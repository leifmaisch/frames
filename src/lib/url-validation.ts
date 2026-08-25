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

export function isValidScreenshotUrl(value: string) {
  try {
    const url = new URL(value)

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
  } catch {
    return false
  }
}

export function displayUrl(value: string) {
  try {
    const url = new URL(value)
    return url.hostname + url.pathname.replace(/\/$/, "")
  } catch {
    return value
  }
}
