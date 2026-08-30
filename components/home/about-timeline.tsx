"use client"

import { memo, useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { Experience } from "@/lib/types"

function AboutTimelineInner({ experiences }: { experiences: Experience[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-8%" })

  return (
    <div ref={ref} className="relative pl-7 sm:pl-9 min-w-0">
      <div className="absolute left-[5px] sm:left-[9px] top-2 bottom-2 w-px bg-[#1c222b]" />
      <div className="space-y-10">
        {experiences.map((exp, i) => (
          <motion.article
            key={exp.id}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <span className="absolute -left-7 sm:-left-9 top-1.5 h-2 w-2 rounded-full border border-[var(--accent-primary)]/80 bg-[var(--bg-primary)]" />
            <p className="meta-label mb-1.5">{exp.period}</p>
            <p className="text-[15px] font-semibold text-[var(--text-primary)] break-words">{exp.role}</p>
            <p className="text-sm text-neutral-500 mb-3 break-words">
              {exp.company} · {exp.location}
            </p>
            <ul className="space-y-2.5">
              {exp.achievements.slice(0, 3).map((a) => (
                <li key={a} className="text-sm text-neutral-500 flex gap-3 break-words leading-relaxed">
                  <span className="mt-2.5 h-px w-3 shrink-0 bg-[var(--accent-primary)]/55" />
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
