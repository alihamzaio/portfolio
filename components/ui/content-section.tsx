import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Server-safe section wrapper (no client boundary) for crawlable content. */
export function ContentSection({
  id,
  children,
  className,
  variant = "default",
}: {
  id?: string
  children: ReactNode
  className?: string
  variant?: "default" | "elevated" | "muted"
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={cn(
        "section-pad relative",
        variant === "elevated" && "section-elevated",
        variant === "muted" && "section-muted",
        className
      )}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(70%,28rem)] h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent"
        aria-hidden
      />
      <div className="section-shell relative z-[1]">{children}</div>
    </section>
  )
}
