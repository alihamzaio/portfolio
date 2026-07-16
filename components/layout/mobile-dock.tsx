"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MouseEvent } from "react"
import { Home, User, Layers, Briefcase, Mail } from "lucide-react"
import { resolveNavHref, scrollToSection, shouldSmoothScrollHash } from "@/lib/navigation"

const dockItems = [
  { href: "/#home", icon: Home, label: "Top" },
  { href: "/#about", icon: User, label: "Bio" },
  { href: "/#skills", icon: Layers, label: "Stack" },
  { href: "/#projects", icon: Briefcase, label: "Portfolio" },
  { href: "/#contact", icon: Mail, label: "Reach out" },
]

export function MobileDock() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  if (!isHome) return null

  const handleClick = (e: MouseEvent, href: string) => {
    if (shouldSmoothScrollHash(href, pathname)) {
      e.preventDefault()
      scrollToSection(href)
      window.history.pushState(null, "", href)
    }
  }

  return (
    <nav
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 lg:hidden w-[calc(100%-1.5rem)] max-w-md mobile-dock"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around py-2.5 px-2 rounded-2xl glass-nav shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {dockItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={resolveNavHref(href, pathname)}
            onClick={(e) => handleClick(e, href)}
            className="flex flex-col items-center justify-center min-h-11 min-w-11 text-[#A3B0C2] hover:text-[#3B82F6] transition-colors duration-300"
            aria-label={label}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </Link>
        ))}
      </div>
    </nav>
  )
}
