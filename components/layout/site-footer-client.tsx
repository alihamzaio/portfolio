"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MouseEvent } from "react"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { Logo } from "@/components/brand/logo"
import { resolveNavHref, scrollToSection, shouldSmoothScrollHash } from "@/lib/navigation"
import type { NavItem } from "@/lib/site"

function obfuscatedMailto(email: string) {
  const [user, domain] = email.split("@")
  return `mailto:${user}@${domain}`
}

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

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="border-t border-white/[0.06] mt-12 sm:mt-16 md:mt-20 bg-[#0a0f1a]/80 backdrop-blur-xl">
      <div className="section-shell py-12 sm:py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="max-w-sm">
            <Link href="/" className="inline-block mb-4 group" aria-label="Ali Hamza Portfolio home">
              <Logo name={profile.name} showName={false} size={40} instanceId="footer" />
            </Link>
            <p className="text-sm font-semibold text-white mb-1">Ali Hamza Portfolio</p>
            <p className="text-sm text-neutral-400 leading-relaxed break-words">
              {profile.title} based in {profile.location}. Building MERN, Next.js, AWS serverless, and blockchain products.
            </p>
            <button
              type="button"
              onClick={() => {
                window.location.href = obfuscatedMailto(profile.email)
              }}
              className="text-sm text-neutral-400 hover:text-white mt-2 inline-block transition-colors text-left"
            >
              Send an email
            </button>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2" aria-label="Footer">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={resolveNavHref(item.href, pathname)}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm text-neutral-500 hover:text-white transition-colors"
              >
                {item.label === "Home"
                  ? "Back to home"
                  : item.label === "Work"
                    ? "View work"
                    : `${item.label} overview`}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2">
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-500 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              GitHub profile <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-500 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              LinkedIn profile <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <div className="text-center sm:text-left">
            <p suppressHydrationWarning>© {year} {profile.name}</p>
            <p className="text-neutral-500 mt-1">Made by Ali Hamza</p>
            <Link href="/privacy" className="text-neutral-500 hover:text-white mt-2 inline-block transition-colors">
              Privacy policy
            </Link>
          </div>
          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex items-center justify-center gap-1.5 min-h-11 px-2 text-neutral-500 hover:text-white transition-colors"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
