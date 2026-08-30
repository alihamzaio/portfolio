"use client"

import { memo } from "react"
import skillsData from "@/lib/skill.json"

const TOP = skillsData.slice(0, 14)

function SkillActivityGridInner() {
  return (
    <div className="p-4 sm:p-6 rounded-2xl premium-surface overflow-hidden min-w-0 w-full max-w-full">
      <p className="meta-label mb-3 sm:mb-4">Stack</p>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-1">
        {TOP.map((skill) => {
          const cells = Math.round((skill.level / 100) * 5)
          return (
            <div key={skill.name} className="flex flex-col gap-0.5" title={`${skill.name}: ${skill.level}%`}>
              {Array.from({ length: 5 }).map((_, row) => (
                <div
                  key={row}
                  className={`h-2.5 sm:h-2 w-full rounded-sm ${
                    4 - row < cells ? "bg-[var(--accent-primary)]/80" : "bg-white/[0.06]"
                  }`}
                />
              ))}
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-1.5 mt-3">
        {TOP.map((s) => (
          <span key={s.name} className="text-xs sm:text-[11px] text-neutral-400 font-mono break-words">
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export const SkillActivityGrid = memo(SkillActivityGridInner)
