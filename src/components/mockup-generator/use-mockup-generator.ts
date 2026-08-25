"use client"

import { useCallback, useMemo, useRef, useState } from "react"

import { PRESET_BACKGROUNDS } from "@/lib/backgrounds"
import { MOCKUP_DEFAULTS, getDefaultFrameScale } from "@/lib/mockup/defaults"
import { exportMockup } from "@/lib/mockup/export-mockup"
import { isDesktopFrame } from "@/lib/mockup/frame-layout"
import { readFileAsDataUrl } from "@/lib/mockup/read-file-as-data-url"
import type {
  ContentMode,
  ExportFormat,
  FrameType,
  ImageScale,
  ScreenshotCaptureArea,
  ScreenshotFormat,
} from "@/lib/mockup-types"
import { displayUrl, normalizeScreenshotUrl } from "@/lib/url-validation"

export function useMockupGenerator() {
  const previewRef = useRef<HTMLDivElement>(null)

  const [selectedBackgroundId, setSelectedBackgroundId] = useState(
    PRESET_BACKGROUNDS[0]?.id ?? "background-1"
  )
  const [customBackground, setCustomBackground] = useState<string | null>(null)
  const [blur, setBlur] = useState(MOCKUP_DEFAULTS.blur)
  const [dim, setDim] = useState(MOCKUP_DEFAULTS.dim)
  const [frameScale, setFrameScale] = useState(
    getDefaultFrameScale(MOCKUP_DEFAULTS.frame)
  )
  const [backgroundScale, setBackgroundScale] = useState(
    MOCKUP_DEFAULTS.backgroundScale
  )
  const [frame, setFrame] = useState<FrameType>(MOCKUP_DEFAULTS.frame)
  const [contentMode, setContentMode] = useState<ContentMode>(
    MOCKUP_DEFAULTS.contentMode
  )
  const [productImage, setProductImage] = useState<string | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState(MOCKUP_DEFAULTS.websiteUrl)
  const [screenshotFormat, setScreenshotFormat] = useState<ScreenshotFormat>(
    MOCKUP_DEFAULTS.screenshotFormat
  )
  const [screenshotScale, setScreenshotScale] = useState<ImageScale>(
    MOCKUP_DEFAULTS.screenshotScale
  )
  const [screenshotCaptureArea, setScreenshotCaptureArea] =
    useState<ScreenshotCaptureArea>(MOCKUP_DEFAULTS.screenshotCaptureArea)
  const [exportFormat, setExportFormat] = useState<ExportFormat>(
    MOCKUP_DEFAULTS.exportFormat
  )
  const [exportScale, setExportScale] = useState<ImageScale>(
    MOCKUP_DEFAULTS.exportScale
  )
  const [screenSrc, setScreenSrc] = useState<string | undefined>()
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

  const activeScreenSrc =
    contentMode === "upload"
      ? (productImage ?? undefined)
      : (screenSrc ?? undefined)

  const safariUrl = useMemo(() => {
    if (contentMode === "url" && websiteUrl.trim()) {
      return displayUrl(websiteUrl)
    }

    return "example.com"
  }, [contentMode, websiteUrl])

  const canExport = Boolean(activeScreenSrc)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const selectPresetBackground = useCallback((id: string) => {
    clearError()
    setCustomBackground(null)
    setSelectedBackgroundId(id)
  }, [clearError])

  const uploadBackground = useCallback(async (file: File | undefined) => {
    if (!file) {
      return
    }

    clearError()
    const dataUrl = await readFileAsDataUrl(file)
    setCustomBackground(dataUrl)
    setSelectedBackgroundId("")
  }, [clearError])

  const uploadProduct = useCallback(async (file: File | undefined) => {
    if (!file) {
      return
    }

    clearError()
    const dataUrl = await readFileAsDataUrl(file)
    setProductImage(dataUrl)
    setContentMode("upload")
  }, [clearError])

  const selectFrame = useCallback(
    (nextFrame: FrameType) => {
      if (isDesktopFrame(frame) !== isDesktopFrame(nextFrame)) {
        setFrameScale(getDefaultFrameScale(nextFrame))
      }

      setFrame(nextFrame)
    },
    [frame]
  )

  const captureScreenshot = useCallback(async () => {
    clearError()
    setIsCapturing(true)

    try {
      const normalizedUrl = normalizeScreenshotUrl(websiteUrl)

      if (!normalizedUrl) {
        throw new Error("Enter a valid public website URL.")
      }

      const response = await fetch("/api/screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: websiteUrl.trim(),
          format: screenshotFormat,
          scale: screenshotScale,
          captureArea: screenshotCaptureArea,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Screenshot failed.")
      }

      setScreenSrc(data.image)
      setFrame(screenshotFormat)
      setFrameScale(getDefaultFrameScale(screenshotFormat))
      setContentMode("url")

      if (typeof data.url === "string") {
        setWebsiteUrl(data.url)
      }
    } catch (captureError) {
      setError(
        captureError instanceof Error
          ? captureError.message
          : "Screenshot failed."
      )
    } finally {
      setIsCapturing(false)
    }
  }, [clearError, screenshotCaptureArea, screenshotFormat, screenshotScale, websiteUrl])

  const downloadScreenshot = useCallback(() => {
    if (!screenSrc) {
      return
    }

    clearError()
    const link = document.createElement("a")
    link.download = "screenshot.png"
    link.href = screenSrc
    link.click()
  }, [clearError, screenSrc])

  const exportMockupFile = useCallback(async () => {
    if (!previewRef.current || !canExport) {
      return
    }

    clearError()
    setIsExporting(true)

    try {
      const { dataUrl, fileName } = await exportMockup(previewRef.current, {
        format: exportFormat,
        scale: exportScale,
      })

      const link = document.createElement("a")
      link.download = fileName
      link.href = dataUrl
      link.click()
    } catch {
      setError("Export failed. Try again after the preview finishes loading.")
    } finally {
      setIsExporting(false)
    }
  }, [canExport, clearError, exportFormat, exportScale])

  const resetScene = useCallback(() => {
    clearError()
    setSelectedBackgroundId(PRESET_BACKGROUNDS[0]?.id ?? "background-1")
    setCustomBackground(null)
    setBlur(MOCKUP_DEFAULTS.blur)
    setDim(MOCKUP_DEFAULTS.dim)
    setFrameScale(getDefaultFrameScale(frame))
    setBackgroundScale(MOCKUP_DEFAULTS.backgroundScale)
  }, [clearError, frame])

  const resetContent = useCallback(() => {
    clearError()
    setProductImage(null)
    setScreenSrc(undefined)
    setWebsiteUrl(MOCKUP_DEFAULTS.websiteUrl)
    setScreenshotFormat(MOCKUP_DEFAULTS.screenshotFormat)
    setScreenshotScale(MOCKUP_DEFAULTS.screenshotScale)
    setScreenshotCaptureArea(MOCKUP_DEFAULTS.screenshotCaptureArea)
    setContentMode(MOCKUP_DEFAULTS.contentMode)
  }, [clearError])

  const resetExport = useCallback(() => {
    clearError()
    setExportFormat(MOCKUP_DEFAULTS.exportFormat)
    setExportScale(MOCKUP_DEFAULTS.exportScale)
  }, [clearError])

  return {
    previewRef,
    backgroundSrc,
    activeScreenSrc,
    canExport,
    blur,
    dim,
    frameScale,
    backgroundScale,
    frame,
    contentMode,
    productImage,
    websiteUrl,
    screenshotFormat,
    screenshotScale,
    screenshotCaptureArea,
    exportFormat,
    exportScale,
    safariUrl,
    selectedBackgroundId,
    customBackground,
    isCapturing,
    isExporting,
    error,
    setBlur,
    setDim,
    setFrameScale,
    setBackgroundScale,
    setFrame: selectFrame,
    setContentMode,
    setWebsiteUrl,
    setScreenshotFormat,
    setScreenshotScale,
    setScreenshotCaptureArea,
    setExportFormat,
    setExportScale,
    selectPresetBackground,
    uploadBackground,
    uploadProduct,
    captureScreenshot,
    downloadScreenshot,
    exportMockup: exportMockupFile,
    resetScene,
    resetContent,
    resetExport,
  }
}

export type MockupGeneratorState = ReturnType<typeof useMockupGenerator>
