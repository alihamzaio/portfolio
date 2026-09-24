import Link from "next/link"
import Image from "next/image"
import type { Components } from "react-markdown"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { BlogPost } from "@/lib/blog"

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white pt-6 first:pt-0 scroll-mt-24">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white pt-6 first:pt-0 scroll-mt-24">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-white/95 pt-4 scroll-mt-24">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold text-white/90 pt-3 scroll-mt-24">{children}</h4>
  ),
  p: ({ children }) => <p className="text-neutral-300 leading-[1.75] text-[17px]">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-neutral-200">{children}</em>,
  a: ({ href, children }) => {
    const url = href || "#"
    const external = url.startsWith("http")
    if (external) {
      return (
        <a
          href={url}
          className="text-amber-200/90 underline underline-offset-2 hover:text-amber-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={url} className="text-amber-200/90 underline underline-offset-2">
        {children}
      </Link>
    )
  },
  ul: ({ children }) => (
    <ul className="list-disc pl-6 space-y-2 marker:text-amber-400/70 text-neutral-300 text-[17px] leading-[1.75]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 space-y-2 marker:text-amber-400/70 text-neutral-300 text-[17px] leading-[1.75]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-amber-400/50 pl-5 italic text-neutral-400 my-6">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className?.includes("language-"))
    if (isBlock) {
      return <code className="text-sm text-amber-50/90">{children}</code>
    }
    return (
      <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-amber-100/90">{children}</code>
    )
  },
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-sm my-6">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-white/10 my-8" />,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[28rem] text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-white/[0.04] text-neutral-400">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-white/[0.06] last:border-0">{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-2.5 font-medium border-b border-white/10">{children}</th>
  ),
  td: ({ children }) => <td className="px-3 py-2.5 align-top text-neutral-300">{children}</td>,
  img: ({ src, alt }) => {
    const url = typeof src === "string" ? src : ""
    if (!url) return null
    return (
      <figure className="my-8 rounded-xl overflow-hidden border border-white/10">
        <Image
          src={url}
          alt={alt || "Article illustration"}
          width={1200}
          height={630}
          className="w-full h-auto object-cover"
          unoptimized={url.startsWith("http")}
        />
        {alt ? (
          <figcaption className="text-xs text-neutral-500 px-4 py-2 bg-white/[0.03]">{alt}</figcaption>
        ) : null}
      </figure>
    )
  },
}

/** Strip common AI punctuation artifacts before render. */
export function cleanBlogMarkdown(body: string): string {
  return body
    .replace(/\u2014/g, " - ") // em dash
    .replace(/\u2013/g, "-") // en dash
    .replace(/\u2011/g, "-") // non-breaking hyphen
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .trim()
}

export function BlogBody({ body }: { body: string }) {
  const markdown = cleanBlogMarkdown(body)

  return (
    <div className="blog-prose space-y-5 text-neutral-300 leading-[1.75] text-[17px]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}

export function BlogReferences({ references }: { references: BlogPost["references"] }) {
  if (!references?.length) return null
  return (
    <section className="mt-12 pt-8 border-t border-white/[0.08]">
      <h2 className="text-lg font-semibold text-white mb-4">References & further reading</h2>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-neutral-400">
        {references.map((ref, i) => (
          <li key={i}>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-200/90 underline underline-offset-2 hover:text-amber-100"
            >
              {ref.title}
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function blogSourceLabel(post: BlogPost) {
  return post.author || post.source || "Ali Hamza"
}
