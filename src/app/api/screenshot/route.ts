import puppeteer from "puppeteer"
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

async function launchBrowser() {
  try {
    return await puppeteer.launch({
      headless: true,
      channel: "chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
  } catch {
    return await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
  }
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
  let browser: Awaited<ReturnType<typeof launchBrowser>> | null = null

  try {
    browser = await launchBrowser()
    const page = await browser.newPage()
    await page.setViewport(viewport)
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 45000,
    })
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const screenshot = await page.screenshot({
      type: "png",
      encoding: "base64",
      fullPage: false,
    })

    return NextResponse.json({
      image: `data:image/png;base64,${screenshot}`,
    })
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not capture this URL. Check that it is reachable and that Chrome is installed locally.",
      },
      { status: 500 }
    )
  } finally {
    await browser?.close()
  }
}
