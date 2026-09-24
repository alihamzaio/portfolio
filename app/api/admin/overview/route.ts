import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { readJsonFile, requireAdminAuth } from "@/lib/admin"
import { getAllBlogPostsAdmin } from "@/lib/blog"
import { getExperiences, getSiteSettings } from "@/lib/content"
import { githubSyncConfig } from "@/lib/github-sync-config"
import { isGitHubSyncEnabled } from "@/lib/github-api"
import { getStoreJson, hasKvStore } from "@/lib/store"
import { siteConfig } from "@/lib/site"
import type { SiteSettings } from "@/lib/settings"

export const runtime = "nodejs"

function profileCompleteness(settings: SiteSettings) {
  const checks: { key: string; ok: boolean }[] = [
    { key: "Name", ok: Boolean(settings.name?.trim()) },
    { key: "Headline", ok: Boolean(settings.headline?.trim()) },
    { key: "Email", ok: Boolean(settings.email?.trim()) },
    { key: "Phone", ok: Boolean(settings.phone?.trim()) },
    { key: "Location", ok: Boolean(settings.location?.trim()) },
    { key: "GitHub", ok: Boolean(settings.social?.github?.trim()) },
    { key: "LinkedIn", ok: Boolean(settings.social?.linkedin?.trim()) },
  ]
  const filled = checks.filter((c) => c.ok).length
  return {
    percent: Math.round((filled / checks.length) * 100),
    filled,
    total: checks.length,
    missing: checks.filter((c) => !c.ok).map((c) => c.key),
  }
}

async function getProjectsList(): Promise<Array<{ featured?: boolean }>> {
  const kv = await getStoreJson("projects")
  if (Array.isArray(kv)) return kv as Array<{ featured?: boolean }>
  return readJsonFile<Array<{ featured?: boolean }>>("lib/projects.json").catch(() => [])
}

async function getSkillsList(): Promise<unknown[]> {
  const kv = await getStoreJson("skills")
  if (Array.isArray(kv)) return kv
  return readJsonFile<unknown[]>("lib/skills.json").catch(() => [])
}

async function resumeStats(): Promise<{ files: number; active: string | null }> {
  try {
    const dir = path.join(process.cwd(), "public", "resume")
    const names = await fs.readdir(dir)
    const files = names.filter((n) => n.toLowerCase().endsWith(".pdf"))
    let active: string | null = null
    try {
      const raw = await fs.readFile(path.join(dir, "active.json"), "utf8")
      const data = JSON.parse(raw) as { active?: string }
      active = data.active || null
    } catch {
      active = files[0] || null
    }
    return { files: files.length, active }
  } catch {
    return { files: 0, active: null }
  }
}

/**
 * GET /api/admin/overview — dashboard counts, profile health, sync status
 */
export async function GET(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [blog, settings, experience, projects, skills, resumes] = await Promise.all([
    getAllBlogPostsAdmin(),
    getSiteSettings(),
    getExperiences(),
    getProjectsList(),
    getSkillsList(),
    resumeStats(),
  ])

  const published = blog.filter((p) => p.status === "published").length
  const drafts = blog.filter((p) => p.status === "draft").length
  const featuredProjects = projects.filter((p) => p.featured).length

  const kvConfigured = hasKvStore()
  const githubConfigured = isGitHubSyncEnabled()
  let mode: "kv-live" | "github-live" | "local-files" | "needs-storage" = "local-files"
  if (kvConfigured) mode = "kv-live"
  else if (githubConfigured && process.env.VERCEL === "1") mode = "github-live"
  else if (process.env.VERCEL === "1") mode = "needs-storage"

  const profile = profileCompleteness(settings)

  return NextResponse.json({
    counts: {
      experience: experience.length,
      projects: projects.length,
      featuredProjects,
      skills: skills.length,
      resumes: resumes.files,
      activeResume: resumes.active,
      blogPublished: published,
      blogDrafts: drafts,
      blogTotal: blog.length,
    },
    profile,
    sync: {
      mode,
      githubConfigured,
      kvConfigured,
      githubRepo: githubSyncConfig.repo,
      githubBranch: githubSyncConfig.baseBranch,
      healthy: mode !== "needs-storage",
      message:
        mode === "kv-live"
          ? "Saves go live instantly (Redis)."
          : mode === "github-live"
            ? "Saves sync via GitHub PR (blog uses PR + merge)."
            : mode === "needs-storage"
              ? "Add GITHUB_TOKEN or Upstash Redis on Vercel."
              : "Local JSON files (dev).",
    },
    recentBlog: blog.slice(0, 5).map((p) => ({
      slug: p.slug,
      title: p.title,
      status: p.status,
      date: p.date,
      category: p.category,
    })),
    links: {
      site: siteConfig.url,
      blog: `${siteConfig.url}/blog`,
      admin: `${siteConfig.url}/admin`,
      githubRepo: `https://github.com/${githubSyncConfig.repo}`,
    },
  })
}
