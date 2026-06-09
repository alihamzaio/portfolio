"use client"

import { useState, useEffect, type MouseEvent } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { navItems } from "@/lib/site"
import { resolveNavHref, shouldSmoothScrollHash } from "@/lib/navigation"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const profile = usePublicProfile()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeId, setActiveId] = useState("home")
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
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
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const handleNavClick = (e: MouseEvent, href: string) => {
    setMobileOpen(false)
    if (shouldSmoothScrollHash(href, pathname)) {
      e.preventDefault()
    }
  }

  return (
    <header
      data-site-header
      className={cn(
        "fixed top-[2px] left-0 right-0 z-50 transition-[transform,background,padding,box-shadow] duration-500",
        scrolled || mobileOpen ? "glass-nav py-3.5" : "py-6 sm:py-7 bg-transparent"
      )}
    >
      <div className="section-shell">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0 group" data-cursor aria-label={`${profile.name} — Home`}>
            <Logo
              name={profile.name}
              showName
              size={42}
              animated
              instanceId="header"
              className="transition-opacity group-hover:opacity-95"
            />
          </Link>

          <nav
            className="hidden lg:flex items-center gap-0.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            aria-label="Main"
          >
            {navItems.map((item) => {
              const active = isHome && activeId === item.id
              return (
                <Link
                  key={item.id}
                  href={resolveNavHref(item.href, pathname)}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative px-4 py-2.5 text-[13px] font-medium rounded-xl transition-colors duration-300",
                    active ? "nav-link-active-cyan" : "text-neutral-400 hover:text-white"
                  )}
                >
                  <span className="relative">{item.label}</span>
                  {active && <span className="nav-active-dot" aria-hidden />}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/#contact"
              onClick={(e) => handleNavClick(e, "/#contact")}
              className="hidden sm:inline-flex items-center gap-1.5 btn-primary text-[13px] !py-2.5 !px-5"
              data-cursor
            >
              Contact
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl glass-panel text-[#F8FAFC]"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 top-[60px] z-40 bg-[#0a0f1a]/95 backdrop-blur-3xl"
          >
            <motion.nav
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="section-shell py-8 flex flex-col gap-1"
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "block px-4 py-3.5 rounded-xl text-base font-medium transition-colors",
                      activeId === item.id && isHome
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                        : "text-neutral-400"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/#contact"
                onClick={(e) => handleNavClick(e, "/#contact")}
                className="mt-5 btn-primary justify-center py-3.5"
              >
                Contact
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
