import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.cursor.app", "*.cursor.so", "*.ngrok-free.app", "*.loca.lt", "*.trycloudflare.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Don't pipe every *.css file through Tailwind — that breaks next/font Google CSS modules.
  turbopack: {
    root,
  },
};

export default nextConfig;
