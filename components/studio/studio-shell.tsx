"use client"

import { useRef, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  Clapperboard,
  ExternalLink,
  History,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Play,
  Radio,
  X,
  Youtube,
} from "lucide-react"
import { LogoMark } from "@/components/brand/logo"
import { cn } from "@/lib/utils"
import { easeCinematic } from "@/lib/motion"

export type StudioTab = "overview" | "publish" | "platforms" | "runs" | "failures"

const nav: { id: StudioTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "publish", label: "Create & publish", icon: Play },
  { id: "platforms", label: "Platforms", icon: Link2 },
  { id: "runs", label: "Actions runs", icon: Radio },
  { id: "failures", label: "Failures", icon: AlertTriangle },
]

const titles: Record<StudioTab, string> = {
  overview: "Overview",
  publish: "Create & publish",
  platforms: "Platforms",
  runs: "Actions runs",
  failures: "Failures",
}

type Stats = {
  publishes: number
  ok: number
  failed: number
  running: number
  platforms: number
}

function SidebarNav({
  tab,
  onTab,
  onLogout,
}: {
  tab: StudioTab
  onTab: (t: StudioTab) => void
  onLogout: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 shrink-0 px-1 pb-6">
        <div className="relative">
          <LogoMark size={44} instanceId="studio" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[var(--accent-primary)] border-2 border-[#0c0c0c]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)] tracking-tight">Behind The Price</p>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em]">Channel Studio</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-1">
        {nav.map((item) => (
          <button
            key={item.id}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-400",
              tab === item.id
                ? "bg-[var(--accent-primary)]/10 text-[var(--text-primary)] border border-[var(--accent-primary)]/25"
                : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)] border border-transparent"
            )}
          >
            <item.icon className={cn("h-4 w-4 shrink-0", tab === item.id && "text-[var(--accent-primary)]")} />
            {item.label}
          </button>
        ))}
      </nav>

      <a
        href="/admin"
        className="mt-2 flex w-full shrink-0 items-center gap-2.5 rounded-xl border border-transparent px-3.5 py-3 text-sm text-[var(--text-secondary)] transition-all hover:border-white/10 hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
      >
        <Clapperboard className="h-4 w-4" /> Portfolio CMS
      </a>

      <button
        type="button"
        onClick={onLogout}
        className="mt-1 flex w-full shrink-0 items-center gap-2.5 rounded-xl border border-transparent px-3.5 py-3 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--accent-primary)]/25 hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)]"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  )
}

export function StudioShell({
  children,
  tab,
  onTab,
  onLogout,
  stats,
}: {
  children: ReactNode
  tab: StudioTab
  onTab: (t: StudioTab) => void
  onLogout: () => void
  stats: Stats
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  const selectTab = (next: StudioTab) => {
    onTab(next)
    mainRef.current?.scrollTo({ top: 0 })
  }

  const chips = [
    { label: "Publishes", value: stats.publishes, icon: History },
    { label: "OK", value: stats.ok, icon: Youtube },
    { label: "Failed", value: stats.failed, icon: AlertTriangle },
    { label: "Running", value: stats.running, icon: Radio },
    { label: "Platforms", value: stats.platforms, icon: Link2 },
  ]

  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden bg-[var(--bg-void)]">
      <aside className="relative hidden h-full w-[272px] shrink-0 flex-col overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] lg:flex">
        <div className="pointer-events-none absolute inset-0 mesh-ambient opacity-50" />
        <div className="relative flex h-full min-h-0 flex-col p-6">
          <SidebarNav tab={tab} onTab={selectTab} onLogout={onLogout} />
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-20 flex shrink-0 flex-col gap-4 border-b border-white/[0.06] glass-nav px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2.5 glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-bold tracking-tight text-[var(--text-primary)]">{titles[tab]}</p>
              <p className="font-mono text-[10px] text-[var(--text-muted)]">Channel ops · Vercel</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {chips.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs"
              >
                <s.icon className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                <span className="text-[var(--text-muted)]">{s.label}</span>
                <span className="font-bold tabular-nums text-[var(--text-primary)]">{s.value}</span>
              </div>
            ))}
          </div>
        </header>

        <main ref={mainRef} className="relative min-h-0 flex-1 overflow-y-auto p-6 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute inset-0 grid-fine opacity-20" />
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easeCinematic }}
            className="relative"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--bg-void)]/90 backdrop-blur-xl lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="flex h-full w-[280px] flex-col overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="mb-2 self-end rounded-lg p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="min-h-0 flex-1">
                <SidebarNav
                  tab={tab}
                  onTab={(t) => {
                    selectTab(t)
                    setSidebarOpen(false)
                  }}
                  onLogout={onLogout}
                />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function StudioPanel({
  title,
  children,
  action,
}: {
  title: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border-white/[0.08]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-gradient-to-r from-white/[0.03] to-transparent">
        <h2 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">{title}</h2>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] hover:underline"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  )
}
