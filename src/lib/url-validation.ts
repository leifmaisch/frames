const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"])

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".").map(Number)

  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false
  }

  const [a, b] = parts

  return (
    a === 10 ||
    a === 127 ||
    (a === 192 && b === 168) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 169 && b === 254)
  )
}

function isAllowedScreenshotUrl(url: URL) {
  if (!["http:", "https:"].includes(url.protocol)) {
    return false
  }

  const hostname = url.hostname.toLowerCase()

  if (BLOCKED_HOSTS.has(hostname) || hostname.endsWith(".local")) {
    return false
  }

  if (isPrivateIpv4(hostname)) {
    return false
  }

  return true
}

export function normalizeScreenshotUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  let candidate = trimmed

  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`
  }

  try {
    const url = new URL(candidate)

    if (!isAllowedScreenshotUrl(url)) {
      return null
    }

    return url.toString()
  } catch {
    return null
  }
}

export function getScreenshotUrlCandidates(value: string) {
  const normalized = normalizeScreenshotUrl(value)

  if (!normalized) {
    return []
  }

  if (normalized.startsWith("http://")) {
    return [normalized]
  }

  const httpVersion = normalized.replace(/^https:\/\//i, "http://")

  if (httpVersion === normalized) {
    return [normalized]
  }

  return [normalized, httpVersion]
}

export function canCaptureWebsiteUrl(value: string) {
  return normalizeScreenshotUrl(value) !== null
}

export function isValidScreenshotUrl(value: string) {
  return canCaptureWebsiteUrl(value)
}

export function displayUrl(value: string) {
  const normalized = normalizeScreenshotUrl(value)

  if (!normalized) {
    return value.trim()
  }

  try {
    const url = new URL(normalized)
    const pathname =
      url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "")

    return url.hostname + pathname
  } catch {
    return value.trim()
  }
}
