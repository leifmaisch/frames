import type {
  ContentMode,
  ExportFormat,
  FrameType,
  ImageScale,
  ScreenshotFormat,
} from "@/lib/mockup-types"

export const MOCKUP_DEFAULTS = {
  contentMode: "url" as ContentMode,
  blur: 4,
  dim: 28,
  phoneFrameScale: 75,
  safariFrameScale: 88,
  backgroundScale: 110,
  frame: "safari" as FrameType,
  screenshotFormat: "safari" as ScreenshotFormat,
  screenshotScale: 2 as ImageScale,
  exportFormat: "png" as ExportFormat,
  exportScale: 3 as ImageScale,
  websiteUrl: "",
}

export function getDefaultFrameScale(frame: FrameType) {
  return frame === "safari"
    ? MOCKUP_DEFAULTS.safariFrameScale
    : MOCKUP_DEFAULTS.phoneFrameScale
}
