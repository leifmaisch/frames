import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type StudioPanelToolbarProps = {
  label: string
  onReset?: () => void
  resetLabel?: string
  className?: string
}

export function StudioPanelToolbar({
  label,
  onReset,
  resetLabel = "Reset",
  className,
}: StudioPanelToolbarProps) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-center justify-between gap-2", className)}>
      <p className="min-w-0 flex-1 text-label text-balance">{label}</p>
      {onReset ? (
        <Button type="button" variant="ghost" size="xs" onClick={onReset}>
          {resetLabel}
        </Button>
      ) : null}
    </div>
  )
}

export function StudioPanelSection({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-4 border-t border-border pt-5", className)}>
      {children}
    </div>
  )
}
