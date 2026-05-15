"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { getFeaturedProjects } from "@/lib/projects"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"

const featured = getFeaturedProjects(3)

export function FeaturedProjects() {
  return (
    <section className="section-pad">
      <motion.div className="section-shell">
        <SectionHeading
          label="Selected Work"
          title="Products shipped in production"
          description="Case studies across e-commerce, fintech, healthcare, and Web3 — engineered for scale."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-4 right-4 p-2 rounded-full glass-panel opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-4 w-4 text-[#00FFB2]" />
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-[#00FFB2] transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{project.description}</p>
                    <motion.div className="flex flex-wrap gap-1.5 mt-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.08] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  </div>
                </PremiumCard>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#00FFB2] hover:text-[#7CFFCB] transition-colors"
          >
            View all projects <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
