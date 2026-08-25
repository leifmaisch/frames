import { FramePicker } from "@/components/mockup-generator/controls/frame-picker"
import { StudioPanelToolbar } from "@/components/mockup-generator/studio-panel"
import type { MockupGeneratorState } from "@/components/mockup-generator/use-mockup-generator"

type FramePanelProps = Pick<MockupGeneratorState, "frame" | "setFrame">

export function FramePanel({ frame, setFrame }: FramePanelProps) {
  return (
    <div>
      <StudioPanelToolbar label="Device frame" />
      <FramePicker value={frame} onChange={setFrame} />
    </div>
  )
}
