"use client"

import { memo } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import type { Experience } from "@/lib/types"

function AboutTimelineInner({ experiences }: { experiences: Experience[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-8%" })

  return (
    <div ref={ref} className="relative pl-6 sm:pl-8 min-w-0">
      <div className="absolute left-[7px] sm:left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/60 via-cyan-500/20 to-transparent" />
      <div className="space-y-8">
        {experiences.map((exp, i) => (
          <motion.article
            key={exp.id}
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <span className="absolute -left-6 sm:-left-8 top-1.5 h-3 w-3 rounded-full border-2 border-cyan-400 bg-[#0a0f1a]" />
            <p className="meta-label mb-1">
              {exp.period}
            </p>
            <p className="text-base font-bold text-white break-words">{exp.role}</p>
            <p className="text-sm text-neutral-400 mb-2 break-words">{exp.company} · {exp.location}</p>
            <ul className="space-y-1.5">
              {exp.achievements.slice(0, 3).map((a) => (
                <li key={a} className="text-sm text-neutral-400 flex gap-2 break-words">
                  <span className="text-cyan-400 shrink-0">▸</span>
                  {a}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

export const AboutTimeline = memo(AboutTimelineInner)
