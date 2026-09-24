"use client"

import { Clock, Tag } from "lucide-react"
import { BlogBody, BlogReferences, blogSourceLabel } from "@/components/pages/blog-body"
import { BlogCoverImage } from "@/components/pages/blog-cover-image"
import { resolveBlogCover } from "@/lib/blog-cover"
import type { BlogPost } from "@/lib/blog"

function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

type PreviewInput = {
  title: string
  excerpt: string
  date: string
  category: string
  author: string
  coverImage: string
  coverImageAlt: string
  tags: string
  youtubeUrl: string
  body: string
}

/** Same article chrome as /blog/[slug] so admin preview matches the live site. */
export function AdminBlogPreview(form: PreviewInput) {
  const tags = form.tags
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const post: BlogPost = {
    slug: "preview",
    title: form.title.trim() || "Untitled post",
    excerpt: form.excerpt.trim() || "Add an excerpt to see it here.",
    date: form.date || new Date().toISOString().slice(0, 10),
    readTime: estimateReadTime(form.body || "word"),
    category: form.category || "Full Stack",
    author: form.author || "Ali Hamza",
    coverImage: resolveBlogCover(form.coverImage),
    coverImageAlt: form.coverImageAlt || "Ali Hamza — Full Stack Developer",
    tags: tags.length ? tags : undefined,
    youtubeUrl: form.youtubeUrl || undefined,
    body: form.body.trim() || "_Start writing in the Write tab. Preview uses the same renderer as the live blog._",
  }

  const author = blogSourceLabel(post)

  return (
    <article className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/80 p-6 sm:p-8">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6">
        Live site preview · same renderer as /blog
      </p>
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
        <BlogCoverImage src={post.coverImage} alt={post.coverImageAlt || post.title} />
      </figure>

      <BlogBody body={post.body} />

      {post.youtubeUrl && (
        <div className="mt-10 p-5 rounded-xl border border-white/10 bg-white/[0.03]">
          <p className="text-sm text-neutral-400 mb-2">Watch the companion video</p>
          <a
            href={post.youtubeUrl}
            className="text-amber-200/90 underline underline-offset-2 font-medium break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {post.youtubeUrl}
          </a>
        </div>
      )}

      <BlogReferences references={post.references} />
    </article>
  )
}

export const BLOG_MARKDOWN_HINT = `Supported body markdown (renders on the live site the same way):

## Heading 2
### Heading 3
Paragraphs separated by a blank line
**bold** · \`inline code\` · [link text](https://…)
- unordered list
1. ordered list
> blockquote
\`\`\`
code block
\`\`\`
![Alt text](https://image-url.jpg)

Cover image: Brand default, copyright-free live URL (Pexels/Unsplash), or upload to /blog/covers.
Remote images must be copyright-free. If none set, the Ali Hamza brand placeholder is used.`
