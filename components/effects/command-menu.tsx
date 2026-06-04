"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowRight, FileDown, Github, Linkedin } from "lucide-react"
import { navItems, siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

const commands = [
  ...navItems.map((item) => ({ id: item.href, label: `Go to ${item.label}`, href: item.href, icon: ArrowRight })),
  { id: "resume", label: "Download Resume", href: siteConfig.resumeUrl, icon: FileDown, external: true },
  { id: "github", label: "GitHub", href: siteConfig.social.github, icon: Github, external: true },
  { id: "linkedin", label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin, external: true },
]

type CommandMenuContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null)

function useCommandMenu() {
  const ctx = useContext(CommandMenuContext)
  if (!ctx) throw new Error("useCommandMenu must be used within CommandMenuProvider")
  return ctx
}

/** Global provider: keyboard shortcut + modal. Place once in app layout. */
export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(0)
  const router = useRouter()

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))

  const run = useCallback(
    (cmd: (typeof commands)[0]) => {
      if ("external" in cmd && cmd.external) {
        window.open(cmd.href, "_blank")
      } else {
        router.push(cmd.href)
      }
      setOpen(false)
      setQuery("")
    },
    [router]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
        setQuery("")
        setSelected(0)
      }
      if (!open) return
      if (e.key === "Escape") setOpen(false)
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelected((s) => Math.min(s + 1, filtered.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelected((s) => Math.max(s - 1, 0))
      }
      if (e.key === "Enter" && filtered[selected]) {
        e.preventDefault()
        run(filtered[selected])
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, filtered, selected, run])

  return (
    <CommandMenuContext.Provider value={{ open, setOpen }}>
      {children}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              className="fixed left-1/2 top-[18%] z-[201] w-full max-w-lg -translate-x-1/2 px-4"
            >
              <motion.div
                className="glass-float rounded-2xl overflow-hidden border-white/[0.1] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
                role="dialog"
                aria-label="Command menu"
              >
                <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
                  <Search className="h-4 w-4 text-[#3B82F6] shrink-0" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setSelected(0)
                    }}
                    placeholder="Navigate anywhere..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[#18181B] text-muted-foreground shrink-0">
                    ESC
                  </kbd>
                </div>
                <ul className="max-h-72 overflow-y-auto p-2">
                  {filtered.length === 0 ? (
                    <li className="px-4 py-6 text-center text-sm text-muted-foreground">No results</li>
                  ) : (
                    filtered.map((cmd, i) => {
                      const Icon = cmd.icon
                      return (
                        <li key={cmd.id}>
                          <button
                            onClick={() => run(cmd)}
                            onMouseEnter={() => setSelected(i)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                              selected === i
                                ? "bg-[#3B82F6]/15 text-[#F8FAFC] border border-[#3B82F6]/20"
                                : "text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]"
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="flex-1 text-left">{cmd.label}</span>
                          </button>
                        </li>
                      )
                    })
                  )}
                </ul>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </CommandMenuContext.Provider>
  )
}

/** Trigger button — place inside the site header. */
export function CommandMenuTrigger({ className }: { className?: string }) {
  const { setOpen } = useCommandMenu()

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        "hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground",
        "glass-panel rounded-lg border border-white/[0.06]",
        "hover:border-[#3B82F6]/30 hover:text-[#F8FAFC] transition-colors shrink-0",
        className
      )}
      aria-label="Open command menu"
    >
      <Search className="h-3.5 w-3.5" />
      <span className="text-[#71717a]">Search</span>
      <kbd className="px-1.5 py-0.5 rounded bg-[#18181B] border border-white/[0.08] text-[10px] font-mono">
        ⌘K
      </kbd>
    </button>
  )
}
