import type { Metadata, Viewport } from "next"
import { leguanFontVariables } from "@/lib/fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mockup Generator",
  description: "Next.js starter with Leguan UI",
}

export const viewport: Viewport = {
  colorScheme: "dark",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${leguanFontVariables} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
