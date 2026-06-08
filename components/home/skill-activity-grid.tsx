"use client"

import { memo } from "react"
import skillsData from "@/lib/skill.json"

const TOP = skillsData.slice(0, 14)

function SkillActivityGridInner() {
  return (
    <div className="p-5 sm:p-6 rounded-2xl premium-surface">
      <p className="text-xs font-mono text-neutral-500 mb-4 uppercase tracking-widest">Stack proficiency</p>
      <div className="grid grid-cols-7 sm:grid-cols-14 gap-1">
        {TOP.map((skill) => {
          const cells = Math.round((skill.level / 100) * 5)
          return (
            <div key={skill.name} className="flex flex-col gap-0.5" title={`${skill.name}: ${skill.level}%`}>
              {Array.from({ length: 5 }).map((_, row) => (
                <div
                  key={row}
                  className={`h-2 w-full rounded-sm ${
                    4 - row < cells ? "bg-cyan-500/80" : "bg-white/[0.06]"
                  }`}
                />
              ))}
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
        {TOP.map((s) => (
          <span key={s.name} className="text-[9px] text-neutral-600 font-mono">
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export const SkillActivityGrid = memo(SkillActivityGridInner)
