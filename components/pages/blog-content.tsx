import Link from "next/link"
import { Clock } from "lucide-react"
import { PremiumGrid, PremiumPage, PremiumReveal } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { getAllBlogPosts } from "@/lib/blog"
import { siteConfig } from "@/lib/site"

export async function BlogContent() {
  const posts = await getAllBlogPosts()
  const featured = posts.find((p) => p.featured) || posts[0]
  const rest = posts.filter((p) => p.slug !== featured?.slug)

  return (
    <PremiumPage>
      <SectionHeading
        headingLevel={1}
        label="Blog"
        title="Technical writing"
        description={`Notes from ${siteConfig.name}. Dev tips also publish from ${siteConfig.brand.channel} — same brain, personal site for SEO and hire leads.`}
        align="center"
        className="mx-auto"
      />

      {featured && (
        <PremiumReveal className="mb-10">
          <Link href={`/blog/${featured.slug}`} className="block group">
            <PremiumCard className="p-8 md:p-10" spotlight>
              <span className="meta-label">{featured.category}</span>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mt-3 mb-3 group-hover:text-amber-200 transition-colors">
                {featured.title}
              </h2>
              <p className="text-neutral-400 leading-relaxed max-w-2xl mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {featured.readTime}
                </span>
                <span>{featured.date}</span>
                {featured.source && <span>{featured.source}</span>}
              </div>
            </PremiumCard>
          </Link>
        </PremiumReveal>
      )}

      <PremiumGrid cols="2">
        {rest.map((post, i) => (
          <PremiumReveal key={post.slug} delay={i * 0.08}>
            <Link href={`/blog/${post.slug}`} className="block h-full group">
              <PremiumCard className="h-full flex flex-col">
                <span className="meta-label">{post.category}</span>
                <h3 className="text-lg font-semibold text-white mt-2 mb-2 group-hover:text-amber-200 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-neutral-400 flex-1 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.06] text-xs text-neutral-500">
                  <span>{post.readTime}</span>
                  <span>{post.date}</span>
                </div>
              </PremiumCard>
            </Link>
          </PremiumReveal>
        ))}
      </PremiumGrid>
    </PremiumPage>
  )
}
