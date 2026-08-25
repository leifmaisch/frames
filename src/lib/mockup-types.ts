export type FrameType = "iphone" | "android" | "safari"

export type ContentMode = "upload" | "url"

export type ScreenshotFormat = FrameType

export const FRAME_OPTIONS: { value: FrameType; label: string }[] = [
  { value: "iphone", label: "iPhone" },
  { value: "android", label: "Android" },
  { value: "safari", label: "Safari" },
]

export const SCREENSHOT_FORMAT_OPTIONS: {
  value: ScreenshotFormat
  label: string
  description: string
}[] = [
  {
    value: "iphone",
    label: "iPhone",
    description: "390 x 844 viewport",
  },
  {
    value: "android",
    label: "Android",
    description: "360 x 800 viewport",
  },
  {
    value: "safari",
    label: "Desktop",
    description: "1280 x 800 viewport",
  },
]
