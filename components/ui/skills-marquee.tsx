"use client"

import { skillCategories } from "@/lib/skills-data"

const allSkills = skillCategories.flatMap((c) => c.skills)

export function SkillsMarquee() {
  const track = [...allSkills, ...allSkills]

  return (
    <div className="skills-marquee-wrap mt-12" data-animate>
      <div className="skills-marquee-track">
        {track.map((skill, i) => (
          <span key={`${skill.name}-${i}`} className="skill-marquee-pill" data-cursor="skill" data-cursor-magnetic>
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  )
}
