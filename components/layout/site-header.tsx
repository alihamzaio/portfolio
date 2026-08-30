"use client"

import { useState, useEffect, type MouseEvent } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { navItems } from "@/lib/site"
import { resolveNavHref, scrollToSection, shouldSmoothScrollHash } from "@/lib/navigation"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

const panelVariants = {
  closed: { x: "100%", opacity: 0 },
  open: { x: 0, opacity: 1 },
}

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
}

const itemVariants = {
  closed: { opacity: 0, x: 16 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.06 + i * 0.04, duration: 0.32, ease },
  }),
}

export function SiteHeader() {
  const profile = usePublicProfile()
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeId, setActiveId] = useState("home")
  const [mounted, setMounted] = useState(false)
  const isHome = pathname === "/"

  const closeMobile = () => setMobileOpen(false)
  const openMobile = () => setMobileOpen(true)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile()
    }
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    document.body.dataset.mobileNavOpen = mobileOpen ? "true" : ""
    if (mobileOpen) window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = ""
      delete document.body.dataset.mobileNavOpen
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [mobileOpen])

  const handleNavClick = (e: MouseEvent, href: string) => {
    closeMobile()
    if (shouldSmoothScrollHash(href, pathname)) {
      e.preventDefault()
      scrollToSection(href)
      window.history.pushState(null, "", href)
    }
  }

  const motionTransition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, damping: 32, stiffness: 340, mass: 0.85 }

  const mobileMenu =
    mounted &&
    createPortal(
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              key="mobile-nav-backdrop"
              type="button"
              aria-label="Close menu"
              initial={reduceMotion ? false : "closed"}
              animate="open"
              exit="closed"
              variants={backdropVariants}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease }}
              className="fixed inset-0 z-[200] bg-[var(--bg-primary)]/90 backdrop-blur-sm lg:hidden"
              onClick={closeMobile}
            />

            <motion.aside
              key="mobile-nav-panel"
              id="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={reduceMotion ? false : "closed"}
              animate="open"
              exit="closed"
              variants={panelVariants}
              transition={motionTransition}
              className="fixed top-0 right-0 bottom-0 z-[201] flex w-[min(100%,20rem)] flex-col border-l border-[var(--border-subtle)] bg-[var(--bg-primary)] lg:hidden"
              style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-[var(--border-subtle)] shrink-0">
                <Link
                  href="/"
                  onClick={() => closeMobile()}
                  className="min-w-0 shrink"
                  aria-label={`${profile.name} - Home`}
                >
                  <Logo
                    name={profile.name}
                    showName
                    size={38}
                    instanceId="mobile-nav"
                  />
                </Link>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="inline-flex items-center justify-center min-h-11 min-w-11 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-elevated)]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.id}
                      custom={i}
                      initial={reduceMotion ? false : "closed"}
                      animate="open"
                      exit="closed"
                      variants={itemVariants}
                    >
                      <Link
                        href={resolveNavHref(item.href, pathname)}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={cn(
                          "flex items-center min-h-12 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                          activeId === item.id && isHome
                            ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/25"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.03]"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  custom={navItems.length}
                  initial={reduceMotion ? false : "closed"}
                  animate="open"
                  exit="closed"
                  variants={itemVariants}
                  className="mt-5 px-1"
                >
                  <Link
                    href={resolveNavHref("/#contact", pathname)}
                    onClick={(e) => handleNavClick(e, "/#contact")}
                  className="btn-primary btn-responsive justify-center w-full"
                  >
                    Hire me
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </Link>
                </motion.div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>,
      document.body
    )

  return (
    <>
      <header data-site-header className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
        <div
          className={cn(
            "pointer-events-auto transition-[background,box-shadow,border-color,padding,margin,border-radius] duration-400 ease-out",
            scrolled || mobileOpen
              ? "glass-nav mx-3 sm:mx-6 mt-2 rounded-[1rem] py-2.5 sm:py-3"
              : "py-6 sm:py-7 bg-transparent"
          )}
        >
          <div className="section-shell !px-4 sm:!px-6 lg:!px-8">
            <div className="flex items-center justify-between gap-4 min-w-0">
              <Link
                href="/"
                className="shrink min-w-0 group"
                data-cursor="link"
                aria-label={`${profile.name} - Home`}
                onClick={() => closeMobile()}
              >
                <Logo
                  name={profile.name}
                  showName
                  size={38}
                  instanceId="header"
                  className="transition-opacity group-hover:opacity-90"
                />
              </Link>

              <nav
                className="hidden lg:flex items-center gap-0.5 px-2"
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
                        "relative px-4 py-2 text-[13px] font-medium tracking-tight rounded-lg transition-colors duration-250",
                        active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="desktop-nav-active"
                          className="absolute inset-0 rounded-lg border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/[0.07]"
                          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                          aria-hidden
                        />
                      )}
                      <span className="relative z-[1]">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  href={resolveNavHref("/#contact", pathname)}
                  onClick={(e) => handleNavClick(e, "/#contact")}
                  className="hidden lg:inline-flex items-center gap-2 btn-primary !px-5"
                  data-cursor="contact"
                  data-cursor-magnetic
                >
                  Hire me
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={mobileOpen ? closeMobile : openMobile}
                  className="lg:hidden inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-primary)] transition-transform active:scale-95"
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-nav-panel"
                >
                  <span className="inline-flex transition-opacity duration-200">
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {mobileMenu}
    </>
  )
}
