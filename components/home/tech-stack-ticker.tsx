"use client"

import Image from "next/image"
import { TECH_STACK_TICKER } from "@/lib/hero-config"

export function TechStackTicker() {
  const items = [...TECH_STACK_TICKER, ...TECH_STACK_TICKER]

  return (
    <div className="tech-ticker relative w-full min-w-0 max-w-full overflow-hidden border-y border-white/[0.06] py-4 sm:py-5">
      <div className="tech-ticker-track flex items-center gap-6 sm:gap-10">
        {items.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            data-cursor="skill"
            data-cursor-magnetic
            className="flex items-center gap-2.5 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <Image src={item.icon} alt={`${item.name} logo`} width={22} height={22} unoptimized />
            <span className="text-sm font-medium text-neutral-400 whitespace-nowrap">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
