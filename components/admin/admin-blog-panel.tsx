"use client"

import { useCallback, useEffect, useState } from "react"
import { ExternalLink, Loader2, Plus, Trash2 } from "lucide-react"
import { Panel } from "@/components/admin/admin-shell"
import { AdminBlogPreview, BLOG_MARKDOWN_HINT } from "@/components/admin/admin-blog-preview"
import { adminFetch, getAuthHeaders } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { BlogPost, BlogStatus } from "@/lib/blog"

/** Client-safe list row shape (mirrors server BlogPostAdmin). */
type BlogListItem = BlogPost & {
  status: BlogStatus
  path: string
}

type FormState = {
  slug: string
  title: string
  excerpt: string
  metaDescription: string
  date: string
  category: string
  featured: boolean
  author: string
  coverImage: string
  coverImageAlt: string
  tags: string
  keywords: string
  youtubeUrl: string
  youtubeId: string
  body: string
  status: BlogStatus
}

type EditorTab = "write" | "preview"

const emptyForm = (): FormState => ({
  slug: "",
  title: "",
  excerpt: "",
  metaDescription: "",
  date: new Date().toISOString().slice(0, 10),
  category: "Full Stack",
  featured: false,
  author: "Ali Hamza",
  coverImage: "",
  coverImageAlt: "",
  tags: "",
  keywords: "",
  youtubeUrl: "",
  youtubeId: "",
  body: "",
  status: "draft",
})

function postToForm(p: BlogListItem): FormState {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    metaDescription: p.metaDescription || "",
    date: p.date,
    category: p.category,
    featured: Boolean(p.featured),
    author: p.author || "Ali Hamza",
    coverImage: p.coverImage || "",
    coverImageAlt: p.coverImageAlt || "",
    tags: (p.tags || []).join(", "),
    keywords: (p.keywords || []).join(", "),
    youtubeUrl: p.youtubeUrl || "",
    youtubeId: p.youtubeId || "",
    body: p.body,
    status: p.status,
  }
}

function splitCsv(value: string): string[] | undefined {
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  return parts.length ? parts : undefined
}

type Props = {
  onNotice: (message: string, prUrl?: string | null) => void
  onError: (message: string) => void
}

export function AdminBlogPanel({ onNotice, onError }: Props) {
  const [posts, setPosts] = useState<BlogListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [showEditor, setShowEditor] = useState(false)
  const [editorTab, setEditorTab] = useState<EditorTab>("write")
  const [uploadingCover, setUploadingCover] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/api/admin/blog", { headers: getAuthHeaders() })
      const data = await res.json()
      if (!res.ok) {
        onError(typeof data.error === "string" ? data.error : "Failed to load posts")
        return
      }
      setPosts(Array.isArray(data.posts) ? data.posts : [])
    } catch {
      onError("Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    load()
  }, [load])

  const patch = (partial: Partial<FormState>) => setForm((f) => ({ ...f, ...partial }))

  const startNew = () => {
    setEditingSlug(null)
    setForm(emptyForm())
    setEditorTab("write")
    setShowEditor(true)
  }

  const startEdit = (p: BlogListItem) => {
    setEditingSlug(p.slug)
    setForm(postToForm(p))
    setEditorTab("write")
    setShowEditor(true)
  }

  const save = async (status: BlogStatus) => {
    if (!form.title.trim() || !form.body.trim()) {
      onError("Title and body are required")
      return
    }
    setSaving(true)
    try {
      const res = await adminFetch("/api/admin/blog", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          slug: form.slug || undefined,
          title: form.title,
          excerpt: form.excerpt || undefined,
          metaDescription: form.metaDescription || undefined,
          date: form.date || undefined,
          category: form.category || undefined,
          featured: form.featured,
          author: form.author || undefined,
          coverImage: form.coverImage || undefined,
          coverImageAlt: form.coverImageAlt || undefined,
          tags: splitCsv(form.tags),
          keywords: splitCsv(form.keywords),
          youtubeUrl: form.youtubeUrl || undefined,
          youtubeId: form.youtubeId || undefined,
          body: form.body,
          status,
          source: "admin",
          autoMerge: true,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.ok === false) {
        onError(typeof data.error === "string" ? data.error : "Save failed")
        return
      }
      const merged = data.merge?.merged
      onNotice(
        merged
          ? `${status === "draft" ? "Draft" : "Published"} “${data.slug}” (PR merged). Deploy will pick it up shortly.`
          : `${status === "draft" ? "Draft" : "Publish"} PR opened for “${data.slug}”.`,
        data.prUrl || null
      )
      setShowEditor(false)
      setForm(emptyForm())
      setEditingSlug(null)
      await load()
    } catch {
      onError("Save failed. Check GITHUB_TOKEN on Vercel.")
    } finally {
      setSaving(false)
    }
  }

  const remove = async (slug: string) => {
    if (!confirm(`Delete blog “${slug}”? This opens a PR and merges it.`)) return
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
      onNotice(`Deleted “${slug}” (PR merged).`, data.prUrl || null)
      if (editingSlug === slug) {
        setShowEditor(false)
        setEditingSlug(null)
      }
      await load()
    } catch {
      onError("Delete failed")
    } finally {
      setDeleting(null)
    }
  }

  const uploadCover = async (file: File) => {
    setUploadingCover(true)
    try {
      const body = new FormData()
      body.append("file", file)
      body.append("name", form.slug || form.title || file.name)
      const auth = getAuthHeaders()
      // Browser must set multipart boundary — do not force JSON content-type
      const { "Content-Type": _drop, ...headers } = auth
      const res = await adminFetch("/api/admin/blog/cover", {
        method: "POST",
        headers,
        body,
      })
      const data = await res.json()
      if (!res.ok || data.ok === false) {
        onError(typeof data.error === "string" ? data.error : "Cover upload failed")
        return
      }
      patch({ coverImage: data.path })
      onNotice(`Cover uploaded to ${data.path} (PR merged). Site will show it after deploy.`, data.prUrl || null)
    } catch {
      onError("Cover upload failed")
    } finally {
      setUploadingCover(false)
    }
  }

  const fieldClass =
    "w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]/40"

  return (
    <div className="space-y-6">
      <Panel
        title="Blog posts"
        action={
          <button type="button" onClick={startNew} className="btn-secondary !text-xs !py-2 !px-3 inline-flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New post
          </button>
        }
      >
        <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
          Saves create a GitHub PR and merge it automatically — same flow as DevBuildDaily automation.
          Drafts stay off the public blog until you publish. Use Preview to check markdown, images, and layout
          before publish; what you see there is what the live site renders.
        </p>

        {loading ? (
          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">No posts yet. Create a draft or publish one.</p>
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
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="btn-secondary !text-xs !py-2 !px-3"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p.slug)}
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

      {showEditor && (
        <Panel
          title={editingSlug ? `Edit: ${editingSlug}` : "New blog post"}
          action={
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-lg border border-white/[0.08] p-0.5 bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setEditorTab("write")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    editorTab === "write"
                      ? "bg-[var(--accent-primary)]/15 text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  )}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    editorTab === "preview"
                      ? "bg-[var(--accent-primary)]/15 text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  )}
                >
                  Preview
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditor(false)
                  setEditingSlug(null)
                }}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Close
              </button>
            </div>
          }
        >
          {editorTab === "write" ? (
            <>
              <details className="mb-5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <summary className="text-xs font-medium text-[var(--text-secondary)] cursor-pointer select-none">
                  Markdown & images cheat sheet (what the site supports)
                </summary>
                <pre className="mt-3 text-[11px] leading-relaxed text-[var(--text-muted)] whitespace-pre-wrap font-mono overflow-x-auto">
                  {BLOG_MARKDOWN_HINT}
                </pre>
              </details>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Title</span>
                  <input className={fieldClass} value={form.title} onChange={(e) => patch({ title: e.target.value })} />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Slug (optional)</span>
                  <input
                    className={fieldClass}
                    value={form.slug}
                    onChange={(e) => patch({ slug: e.target.value })}
                    placeholder="auto-from-title"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Date</span>
                  <input type="date" className={fieldClass} value={form.date} onChange={(e) => patch({ date: e.target.value })} />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Category</span>
                  <input className={fieldClass} value={form.category} onChange={(e) => patch({ category: e.target.value })} />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Author</span>
                  <input className={fieldClass} value={form.author} onChange={(e) => patch({ author: e.target.value })} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Excerpt</span>
                  <textarea
                    className={cn(fieldClass, "min-h-[72px] resize-y")}
                    value={form.excerpt}
                    onChange={(e) => patch({ excerpt: e.target.value })}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Meta description</span>
                  <textarea
                    className={cn(fieldClass, "min-h-[56px] resize-y")}
                    value={form.metaDescription}
                    onChange={(e) => patch({ metaDescription: e.target.value })}
                    maxLength={180}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Cover image URL</span>
                  <input
                    className={fieldClass}
                    value={form.coverImage}
                    onChange={(e) => patch({ coverImage: e.target.value })}
                    placeholder="https://… or /blog/covers/my-image.jpg"
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <label className="btn-secondary !text-xs !py-2 !px-3 cursor-pointer inline-flex items-center gap-1.5">
                      {uploadingCover ? "Uploading…" : "Upload cover"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={uploadingCover}
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) void uploadCover(f)
                          e.target.value = ""
                        }}
                      />
                    </label>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      JPG/PNG/WebP under 4.5 MB → saved to /blog/covers via PR
                    </span>
                  </div>
                  {form.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.coverImage}
                      alt=""
                      className="mt-3 h-28 w-full max-w-md object-cover rounded-xl border border-white/[0.08]"
                    />
                  )}
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Cover alt text</span>
                  <input className={fieldClass} value={form.coverImageAlt} onChange={(e) => patch({ coverImageAlt: e.target.value })} />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Tags (comma)</span>
                  <input className={fieldClass} value={form.tags} onChange={(e) => patch({ tags: e.target.value })} />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Keywords (comma)</span>
                  <input className={fieldClass} value={form.keywords} onChange={(e) => patch({ keywords: e.target.value })} />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">YouTube URL</span>
                  <input className={fieldClass} value={form.youtubeUrl} onChange={(e) => patch({ youtubeUrl: e.target.value })} />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">YouTube ID</span>
                  <input className={fieldClass} value={form.youtubeId} onChange={(e) => patch({ youtubeId: e.target.value })} />
                </label>
                <label className="flex items-center gap-2 sm:col-span-2 pt-1">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => patch({ featured: e.target.checked })}
                    className="rounded border-white/20"
                  />
                  <span className="text-sm text-[var(--text-secondary)]">Featured on blog index</span>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Body (markdown)</span>
                  <textarea
                    className={cn(fieldClass, "min-h-[280px] resize-y font-mono text-[13px] leading-relaxed")}
                    value={form.body}
                    onChange={(e) => patch({ body: e.target.value })}
                    placeholder={"## Intro\n\nYour article…\n\n![Caption](https://…)\n"}
                  />
                </label>
              </div>
            </>
          ) : (
            <AdminBlogPreview
              title={form.title}
              excerpt={form.excerpt}
              date={form.date}
              category={form.category}
              author={form.author}
              coverImage={form.coverImage}
              coverImageAlt={form.coverImageAlt}
              tags={form.tags}
              youtubeUrl={form.youtubeUrl}
              body={form.body}
            />
          )}

          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              disabled={saving}
              onClick={() => save("draft")}
              className="btn-secondary !text-sm disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save("published")}
              className="btn-primary !text-sm disabled:opacity-50"
            >
              {saving ? "Publishing…" : "Publish (PR + merge)"}
            </button>
            {editorTab === "write" && (
              <button
                type="button"
                onClick={() => setEditorTab("preview")}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] ml-auto"
              >
                Check Preview first →
              </button>
            )}
          </div>
        </Panel>
      )}
    </div>
  )
}
