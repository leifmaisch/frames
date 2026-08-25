import { chromium, type Browser } from "playwright"
import { NextResponse } from "next/server"

import type { ImageScale, ScreenshotFormat } from "@/lib/mockup-types"
import { SCREENSHOT_VIEWPORTS } from "@/lib/screenshot-formats"
import { dismissOverlays } from "@/lib/screenshot/dismiss-overlays"
import { getScreenshotUrlCandidates } from "@/lib/url-validation"

export const runtime = "nodejs"
export const maxDuration = 60

const VALID_SCALES: ImageScale[] = [1, 2, 3, 4]

type ScreenshotRequest = {
  url?: string
  format?: ScreenshotFormat
  scale?: ImageScale
}

type CaptureViewport = {
  width: number
  height: number
}

async function captureScreenshot(
  browser: Browser,
  url: string,
  viewport: CaptureViewport,
  scale: ImageScale
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

    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
      timeout: 30000,
      animations: "disabled",
    })

    return screenshot
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

  const viewport = SCREENSHOT_VIEWPORTS[format]
  let browser: Browser | null = null

  try {
    browser = await chromium.launch({ headless: true })

    for (const candidate of candidates) {
      try {
        const screenshot = await captureScreenshot(
          browser,
          candidate,
          viewport,
          scale
        )

        return NextResponse.json({
          image: `data:image/png;base64,${screenshot.toString("base64")}`,
          url: candidate,
          width: viewport.width * scale,
          height: viewport.height * scale,
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
