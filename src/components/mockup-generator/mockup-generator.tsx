"use client"

import { StudioPreview } from "@/components/mockup-generator/preview/studio-preview"
import { StudioSidebar } from "@/components/mockup-generator/studio-sidebar"
import { SiteNavbar } from "@/components/site-navbar"
import { useMockupGenerator } from "@/components/mockup-generator/use-mockup-generator"

export function MockupGenerator() {
  const generator = useMockupGenerator()

  return (
    <div className="flex min-h-full flex-col">
      <SiteNavbar activePath="/creator-studio" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-stretch lg:gap-6">
          <StudioSidebar {...generator} />
          <StudioPreview
            previewRef={generator.previewRef}
            backgroundSrc={generator.backgroundSrc}
            blur={generator.blur}
            dim={generator.dim}
            frameScale={generator.frameScale}
            backgroundScale={generator.backgroundScale}
            frame={generator.frame}
            activeScreenSrc={generator.activeScreenSrc}
            safariUrl={generator.safariUrl}
            canExport={generator.canExport}
            exportFormat={generator.exportFormat}
            exportScale={generator.exportScale}
            isExporting={generator.isExporting}
            onExport={() => void generator.exportMockup()}
          />
        </div>
      </main>
    </div>
  )
}
