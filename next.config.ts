import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build to plain static files in `out/`; the site needs no server.
  // Old page URLs (/about, /skills, ...) are redirected in public/_redirects.
  output: "export",
  images: {
    // No server to resize images, so serve them as-is (they're already compressed).
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
