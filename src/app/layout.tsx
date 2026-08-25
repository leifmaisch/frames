import type { Metadata, Viewport } from "next"
import { leguanFontVariables } from "@/lib/fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "Frames",
  description:
    "Create framed product and website visuals with backgrounds, device frames, and live captures.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${leguanFontVariables} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
