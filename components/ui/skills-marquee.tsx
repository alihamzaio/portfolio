"use client"

import Image from "next/image"
import { skillCategories } from "@/lib/skills-data"

const allSkills = skillCategories.flatMap((c) => c.skills)

export function SkillsMarquee() {
  const track = [...allSkills, ...allSkills]

  return (
    <div className="skills-marquee-wrap mt-12" data-animate>
      <div className="skills-marquee-track">
        {track.map((skill, i) => (
          <span key={`${skill.name}-${i}`} className="skill-marquee-pill" data-cursor="skill" data-cursor-magnetic>
            {skill.icon && (
              <Image src={skill.icon} alt={`${skill.name} icon`} width={14} height={14} unoptimized className="shrink-0" />
            )}
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  )
}
