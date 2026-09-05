import { StudioPanelToolbar } from "@/components/mockup-generator/studio-panel"
import type { MockupGeneratorState } from "@/components/mockup-generator/use-mockup-generator"
import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  EXPORT_FORMAT_OPTIONS,
  getExportScaleOptions,
  type ExportFormat,
  type ImageScale,
} from "@/lib/mockup-types"
import {
  EXPORT_MODE_OPTIONS,
  getXSplitResolutionLabel,
  X_SPLIT_ASPECT_OPTIONS,
  X_SPLIT_COUNT_OPTIONS,
  type ExportMode,
  type XSplitAspect,
  type XSplitCount,
} from "@/lib/mockup/x-split"

type ExportPanelProps = Pick<
  MockupGeneratorState,
  | "frame"
  | "exportFormat"
  | "exportScale"
  | "exportRounded"
  | "exportMode"
  | "xSplitCount"
  | "xSplitAspect"
  | "setExportFormat"
  | "setExportScale"
  | "setExportRounded"
  | "setExportMode"
  | "setXSplitCount"
  | "setXSplitAspect"
  | "resetExport"
>

export function ExportPanel({
  frame,
  exportFormat,
  exportScale,
  exportRounded,
  exportMode,
  xSplitCount,
  xSplitAspect,
  setExportFormat,
  setExportScale,
  setExportRounded,
  setExportMode,
  setXSplitCount,
  setXSplitAspect,
  resetExport,
}: ExportPanelProps) {
  const scaleOptions = getExportScaleOptions(frame)
  const isXSplit = exportMode === "x-split"
  const xSplitResolution = getXSplitResolutionLabel({
    count: xSplitCount,
    aspect: xSplitAspect,
    scale: exportScale,
    format: exportFormat,
  })

  return (
    <div className="space-y-4">
      <StudioPanelToolbar
        label="Output format and resolution"
        onReset={resetExport}
        resetLabel="Reset export"
      />

      <Field>
        <FieldLabel>Export mode</FieldLabel>
        <Select
          items={EXPORT_MODE_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          value={exportMode}
          onValueChange={(value) => setExportMode(value as ExportMode)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EXPORT_MODE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-2 text-description text-xs">
          {EXPORT_MODE_OPTIONS.find((option) => option.value === exportMode)
            ?.description}
        </p>
      </Field>

      {isXSplit ? (
        <>
          <Field>
            <FieldLabel>Pieces</FieldLabel>
            <Select
              items={X_SPLIT_COUNT_OPTIONS.map((option) => ({
                label: option.label,
                value: String(option.value),
              }))}
              value={String(xSplitCount)}
              onValueChange={(value) =>
                setXSplitCount(Number(value) as XSplitCount)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {X_SPLIT_COUNT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-description text-xs">
              Slices your mockup left to right. Upload in order on X.
            </p>
          </Field>

          <Field>
            <FieldLabel>Tile aspect</FieldLabel>
            <Select
              items={X_SPLIT_ASPECT_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              value={xSplitAspect}
              onValueChange={(value) => setXSplitAspect(value as XSplitAspect)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {X_SPLIT_ASPECT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-description text-xs">
              {
                X_SPLIT_ASPECT_OPTIONS.find(
                  (option) => option.value === xSplitAspect
                )?.description
              }
            </p>
          </Field>

          <div className="rounded-squircle-md border border-border/70 bg-muted/30 px-3 py-2 text-description text-xs">
            <p className="text-heading text-sm">X upload tips</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Upload all slices at once on x.com desktop.</li>
              <li>Attach files left to right (01, 02, 03…).</li>
              <li>Portrait tiles fill more of the timeline than landscape.</li>
            </ul>
          </div>
        </>
      ) : null}

      <Field>
        <FieldLabel>Format</FieldLabel>
        <Select
          items={EXPORT_FORMAT_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          value={exportFormat}
          onValueChange={(value) => setExportFormat(value as ExportFormat)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EXPORT_FORMAT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel>Rounded corners</FieldLabel>
        <Switch
          checked={exportRounded}
          onCheckedChange={setExportRounded}
        />
      </Field>

      <Field>
        <FieldLabel>Resolution</FieldLabel>
        <Select
          items={scaleOptions.map((option) => ({
            label: option.label,
            value: String(option.value),
          }))}
          value={String(exportScale)}
          onValueChange={(value) =>
            setExportScale(Number(value) as ImageScale)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {scaleOptions.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isXSplit ? (
          <p className="mt-2 text-description text-xs">{xSplitResolution}</p>
        ) : null}
      </Field>
    </div>
  )
}
