import type { Page } from "playwright"

const MAX_SCROLL_STEPS = 50
const SCROLL_PAUSE_MS = 200

export async function scrollPageForLazyContent(page: Page) {
  const viewportHeight = page.viewportSize()?.height ?? 800
  let steps = 0

  while (steps < MAX_SCROLL_STEPS) {
    const metrics = await page.evaluate(() => {
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )

      return {
        scrollHeight,
        scrollTop: window.scrollY,
        clientHeight: window.innerHeight,
      }
    })

    const maxScroll = Math.max(0, metrics.scrollHeight - metrics.clientHeight)
    const nextTop = Math.min(
      metrics.scrollTop + Math.round(viewportHeight * 0.9),
      maxScroll
    )

    if (metrics.scrollTop >= maxScroll - 2) {
      break
    }

    await page.evaluate((top) => {
      window.scrollTo(0, top)
    }, nextTop)
    await page.waitForTimeout(SCROLL_PAUSE_MS)
    steps++
  }

  await page.evaluate(() => {
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(150)
}
