import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["playwright", "playwright-core"],
  outputFileTracingIncludes: {
    "/api/screenshot": [
      "./node_modules/.pnpm/playwright-core@*/node_modules/playwright-core/browsers.json",
    ],
  },
  images: {
    qualities: [25, 75],
  },
}

export default nextConfig
