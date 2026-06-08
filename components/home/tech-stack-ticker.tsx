"use client"

import Image from "next/image"
import { TECH_STACK_TICKER } from "@/lib/hero-config"

export function TechStackTicker() {
  const items = [...TECH_STACK_TICKER, ...TECH_STACK_TICKER]

  return (
    <div className="tech-ticker w-full overflow-hidden border-y border-white/[0.06] py-5">
      <div className="tech-ticker-track flex items-center gap-10 w-max">
        {items.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="flex items-center gap-2.5 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <Image src={item.icon} alt="" width={22} height={22} unoptimized />
            <span className="text-sm font-medium text-neutral-400 whitespace-nowrap">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
