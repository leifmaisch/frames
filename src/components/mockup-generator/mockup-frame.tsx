import { memo } from "react"

import { Android } from "@/components/frames/android"
import { Iphone } from "@/components/frames/iphone"
import { Safari } from "@/components/frames/safari"
import { FRAME_MAX_WIDTH } from "@/lib/mockup/frame-layout"
import type { FrameType } from "@/lib/mockup-types"

type MockupFrameProps = {
  frame: FrameType
  screenSrc?: string
  safariUrl?: string
}

function FrameShell({
  frame,
  children,
}: {
  frame: FrameType
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full justify-center">
      <div
        className="w-full shrink-0"
        style={{ maxWidth: FRAME_MAX_WIDTH[frame] }}
      >
        {children}
      </div>
    </div>
  )
}

export const MockupFrame = memo(function MockupFrame({
  frame,
  screenSrc,
  safariUrl,
}: MockupFrameProps) {
  if (frame === "iphone") {
    return (
      <FrameShell frame={frame}>
        <Iphone src={screenSrc} className="block h-auto w-full" />
      </FrameShell>
    )
  }

  if (frame === "android") {
    return (
      <FrameShell frame={frame}>
        <Android src={screenSrc} className="block h-auto w-full" />
      </FrameShell>
    )
  }

  return (
    <FrameShell frame={frame}>
      <Safari
        imageSrc={screenSrc}
        url={safariUrl}
        className="block h-auto w-full"
      />
    </FrameShell>
  )
})
