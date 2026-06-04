"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { navItems, siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeId, setActiveId] = useState("home")
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!isHome) return
    const sections = navItems.map((n) => n.id)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isHome])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "")
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || mobileOpen ? "glass-nav py-2.5 sm:py-3" : "py-4 sm:py-5 bg-transparent"
      )}
    >
      <div className="section-shell">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
            <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white font-display font-bold text-xs sm:text-sm glow-blue group-hover:scale-105 transition-transform">
              {siteConfig.initials}
            </span>
            <span className="font-display font-semibold text-white text-sm sm:text-base group-hover:text-[#60A5FA] transition-colors">
              {siteConfig.name.split(" ")[0]}
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main">
            {navItems.map((item) => {
              const active = isHome ? activeId === item.id : pathname === item.href
              return (
                <Link
                  key={item.id}
                  href={isHome ? item.href : item.href.replace("/#", "/")}
                  onClick={(e) => {
                    if (isHome && item.href.startsWith("/#")) {
                      e.preventDefault()
                      handleNavClick(item.href)
                    }
                  }}
                  className={cn(
                    "relative px-3 py-2 text-[13px] font-medium rounded-lg transition-colors whitespace-nowrap",
                    active ? "text-[#60A5FA]" : "text-muted-foreground hover:text-white"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/#contact"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault()
                  handleNavClick("/#contact")
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-90 transition-opacity glow-blue"
            >
              Let&apos;s Build
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2.5 rounded-xl glass-panel border border-white/[0.08] text-white"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="xl:hidden overflow-hidden border-t border-white/[0.08] mt-3 glass-nav"
          >
            <nav className="section-shell py-4 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
              {navItems.map((item, i) => {
                const active = isHome ? activeId === item.id : false
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (isHome && item.href.startsWith("/#")) {
                          e.preventDefault()
                          handleNavClick(item.href)
                        }
                      }}
                      className={cn(
                        "block px-4 py-3.5 rounded-xl text-sm font-medium",
                        active ? "bg-[#3B82F6]/15 text-[#60A5FA]" : "text-muted-foreground hover:bg-white/5"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              })}
              <Link
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick("/#contact")
                }}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-semibold text-sm"
              >
                Let&apos;s Build <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
