"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUp, ArrowUpRight, Github, Instagram, Linkedin, Youtube } from "lucide-react"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { Logo } from "@/components/brand/logo"
import { resolveNavHref, offsiteAnchorProps } from "@/lib/navigation"
import { scrollToSectionId } from "@/lib/lenis-scroll"
import { siteConfig } from "@/lib/site"

const footerNav = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Tech stack", href: "/tech-stack" },
  { label: "Blog", href: "/blog" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
] as const

export function SiteFooterClient() {
  const profile = usePublicProfile()
  const pathname = usePathname()
  const year = new Date().getFullYear()
  const contactHref = resolveNavHref("/#contact", pathname)

  const scrollTop = () => {
    scrollToSectionId("home")
  }

  return (
    <footer className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-void)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 footer-glow" aria-hidden />

      <div className="site-grid relative z-[1] pt-[var(--space-5)] pb-[max(var(--space-5),calc(5rem+env(safe-area-inset-bottom)))] lg:pb-[var(--space-5)]">
        <div className="grid gap-10 md:grid-cols-3 lg:gap-[var(--space-7)]">
          <div className="max-w-md md:col-span-1">
            <Link href="/" className="inline-flex mb-[var(--space-4)]" aria-label={`${profile.name} — home`}>
              <Logo name={profile.name} showName size={36} instanceId="footer" />
            </Link>
            <p className="type-body-sm leading-relaxed text-[var(--text-secondary)]">{profile.title}</p>
            <p className="type-body-sm mt-[var(--space-3)] text-[var(--text-muted)]">{siteConfig.tagline}</p>
            <Link
              href={contactHref}
              className="mt-[var(--space-4)] inline-flex items-center gap-1.5 text-sm text-[var(--accent-primary)] hover:opacity-90 transition-opacity"
            >
              Start a project
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          <div>
            <p className="type-label mb-[var(--space-4)]">Index</p>
            <ul className="flex flex-col gap-[var(--space-3)]">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:justify-self-end md:text-right">
            <p className="type-label mb-[var(--space-4)]">Connect</p>
            <ul className="flex flex-col gap-[var(--space-3)] md:items-end">
              <li>
                <a
                  href={profile.social.github}
                  {...offsiteAnchorProps(profile.social.github)}
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <Github className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  GitHub
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href={profile.social.linkedin}
                  {...offsiteAnchorProps(profile.social.linkedin)}
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <Linkedin className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  LinkedIn
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href={profile.social.youtube}
                  {...offsiteAnchorProps(profile.social.youtube)}
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <Youtube className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  YouTube
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href={profile.social.tiktok}
                  {...offsiteAnchorProps(profile.social.tiktok)}
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <svg className="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.8a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.19 8.19 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15Z" />
                  </svg>
                  TikTok
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href={profile.social.instagram}
                  {...offsiteAnchorProps(profile.social.instagram)}
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <Instagram className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  Instagram
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.resumeUrl}
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Resume PDF
                </a>
              </li>
            </ul>

            {siteConfig.available && (
              <p className="mt-[var(--space-5)] inline-flex items-center gap-2 type-label !text-[var(--accent-primary)]">
                <span className="hero-avail-dot scale-75" aria-hidden />
                Open to new work
              </p>
            )}
          </div>
        </div>

        <div className="mt-[var(--space-7)] pt-[var(--space-5)] border-t border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-xs text-[var(--text-muted)]">
            <p suppressHydrationWarning>
              © {year} {profile.name}
            </p>
            <Link href="/privacy" className="hover:text-[var(--text-secondary)] transition-colors">
              Privacy
            </Link>
          </div>
          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex items-center gap-1.5 min-h-11 px-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-[0.14em]"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
