import type { ReactNode } from "react"
import { AppProviders } from "@/components/providers/app-providers"
import { SiteContentProvider } from "@/components/providers/site-content-provider"
import { HashScrollHandler } from "@/components/navigation/hash-scroll-handler"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { MobileDock } from "@/components/layout/mobile-dock"
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <SiteContentProvider>
        <HashScrollHandler />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#3B82F6] focus:text-white focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="relative z-[2] min-h-screen pb-24 lg:pb-0" role="main">
          {children}
        </main>
        <SiteFooter />
        <MobileDock />
      </SiteContentProvider>
    </AppProviders>
  )
}
