"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { projects } from "@/lib/projects"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"

export function ProjectsGrid() {
  return (
    <motion.div className="pt-28 section-pad">
      <div className="section-shell">
        <SectionHeading
          label="Projects"
          title="Premium case studies"
          description="Production applications engineered for global clients — each built to perform, scale, and impress."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 12).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: (i % 6) * 0.05 }}
            >
              <Link href={`/projects/${project.slug}`}>
                <PremiumCard className="p-0 overflow-hidden group h-full flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-70" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-white mb-2 group-hover:text-[#00FFB2] transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-[#00FFB2]">
                      View case study <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </PremiumCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
