import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["playwright", "playwright-core"],
  images: {
    qualities: [25, 75],
  },
}

export default nextConfig
