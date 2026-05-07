import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Go Viral: AI Creator Assistant",
  description: "Upload your content and receive an AI virality score with actionable feedback.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        <AuthProvider>
          <SubscriptionProvider>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
          </SubscriptionProvider>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
