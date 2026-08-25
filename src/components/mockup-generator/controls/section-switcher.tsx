import { cn } from "@/lib/utils"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"

type SectionOption<T extends string> = {
  value: T
  label: string
}

type SectionSwitcherProps<T extends string> = {
  value: T
  options: SectionOption<T>[]
  onChange: (value: T) => void
  className?: string
}

export function SectionSwitcher<T extends string>({
  value,
  options,
  onChange,
  className,
}: SectionSwitcherProps<T>) {
  return (
    <div
      style={squircle}
      className={cn(
        "grid gap-1 rounded-squircle-md border border-border/60 bg-muted p-1",
        surfaceDepth("md"),
        options.length === 2 && "grid-cols-2",
        options.length === 3 && "grid-cols-3",
        options.length === 4 && "grid-cols-2 sm:grid-cols-4",
        className
      )}
    >
      {options.map((option) => {
        const isActive = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex min-h-9 items-center justify-center rounded-squircle-sm px-3 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-sm",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
