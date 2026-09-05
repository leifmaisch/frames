import { toBlob, toJpeg, toPng } from "html-to-image"

import type { ExportFormat, ImageScale } from "@/lib/mockup-types"
import { getExportFileName } from "@/lib/mockup-types"
import {
  splitImageDataUrl,
  type XSplitOptions,
} from "@/lib/mockup/x-split"

type ExportMockupOptions = {
  format: ExportFormat
  scale: ImageScale
}

function inlineSvgPaint(root: HTMLElement, view: Window) {
  root.querySelectorAll("svg *").forEach((node) => {
    if (!(node instanceof SVGElement)) {
      return
    }

    const styles = view.getComputedStyle(node)
    const fill = styles.fill

    if (fill && fill !== "none" && fill !== "rgba(0, 0, 0, 0)") {
      node.setAttribute("fill", fill)
    }

    const stroke = styles.stroke

    if (stroke && stroke !== "none") {
      node.setAttribute("stroke", stroke)
    }

    const strokeWidth = styles.strokeWidth

    if (strokeWidth && strokeWidth !== "0px") {
      node.setAttribute("stroke-width", strokeWidth)
    }

    const opacity = styles.opacity

    if (opacity && opacity !== "1") {
      node.setAttribute("opacity", opacity)
    }
  })
}

function prepareExportNode(node: HTMLElement) {
  const clone = node.cloneNode(true) as HTMLElement
  const mount = document.createElement("div")

  mount.style.position = "fixed"
  mount.style.left = "-10000px"
  mount.style.top = "0"
  mount.style.pointerEvents = "none"
  mount.style.width = `${node.offsetWidth}px`
  mount.style.height = `${node.offsetHeight}px`

  clone.querySelectorAll("[data-export-ignore]").forEach((element) => {
    element.remove()
  })

  mount.appendChild(clone)
  document.body.appendChild(mount)
  inlineSvgPaint(clone, window)

  return { clone, mount }
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }

      reject(new Error("Export failed."))
    }

    reader.onerror = () => reject(new Error("Export failed."))
    reader.readAsDataURL(blob)
  })
}

export async function exportMockup(
  node: HTMLElement,
  { format, scale }: ExportMockupOptions
) {
  const { clone, mount } = prepareExportNode(node)

  try {
    const options = {
      cacheBust: true,
      pixelRatio: scale,
      skipFonts: true,
    }

    if (format === "jpeg") {
      const dataUrl = await toJpeg(clone, {
        ...options,
        quality: 0.92,
      })

      return {
        dataUrl,
        fileName: getExportFileName(format),
      }
    }

    if (format === "webp") {
      const blob = await toBlob(clone, {
        ...options,
        type: "image/webp",
      })

      if (!blob) {
        throw new Error("Export failed.")
      }

      return {
        dataUrl: await blobToDataUrl(blob),
        fileName: getExportFileName(format),
      }
    }

    const dataUrl = await toPng(clone, options)

    return {
      dataUrl,
      fileName: getExportFileName(format),
    }
  } finally {
    mount.remove()
  }
}

export async function exportMockupSplit(
  node: HTMLElement,
  splitOptions: XSplitOptions
) {
  const { dataUrl } = await exportMockup(node, {
    format: "png",
    scale: 1,
  })

  return splitImageDataUrl(dataUrl, splitOptions)
}
