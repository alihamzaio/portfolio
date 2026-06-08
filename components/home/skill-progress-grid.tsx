"use client"

import { PremiumProgressList } from "@/components/premium/premium-progress"
import skillsData from "@/lib/skill.json"

const TOP_SKILLS = skillsData.slice(0, 8)

export function SkillProgressGrid() {
  return (
    <PremiumProgressList
      items={TOP_SKILLS.map((s) => ({ name: s.name, level: s.level }))}
      className="mt-12"
    />
  )
}
