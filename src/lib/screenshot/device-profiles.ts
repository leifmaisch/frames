import { devices, type BrowserContextOptions } from "playwright"

import type { ImageScale, ScreenshotFormat } from "@/lib/mockup-types"
import { SCREENSHOT_VIEWPORTS } from "@/lib/screenshot-formats"

const DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

export function getScreenshotContextOptions(
  format: ScreenshotFormat,
  scale: ImageScale,
  darkMode: boolean
): BrowserContextOptions {
  const viewport = SCREENSHOT_VIEWPORTS[format]
  const sharedViewport = {
    width: viewport.width,
    height: viewport.height,
  }

  if (format === "iphone") {
    const device = devices["iPhone 14"]

    return {
      userAgent: device.userAgent,
      viewport: sharedViewport,
      screen: sharedViewport,
      deviceScaleFactor: scale,
      isMobile: device.isMobile,
      hasTouch: device.hasTouch,
      colorScheme: darkMode ? "dark" : "light",
    }
  }

  if (format === "android") {
    const device = devices["Pixel 7"]

    return {
      userAgent: device.userAgent,
      viewport: sharedViewport,
      screen: sharedViewport,
      deviceScaleFactor: scale,
      isMobile: device.isMobile,
      hasTouch: device.hasTouch,
      colorScheme: darkMode ? "dark" : "light",
    }
  }

  return {
    userAgent: DESKTOP_USER_AGENT,
    viewport: sharedViewport,
    screen: sharedViewport,
    deviceScaleFactor: scale,
    isMobile: false,
    hasTouch: false,
    colorScheme: darkMode ? "dark" : "light",
  }
}
