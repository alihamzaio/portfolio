import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, Tag } from "lucide-react"
import { BlogBody, BlogReferences, blogSourceLabel } from "@/components/pages/blog-body"
import { BlogCoverImage } from "@/components/pages/blog-cover-image"
import { BlogArticleJsonLd } from "@/components/seo/blog-article-json-ld"
import { PageBreadcrumbJsonLd } from "@/components/seo/page-breadcrumb-json-ld"
import { PremiumPage, PremiumReveal } from "@/components/premium"
import { HireCtaBlock } from "@/components/home/hire-cta-block"
import { BlogToolsLinks } from "@/components/pages/blog-tools-links"
import { getAllBlogPosts, getPostBySlug, postKeywords, postSeoDescription } from "@/lib/blog"
import { buildPageMetadata } from "@/lib/seo"

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
    description: postSeoDescription(post),
    path: `/blog/${post.slug}`,
    type: "article",
    keywords: postKeywords(post),
    ogImage: post.coverImage,
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const author = blogSourceLabel(post)

  return (
    <>
      <PageBreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <BlogArticleJsonLd post={post} />
      <PremiumPage>
        <PremiumReveal>
          <article className="mx-auto max-w-3xl">
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="meta-label">{post.category}</span>
                {post.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-neutral-500"
                  >
                    <Tag className="h-3 w-3" aria-hidden />
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-[2.35rem] font-semibold text-white tracking-tight leading-tight mb-5">
                {post.title}
              </h1>
              <p className="text-lg text-neutral-400 leading-relaxed mb-6">{post.excerpt}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {post.readTime}
                </span>
                <time dateTime={post.date}>{post.date}</time>
                <span>By {author}</span>
              </div>
            </header>

            <figure className="mb-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative h-56 md:h-72 bg-neutral-900">
              <BlogCoverImage
                src={post.coverImage}
                alt={post.coverImageAlt || post.title}
                priority
              />
            </figure>

            <BlogBody body={post.body} />

            {post.youtubeUrl && (
              <div className="mt-10 p-5 rounded-xl border border-white/10 bg-white/[0.03]">
                <p className="text-sm text-neutral-400 mb-2">Watch the companion video</p>
                <a
                  href={post.youtubeUrl}
                  className="text-amber-200/90 underline underline-offset-2 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {post.youtubeUrl}
                </a>
              </div>
            )}

            <BlogReferences references={post.references} />

            <div className="mt-12 pt-8 border-t border-white/[0.08] space-y-6">
              <p className="text-neutral-400 text-sm leading-relaxed">
                {author} is a full-stack developer in Lahore specializing in MERN, Next.js, and AWS serverless.
              </p>
              <BlogToolsLinks topic={post.title} category={post.category} />
              <HireCtaBlock
                variant="compact"
                title="Want this built for your product?"
                description="Hire me for production Next.js, MERN, and AWS work. Prefer a short call over a long thread."
              />
              <Link
                href="/blog"
                className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors"
              >
                ← All articles
              </Link>
            </div>
          </article>
        </PremiumReveal>
      </PremiumPage>
    </>
  )
}
