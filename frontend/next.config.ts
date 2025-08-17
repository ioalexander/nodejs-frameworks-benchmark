import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH || "";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  basePath: isProd ? `/${basePath}` : "",
  assetPrefix: isProd ? `/${basePath}/` : "",
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
