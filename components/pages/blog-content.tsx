import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"
import { PremiumGrid, PremiumPage, PremiumReveal } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { AmberGlassCta } from "@/components/ui/amber-glass-cta"
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
        title="In-depth technical articles"
        description={`Long-form guides by ${siteConfig.name} on full-stack development, cloud architecture, and production engineering — written for developers and hiring teams.`}
        align="center"
        className="mx-auto"
      />

      {posts.length === 0 && (
        <PremiumReveal>
          <PremiumCard className="p-10 text-center max-w-xl mx-auto">
            <p className="text-neutral-400 mb-6">
              New articles publish automatically from DevBuildDaily video scripts. Check back soon.
            </p>
            <AmberGlassCta href="/contact">Work with me</AmberGlassCta>
          </PremiumCard>
        </PremiumReveal>
      )}

      {featured && (
        <PremiumReveal className="mb-10">
          <Link href={`/blog/${featured.slug}`} className="block group">
            <PremiumCard className="overflow-hidden p-0" spotlight>
              {featured.coverImage && (
                <div className="relative h-48 md:h-56 w-full overflow-hidden">
                  <Image
                    src={featured.coverImage}
                    alt={featured.coverImageAlt || featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    unoptimized={featured.coverImage.startsWith("http")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
                </div>
              )}
              <div className="p-8 md:p-10">
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
                </div>
              </div>
            </PremiumCard>
          </Link>
        </PremiumReveal>
      )}

      {rest.length > 0 && (
        <PremiumGrid cols="2">
          {rest.map((post, i) => (
            <PremiumReveal key={post.slug} delay={i * 0.08}>
              <Link href={`/blog/${post.slug}`} className="block h-full group">
                <PremiumCard className="h-full flex flex-col overflow-hidden p-0">
                  {post.coverImage && (
                    <div className="relative h-36 w-full overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.coverImageAlt || post.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        unoptimized={post.coverImage.startsWith("http")}
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="meta-label">{post.category}</span>
                    <h3 className="text-lg font-semibold text-white mt-2 mb-2 group-hover:text-amber-200 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-neutral-400 flex-1 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.06] text-xs text-neutral-500">
                      <span>{post.readTime}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </PremiumCard>
              </Link>
            </PremiumReveal>
          ))}
        </PremiumGrid>
      )}
    </PremiumPage>
  )
}
