"use client"

import { useState } from "react"

import { SectionSwitcher } from "@/components/mockup-generator/controls/section-switcher"
import { ContentPanel } from "@/components/mockup-generator/panels/content-panel"
import { ExportPanel } from "@/components/mockup-generator/panels/export-panel"
import { FramePanel } from "@/components/mockup-generator/panels/frame-panel"
import { ScenePanel } from "@/components/mockup-generator/panels/scene-panel"
import type { MockupGeneratorState } from "@/components/mockup-generator/use-mockup-generator"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

type StudioSidebarProps = MockupGeneratorState

const studioSections = [
  { value: "scene", label: "Scene" },
  { value: "content", label: "Content" },
  { value: "frame", label: "Frame" },
  { value: "export", label: "Export" },
] as const

type StudioSection = (typeof studioSections)[number]["value"]

export function StudioSidebar(props: StudioSidebarProps) {
  const [section, setSection] = useState<StudioSection>("scene")

  return (
    <Card className="flex h-full w-full min-w-0 flex-col lg:sticky lg:top-24">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle>Studio</CardTitle>
        <SectionSwitcher
          value={section}
          onChange={setSection}
          options={[...studioSections]}
          className="mt-4"
        />
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {section === "scene" ? <ScenePanel {...props} /> : null}
        {section === "content" ? <ContentPanel {...props} /> : null}
        {section === "frame" ? <FramePanel {...props} /> : null}
        {section === "export" ? <ExportPanel {...props} /> : null}
      </CardContent>

      {props.error ? (
        <div
          style={squircle}
          className={cn(
            "mx-4 mb-4 rounded-squircle-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-caption text-destructive",
            surfaceDepth("md")
          )}
        >
          {props.error}
        </div>
      ) : null}
    </Card>
  )
}
