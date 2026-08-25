import { PreviewCanvas } from "@/components/mockup-generator/preview/preview-canvas"
import type { StudioPreviewProps } from "@/components/mockup-generator/preview/preview-props"
import { PreviewToolbar } from "@/components/mockup-generator/preview/preview-toolbar"
import { Frame } from "@/components/ui/frame"

export function StudioPreview({
  previewRef,
  backgroundSrc,
  blur,
  dim,
  frameScale,
  backgroundScale,
  frame,
  activeScreenSrc,
  safariUrl,
  canExport,
  exportFormat,
  exportScale,
  isExporting,
  onExport,
}: StudioPreviewProps) {
  return (
    <Frame className="flex h-full min-w-0 flex-1 flex-col lg:sticky lg:top-24">
      <PreviewToolbar
        canExport={canExport}
        exportFormat={exportFormat}
        exportScale={exportScale}
        frame={frame}
        isExporting={isExporting}
        onExport={onExport}
      />
      <PreviewCanvas
        previewRef={previewRef}
        backgroundSrc={backgroundSrc}
        blur={blur}
        dim={dim}
        frameScale={frameScale}
        backgroundScale={backgroundScale}
        frame={frame}
        activeScreenSrc={activeScreenSrc}
        safariUrl={safariUrl}
      />
    </Frame>
  )
}
