import type { RefObject } from "react"

import { MockupPreview } from "@/components/mockup-generator/mockup-preview"
import type { PreviewSceneProps } from "@/components/mockup-generator/preview/preview-props"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

type PreviewCanvasProps = PreviewSceneProps & {
  previewRef: RefObject<HTMLDivElement | null>
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
}: PreviewCanvasProps) {
  return (
    <div className="flex flex-1 flex-col p-2 sm:p-3">
      <div
        style={squircle}
        className={cn(
          "relative flex min-h-[420px] flex-1 flex-col overflow-hidden rounded-squircle-inner border border-border bg-card",
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

        <div className="relative z-10 flex flex-1 items-center justify-center p-3 sm:p-5">
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
            />
          </div>
        </div>
      </div>
    </div>
  )
}
