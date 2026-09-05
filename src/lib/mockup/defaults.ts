import type {
  ContentMode,
  ExportFormat,
  FrameType,
  ImageScale,
  ScreenshotCaptureArea,
  ScreenshotFormat,
} from "@/lib/mockup-types"
import type {
  ExportMode,
  XSplitAspect,
  XSplitCount,
} from "@/lib/mockup/x-split"

export const MOCKUP_DEFAULTS = {
  contentMode: "url" as ContentMode,
  blur: 4,
  dim: 28,
  phoneFrameScale: 75,
  safariFrameScale: 88,
  backgroundScale: 110,
  frame: "safari" as FrameType,
  screenshotFormat: "safari" as ScreenshotFormat,
  screenshotCaptureArea: "viewport" as ScreenshotCaptureArea,
  screenshotDarkMode: false,
  screenshotScale: 2 as ImageScale,
  exportFormat: "png" as ExportFormat,
  exportScale: 3 as ImageScale,
  exportRounded: true,
  exportMode: "standard" as ExportMode,
  xSplitCount: 4 as XSplitCount,
  xSplitAspect: "fit-mockup" as XSplitAspect,
  websiteUrl: "",
}

export function getDefaultFrameScale(frame: FrameType) {
  return frame === "safari"
    ? MOCKUP_DEFAULTS.safariFrameScale
    : MOCKUP_DEFAULTS.phoneFrameScale
}
