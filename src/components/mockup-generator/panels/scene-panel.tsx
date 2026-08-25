import { BackgroundPicker } from "@/components/mockup-generator/controls/background-picker"
import { SliderControl } from "@/components/mockup-generator/controls/slider-control"
import {
  StudioPanelSection,
  StudioPanelToolbar,
} from "@/components/mockup-generator/studio-panel"
import type { MockupGeneratorState } from "@/components/mockup-generator/use-mockup-generator"

type ScenePanelProps = Pick<
  MockupGeneratorState,
  | "selectedBackgroundId"
  | "customBackground"
  | "blur"
  | "dim"
  | "frameScale"
  | "backgroundScale"
  | "setBlur"
  | "setDim"
  | "setFrameScale"
  | "setBackgroundScale"
  | "selectPresetBackground"
  | "uploadBackground"
  | "resetScene"
>

export function ScenePanel({
  selectedBackgroundId,
  customBackground,
  blur,
  dim,
  frameScale,
  backgroundScale,
  setBlur,
  setDim,
  setFrameScale,
  setBackgroundScale,
  selectPresetBackground,
  uploadBackground,
  resetScene,
}: ScenePanelProps) {
  return (
    <div className="space-y-5">
      <StudioPanelToolbar
        label="Background and atmosphere"
        onReset={resetScene}
        resetLabel="Reset scene"
      />

      <BackgroundPicker
        selectedBackgroundId={selectedBackgroundId}
        hasCustomBackground={Boolean(customBackground)}
        onSelectPreset={selectPresetBackground}
        onUpload={uploadBackground}
      />

      <StudioPanelSection>
        <SliderControl
          label="Background blur"
          value={blur}
          min={0}
          max={40}
          suffix="px"
          onChange={setBlur}
        />
        <SliderControl
          label="Background dim"
          value={dim}
          min={0}
          max={70}
          suffix="%"
          onChange={setDim}
        />
        <SliderControl
          label="Background zoom"
          value={backgroundScale}
          min={100}
          max={140}
          suffix="%"
          onChange={setBackgroundScale}
        />
        <SliderControl
          label="Frame scale"
          value={frameScale}
          min={50}
          max={120}
          suffix="%"
          onChange={setFrameScale}
        />
      </StudioPanelSection>
    </div>
  )
}
