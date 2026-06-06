import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fashion Try-On Studio",
  description: "AI-powered virtual fashion try-on and styling studio",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-hidden bg-zinc-950">{children}</body>
    </html>
  )
}
