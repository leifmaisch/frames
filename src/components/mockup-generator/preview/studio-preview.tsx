import { PreviewCanvas } from "@/components/mockup-generator/preview/preview-canvas"
import type { StudioPreviewProps } from "@/components/mockup-generator/preview/preview-props"
import { PreviewToolbar } from "@/components/mockup-generator/preview/preview-toolbar"
import { Frame } from "@/components/ui/frame"
import { cn } from "@/lib/utils"

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
  exportRounded,
  canExport,
  exportFormat,
  exportScale,
  isExporting,
  onExport,
  className,
}: StudioPreviewProps) {
  return (
    <Frame
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col max-lg:sticky max-lg:top-[4.25rem] max-lg:z-10 max-lg:self-start lg:sticky lg:top-24 lg:h-full",
        className
      )}
    >
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
        exportRounded={exportRounded}
      />
    </Frame>
  )
}
