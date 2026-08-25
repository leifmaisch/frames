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

type ExportPanelProps = Pick<
  MockupGeneratorState,
  | "frame"
  | "exportFormat"
  | "exportScale"
  | "exportRounded"
  | "setExportFormat"
  | "setExportScale"
  | "setExportRounded"
  | "resetExport"
>

export function ExportPanel({
  frame,
  exportFormat,
  exportScale,
  exportRounded,
  setExportFormat,
  setExportScale,
  setExportRounded,
  resetExport,
}: ExportPanelProps) {
  const scaleOptions = getExportScaleOptions(frame)

  return (
    <div className="space-y-4">
      <StudioPanelToolbar
        label="Output format and resolution"
        onReset={resetExport}
        resetLabel="Reset export"
      />

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
      </Field>
    </div>
  )
}
