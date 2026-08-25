import type { Page } from "playwright"

const OVERLAY_HIDE_CSS = `
  #onetrust-banner-sdk,
  #onetrust-consent-sdk,
  #onetrust-pc-sdk,
  .onetrust-pc-dark-filter,
  #CybotCookiebotDialog,
  #CybotCookiebotDialogBodyUnderlay,
  .cc-window,
  .cc-banner,
  #cookieconsent,
  #cookie-law-info-bar,
  #cookie-notice,
  #cookie-banner,
  #cookieBanner,
  #cookies-banner,
  #gdpr-cookie-message,
  #axeptio_overlay,
  .axeptio_widget,
  #didomi-notice,
  #didomi-popup,
  .didomi-popup-backdrop,
  #truste-consent-track,
  .truste_overlay,
  #sp-cc,
  #sp-cc-wrapper,
  #qc-cmp2-container,
  #qc-cmp2-main,
  #usercentrics-root,
  #cmpbox,
  #cmpwrapper,
  .fc-consent-root,
  #iubenda-cs-banner,
  .iubenda-cs-content,
  #privacy-banner,
  #consent-manager,
  #consent-banner,
  #termly-code-snippet-support,
  .termly-styles,
  #hs-eu-cookie-confirmation,
  #cookieChoiceInfo,
  #cookie-policy-panel,
  #cookieModal,
  #cookie-modal,
  #cookieConsent,
  #cookie-consent,
  #cookiescript_injected,
  #cookiescript_injected_wrapper,
  #intercom-container,
  #drift-widget,
  #hubspot-messages-iframe-container,
  .osano-cm-window,
  #osano-cm-dialog,
  [class*="cookie-banner"],
  [class*="cookie-consent"],
  [class*="cookie-notice"],
  [class*="CookieBanner"],
  [class*="CookieConsent"],
  [id*="cookie-banner"],
  [id*="cookie-notice"],
  [id*="cookie-consent"],
  [data-testid*="cookie"],
  [data-testid*="consent"],
  [aria-label*="cookie" i],
  [aria-label*="consent" i] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
`

const CONSENT_BUTTON_SELECTORS = [
  "#onetrust-accept-btn-handler",
  "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
  "#CybotCookiebotDialogBodyButtonAccept",
  ".cc-accept",
  ".cc-allow",
  ".cc-dismiss",
  "#cookie_action_close_header",
  "#cookie-accept",
  "#accept-cookies",
  ".accept-cookies",
  "#axeptio_btn_acceptAll",
  "#didomi-notice-agree-button",
  ".didomi-continue-without-agreeing",
  "#truste-consent-button",
  ".fc-cta-consent",
  ".fc-button-label",
  "#iubenda-cs-accept-btn",
  ".iubenda-cs-close-btn",
  "[data-consent-accept]",
  "[data-testid='accept-all']",
  "[data-testid='uc-accept-all-button']",
  "button[id*='accept']",
  "button[class*='accept']",
]

const CONSENT_BUTTON_TEXT = [
  "accept all",
  "accept cookies",
  "allow all",
  "allow cookies",
  "agree and close",
  "i agree",
  "got it",
  "ok",
  "continue",
  "understood",
  "close",
  "dismiss",
]

async function clickConsentButtons(page: Page) {
  for (const selector of CONSENT_BUTTON_SELECTORS) {
    const button = page.locator(selector).first()
    if ((await button.count()) === 0) {
      continue
    }

    try {
      if (await button.isVisible({ timeout: 250 })) {
        await button.click({ timeout: 1000, force: true })
        await page.waitForTimeout(150)
      }
    } catch {
      continue
    }
  }

  await page.evaluate((buttonTexts) => {
    const candidates = Array.from(
      document.querySelectorAll(
        "button, a[role='button'], [role='button'], input[type='button'], input[type='submit']"
      )
    )

    for (const element of candidates) {
      const text = (element.textContent ?? "").replace(/\s+/g, " ").trim().toLowerCase()
      if (!text || text.length > 40) {
        continue
      }

      if (!buttonTexts.some((label) => text.includes(label))) {
        continue
      }

      const style = window.getComputedStyle(element)
      if (style.display === "none" || style.visibility === "hidden") {
        continue
      }

      element.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true, view: window })
      )
    }
  }, CONSENT_BUTTON_TEXT)
}

async function removeOverlayElements(page: Page) {
  await page.evaluate(() => {
    const pattern =
      /cookie|consent|gdpr|privacy|banner|popup|popover|modal|overlay|dialog|cmp|notice|termly|iubenda|didomi|onetrust|cookiebot|axeptio|truste|osano|hubspot|intercom|drift/i

    const viewportArea = window.innerWidth * window.innerHeight

    for (const element of Array.from(document.querySelectorAll("*"))) {
      const style = window.getComputedStyle(element)
      const position = style.position

      if (position !== "fixed" && position !== "sticky" && position !== "absolute") {
        continue
      }

      const zIndex = Number.parseInt(style.zIndex, 10)
      if (Number.isNaN(zIndex) || zIndex < 50) {
        continue
      }

      const rect = element.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) {
        continue
      }

      const area = rect.width * rect.height
      const attrs = [
        element.id,
        element.className,
        element.getAttribute("aria-label") ?? "",
        element.getAttribute("role") ?? "",
        element.getAttribute("data-testid") ?? "",
      ]
        .join(" ")
        .toLowerCase()

      const isOverlayCandidate =
        pattern.test(attrs) ||
        element.matches("[role='dialog'], dialog[open], [aria-modal='true']")

      if (!isOverlayCandidate) {
        continue
      }

      if (area >= viewportArea * 0.08 || rect.bottom > window.innerHeight * 0.65) {
        element.remove()
      }
    }

    for (const selector of [
      ".modal-backdrop",
      "[class*='backdrop']",
      "[class*='overlay']",
      "[class*='Underlay']",
    ]) {
      for (const element of Array.from(document.querySelectorAll(selector))) {
        const style = window.getComputedStyle(element)
        if (style.position === "fixed" || style.position === "absolute") {
          element.remove()
        }
      }
    }

    document.documentElement.style.overflow = ""
    document.body.style.overflow = ""
    document.body.style.position = ""
    document.body.classList.remove("modal-open", "overflow-hidden", "no-scroll")
  })
}

export async function dismissOverlays(page: Page) {
  await page.addStyleTag({ content: OVERLAY_HIDE_CSS })
  await clickConsentButtons(page)
  await removeOverlayElements(page)
  await clickConsentButtons(page)
  await removeOverlayElements(page)
  await page.waitForTimeout(300)
}
