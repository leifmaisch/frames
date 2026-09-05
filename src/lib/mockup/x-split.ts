import type { ExportFormat, ImageScale } from "@/lib/mockup-types"
import { formatPixelSize } from "@/lib/mockup-types"

export type ExportMode = "standard" | "x-split"

export type XSplitCount = 2 | 3 | 4

export type XSplitAspect = "portrait-3-4" | "portrait-4-5" | "square" | "landscape-16-9"

export type XSplitOptions = {
  count: XSplitCount
  aspect: XSplitAspect
  scale: ImageScale
  format: ExportFormat
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
    value: "portrait-4-5",
    label: "4:5 portrait",
    description: "Tallest tiles, best feed presence on X",
  },
  {
    value: "portrait-3-4",
    label: "3:4 portrait",
    description: "Classic portrait tiles at 1200 x 1600",
  },
  {
    value: "square",
    label: "1:1 square",
    description: "Balanced square tiles",
  },
  {
    value: "landscape-16-9",
    label: "16:9 landscape",
    description: "Wide tiles for landscape compositions",
  },
]

const X_TILE_BASE_SIZE: Record<XSplitAspect, { width: number; height: number }> =
  {
    "portrait-3-4": { width: 1200, height: 1600 },
    "portrait-4-5": { width: 1200, height: 1500 },
    square: { width: 1200, height: 1200 },
    "landscape-16-9": { width: 1200, height: 675 },
  }

export function getXSplitTileSize(aspect: XSplitAspect, scale: ImageScale) {
  const base = X_TILE_BASE_SIZE[aspect]

  return {
    width: base.width * scale,
    height: base.height * scale,
  }
}

export function getXSplitCompositeSize({
  count,
  aspect,
  scale,
}: Pick<XSplitOptions, "count" | "aspect" | "scale">) {
  const tile = getXSplitTileSize(aspect, scale)

  return {
    width: tile.width * count,
    height: tile.height,
  }
}

export function getXSplitCompositeAspectRatio(
  count: XSplitCount,
  aspect: XSplitAspect
) {
  const composite = getXSplitCompositeSize({ count, aspect, scale: 1 })

  return composite.width / composite.height
}

export function getXSplitTileAspectRatio(aspect: XSplitAspect) {
  const tile = getXSplitTileSize(aspect, 1)

  return tile.width / tile.height
}

export function getXSplitResolutionLabel(options: XSplitOptions) {
  const tile = getXSplitTileSize(options.aspect, options.scale)
  const composite = getXSplitCompositeSize(options)

  return `${options.count} x ${formatPixelSize(tile.width, tile.height)} (${formatPixelSize(composite.width, composite.height)} total)`
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
  const tile = getXSplitTileSize(options.aspect, options.scale)
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
