import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
const privateRoutes = ["/admin", "/accountant", "/teacher", "/student", "/parent", "/dashboard"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("x-auth-token");

  // Redirect old teacher routes to new admin/teacher routes for backward compatibility
  if (pathname.startsWith("/teacher/")) {
    const newPath = pathname.replace("/teacher/", "/admin/teacher/");
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // If no token and trying to access private route, redirect to login
  if (!token && privateRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If token exists and trying to access public auth routes, redirect to admin dashboard
  if (token && publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|public|api|static|..*).*)"],
};
