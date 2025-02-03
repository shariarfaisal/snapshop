import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "localhost:3000",
      "localhost:5000",
      "via.placeholder.com",
    ],
  },
};

export default nextConfig;
