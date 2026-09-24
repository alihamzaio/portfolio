"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink, Loader2, Plus, Trash2 } from "lucide-react"
import { Panel } from "@/components/admin/admin-shell"
import { adminFetch, getAuthHeaders } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { BlogPost, BlogStatus } from "@/lib/blog"

type BlogListItem = BlogPost & {
  status: BlogStatus
  path: string
}

type Props = {
  onNotice: (message: string, prUrl?: string | null) => void
  onError: (message: string) => void
  onCounts?: (published: number, drafts: number) => void
}

export function AdminBlogPanel({ onNotice, onError, onCounts }: Props) {
  const [posts, setPosts] = useState<BlogListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/api/admin/blog", { headers: getAuthHeaders() })
      const data = await res.json()
      if (!res.ok) {
        onError(typeof data.error === "string" ? data.error : "Failed to load posts")
        return
      }
      const list = Array.isArray(data.posts) ? (data.posts as BlogListItem[]) : []
      setPosts(list)
      if (onCounts) {
        onCounts(
          list.filter((p) => p.status === "published").length,
          list.filter((p) => p.status === "draft").length
        )
      }
    } catch {
      onError("Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }, [onError, onCounts])

  useEffect(() => {
    void load()
  }, [load])

  const remove = async (slug: string) => {
    if (!confirm(`Delete blog “${slug}”? This removes it from main.`)) return
    setDeleting(slug)
    try {
      const res = await adminFetch(`/api/admin/blog/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (!res.ok || data.ok === false) {
        onError(typeof data.error === "string" ? data.error : "Delete failed")
        return
      }
      onNotice(`Deleted “${slug}” from main.`, data.prUrl || null)
      await load()
    } catch {
      onError("Delete failed")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <Panel
      title="Blog posts"
      action={
        <Link href="/admin/blog/new" className="btn-secondary !text-xs !py-2 !px-3 inline-flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" /> New post
        </Link>
      }
    >
      <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
        Open a post to edit it on its own page. Drafts stay off the public blog until you publish.
        Saves commit straight to main.
      </p>

      {loading ? (
        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </p>
      ) : posts.length === 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-secondary)]">No posts yet.</p>
          <Link href="/admin/blog/new" className="btn-primary !text-sm inline-flex">
            Write the first post
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li
              key={`${p.status}-${p.slug}`}
              className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border",
                      p.status === "published"
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                        : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                    )}
                  >
                    {p.status}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">{p.date}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{p.category}</span>
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{p.title}</p>
                <p className="text-[11px] text-[var(--text-muted)] font-mono truncate">{p.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {p.status === "published" && (
                  <a
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]"
                    title="View live"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link href={`/admin/blog/${encodeURIComponent(p.slug)}/edit`} className="btn-secondary !text-xs !py-2 !px-3">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => void remove(p.slug)}
                  disabled={deleting === p.slug}
                  className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  title="Delete"
                >
                  {deleting === p.slug ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
