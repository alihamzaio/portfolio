"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MouseEvent } from "react"
import { ArrowUpRight } from "lucide-react"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { Logo } from "@/components/brand/logo"
import { resolveNavHref, scrollToSection, shouldSmoothScrollHash } from "@/lib/navigation"
import type { NavItem } from "@/lib/site"

export function SiteFooterClient({ navItems }: { navItems: readonly NavItem[] }) {
  const profile = usePublicProfile()
  const pathname = usePathname()
  const year = new Date().getFullYear()

  const handleNavClick = (e: MouseEvent, href: string) => {
    if (shouldSmoothScrollHash(href, pathname)) {
      e.preventDefault()
      scrollToSection(href)
      window.history.pushState(null, "", href)
    }
  }

  return (
    <footer className="border-t border-white/[0.08] mt-16 bg-[#0a0f1a]/50">
      <div className="section-shell py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          <div className="max-w-sm">
            <Link href="/" className="inline-block mb-5 group">
              <Logo name={profile.name} showName size={44} />
            </Link>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {profile.title} · {profile.location}
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="text-sm text-[#64748B] hover:text-[#3B82F6] mt-3 inline-block transition-colors"
            >
              {profile.email}
            </a>
          </div>

          <nav className="flex flex-wrap gap-x-10 gap-y-3">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={resolveNavHref(item.href, pathname)}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1.5 transition-colors"
            >
              GitHub <ArrowUpRight className="h-3.5 w-3.5 text-[#3B82F6]" />
            </a>
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1.5 transition-colors"
            >
              LinkedIn <ArrowUpRight className="h-3.5 w-3.5 text-[#3B82F6]" />
            </a>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between gap-3 text-xs text-[#64748B]">
          <p>© {year} {profile.name}</p>
          <p className="font-mono">MERN · AWS · Web3</p>
        </div>
      </div>
    </footer>
  )
}
