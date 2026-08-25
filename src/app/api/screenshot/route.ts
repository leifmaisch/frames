import { chromium, type Browser, type Page } from "playwright"
import { NextResponse } from "next/server"

import type {
  ImageScale,
  ScreenshotCaptureArea,
  ScreenshotFormat,
} from "@/lib/mockup-types"
import { SCREENSHOT_VIEWPORTS } from "@/lib/screenshot-formats"
import { dismissOverlays } from "@/lib/screenshot/dismiss-overlays"
import { getScreenshotUrlCandidates } from "@/lib/url-validation"

export const runtime = "nodejs"
export const maxDuration = 60

const VALID_SCALES: ImageScale[] = [1, 2, 3, 4]
const VALID_CAPTURE_AREAS: ScreenshotCaptureArea[] = ["viewport", "fullPage"]

type ScreenshotRequest = {
  url?: string
  format?: ScreenshotFormat
  scale?: ImageScale
  captureArea?: ScreenshotCaptureArea
}

type CaptureViewport = {
  width: number
  height: number
}

async function getPageDimensions(page: Page) {
  return page.evaluate(() => ({
    width: Math.max(
      document.documentElement.clientWidth,
      document.documentElement.scrollWidth,
      document.body.scrollWidth
    ),
    height: Math.max(
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    ),
  }))
}

async function captureScreenshot(
  browser: Browser,
  url: string,
  viewport: CaptureViewport,
  scale: ImageScale,
  captureArea: ScreenshotCaptureArea
) {
  const context = await browser.newContext({
    viewport: {
      width: viewport.width,
      height: viewport.height,
    },
    deviceScaleFactor: scale,
  })

  const page = await context.newPage()

  try {
    page.setDefaultTimeout(45000)

    try {
      await page.goto(url, { waitUntil: "load", timeout: 45000 })
    } catch {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 })
    }

    await dismissOverlays(page)

    const fullPage = captureArea === "fullPage"
    const pageDimensions = fullPage ? await getPageDimensions(page) : null

    const screenshot = await page.screenshot({
      type: "png",
      fullPage,
      timeout: fullPage ? 60000 : 30000,
      animations: "disabled",
    })

    return {
      screenshot,
      width: fullPage
        ? pageDimensions!.width * scale
        : viewport.width * scale,
      height: fullPage
        ? pageDimensions!.height * scale
        : viewport.height * scale,
    }
  } finally {
    await context.close()
  }
}

export async function POST(request: Request) {
  let body: ScreenshotRequest

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const url = body.url?.trim() ?? ""
  const format = body.format
  const scale = body.scale ?? 2
  const captureArea = body.captureArea ?? "viewport"
  const candidates = getScreenshotUrlCandidates(url)

  if (!url || candidates.length === 0) {
    return NextResponse.json(
      { error: "Enter a valid public website URL." },
      { status: 400 }
    )
  }

  if (!format || !(format in SCREENSHOT_VIEWPORTS)) {
    return NextResponse.json({ error: "Select a screenshot format." }, { status: 400 })
  }

  if (!VALID_SCALES.includes(scale)) {
    return NextResponse.json({ error: "Select a valid screenshot scale." }, { status: 400 })
  }

  if (!VALID_CAPTURE_AREAS.includes(captureArea)) {
    return NextResponse.json({ error: "Select a valid capture area." }, { status: 400 })
  }

  const viewport = SCREENSHOT_VIEWPORTS[format]
  let browser: Browser | null = null

  try {
    browser = await chromium.launch({ headless: true })

    for (const candidate of candidates) {
      try {
        const result = await captureScreenshot(
          browser,
          candidate,
          viewport,
          scale,
          captureArea
        )

        return NextResponse.json({
          image: `data:image/png;base64,${result.screenshot.toString("base64")}`,
          url: candidate,
          width: result.width,
          height: result.height,
          captureArea,
        })
      } catch {
        continue
      }
    }

    return NextResponse.json(
      {
        error:
          "Could not capture this URL. We tried https and http. Check that the site is reachable.",
      },
      { status: 500 }
    )
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not capture this URL. Check that Playwright Chromium is installed.",
      },
      { status: 500 }
    )
  } finally {
    await browser?.close()
  }
}
