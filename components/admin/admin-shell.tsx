"use client"

import { useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  LogOut,
  User,
  Sparkles,
  Building2,
  Menu,
  X,
  TrendingUp,
} from "lucide-react"
import { LogoMark } from "@/components/brand/logo"
import { cn } from "@/lib/utils"
import { ease, easeCinematic } from "@/lib/motion"

export type AdminTab = "overview" | "profile" | "experience" | "projects" | "skills" | "resume"

const nav: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile & Hero", icon: User },
  { id: "experience", label: "Experience", icon: Building2 },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "resume", label: "Resume", icon: FileText },
]

interface AdminShellProps {
  children: ReactNode
  tab: AdminTab
  onTab: (t: AdminTab) => void
  onLogout: () => void
  stats: { projects: number; skills: number; resumes: number; experience: number }
}

function SidebarNav({
  tab,
  onTab,
  onLogout,
}: {
  tab: AdminTab
  onTab: (t: AdminTab) => void
  onLogout: () => void
}) {
  return (
    <>
      <div className="flex items-center gap-3 mb-10 px-1">
        <div className="relative">
          <LogoMark size={44} instanceId="admin" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#22C55E] border-2 border-[#0F172A]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#F8FAFC] tracking-tight">Portfolio CMS</p>
          <p className="text-[10px] text-[#64748B] uppercase tracking-[0.2em]">SaaS Admin</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-400",
              tab === item.id
                ? "bg-gradient-to-r from-[#3B82F6]/20 to-[#06B6D4]/10 text-[#F8FAFC] border border-[#3B82F6]/30 shadow-[0_0_32px_rgba(59,130,246,0.12)]"
                : "text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC] border border-transparent"
            )}
          >
            <item.icon className={cn("h-4 w-4 shrink-0", tab === item.id && "text-[#3B82F6]")} />
            {item.label}
          </button>
        ))}
      </nav>
      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/25 transition-all mt-8 w-full"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </>
  )
}

export function AdminShell({ children, tab, onTab, onLogout, stats }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const statItems = [
    { label: "Roles", value: stats.experience, icon: Building2 },
    { label: "Projects", value: stats.projects, icon: Briefcase },
    { label: "Skills", value: stats.skills, icon: Sparkles },
    { label: "Resumes", value: stats.resumes, icon: FileText },
  ]

  return (
    <div className="flex min-h-screen bg-[#020617]">
      <aside className="hidden lg:flex w-[272px] flex-col border-r border-white/[0.08] bg-[#0F172A]/90 backdrop-blur-2xl p-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 mesh-ambient opacity-50 pointer-events-none" />
        <div className="relative flex flex-col flex-1">
          <SidebarNav tab={tab} onTab={onTab} onLogout={onLogout} />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 glass-nav px-6 sm:px-10 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl glass-panel text-[#94A3B8] hover:text-[#F8FAFC]"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-bold text-[#F8FAFC] capitalize tracking-tight">
                {tab === "profile" ? "Profile & Hero" : tab}
              </p>
              <p className="text-[10px] text-[#64748B] font-mono">Content management</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {statItems.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs"
              >
                <s.icon className="h-3.5 w-3.5 text-[#3B82F6]" />
                <span className="text-[#64748B]">{s.label}</span>
                <span className="text-[#F8FAFC] font-bold tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-auto relative">
          <div className="absolute inset-0 grid-fine opacity-20 pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: easeCinematic }}
              className="relative"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-[#020617]/85 backdrop-blur-xl"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="w-[280px] h-full bg-[#0F172A] border-r border-white/[0.08] p-6 flex flex-col shadow-[24px_0_80px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="self-end p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] mb-2"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarNav
                tab={tab}
                onTab={(t) => {
                  onTab(t)
                  setSidebarOpen(false)
                }}
                onLogout={onLogout}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease }}
      className="glass-card-interactive rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#3B82F6]/10 blur-3xl pointer-events-none group-hover:bg-[#3B82F6]/20 transition-colors duration-500" />
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-3.5 w-3.5 text-[#06B6D4]" />
        <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-[0.2em]">{label}</p>
      </div>
      <p className="text-3xl font-bold text-[#F8FAFC] tabular-nums tracking-tight">{value}</p>
      {sub && <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{sub}</p>}
    </motion.div>
  )
}

export function Panel({
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
        <h2 className="text-sm font-bold text-[#F8FAFC] tracking-tight">{title}</h2>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
