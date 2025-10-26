import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',  // TODO: Enable after adding generateStaticParams to all dynamic routes
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [
      "localhost",
      "127.0.0.1",
      "localhost:3000",
      "localhost:5000",
      "via.placeholder.com",
    ],
  },
  eslint: {
    // Allow build to succeed with ESLint warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
