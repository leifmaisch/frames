"use client"

import { DownloadIcon, ImageIcon, LinkIcon, UploadIcon } from "@phosphor-icons/react"
import { toPng } from "html-to-image"
import { useMemo, useRef, useState } from "react"

import { MockupPreview } from "@/components/mockup-generator/mockup-preview"
import { SliderControl } from "@/components/mockup-generator/slider-control"
import { iconWeight } from "@/components/shared"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PRESET_BACKGROUNDS } from "@/lib/backgrounds"
import {
  FRAME_OPTIONS,
  SCREENSHOT_FORMAT_OPTIONS,
  type ContentMode,
  type FrameType,
  type ScreenshotFormat,
} from "@/lib/mockup-types"
import { displayUrl } from "@/lib/url-validation"
import { cn } from "@/lib/utils"

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }

      reject(new Error("Could not read file."))
    }

    reader.onerror = () => reject(new Error("Could not read file."))
    reader.readAsDataURL(file)
  })
}

export function MockupGenerator() {
  const previewRef = useRef<HTMLDivElement>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)
  const productInputRef = useRef<HTMLInputElement>(null)

  const [selectedBackgroundId, setSelectedBackgroundId] = useState(
    PRESET_BACKGROUNDS[0]?.id ?? "background-1"
  )
  const [customBackground, setCustomBackground] = useState<string | null>(null)
  const [blur, setBlur] = useState(18)
  const [dim, setDim] = useState(28)
  const [frameScale, setFrameScale] = useState(88)
  const [frame, setFrame] = useState<FrameType>("iphone")
  const [contentMode, setContentMode] = useState<ContentMode>("upload")
  const [productImage, setProductImage] = useState<string | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [screenshotFormat, setScreenshotFormat] =
    useState<ScreenshotFormat>("iphone")
  const [screenSrc, setScreenSrc] = useState<string | undefined>()
  const [safariUrl, setSafariUrl] = useState<string | undefined>()
  const [isCapturing, setIsCapturing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const backgroundSrc = useMemo(() => {
    if (customBackground) {
      return customBackground
    }

    return (
      PRESET_BACKGROUNDS.find((background) => background.id === selectedBackgroundId)
        ?.src ?? PRESET_BACKGROUNDS[0].src
    )
  }, [customBackground, selectedBackgroundId])

  const activeScreenSrc = screenSrc ?? productImage ?? undefined

  async function handleBackgroundUpload(file: File | undefined) {
    if (!file) {
      return
    }

    setError(null)
    const dataUrl = await readFileAsDataUrl(file)
    setCustomBackground(dataUrl)
    setSelectedBackgroundId("")
  }

  async function handleProductUpload(file: File | undefined) {
    if (!file) {
      return
    }

    setError(null)
    const dataUrl = await readFileAsDataUrl(file)
    setProductImage(dataUrl)
    setScreenSrc(dataUrl)
    setContentMode("upload")
  }

  async function handleCaptureScreenshot() {
    setError(null)
    setIsCapturing(true)

    try {
      const response = await fetch("/api/screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: websiteUrl,
          format: screenshotFormat,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Screenshot failed.")
      }

      setScreenSrc(data.image)
      setFrame(screenshotFormat)
      setSafariUrl(displayUrl(websiteUrl))
      setContentMode("url")
    } catch (captureError) {
      setError(
        captureError instanceof Error
          ? captureError.message
          : "Screenshot failed."
      )
    } finally {
      setIsCapturing(false)
    }
  }

  async function handleExport() {
    if (!previewRef.current) {
      return
    }

    setError(null)
    setIsExporting(true)

    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      })

      const link = document.createElement("a")
      link.download = "mockup.png"
      link.href = dataUrl
      link.click()
    } catch {
      setError("Export failed. Try again after the preview finishes loading.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-label">Mockup Generator</p>
            <h1 className="text-heading-lg">Create product and website mockups</h1>
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting || !activeScreenSrc}
            className="w-full sm:w-auto"
          >
            <DownloadIcon weight={iconWeight} />
            {isExporting ? "Exporting..." : "Download PNG"}
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[360px]">
          <Card>
            <CardHeader>
              <CardTitle>Background</CardTitle>
              <CardDescription>
                Pick a preset or upload your own image.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {PRESET_BACKGROUNDS.map((background) => {
                  const isSelected =
                    !customBackground && selectedBackgroundId === background.id

                  return (
                    <button
                      key={background.id}
                      type="button"
                      onClick={() => {
                        setCustomBackground(null)
                        setSelectedBackgroundId(background.id)
                      }}
                      className={cn(
                        "group relative aspect-[4/3] overflow-hidden rounded-squircle-md border transition-colors",
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
                ref={backgroundInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  void handleBackgroundUpload(event.target.files?.[0])
                  event.target.value = ""
                }}
              />

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => backgroundInputRef.current?.click()}
              >
                <UploadIcon weight={iconWeight} />
                Upload custom background
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Effects</CardTitle>
              <CardDescription>Fine-tune the scene before export.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
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
                label="Frame scale"
                value={frameScale}
                min={50}
                max={120}
                suffix="%"
                onChange={setFrameScale}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Upload a product image or capture a live website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs
                value={contentMode}
                onValueChange={(value) => setContentMode(value as ContentMode)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">
                    <ImageIcon weight={iconWeight} />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <LinkIcon weight={iconWeight} />
                    Website
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4 pt-4">
                  <Field>
                    <input
                      ref={productInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        void handleProductUpload(event.target.files?.[0])
                        event.target.value = ""
                      }}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => productInputRef.current?.click()}
                    >
                      <UploadIcon weight={iconWeight} />
                      Upload product image
                    </Button>

                    {productImage ? (
                      <div className="overflow-hidden rounded-squircle-md border border-border">
                        <img
                          src={productImage}
                          alt="Uploaded product"
                          className="max-h-40 w-full object-cover"
                        />
                      </div>
                    ) : (
                      <FieldDescription>
                        PNG or JPG works best for transparent product shots.
                      </FieldDescription>
                    )}
                  </Field>
                </TabsContent>

                <TabsContent value="url" className="space-y-4 pt-4">
                  <Field>
                    <FieldLabel>Website URL</FieldLabel>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={websiteUrl}
                      onChange={(event) => setWebsiteUrl(event.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Screenshot format</FieldLabel>
                    <Select
                      value={screenshotFormat}
                      onValueChange={(value) =>
                        setScreenshotFormat(value as ScreenshotFormat)
                      }
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
                    <FieldDescription>
                      {
                        SCREENSHOT_FORMAT_OPTIONS.find(
                          (option) => option.value === screenshotFormat
                        )?.description
                      }
                    </FieldDescription>
                  </Field>

                  <Button
                    type="button"
                    className="w-full"
                    disabled={!websiteUrl || isCapturing}
                    onClick={() => void handleCaptureScreenshot()}
                  >
                    {isCapturing ? "Capturing..." : "Capture screenshot"}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frame</CardTitle>
              <CardDescription>Choose the device frame for the preview.</CardDescription>
            </CardHeader>
            <CardContent>
              <Field>
                <FieldLabel>Device</FieldLabel>
                <Select
                  value={frame}
                  onValueChange={(value) => setFrame(value as FrameType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAME_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>

          {error ? <p className="text-caption text-destructive">{error}</p> : null}
        </aside>

        <main className="flex min-h-[420px] flex-1 items-center justify-center">
          <div ref={previewRef} className="w-full max-w-5xl">
            <MockupPreview
              backgroundSrc={backgroundSrc}
              blur={blur}
              dim={dim}
              frameScale={frameScale}
              frame={frame}
              screenSrc={activeScreenSrc}
              safariUrl={safariUrl}
            />
            {!activeScreenSrc ? (
              <p className="mt-4 text-center text-description">
                Upload a product image or capture a website screenshot to fill
                the frame.
              </p>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
