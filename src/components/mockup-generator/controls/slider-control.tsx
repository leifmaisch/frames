import { Field, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

type SliderControlProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (value: number) => void
  className?: string
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
  className,
}: SliderControlProps) {
  return (
    <Field className={className}>
      <div className="flex w-full items-center justify-between gap-3">
        <FieldLabel className="text-label font-medium text-muted-foreground">
          {label}
        </FieldLabel>
        <span className="text-caption text-numeric tabular-nums text-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary",
          "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm",
          "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary"
        )}
      />
    </Field>
  )
}
