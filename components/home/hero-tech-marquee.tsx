"use client"

import Image from "next/image"
import skillsData from "@/lib/skill.json"

const ICON_SKILLS = skillsData.filter((s) => s.image).slice(0, 12)

export function HeroTechMarquee() {
  const items = [...ICON_SKILLS, ...ICON_SKILLS]

  return (
    <div className="hero-tech-marquee mt-10 w-full max-w-2xl overflow-hidden mask-fade-x">
      <div className="hero-tech-track flex items-center gap-8 w-max">
        {items.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className="flex items-center gap-2 shrink-0 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-[#00d4ff]/35 hover:bg-[#00d4ff]/5 transition-colors duration-300"
            title={skill.name}
          >
            {skill.image && (
              <Image
                src={skill.image}
                alt=""
                width={22}
                height={22}
                className="opacity-80"
                unoptimized
              />
            )}
            <span className="text-xs font-medium text-[#94A3B8] whitespace-nowrap">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
