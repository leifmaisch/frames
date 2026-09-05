import type { RefObject } from "react"

import { MockupPreview } from "@/components/mockup-generator/mockup-preview"
import type { PreviewSceneProps } from "@/components/mockup-generator/preview/preview-props"
import { XSplitLivePreview } from "@/components/mockup-generator/preview/x-split-live-preview"
import type { ExportMode } from "@/lib/mockup/x-split"
import type { XSplitAspect, XSplitCount } from "@/lib/mockup/x-split"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

type PreviewCanvasProps = PreviewSceneProps & {
  previewRef: RefObject<HTMLDivElement | null>
  exportMode: ExportMode
  xSplitCount: XSplitCount
  xSplitAspect: XSplitAspect
}

export function PreviewCanvas({
  previewRef,
  backgroundSrc,
  blur,
  dim,
  frameScale,
  backgroundScale,
  frame,
  activeScreenSrc,
  safariUrl,
  exportRounded,
  exportMode,
  xSplitCount,
  xSplitAspect,
}: PreviewCanvasProps) {
  const isXSplit = exportMode === "x-split"

  return (
    <div className="flex flex-1 flex-col p-2 sm:p-3">
      <div
        style={squircle}
        className={cn(
          "relative flex min-h-[min(60vh,360px)] flex-1 flex-col overflow-hidden rounded-squircle-inner border border-border bg-card sm:min-h-[400px] lg:min-h-[500px]",
          surfaceDepth("md")
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_0%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_65%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(color-mix(in_srgb,var(--primary)_6%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--primary)_6%,transparent)_1px,transparent_1px)] [background-size:24px_24px]"
        />

        <div
          className={cn(
            "relative z-10 flex flex-1 p-3 sm:p-5",
            isXSplit
              ? "items-start justify-center overflow-y-auto"
              : "items-center justify-center"
          )}
        >
          {isXSplit ? (
            <XSplitLivePreview
              previewRef={previewRef}
              xSplitCount={xSplitCount}
              xSplitAspect={xSplitAspect}
              backgroundSrc={backgroundSrc}
              blur={blur}
              dim={dim}
              frameScale={frameScale}
              backgroundScale={backgroundScale}
              frame={frame}
              activeScreenSrc={activeScreenSrc}
              safariUrl={safariUrl}
              exportRounded={exportRounded}
            />
          ) : (
            <div ref={previewRef} className="w-full min-w-0">
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
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
