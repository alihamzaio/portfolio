import type { BlogPost } from "@/lib/blog"

/** Tiny markdown-ish renderer (headings + paragraphs). No extra deps. */
export function BlogBody({ body }: { body: string }) {
  const blocks = body
    .trim()
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)

  return (
    <div className="space-y-5 text-neutral-300 leading-relaxed">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-semibold text-white pt-2">
              {block.slice(3)}
            </h2>
          )
        }
        if (block.startsWith("# ")) {
          return (
            <h2 key={i} className="text-2xl font-semibold text-white pt-2">
              {block.slice(2)}
            </h2>
          )
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {block}
          </p>
        )
      })}
    </div>
  )
}

export function blogSourceLabel(post: BlogPost) {
  return post.source || "Ali Hamza"
}
