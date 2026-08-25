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
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <p className="text-label">{label}</p>
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
