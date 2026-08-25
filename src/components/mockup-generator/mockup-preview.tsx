import { memo } from "react"

import { MockupFrame } from "@/components/mockup-generator/mockup-frame"
import { isDesktopFrame } from "@/lib/mockup/frame-layout"
import type { FrameType } from "@/lib/mockup-types"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

type MockupPreviewProps = {
  backgroundSrc: string
  blur: number
  dim: number
  frameScale: number
  backgroundScale: number
  frame: FrameType
  screenSrc?: string
  safariUrl?: string
  className?: string
}

export const MockupPreview = memo(function MockupPreview({
  backgroundSrc,
  blur,
  dim,
  frameScale,
  backgroundScale,
  frame,
  screenSrc,
  safariUrl,
  className,
}: MockupPreviewProps) {
  const hasContent = Boolean(screenSrc)
  const isDesktop = isDesktopFrame(frame)

  return (
    <div
      style={squircle}
      className={cn(
        "relative w-full overflow-hidden rounded-squircle-lg border border-border/80 bg-black/20 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]",
        isDesktop ? "aspect-[16/10]" : "aspect-[4/3]",
        surfaceDepth("lg"),
        className
      )}
    >
      <PreviewBackground
        backgroundSrc={backgroundSrc}
        blur={blur}
        dim={dim}
        backgroundScale={backgroundScale}
      />

      <div className="relative flex h-full min-h-0 items-center justify-center p-4 sm:p-6">
        <div
          className="flex w-full origin-center justify-center"
          style={{ transform: `scale(${frameScale / 100})` }}
        >
          <MockupFrame
            frame={frame}
            screenSrc={screenSrc}
            safariUrl={safariUrl}
          />
        </div>
      </div>

      {!hasContent ? <PreviewEmptyState /> : null}
    </div>
  )
})

function PreviewBackground({
  backgroundSrc,
  blur,
  dim,
  backgroundScale,
}: {
  backgroundSrc: string
  blur: number
  dim: number
  backgroundScale: number
}) {
  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${backgroundSrc}")`,
          filter: `blur(${blur}px)`,
          transform: `scale(${backgroundScale / 100})`,
        }}
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: dim / 100 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgb(0_0_0/0.35)_100%)]"
      />
    </>
  )
}

function PreviewEmptyState() {
  return (
    <div
      className="absolute inset-0 flex items-end justify-center p-4 sm:p-6"
      data-export-ignore
    >
      <div className="max-w-md rounded-squircle-md border border-border/80 bg-background/90 px-4 py-3 text-center backdrop-blur-sm">
        <p className="text-heading text-sm sm:text-base">
          Add content to complete the mockup
        </p>
        <p className="mt-1 text-description text-xs sm:text-sm">
          Upload a product image or capture a website screenshot.
        </p>
      </div>
    </div>
  )
}
