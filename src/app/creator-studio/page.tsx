import type { Metadata } from "next"

import { MockupGenerator } from "@/components/mockup-generator/mockup-generator"
import { siteDescription, siteName } from "@/lib/site"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Creator Studio",
  description: `${siteDescription} Open the studio to compose exports with backgrounds, frames, uploads, and live captures.`,
  alternates: {
    canonical: "/creator-studio",
  },
  openGraph: {
    title: `Creator Studio | ${siteName}`,
    description: siteDescription,
    url: "/creator-studio",
  },
  twitter: {
    title: `Creator Studio | ${siteName}`,
    description: siteDescription,
  },
}

export default function CreatorStudioPage() {
  return <MockupGenerator />
}
