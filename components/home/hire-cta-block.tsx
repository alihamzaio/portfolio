"use client"

import Link from "next/link"
import { AmberGlassCta } from "@/components/ui/amber-glass-cta"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  variant?: "full" | "compact"
  title?: string
  description?: string
}

export function HireCtaBlock({
  className,
  variant = "full",
  title = "Need a full-stack developer for your next build?",
  description = "I ship production Next.js, MERN, and AWS serverless work from MVP to polish. Prefer a short call over a long thread.",
}: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-8 sm:px-8 sm:py-10",
        variant === "compact" && "px-5 py-6 sm:px-6",
        className
      )}
    >
      <h2
        className={cn(
          "font-semibold text-white tracking-tight",
          variant === "full" ? "text-xl md:text-2xl text-center" : "text-lg"
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "text-neutral-400 text-sm leading-relaxed mt-3 max-w-lg",
          variant === "full" && "mx-auto text-center"
        )}
      >
        {description}
      </p>

      <div
        className={cn(
          "mt-6 flex flex-wrap gap-3",
          variant === "full" && "justify-center"
        )}
      >
        <AmberGlassCta href="/contact">Hire me for your project</AmberGlassCta>
        <Link
          href="/products/kickoff-forge"
          className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors self-center"
        >
          Kickoff Forge →
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-white transition-colors self-center"
        >
          Work
        </Link>
      </div>
    </div>
  )
}
