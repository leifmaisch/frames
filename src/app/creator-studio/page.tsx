import type { Metadata } from "next"

import { MockupGenerator } from "@/components/mockup-generator/mockup-generator"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Creator Studio | Mockup Generator",
  description:
    "Compose product and website mockups with backgrounds, frames, and high-resolution export.",
}

export default function CreatorStudioPage() {
  return <MockupGenerator />
}
