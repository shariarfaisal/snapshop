import { NextResponse, NextRequest } from "next/server";

function handleApiMiddleware(request: NextRequest) {
  const authCookie = request.cookies.get("x-auth-token");

  const headers = new Headers(request.headers);
  if (authCookie) {
    headers.set("Authorization", `Bearer ${authCookie.value}`);
  }

  const modifiedRequest = new Request(request.url, {
    headers,
    method: request.method,
    body: request.body,
  });

  return NextResponse.next({ request: modifiedRequest });
}

function handleProtectedRoute(request: NextRequest) {
  const { cookies } = request;
  const authCookie = cookies.get("x-auth-token");
  const url = request.nextUrl.clone();
  const isAuthError = url.searchParams.get("auth_error");

  const publicRoutes = ["/login", "/signup"];

  if (!authCookie && !publicRoutes.includes(url.pathname)) {
    // If there's no auth cookie and the user is not on the login page, redirect to login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  } else if (
    authCookie &&
    ["/login", "/signup"].includes(url.pathname) &&
    !isAuthError
  ) {
    // If there is an auth cookie and the user is on the login page, redirect to home
    url.pathname = "/";
    return NextResponse.redirect(url);
  } else if (authCookie && isAuthError) {
    cookies.delete("x-auth-token");
  }

  // Otherwise, allow the request to continue
  return NextResponse.next();
}

function handleAuthMiddleware(request: NextRequest) {
  const url = request.nextUrl;
  const authToken = url.searchParams.get("auth_token");

  if (!authToken) {
    const loginUrl = `${url.origin}/login`;
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(`${url.origin}/`);
  response.cookies.set("x-auth-token", authToken, {
    secure: true,
    sameSite: "none",
    httpOnly: false,
    path: "/",
  });

  return response;
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host");
  const subdomain = host?.split(".")[0];

  if (url.pathname.startsWith("/api/")) {
    return handleApiMiddleware(request);
  }

  console.log({
    host,
    subdomain,
    url,
  });

  if (subdomain?.includes(url.hostname) || url.pathname === "/not-found") {
    if (url.pathname === "/auth") {
      return handleAuthMiddleware(request);
    }

    return handleProtectedRoute(request);
  }

  if (subdomain && isValidSubdomain(subdomain)) {
    console.log(`/subdomain/${subdomain}${url.pathname}`);

    // Rewrite the URL for subdomains to `/subdomain/{subdomain}/{path}`
    return NextResponse.rewrite(
      new URL(
        `/subdomain/${subdomain}${url.pathname}${url.search}${url.hash}`,
        request.url
      )
    );
  }

  // If subdomain is invalid, redirect to "not found" page
  return NextResponse.redirect(
    new URL(`${url.protocol}//${url.host}/not-found`)
  );
}

function isValidSubdomain(subdomain?: string) {
  return !!subdomain;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|images|icons).*)",
  ],
};
