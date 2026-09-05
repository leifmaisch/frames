import type { RefObject } from "react"

import type { MockupGeneratorState } from "@/components/mockup-generator/use-mockup-generator"

export type StudioPreviewProps = Pick<
  MockupGeneratorState,
  | "backgroundSrc"
  | "blur"
  | "dim"
  | "frameScale"
  | "backgroundScale"
  | "frame"
  | "activeScreenSrc"
  | "safariUrl"
  | "canExport"
  | "exportFormat"
  | "exportScale"
  | "exportRounded"
  | "exportMode"
  | "xSplitCount"
  | "xSplitAspect"
  | "isExporting"
> & {
  previewRef: RefObject<HTMLDivElement | null>
  onExport: () => void
  className?: string
}

export type PreviewSceneProps = Pick<
  StudioPreviewProps,
  | "backgroundSrc"
  | "blur"
  | "dim"
  | "frameScale"
  | "backgroundScale"
  | "frame"
  | "activeScreenSrc"
  | "safariUrl"
  | "exportRounded"
>
