import type { Metadata } from "next"

import { MockupGenerator } from "@/components/mockup-generator/mockup-generator"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Studio | Frames",
  description:
    "Compose framed product and website visuals with backgrounds, device frames, and high-resolution export.",
}

export default function CreatorStudioPage() {
  return <MockupGenerator />
}
