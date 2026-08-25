import type { FrameType } from "@/lib/mockup-types"

export const FRAME_MAX_WIDTH: Record<FrameType, string> = {
  iphone: "17.5rem",
  android: "17.5rem",
  safari: "40rem",
}

export function isDesktopFrame(frame: FrameType) {
  return frame === "safari"
}
