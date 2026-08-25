export type ExportFormat = "png" | "jpeg" | "webp"

export type ImageScale = 1 | 2 | 3 | 4

export type FrameType = "iphone" | "android" | "safari"

export type ContentMode = "upload" | "url"

export type ScreenshotFormat = FrameType

export type ScreenshotCaptureArea = "viewport" | "fullPage"

export const SCREENSHOT_CAPTURE_AREA_OPTIONS: {
  value: ScreenshotCaptureArea
  label: string
}[] = [
  { value: "viewport", label: "Viewport" },
  { value: "fullPage", label: "Full page" },
]

export const FRAME_OPTIONS: { value: FrameType; label: string }[] = [
  { value: "iphone", label: "iPhone" },
  { value: "android", label: "Android" },
  { value: "safari", label: "Safari" },
]

export const EXPORT_FORMAT_OPTIONS: {
  value: ExportFormat
  label: string
  description: string
}[] = [
  {
    value: "png",
    label: "PNG",
    description: "Lossless output with transparency support",
  },
  {
    value: "jpeg",
    label: "JPEG",
    description: "Smaller files for social and web",
  },
  {
    value: "webp",
    label: "WebP",
    description: "Modern compressed format",
  },
]

export const IMAGE_SCALE_OPTIONS: {
  value: ImageScale
  description: string
}[] = [
  { value: 1, description: "Standard density" },
  { value: 2, description: "Retina" },
  { value: 3, description: "High resolution" },
  { value: 4, description: "Ultra sharp export" },
]

const EXPORT_BASE_WIDTH = 1600

export function formatPixelSize(width: number, height: number) {
  return `${width} x ${height}px`
}

export function getExportBaseSize(frame: FrameType) {
  if (frame === "safari") {
    return {
      width: EXPORT_BASE_WIDTH,
      height: Math.round((EXPORT_BASE_WIDTH * 10) / 16),
    }
  }

  return {
    width: EXPORT_BASE_WIDTH,
    height: Math.round((EXPORT_BASE_WIDTH * 3) / 4),
  }
}

export function getExportOutputSize(frame: FrameType, scale: ImageScale) {
  const base = getExportBaseSize(frame)

  return {
    width: base.width * scale,
    height: base.height * scale,
  }
}

export function getScreenshotResolutionLabel(
  format: ScreenshotFormat,
  scale: ImageScale,
  captureArea: ScreenshotCaptureArea = "viewport"
) {
  const size = getScreenshotOutputSize(format, scale, captureArea)

  if (!size) {
    return formatPixelSize(0, 0)
  }

  if (captureArea === "fullPage") {
    return `${size.width}px x full page`
  }

  return formatPixelSize(size.width, size.height)
}

export function getExportResolutionLabel(frame: FrameType, scale: ImageScale) {
  const size = getExportOutputSize(frame, scale)
  return formatPixelSize(size.width, size.height)
}

export function getScreenshotScaleOptions(
  format: ScreenshotFormat,
  captureArea: ScreenshotCaptureArea = "viewport"
) {
  return IMAGE_SCALE_OPTIONS.map((option) => ({
    value: option.value,
    label: getScreenshotResolutionLabel(format, option.value, captureArea),
    description: option.description,
  }))
}

export function getExportScaleOptions(frame: FrameType) {
  return IMAGE_SCALE_OPTIONS.map((option) => ({
    value: option.value,
    label: getExportResolutionLabel(frame, option.value),
    description: option.description,
  }))
}

export const SCREENSHOT_FORMAT_OPTIONS: {
  value: ScreenshotFormat
  label: string
  width: number
  height: number
}[] = [
  {
    value: "iphone",
    label: "iPhone",
    width: 390,
    height: 844,
  },
  {
    value: "android",
    label: "Android",
    width: 360,
    height: 800,
  },
  {
    value: "safari",
    label: "Desktop",
    width: 1280,
    height: 800,
  },
]

export function getScreenshotOutputSize(
  format: ScreenshotFormat,
  scale: ImageScale,
  captureArea: ScreenshotCaptureArea = "viewport"
) {
  const viewport = SCREENSHOT_FORMAT_OPTIONS.find((option) => option.value === format)

  if (!viewport) {
    return null
  }

  return {
    width: viewport.width * scale,
    height: captureArea === "fullPage" ? 0 : viewport.height * scale,
  }
}

export function getExportFormatLabel(format: ExportFormat) {
  return EXPORT_FORMAT_OPTIONS.find((option) => option.value === format)?.label ?? "PNG"
}

export function getExportFileName(format: ExportFormat) {
  if (format === "jpeg") {
    return "mockup.jpg"
  }

  if (format === "webp") {
    return "mockup.webp"
  }

  return "mockup.png"
}
