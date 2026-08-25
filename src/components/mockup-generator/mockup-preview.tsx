import { Android } from "@/components/frames/android"
import { Iphone } from "@/components/frames/iphone"
import { Safari } from "@/components/frames/safari"
import type { FrameType } from "@/lib/mockup-types"
import { cn } from "@/lib/utils"

type MockupPreviewProps = {
  backgroundSrc: string
  blur: number
  dim: number
  frameScale: number
  frame: FrameType
  screenSrc?: string
  safariUrl?: string
  className?: string
}

export function MockupPreview({
  backgroundSrc,
  blur,
  dim,
  frameScale,
  frame,
  screenSrc,
  safariUrl,
  className,
}: MockupPreviewProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-squircle-xl border border-border bg-card",
        className
      )}
    >
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center"
        style={{
          backgroundImage: `url("${backgroundSrc}")`,
          filter: `blur(${blur}px)`,
        }}
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: dim / 100 }}
      />
      <div className="relative flex h-full items-center justify-center p-6 sm:p-10">
        <div
          className="w-full max-w-3xl origin-center"
          style={{ transform: `scale(${frameScale / 100})` }}
        >
          {frame === "iphone" ? (
            <Iphone src={screenSrc} className="mx-auto max-w-[280px]" />
          ) : null}
          {frame === "android" ? (
            <Android src={screenSrc} className="mx-auto max-w-[280px]" />
          ) : null}
          {frame === "safari" ? (
            <Safari
              imageSrc={screenSrc}
              url={safariUrl || "example.com"}
              className="mx-auto w-full"
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
