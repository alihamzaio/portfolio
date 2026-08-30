"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { parseChatBlocks } from "@/lib/chat-format"

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[2]) {
      nodes.push(
        <strong key={key++} className="font-semibold text-[var(--text-primary)]">
          {m[2]}
        </strong>
      )
    } else if (m[3]) {
      nodes.push(
        <em key={key++} className="italic text-[var(--text-primary)]">
          {m[3]}
        </em>
      )
    } else if (m[4]) {
      nodes.push(
        <code
          key={key++}
          className="rounded px-1 py-0.5 font-mono text-[0.8em] bg-white/[0.06] text-[var(--accent-primary)]"
        >
          {m[4]}
        </code>
      )
    }
    last = m.index + m[0].length
  }

  if (last < text.length) nodes.push(text.slice(last))
  return nodes.length ? nodes : [text]
}

export function ChatMessageBody({
  content,
  role,
  className,
}: {
  content: string
  role: "user" | "assistant"
  className?: string
}) {
  const blocks = parseChatBlocks(content)
  const isUser = role === "user"

  return (
    <div
      className={cn(
        "chat-msg space-y-3 text-[13.5px] sm:text-sm leading-[1.7]",
        isUser ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]",
        className
      )}
    >
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return (
            <p key={i} className={cn(isUser ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]")}>
              {renderInline(block.text)}
            </p>
          )
        }

        if (block.type === "ul") {
          return (
            <ul key={i} className="space-y-2.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--accent-primary)]/80" aria-hidden />
                  <span className="min-w-0">{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === "ol") {
          return (
            <ol key={i} className="space-y-2.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="mt-0.5 w-4 shrink-0 font-mono text-[11px] tabular-nums text-[var(--accent-primary)]/75">
                    {String(j + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          )
        }

        return (
          <div key={i} className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)]/80">
            <p className="border-b border-[var(--border-subtle)] px-3.5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent-primary)]/7">
              Project brief
            </p>
            <dl className="divide-y divide-[var(--border-subtle)]/80">
              {block.rows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 px-3.5 py-2.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-3"
                >
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">{row.label}</dt>
                  <dd className="break-words text-[13px] text-[var(--text-primary)]">{renderInline(row.value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )
      })}
    </div>
  )
}
