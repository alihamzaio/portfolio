"use client"

import { useEffect, useState } from "react"
import {
  Briefcase,
  Building2,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileText,
  Newspaper,
  Package,
  Sparkles,
  AlertTriangle,
  User,
} from "lucide-react"
import { Panel, StatCard, type AdminTab } from "@/components/admin/admin-shell"
import { adminFetch, getAuthHeaders } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type OverviewData = {
  counts: {
    experience: number
    projects: number
    featuredProjects: number
    skills: number
    resumes: number
    activeResume: string | null
    blogPublished: number
    blogDrafts: number
    blogTotal: number
  }
  profile: {
    percent: number
    filled: number
    total: number
    missing: string[]
  }
  sync: {
    mode: string
    githubConfigured: boolean
    kvConfigured: boolean
    githubRepo: string
    healthy: boolean
    message: string
  }
  recentBlog: Array<{
    slug: string
    title: string
    status: string
    date: string
    category: string
  }>
  links: {
    site: string
    blog: string
    admin: string
    githubRepo: string
  }
}

type Props = {
  onTab: (t: AdminTab) => void
  onAddExperience: () => void
  onAddProject: () => void
  localCounts?: {
    experience: number
    projects: number
    featuredProjects: number
    skills: number
    resumes: number
    activeResume: string | null
  }
}

export function AdminOverview({
  onTab,
  onAddExperience,
  onAddProject,
  localCounts,
}: Props) {
  const [data, setData] = useState<OverviewData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    adminFetch("/api/admin/overview", { headers: getAuthHeaders() })
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load overview")
        if (!cancelled) setData(json as OverviewData)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load")
      })
    return () => {
      cancelled = true
    }
  }, [])

  const c = data?.counts
  const experience = localCounts?.experience ?? c?.experience ?? 0
  const projects = localCounts?.projects ?? c?.projects ?? 0
  const featured = localCounts?.featuredProjects ?? c?.featuredProjects ?? 0
  const skills = localCounts?.skills ?? c?.skills ?? 0
  const resumes = localCounts?.resumes ?? c?.resumes ?? 0
  const activeResume = localCounts?.activeResume ?? c?.activeResume ?? null
  const blogPublished = c?.blogPublished ?? 0
  const blogDrafts = c?.blogDrafts ?? 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1 tracking-tight">Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Content counts, site health, and shortcuts — everything in one place.
          </p>
        </div>
        {data?.links && (
          <div className="flex flex-wrap gap-2">
            <a
              href={data.links.site}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary !text-xs !py-2 !px-3 inline-flex items-center gap-1.5"
            >
              View site <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={data.links.blog}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary !text-xs !py-2 !px-3 inline-flex items-center gap-1.5"
            >
              Live blog <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400 border border-red-400/25 rounded-lg px-3 py-2 bg-red-400/10">
          {error}
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Experience" value={experience} sub="roles" />
        <StatCard label="Projects" value={projects} sub={`${featured} featured`} />
        <StatCard label="Skills" value={skills} />
        <StatCard label="Blog live" value={blogPublished} sub={`${blogDrafts} drafts`} />
        <StatCard label="Resumes" value={resumes} sub={activeResume || "None active"} />
        <StatCard
          label="Profile"
          value={data ? `${data.profile.percent}%` : "—"}
          sub={data ? `${data.profile.filled}/${data.profile.total} fields` : "Loading…"}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="System health">
          {!data ? (
            <p className="text-sm text-[var(--text-muted)]">Loading status…</p>
          ) : (
            <div className="space-y-4">
              <div
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3",
                  data.sync.healthy
                    ? "border-emerald-500/25 bg-emerald-500/5"
                    : "border-amber-500/25 bg-amber-500/5"
                )}
              >
                {data.sync.healthy ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] capitalize">
                    {data.sync.mode.replace(/-/g, " ")}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {data.sync.message}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono mt-2 truncate">
                    {data.sync.githubRepo} · GitHub {data.sync.githubConfigured ? "ready" : "missing token"}
                    {data.sync.kvConfigured ? " · Redis on" : ""}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Profile completeness">
          {!data ? (
            <p className="text-sm text-[var(--text-muted)]">Loading…</p>
          ) : (
            <div className="space-y-4">
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-500"
                  style={{ width: `${data.profile.percent}%` }}
                />
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {data.profile.percent === 100
                  ? "Profile looks complete."
                  : `Missing: ${data.profile.missing.join(", ") || "none"}`}
              </p>
              <button type="button" onClick={() => onTab("profile")} className="btn-secondary !text-xs">
                Edit profile & hero
              </button>
            </div>
          )}
        </Panel>
      </div>

      <Panel
        title="Recent blog posts"
        action={
          <button type="button" onClick={() => onTab("blog")} className="btn-secondary !text-xs !py-1.5 !px-3">
            Open blog CMS
          </button>
        }
      >
        {!data ? (
          <p className="text-sm text-[var(--text-muted)]">Loading…</p>
        ) : data.recentBlog.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">
            No posts yet. Create a draft or publish from the Blog tab.
          </p>
        ) : (
          <ul className="space-y-2">
            {data.recentBlog.map((p) => (
              <li
                key={`${p.status}-${p.slug}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm text-[var(--text-primary)] truncate">{p.title}</p>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">
                    {p.date} · {p.category} · {p.status}
                  </p>
                </div>
                {p.status === "published" && data.links && (
                  <a
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">Quick actions</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Edit profile", sub: "Name, hero, contact, links", tab: "profile" as const, icon: User, onClick: () => onTab("profile") },
            { label: "Add experience", sub: "Company roles & wins", tab: "experience" as const, icon: Building2, onClick: onAddExperience },
            { label: "Add project", sub: "Case studies & demos", tab: "projects" as const, icon: Briefcase, onClick: onAddProject },
            { label: "Manage skills", sub: "Stack & levels", tab: "skills" as const, icon: Sparkles, onClick: () => onTab("skills") },
            { label: "Manage blog", sub: "Draft, preview, publish", tab: "blog" as const, icon: Newspaper, onClick: () => onTab("blog") },
            { label: "Products", sub: "Listings, Gumroad, download URL", tab: "products" as const, icon: Package, onClick: () => onTab("products") },
            { label: "Payment details", sub: "Bank / JazzCash for direct pay", tab: "payments" as const, icon: CreditCard, onClick: () => onTab("payments") },
            { label: "Upload resume", sub: "Active CV PDF", tab: "resume" as const, icon: FileText, onClick: () => onTab("resume") },
          ].map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className="glass-card rounded-xl p-4 text-left hover:border-white/[0.12] transition-colors flex gap-3 items-start"
            >
              <a.icon className="h-4 w-4 text-[var(--accent-primary)] mt-0.5 shrink-0" />
              <span>
                <span className="block font-medium text-sm text-[var(--text-primary)]">{a.label}</span>
                <span className="block text-xs text-[var(--text-secondary)] mt-0.5">{a.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
