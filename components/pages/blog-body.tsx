import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"
import type { BlogPost } from "@/lib/blog"

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const re = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[2] && m[3]) {
      const href = m[3]
      const external = href.startsWith("http")
      parts.push(
        external ? (
          <a
            key={key++}
            href={href}
            className="text-amber-200/90 underline underline-offset-2 hover:text-amber-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            {m[2]}
          </a>
        ) : (
          <Link key={key++} href={href} className="text-amber-200/90 underline underline-offset-2">
            {m[2]}
          </Link>
        )
      )
    } else if (m[4]) {
      parts.push(
        <strong key={key++} className="font-semibold text-white">
          {m[4]}
        </strong>
      )
    } else if (m[5]) {
      parts.push(
        <code key={key++} className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-amber-100/90">
          {m[5]}
        </code>
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length ? parts : [text]
}

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; text: string }
  | { type: "img"; alt: string; src: string }

function parseBlocks(body: string): Block[] {
  const blocks: Block[] = []
  const chunks = body.trim().split(/\n{2,}/)

  for (const chunk of chunks) {
    const c = chunk.trim()
    if (!c) continue

    if (c.startsWith("## ")) {
      blocks.push({ type: "h2", text: c.slice(3).trim() })
      continue
    }
    if (c.startsWith("### ")) {
      blocks.push({ type: "h3", text: c.slice(4).trim() })
      continue
    }
    if (c.startsWith("> ")) {
      blocks.push({ type: "quote", text: c.replace(/^>\s?/gm, "").trim() })
      continue
    }
    if (c.startsWith("```")) {
      const code = c.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "")
      blocks.push({ type: "code", text: code })
      continue
    }
    const imgMatch = c.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgMatch) {
      blocks.push({ type: "img", alt: imgMatch[1], src: imgMatch[2] })
      continue
    }
    const lines = c.split("\n")
    if (lines.every((l) => l.match(/^[-*]\s+/))) {
      blocks.push({
        type: "ul",
        items: lines.map((l) => l.replace(/^[-*]\s+/, "").trim()),
      })
      continue
    }
    if (lines.every((l) => l.match(/^\d+\.\s+/))) {
      blocks.push({
        type: "ol",
        items: lines.map((l) => l.replace(/^\d+\.\s+/, "").trim()),
      })
      continue
    }
    blocks.push({ type: "p", text: c })
  }
  return blocks
}

export function BlogBody({ body }: { body: string }) {
  const blocks = parseBlocks(body)

  return (
    <div className="blog-prose space-y-6 text-neutral-300 leading-[1.75] text-[17px]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} className="text-2xl font-semibold text-white pt-6 first:pt-0 scroll-mt-24">
                {renderInline(block.text)}
              </h2>
            )
          case "h3":
            return (
              <h3 key={i} className="text-xl font-semibold text-white/95 pt-4 scroll-mt-24">
                {renderInline(block.text)}
              </h3>
            )
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-2 border-amber-400/50 pl-5 italic text-neutral-400 my-6"
              >
                {renderInline(block.text)}
              </blockquote>
            )
          case "code":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-amber-50/90"
              >
                <code>{block.text}</code>
              </pre>
            )
          case "ul":
            return (
              <ul key={i} className="list-disc pl-6 space-y-2 marker:text-amber-400/70">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            )
          case "ol":
            return (
              <ol key={i} className="list-decimal pl-6 space-y-2 marker:text-amber-400/70">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ol>
            )
          case "img":
            return (
              <figure key={i} className="my-8 rounded-xl overflow-hidden border border-white/10">
                <Image
                  src={block.src}
                  alt={block.alt || "Article illustration"}
                  width={1200}
                  height={630}
                  className="w-full h-auto object-cover"
                  unoptimized={block.src.startsWith("http")}
                />
                {block.alt && (
                  <figcaption className="text-xs text-neutral-500 px-4 py-2 bg-white/[0.03]">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            )
          default:
            return (
              <p key={i} className="whitespace-pre-wrap">
                {renderInline(block.text)}
              </p>
            )
        }
      })}
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
