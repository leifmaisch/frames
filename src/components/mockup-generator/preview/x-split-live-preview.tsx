import type { RefObject } from "react"

import { MockupPreview } from "@/components/mockup-generator/mockup-preview"
import type { PreviewSceneProps } from "@/components/mockup-generator/preview/preview-props"
import { isDesktopFrame } from "@/lib/mockup/frame-layout"
import type { FrameType } from "@/lib/mockup-types"
import {
  getXSplitCompositeAspectRatio,
  getXSplitTileAspectRatio,
  type XSplitAspect,
  type XSplitCount,
} from "@/lib/mockup/x-split"
import { squircle } from "@/lib/squircle"
import { cn } from "@/lib/utils"

type XSplitLivePreviewProps = PreviewSceneProps & {
  previewRef: RefObject<HTMLDivElement | null>
  xSplitCount: XSplitCount
  xSplitAspect: XSplitAspect
}

type CompositeSceneProps = PreviewSceneProps & {
  frame: FrameType
}

function getMockupAspectRatio(frame: FrameType) {
  return isDesktopFrame(frame) ? 16 / 10 : 4 / 3
}

function XSplitCompositeScene({
  frame,
  backgroundSrc,
  blur,
  dim,
  frameScale,
  backgroundScale,
  activeScreenSrc,
  safariUrl,
  exportRounded,
}: CompositeSceneProps) {
  const mockupAspectRatio = getMockupAspectRatio(frame)

  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <div
        className="h-full w-auto max-w-full"
        style={{ aspectRatio: mockupAspectRatio }}
      >
        <MockupPreview
          backgroundSrc={backgroundSrc}
          blur={blur}
          dim={dim}
          frameScale={frameScale}
          backgroundScale={backgroundScale}
          frame={frame}
          screenSrc={activeScreenSrc}
          safariUrl={safariUrl}
          rounded={exportRounded}
          className="h-full w-full"
        />
      </div>
    </div>
  )
}

function XSplitSliceGuides({
  count,
  className,
}: {
  count: XSplitCount
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 grid", className)}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={cn(
            "relative border-white/70",
            index > 0 ? "border-l-2 border-dashed" : null
          )}
        >
          <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      ))}
    </div>
  )
}

function XSplitSliceTile({
  index,
  count,
  aspect,
  scene,
}: {
  index: number
  count: XSplitCount
  aspect: XSplitAspect
  scene: CompositeSceneProps
}) {
  const tileAspectRatio = getXSplitTileAspectRatio(aspect)
  const compositeAspectRatio = getXSplitCompositeAspectRatio(count, aspect)

  return (
    <div
      className="relative min-w-0 overflow-hidden rounded-md border border-border/80 bg-black shadow-sm"
      style={{ aspectRatio: tileAspectRatio }}
    >
      <div
        className="h-full"
        style={{
          width: `${count * 100}%`,
          transform: `translateX(-${(index / count) * 100}%)`,
        }}
      >
        <div
          className="h-full w-full"
          style={{ aspectRatio: compositeAspectRatio }}
        >
          <XSplitCompositeScene {...scene} />
        </div>
      </div>
      <span className="absolute right-1.5 bottom-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  )
}

export function XSplitLivePreview({
  previewRef,
  xSplitCount,
  xSplitAspect,
  frame,
  ...scene
}: XSplitLivePreviewProps) {
  const compositeAspectRatio = getXSplitCompositeAspectRatio(
    xSplitCount,
    xSplitAspect
  )
  const sceneProps = { frame, ...scene }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="space-y-2">
        <p className="text-label text-xs">Composite</p>
        <div
          className="relative w-full overflow-hidden rounded-squircle-md border border-border/80"
          style={{
            ...squircle,
            aspectRatio: compositeAspectRatio,
          }}
        >
          <div ref={previewRef} className="absolute inset-0">
            <XSplitCompositeScene {...sceneProps} />
          </div>
          <XSplitSliceGuides count={xSplitCount} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-label text-xs">On X (left to right)</p>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${xSplitCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: xSplitCount }, (_, index) => (
            <XSplitSliceTile
              key={index}
              index={index}
              count={xSplitCount}
              aspect={xSplitAspect}
              scene={sceneProps}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
