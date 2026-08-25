import { DownloadIcon } from "@phosphor-icons/react"

import { iconWeight } from "@/components/shared"
import { Button } from "@/components/ui/button"
import {
  FRAME_OPTIONS,
  getExportFormatLabel,
  getExportResolutionLabel,
  type ExportFormat,
  type FrameType,
  type ImageScale,
} from "@/lib/mockup-types"
import { squircle } from "@/lib/squircle"
import { cn } from "@/lib/utils"

type PreviewToolbarProps = {
  canExport: boolean
  exportFormat: ExportFormat
  exportScale: ImageScale
  frame: FrameType
  isExporting: boolean
  onExport: () => void
}

export function PreviewToolbar({
  canExport,
  exportFormat,
  exportScale,
  frame,
  isExporting,
  onExport,
}: PreviewToolbarProps) {
  const formatLabel = getExportFormatLabel(exportFormat)
  const frameLabel =
    FRAME_OPTIONS.find((option) => option.value === frame)?.label ?? "Frame"
  const exportSize = getExportResolutionLabel(frame, exportScale)

  return (
    <div className="flex flex-col gap-4 border-b border-border/60 px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h2 className="text-heading text-xl sm:text-2xl">Mockup canvas</h2>
          {!canExport ? (
            <p className="text-description">
              Add product or website content to complete the mockup.
            </p>
          ) : null}
        </div>

        <Button
          onClick={onExport}
          disabled={!canExport || isExporting}
          className="w-full shrink-0 sm:w-auto"
        >
          <DownloadIcon weight={iconWeight} />
          {isExporting ? "Exporting..." : `Download ${formatLabel}`}
        </Button>
      </div>

      <PreviewMeta items={[frameLabel, formatLabel, exportSize]} />
    </div>
  )
}

function PreviewMeta({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <span
          key={item}
          style={squircle}
          className={cn(
            "inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-label"
          )}
        >
          {item}
        </span>
      ))}
    </div>
  )
}
