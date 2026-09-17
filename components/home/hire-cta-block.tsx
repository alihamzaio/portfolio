"use client"

import Link from "next/link"
import { ArrowRight, Download } from "lucide-react"
import { AmberGlassCta } from "@/components/ui/amber-glass-cta"
import { PRIMARY_LEAD_MAGNET } from "@/lib/lead-magnet"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  /** Compact for blog footers; full for index / home */
  variant?: "full" | "compact"
  title?: string
  description?: string
}

export function HireCtaBlock({
  className,
  variant = "full",
  title = "Need a full-stack developer for your next build?",
  description = "I ship production Next.js, MERN, and AWS serverless work — from MVP to polish. Grab the free launch checklist, then book a short call if you want help shipping.",
}: Props) {
  const magnet = PRIMARY_LEAD_MAGNET

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
        <a
          href={magnet.downloadPath}
          download={magnet.fileName}
          className="btn-secondary btn-responsive inline-flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" />
          Free checklist
        </a>
        <Link
          href={`/resources/${magnet.slug}`}
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors self-center"
        >
          View checklist <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
