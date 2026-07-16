"use client"

import Image from "next/image"
import { TECH_STACK_TICKER } from "@/lib/hero-config"

const DARK_TICKER = new Set(["Next.js", "AWS"])

export function TechStackTicker() {
  const items = [...TECH_STACK_TICKER, ...TECH_STACK_TICKER]

  return (
    <div className="tech-ticker relative w-full min-w-0 max-w-full overflow-hidden border-y border-white/[0.06] py-4 sm:py-5">
      <div className="tech-ticker-track flex items-center gap-6 sm:gap-10">
        {items.map((item, i) => {
          const dark = DARK_TICKER.has(item.name)
          const logo = (
            <Image
              src={item.icon}
              alt={`${item.name} technology logo`}
              width={22}
              height={22}
              unoptimized
              className="shrink-0 object-contain"
            />
          )

          return (
            <div
              key={`${item.name}-${i}`}
              data-cursor="skill"
              data-cursor-magnetic
              className="flex items-center gap-2.5 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              {dark ? (
                <span
                  className="inline-flex items-center justify-center rounded-[5px] bg-gradient-to-b from-white/95 to-white/80 p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_0_14px_rgba(59,130,246,0.35)]"
                  aria-hidden
                >
                  {logo}
                </span>
              ) : (
                logo
              )}
              <span className="text-sm font-medium text-neutral-400 whitespace-nowrap">{item.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
