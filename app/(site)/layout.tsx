import type { ReactNode } from "react"
import { AppProviders } from "@/components/providers/app-providers"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { MobileDock } from "@/components/layout/mobile-dock"

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <SiteHeader />
      <main className="min-h-screen pb-24 lg:pb-0">{children}</main>
      <SiteFooter />
      <MobileDock />
    </AppProviders>
  )
}
