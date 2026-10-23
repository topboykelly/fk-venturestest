import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ["127.0.0.1"],
  // Don't pipe every *.css file through Tailwind — that breaks next/font Google CSS modules
  // (@vercel/turbopack-next/internal/font/...). Tailwind is handled via postcss.config.mjs.
  turbopack: {
    root,
  },
};

export default nextConfig;
