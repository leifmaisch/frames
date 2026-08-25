import { chromium } from "playwright"
import { NextResponse } from "next/server"

import type { ScreenshotFormat } from "@/lib/mockup-types"
import { SCREENSHOT_VIEWPORTS } from "@/lib/screenshot-formats"
import { isValidScreenshotUrl } from "@/lib/url-validation"

export const runtime = "nodejs"
export const maxDuration = 60

type ScreenshotRequest = {
  url?: string
  format?: ScreenshotFormat
}

export async function POST(request: Request) {
  let body: ScreenshotRequest

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const url = body.url?.trim()
  const format = body.format

  if (!url || !isValidScreenshotUrl(url)) {
    return NextResponse.json({ error: "Enter a valid public http(s) URL." }, { status: 400 })
  }

  if (!format || !(format in SCREENSHOT_VIEWPORTS)) {
    return NextResponse.json({ error: "Select a screenshot format." }, { status: 400 })
  }

  const viewport = SCREENSHOT_VIEWPORTS[format]
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
      deviceScaleFactor: viewport.deviceScaleFactor,
    })
    const page = await context.newPage()
    page.setDefaultTimeout(45000)

    try {
      await page.goto(url, { waitUntil: "load", timeout: 45000 })
    } catch {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 })
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
    })

    return NextResponse.json({
      image: `data:image/png;base64,${screenshot.toString("base64")}`,
    })
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not capture this URL. Check that it is reachable and that Playwright Chromium is installed.",
      },
      { status: 500 }
    )
  } finally {
    await browser?.close()
  }
}
