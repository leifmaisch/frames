"use client"

import {
  BrowsersIcon,
  ExportIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react"

import { iconWeight } from "@/components/shared"
import { FeatureCard, Features } from "@/components/ui/features"

export function HomeFeatures() {
  return (
    <Features
      id="features"
      title="What's included"
      description="Everything you need to compose, preview, and export framed visuals."
    >
      <FeatureCard
        icon={<SlidersHorizontalIcon weight={iconWeight} className="size-12" />}
        title="Scene controls"
        description="Preset backgrounds, blur, dim, zoom, and frame scale sliders."
      />
      <FeatureCard
        icon={<BrowsersIcon weight={iconWeight} className="size-12" />}
        title="Content sources"
        description="Upload product images or capture live website screenshots."
      />
      <FeatureCard
        icon={<ExportIcon weight={iconWeight} className="size-12" />}
        title="Export options"
        description="PNG, JPEG, or WebP exports at 1x to 4x resolution."
        large
      />
    </Features>
  )
}
