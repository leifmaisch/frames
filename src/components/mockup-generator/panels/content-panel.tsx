import { FileUploadField } from "@/components/mockup-generator/controls/file-upload-field"
import { SectionSwitcher } from "@/components/mockup-generator/controls/section-switcher"
import { StudioPanelToolbar } from "@/components/mockup-generator/studio-panel"
import type { MockupGeneratorState } from "@/components/mockup-generator/use-mockup-generator"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SCREENSHOT_CAPTURE_AREA_OPTIONS,
  SCREENSHOT_FORMAT_OPTIONS,
  getScreenshotScaleOptions,
  type ContentMode,
  type ImageScale,
  type ScreenshotCaptureArea,
  type ScreenshotFormat,
} from "@/lib/mockup-types"
import { canCaptureWebsiteUrl } from "@/lib/url-validation"

type ContentPanelProps = Pick<
  MockupGeneratorState,
  | "contentMode"
  | "productImage"
  | "websiteUrl"
  | "screenshotFormat"
  | "screenshotScale"
  | "screenshotCaptureArea"
  | "activeScreenSrc"
  | "isCapturing"
  | "setContentMode"
  | "setWebsiteUrl"
  | "setScreenshotFormat"
  | "setScreenshotScale"
  | "setScreenshotCaptureArea"
  | "setFrame"
  | "uploadProduct"
  | "captureScreenshot"
  | "downloadScreenshot"
  | "resetContent"
>

export function ContentPanel({
  contentMode,
  productImage,
  websiteUrl,
  screenshotFormat,
  screenshotScale,
  screenshotCaptureArea,
  activeScreenSrc,
  isCapturing,
  setContentMode,
  setWebsiteUrl,
  setScreenshotFormat,
  setScreenshotScale,
  setScreenshotCaptureArea,
  setFrame,
  uploadProduct,
  captureScreenshot,
  downloadScreenshot,
  resetContent,
}: ContentPanelProps) {
  const scaleOptions = getScreenshotScaleOptions(
    screenshotFormat,
    screenshotCaptureArea
  )

  return (
    <div className="space-y-4">
      <StudioPanelToolbar
        label="Product image or website capture"
        onReset={resetContent}
        resetLabel="Reset content"
      />

      <SectionSwitcher
        value={contentMode}
        onChange={(value) => setContentMode(value as ContentMode)}
        options={[
          { value: "upload", label: "Upload" },
          { value: "url", label: "Website" },
        ]}
      />

      {contentMode === "upload" ? (
        <FileUploadField
          label="Upload product image"
          onUpload={uploadProduct}
          preview={
            productImage ? (
              <div className="overflow-hidden rounded-squircle-md border border-border">
                <img
                  src={productImage}
                  alt="Uploaded product"
                  className="max-h-44 w-full object-cover"
                />
              </div>
            ) : null
          }
        />
      ) : (
        <div className="space-y-4">
          <Field>
            <FieldLabel>Website URL</FieldLabel>
            <Input
              type="text"
              placeholder="example.com"
              value={websiteUrl}
              onChange={(event) => setWebsiteUrl(event.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel>Capture area</FieldLabel>
            <SectionSwitcher
              value={screenshotCaptureArea}
              onChange={(value) =>
                setScreenshotCaptureArea(value as ScreenshotCaptureArea)
              }
              options={[...SCREENSHOT_CAPTURE_AREA_OPTIONS]}
            />
          </Field>

          <Field>
            <FieldLabel>Device format</FieldLabel>
            <Select
              items={SCREENSHOT_FORMAT_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              value={screenshotFormat}
              onValueChange={(value) => {
                const format = value as ScreenshotFormat
                setScreenshotFormat(format)
                setFrame(format)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCREENSHOT_FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Capture resolution</FieldLabel>
            <Select
              items={scaleOptions.map((option) => ({
                label: option.label,
                value: String(option.value),
              }))}
              value={String(screenshotScale)}
              onValueChange={(value) =>
                setScreenshotScale(Number(value) as ImageScale)
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

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              className="w-full"
              disabled={!canCaptureWebsiteUrl(websiteUrl) || isCapturing}
              onClick={() => void captureScreenshot()}
            >
              {isCapturing ? "Capturing..." : "Capture screenshot"}
            </Button>

            {activeScreenSrc ? (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={downloadScreenshot}
              >
                Download screenshot
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
