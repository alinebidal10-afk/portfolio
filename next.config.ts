import type { NextConfig } from "next";

// Set at build time by the GitHub Pages workflow (e.g. "/portfolio").
// Local dev and Vercel builds leave it unset and get a normal build.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig: NextConfig = {
  ...(basePath
    ? {
        basePath,
        output: "export" as const,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
