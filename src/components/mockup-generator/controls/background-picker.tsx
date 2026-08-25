import { UploadIcon } from "@phosphor-icons/react"
import { useRef } from "react"

import { iconWeight } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { PRESET_BACKGROUNDS } from "@/lib/backgrounds"
import { cn } from "@/lib/utils"

type BackgroundPickerProps = {
  selectedBackgroundId: string
  hasCustomBackground: boolean
  onSelectPreset: (id: string) => void
  onUpload: (file: File | undefined) => void | Promise<void>
}

export function BackgroundPicker({
  selectedBackgroundId,
  hasCustomBackground,
  onSelectPreset,
  onUpload,
}: BackgroundPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {PRESET_BACKGROUNDS.map((background) => {
          const isSelected =
            !hasCustomBackground && selectedBackgroundId === background.id

          return (
            <button
              key={background.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectPreset(background.id)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-squircle-md border transition-colors",
                isSelected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/40"
              )}
            >
              <img
                src={background.src}
                alt={background.label}
                className="size-full object-cover"
              />
            </button>
          )
        })}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          void onUpload(event.target.files?.[0])
          event.target.value = ""
        }}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => inputRef.current?.click()}
      >
        <UploadIcon weight={iconWeight} />
        Upload custom background
      </Button>
    </div>
  )
}
