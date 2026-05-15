"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Clock } from "lucide-react"
import { blogPosts } from "@/lib/blog"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"

export function BlogContent() {
  const featured = blogPosts.find((p) => p.featured)
  const rest = blogPosts.filter((p) => !p.featured)

  return (
    <div className="pt-28 section-pad">
      <div className="section-shell">
        <SectionHeading
          label="Blog"
          title="Engineering journal"
          description="Thoughts on architecture, performance, cloud systems, and building brands that feel premium."
          align="center"
          className="mx-auto"
        />

        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <PremiumCard glow className="p-8 md:p-10">
              <span className="text-xs font-mono text-[#00FFB2] uppercase tracking-widest">{featured.category}</span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-3 mb-3">{featured.title}</h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mb-6">{featured.excerpt}</p>
              <motion.div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {featured.readTime}
                </span>
                <span>{featured.date}</span>
              </motion.div>
              <p className="mt-6 text-sm text-[#71717a]">Full articles coming soon — stay tuned.</p>
            </PremiumCard>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {rest.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <PremiumCard className="h-full flex flex-col">
                <span className="text-xs font-mono text-[#00FFB2]">{post.category}</span>
                <h3 className="font-display text-lg font-semibold text-white mt-2 mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground flex-1 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.06] text-xs text-muted-foreground">
                  <span>{post.readTime}</span>
                  <span>{post.date}</span>
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
