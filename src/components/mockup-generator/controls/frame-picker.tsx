import type { FrameType } from "@/lib/mockup-types"
import { FRAME_OPTIONS } from "@/lib/mockup-types"
import { cn } from "@/lib/utils"

type FramePickerProps = {
  value: FrameType
  onChange: (value: FrameType) => void
}

function FrameGlyph({ frame }: { frame: FrameType }) {
  if (frame === "iphone") {
    return (
      <div className="mx-auto h-10 w-6 rounded-[0.85rem] border-2 border-current bg-background/40" />
    )
  }

  if (frame === "android") {
    return (
      <div className="mx-auto h-10 w-6 rounded-md border-2 border-current bg-background/40" />
    )
  }

  return (
    <div className="mx-auto flex h-10 w-14 flex-col overflow-hidden rounded-md border-2 border-current bg-background/40">
      <div className="h-2 border-b border-current/40 bg-muted/40" />
      <div className="flex-1 bg-background/20" />
    </div>
  )
}

export function FramePicker({ value, onChange }: FramePickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {FRAME_OPTIONS.map((option) => {
        const isSelected = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-squircle-md border px-2 py-3 transition-colors",
              isSelected
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-muted/20 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            <FrameGlyph frame={option.value} />
            <span className="text-label">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
