import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock } from "lucide-react"
import { BlogBody } from "@/components/pages/blog-body"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { PremiumPage, PremiumReveal } from "@/components/premium"
import { AmberGlassCta } from "@/components/ui/amber-glass-cta"
import { getAllBlogPosts, getPostBySlug } from "@/lib/blog"
import { buildPageMetadata } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <PageBreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <PremiumPage>
        <PremiumReveal>
          <article className="mx-auto max-w-3xl">
            <p className="meta-label mb-3">{post.category}</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mb-8">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {post.readTime}
              </span>
              <span>{post.date}</span>
              {post.source && <span>via {post.source}</span>}
            </div>

            <BlogBody body={post.body} />

            {post.youtubeUrl && (
              <p className="mt-8 text-sm text-neutral-400">
                Watch on YouTube:{" "}
                <a
                  href={post.youtubeUrl}
                  className="text-amber-200/90 underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {post.youtubeUrl}
                </a>
              </p>
            )}

            <div className="mt-12 pt-8 border-t border-white/[0.08] space-y-4">
              <p className="text-neutral-400 text-sm leading-relaxed">
                Written by {siteConfig.name}. Channel content also lives on{" "}
                {siteConfig.brand.channel} — this site is for SEO and client work.
              </p>
              <div className="flex flex-wrap gap-3">
                <AmberGlassCta href="/contact">Hire me</AmberGlassCta>
                <Link
                  href="/blog"
                  className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  ← All posts
                </Link>
              </div>
            </div>
          </article>
        </PremiumReveal>
      </PremiumPage>
    </>
  )
}
