"use client"

import { useEffect, useState } from "react"
import { Sparkles, X } from "lucide-react"

export function IntelligenceFloatingTrigger() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (dismissed) return
      setVisible(window.scrollY > window.innerHeight * 0.75)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [dismissed])

  if (!visible || dismissed) return null

  return (
    <div className="fixed bottom-[max(6.75rem,env(safe-area-inset-bottom))] left-3 z-[45] sm:left-auto sm:right-5 lg:bottom-6">
      <div className="flex items-center gap-1 rounded-xl border border-[var(--border-subtle)]/90 bg-[var(--bg-void)]/94 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <a
          href="/#intelligence"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:text-white"
          title="Ask about a project"
          aria-label="Ask about a project"
        >
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent-primary)]" aria-hidden />
          Ask about a project
        </a>
        <button
          type="button"
          aria-label="Dismiss"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-neutral-400 hover:text-white"
          onClick={() => setDismissed(true)}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
