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
} from "lucide-react"
import { LogoMark } from "@/components/brand/logo"
import { cn } from "@/lib/utils"
import { ease } from "@/lib/motion"

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
      <div className="flex items-center gap-3 mb-10 px-2">
        <LogoMark size={44} />
        <div>
          <p className="text-sm font-bold text-[#F8FAFC]">Portfolio CMS</p>
          <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Admin</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
              tab === item.id
                ? "bg-[#3B82F6]/15 text-[#F8FAFC] border border-[#3B82F6]/25 shadow-[0_0_20px_rgba(59,130,246,0.12)]"
                : "text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC] border border-transparent"
            )}
          >
            <item.icon className={cn("h-4 w-4", tab === item.id && "text-[#3B82F6]")} />
            {item.label}
          </button>
        ))}
      </nav>
      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all mt-6 w-full"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </>
  )
}

export function AdminShell({ children, tab, onTab, onLogout, stats }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#020617]">
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/[0.08] bg-[#0F172A]/80 backdrop-blur-xl p-5 shrink-0">
        <SidebarNav tab={tab} onTab={onTab} onLogout={onLogout} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 glass-nav px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl glass-panel text-[#94A3B8] hover:text-[#F8FAFC]"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-bold text-[#F8FAFC] capitalize">
                {tab === "profile" ? "Profile & Hero" : tab}
              </p>
              <p className="text-[10px] text-[#64748B]">Manage portfolio content</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-[#64748B]">
            <span>
              <span className="text-[#F8FAFC] tabular-nums">{stats.experience}</span> roles
            </span>
            <span>
              <span className="text-[#F8FAFC] tabular-nums">{stats.projects}</span> projects
            </span>
            <span>
              <span className="text-[#F8FAFC] tabular-nums">{stats.skills}</span> skills
            </span>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
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
            className="lg:hidden fixed inset-0 z-50 bg-[#020617]/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="w-72 h-full bg-[#0F172A] border-r border-white/[0.08] p-5 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="self-end p-2 rounded-lg text-[#94A3B8] mb-4"
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
    <div className="glass-card-interactive rounded-2xl p-6 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-30 pointer-events-none"
        style={{ background: "var(--accent-glow)" }}
      />
      <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-bold text-[#F8FAFC] tabular-nums">{value}</p>
      {sub && <p className="text-xs text-[#94A3B8] mt-2">{sub}</p>}
    </div>
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
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
        <h2 className="text-sm font-bold text-[#F8FAFC]">{title}</h2>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
