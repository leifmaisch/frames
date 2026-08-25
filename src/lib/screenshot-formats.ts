import type { ScreenshotFormat } from "@/lib/mockup-types"

export const SCREENSHOT_VIEWPORTS: Record<
  ScreenshotFormat,
  { width: number; height: number }
> = {
  iphone: { width: 390, height: 844 },
  android: { width: 360, height: 800 },
  safari: { width: 1280, height: 800 },
}
