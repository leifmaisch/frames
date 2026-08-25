import type { ScreenshotFormat } from "@/lib/mockup-types"

export const SCREENSHOT_VIEWPORTS: Record<
  ScreenshotFormat,
  { width: number; height: number; deviceScaleFactor: number }
> = {
  iphone: { width: 390, height: 844, deviceScaleFactor: 2 },
  android: { width: 360, height: 800, deviceScaleFactor: 2 },
  safari: { width: 1280, height: 800, deviceScaleFactor: 1 },
}
