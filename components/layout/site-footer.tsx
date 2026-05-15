import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { navItems, siteConfig } from "@/lib/site"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/[0.06] mt-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00FFB2]/30 to-transparent" />
      <div className="section-shell py-16 md:py-20">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00FFB2] text-[#050505] font-display font-bold text-sm">
                {siteConfig.initials}
              </span>
              <span className="font-display font-semibold text-white">{siteConfig.name}</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              {siteConfig.headline} MERN + AWS engineer crafting premium product experiences.
            </p>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-[#00FFB2] transition-colors flex items-center gap-1"
              >
                GitHub <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-[#00FFB2] transition-colors flex items-center gap-1"
              >
                LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-[#00FFB2] mb-4">Navigate</p>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-[#00FFB2] mb-4">Contact</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={siteConfig.social.email} className="hover:text-[#00FFB2] transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li>{siteConfig.location}</li>
              {siteConfig.available && (
                <li className="flex items-center gap-2 text-[#00FFB2]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
                  Available for work
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06] text-xs text-muted-foreground">
          <p>© {year} {siteConfig.name}. Engineered with precision.</p>
          <p className="font-mono">Next.js · TypeScript · AWS · GSAP</p>
        </div>
      </div>
    </footer>
  )
}
