import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PremiumPageProps {
  children: ReactNode
  className?: string
  narrow?: boolean
}

/** Standalone route shell — matches home section premium styling */
export function PremiumPage({ children, className, narrow }: PremiumPageProps) {
  return (
    <article className={cn("relative page-top-pad section-pad", className)}>
      <div className="section-glow absolute inset-0 pointer-events-none" aria-hidden />
      <div
        className={cn("section-shell relative z-[1]", narrow && "max-w-4xl")}
      >
        {children}
      </div>
    </article>
  )
}
