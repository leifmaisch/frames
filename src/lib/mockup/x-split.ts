import type { ExportFormat, FrameType, ImageScale } from "@/lib/mockup-types"
import { formatPixelSize, IMAGE_SCALE_OPTIONS } from "@/lib/mockup-types"
import { isDesktopFrame } from "@/lib/mockup/frame-layout"

export type ExportMode = "standard" | "x-split"

export type XSplitCount = 2 | 3 | 4

export type XSplitAspect =
  | "fit-mockup"
  | "landscape-4-3"
  | "landscape-3-2"
  | "landscape-16-9"
  | "wide-2-1"
  | "square"
  | "portrait-4-5"
  | "portrait-3-4"

export type XSplitSizing = {
  count: XSplitCount
  mockupAspect: number
}

export type XSplitOptions = {
  count: XSplitCount
  aspect: XSplitAspect
  scale: ImageScale
  format: ExportFormat
  mockupAspect: number
}

const X_TILE_BASE_WIDTH = 1200

const X_FIXED_TILE_BASE_SIZE: Record<
  Exclude<XSplitAspect, "fit-mockup">,
  { width: number; height: number }
> = {
  "landscape-4-3": { width: 1200, height: 900 },
  "landscape-3-2": { width: 1200, height: 800 },
  "landscape-16-9": { width: 1200, height: 675 },
  "wide-2-1": { width: 1200, height: 600 },
  square: { width: 1200, height: 1200 },
  "portrait-4-5": { width: 1200, height: 1500 },
  "portrait-3-4": { width: 1200, height: 1600 },
}

export const EXPORT_MODE_OPTIONS: {
  value: ExportMode
  label: string
  description: string
}[] = [
  {
    value: "standard",
    label: "Standard",
    description: "Single full-frame export",
  },
  {
    value: "x-split",
    label: "X post split",
    description: "Split into 2–4 images that swipe left to right on X",
  },
]

export const X_SPLIT_COUNT_OPTIONS: {
  value: XSplitCount
  label: string
}[] = [
  { value: 2, label: "2 pieces" },
  { value: 3, label: "3 pieces" },
  { value: 4, label: "4 pieces" },
]

export const X_SPLIT_ASPECT_OPTIONS: {
  value: XSplitAspect
  label: string
  description: string
}[] = [
  {
    value: "fit-mockup",
    label: "Fit mockup",
    description: "Sizes tiles so the full composite matches your frame",
  },
  {
    value: "landscape-4-3",
    label: "4:3 landscape",
    description: "Wide tiles that pair well with phone mockups",
  },
  {
    value: "landscape-3-2",
    label: "3:2 landscape",
    description: "Balanced wide tiles for carousel splits",
  },
  {
    value: "landscape-16-9",
    label: "16:9 landscape",
    description: "Cinematic wide tiles at 1200 x 675",
  },
  {
    value: "wide-2-1",
    label: "2:1 wide",
    description: "Extra-wide tiles for panoramic splits",
  },
  {
    value: "square",
    label: "1:1 square",
    description: "Square tiles for even grid-style posts",
  },
  {
    value: "portrait-4-5",
    label: "4:5 portrait",
    description: "Tall tiles for maximum X timeline height",
  },
  {
    value: "portrait-3-4",
    label: "3:4 portrait",
    description: "Classic portrait tiles at 1200 x 1600",
  },
]

export function getMockupAspectRatio(frame: FrameType) {
  return isDesktopFrame(frame) ? 16 / 10 : 4 / 3
}

export function getXSplitSizing(count: XSplitCount, frame: FrameType): XSplitSizing {
  return {
    count,
    mockupAspect: getMockupAspectRatio(frame),
  }
}

export function getXSplitTileSize(
  aspect: XSplitAspect,
  scale: ImageScale,
  sizing: XSplitSizing
) {
  if (aspect === "fit-mockup") {
    const width = X_TILE_BASE_WIDTH * scale
    const height = Math.round((width * sizing.count) / sizing.mockupAspect)

    return { width, height }
  }

  const base = X_FIXED_TILE_BASE_SIZE[aspect]

  return {
    width: base.width * scale,
    height: base.height * scale,
  }
}

export function getXSplitCompositeSize({
  count,
  aspect,
  scale,
  mockupAspect,
}: Pick<XSplitOptions, "count" | "aspect" | "scale" | "mockupAspect">) {
  const tile = getXSplitTileSize(aspect, scale, { count, mockupAspect })

  return {
    width: tile.width * count,
    height: tile.height,
  }
}

export function getXSplitCompositeAspectRatio(
  count: XSplitCount,
  aspect: XSplitAspect,
  mockupAspect: number
) {
  if (aspect === "fit-mockup") {
    return mockupAspect
  }

  const composite = getXSplitCompositeSize({
    count,
    aspect,
    scale: 1,
    mockupAspect,
  })

  return composite.width / composite.height
}

export function getXSplitTileAspectRatio(
  aspect: XSplitAspect,
  sizing: XSplitSizing
) {
  const tile = getXSplitTileSize(aspect, 1, sizing)

  return tile.width / tile.height
}

export function getXSplitResolutionLabel(options: XSplitOptions) {
  const sizing = { count: options.count, mockupAspect: options.mockupAspect }
  const tile = getXSplitTileSize(options.aspect, options.scale, sizing)
  const composite = getXSplitCompositeSize(options)

  return `${options.count} x ${formatPixelSize(tile.width, tile.height)} (${formatPixelSize(composite.width, composite.height)} total)`
}

export function getXSplitScaleOptions(
  count: XSplitCount,
  aspect: XSplitAspect,
  frame: FrameType
) {
  const mockupAspect = getMockupAspectRatio(frame)

  return IMAGE_SCALE_OPTIONS.map((option) => ({
    value: option.value,
    label: getXSplitResolutionLabel({
      count,
      aspect,
      scale: option.value,
      format: "png",
      mockupAspect,
    }),
    description: option.description,
  }))
}

export function getXSplitFileName(format: ExportFormat, index: number, count: number) {
  const extension =
    format === "jpeg" ? "jpg" : format === "webp" ? "webp" : "png"
  const order = String(index + 1).padStart(String(count).length, "1")

  return `frames-x-${order}.${extension}`
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Export failed."))
    image.src = dataUrl
  })
}

function drawImageContained(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number
) {
  const scale = Math.min(width / image.width, height / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const offsetX = (width - drawWidth) / 2
  const offsetY = (height - drawHeight) / 2

  context.fillStyle = "#000000"
  context.fillRect(0, 0, width, height)
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
}

function canvasToDataUrl(canvas: HTMLCanvasElement, format: ExportFormat) {
  if (format === "jpeg") {
    return canvas.toDataURL("image/jpeg", 0.92)
  }

  if (format === "webp") {
    return canvas.toDataURL("image/webp", 0.92)
  }

  return canvas.toDataURL("image/png")
}

export async function splitImageDataUrl(
  dataUrl: string,
  options: XSplitOptions
) {
  const image = await loadImage(dataUrl)
  const sizing = {
    count: options.count,
    mockupAspect: options.mockupAspect,
  }
  const tile = getXSplitTileSize(options.aspect, options.scale, sizing)
  const composite = getXSplitCompositeSize(options)
  const canvas = document.createElement("canvas")

  canvas.width = composite.width
  canvas.height = composite.height

  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("Export failed.")
  }

  drawImageContained(context, image, composite.width, composite.height)

  const slices: { dataUrl: string; fileName: string }[] = []

  for (let index = 0; index < options.count; index += 1) {
    const sliceCanvas = document.createElement("canvas")
    sliceCanvas.width = tile.width
    sliceCanvas.height = tile.height

    const sliceContext = sliceCanvas.getContext("2d")

    if (!sliceContext) {
      throw new Error("Export failed.")
    }

    sliceContext.drawImage(
      canvas,
      tile.width * index,
      0,
      tile.width,
      tile.height,
      0,
      0,
      tile.width,
      tile.height
    )

    slices.push({
      dataUrl: canvasToDataUrl(sliceCanvas, options.format),
      fileName: getXSplitFileName(options.format, index, options.count),
    })
  }

  return slices
}

export function downloadFiles(files: { dataUrl: string; fileName: string }[]) {
  files.forEach((file, index) => {
    window.setTimeout(() => {
      const link = document.createElement("a")
      link.download = file.fileName
      link.href = file.dataUrl
      link.click()
    }, index * 180)
  })
}
