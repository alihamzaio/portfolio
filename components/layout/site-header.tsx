"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { navItems, siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"
import { MagneticButton } from "@/components/ui/magnetic-button"

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "py-3 glass-panel border-b border-white/[0.06]" : "py-5 bg-transparent"
      )}
    >
      <div className="section-shell flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00FFB2] text-[#050505] font-display font-bold text-sm glow-emerald-sm group-hover:scale-105 transition-transform">
            {siteConfig.initials}
          </span>
          <span className="hidden sm:block font-display font-semibold text-white group-hover:text-[#00FFB2] transition-colors">
            {siteConfig.name.split(" ")[0]}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  active ? "text-[#00FFB2]" : "text-muted-foreground hover:text-white"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-[#00FFB2]/8 border border-[#00FFB2]/15"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <motion.div className="flex items-center gap-3">
          <MagneticButton href={siteConfig.resumeUrl} variant="outline" className="hidden sm:inline-flex !py-2 !px-4 text-xs">
            Resume
          </MagneticButton>
          <MagneticButton href="/contact" className="hidden md:inline-flex !py-2 !px-4 text-xs">
            Hire Me
          </MagneticButton>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl glass-panel"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-white/[0.06] mt-3"
          >
            <nav className="section-shell py-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium",
                      active ? "bg-[#00FFB2]/10 text-[#00FFB2]" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
