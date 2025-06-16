import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { AppProviders } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export default function SupermarketLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AppProviders>
      <div className={`flex flex-col min-h-screen ${inter.className} bg-background text-foreground transition-colors duration-300`}>
        <SiteHeader />
        <main className="flex-grow">{children}</main>
        <SiteFooter />
      </div>
    </AppProviders>
  )
}
