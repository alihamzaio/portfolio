"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import skillsData from "@/lib/skill.json"

const TOP_SKILLS = skillsData.slice(0, 8)

export function SkillProgressGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-8%" })

  return (
    <div ref={ref} className="grid sm:grid-cols-2 gap-5 mt-12">
      {TOP_SKILLS.map((skill, i) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-white/20 hover:bg-white/[0.04] transition-colors duration-300"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
              {skill.name}
            </span>
            <span className="text-xs font-mono text-neutral-500">{skill.level}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neutral-600 to-white"
              initial={{ width: 0 }}
              animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
              transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
