import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/falc-ai",
  images: { unoptimized: true },
};

export default nextConfig;
