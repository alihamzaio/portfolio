"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, Star, Trash2 } from "lucide-react"
import { AdminShell, Panel, StatCard, type AdminTab } from "@/components/admin/admin-shell"
import { AdminLogin } from "@/components/admin/admin-login"
import { adminFetch, clearAdminSession, getAdminSession, getAuthHeaders, setAdminSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { SiteSettings } from "@/lib/settings"
import type { Experience } from "@/lib/types"

type Skill = { name: string; level: number; image?: string; originalName?: string }
type Project = {
  id: number
  title: string
  description: string
  tags: string[]
  image?: string
  details?: string
  link?: string
  github?: string
  featured?: boolean
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState<AdminTab>("overview")
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [resumeFiles, setResumeFiles] = useState<string[]>([])
  const [activeResume, setActiveResume] = useState<string | null>(null)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [experienceList, setExperienceList] = useState<Experience[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [syncNotice, setSyncNotice] = useState<string | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [syncMode, setSyncMode] = useState<string | null>(null)
  const [syncPrUrl, setSyncPrUrl] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  const noteSyncResponse = (res: Response) => {
    const message = res.headers.get("X-Portfolio-Sync-Message")
    const prUrl = res.headers.get("X-Portfolio-Sync-Url")
    if (message) {
      setSyncNotice(message)
      setSyncError(null)
    }
    setSyncPrUrl(prUrl)
  }

  const noteSaveError = async (res: Response) => {
    if (res.ok) return false
    const data = await res.json().catch(() => null)
    setSyncError(typeof data?.error === "string" ? data.error : "Save failed")
    setSyncNotice(null)
    setSyncPrUrl(null)
    return true
  }

  const verifyStoredSession = useCallback(async () => {
    const cached = getAdminSession()
    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
        cache: "no-store",
        headers: cached?.token ? { Authorization: `Bearer ${cached.token}` } : {},
      })

      if (!res.ok) {
        if (cached && Date.now() < cached.expiresAt) {
          setAuthed(true)
        } else {
          clearAdminSession()
          setAuthed(false)
        }
        return
      }

      const data = (await res.json()) as {
        valid?: boolean
        token?: string
        expiresAt?: number
        email?: string
      }

      if (data.valid && data.token && data.expiresAt && data.email) {
        setAdminSession({
          token: data.token,
          expiresAt: data.expiresAt,
          email: data.email,
        })
        setAuthed(true)
        return
      }

      if (data.valid && cached && Date.now() < cached.expiresAt) {
        setAuthed(true)
        return
      }

      clearAdminSession()
      setAuthed(false)
    } catch {
      if (cached && Date.now() < cached.expiresAt) {
        setAuthed(true)
      } else {
        clearAdminSession()
        setAuthed(false)
      }
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    verifyStoredSession()
  }, [verifyStoredSession])

  const loadAll = async () => {
    const [sk, pr, res, set, exp] = await Promise.all([
      fetch("/api/skills").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/resume").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/experience").then((r) => r.json()),
    ])
    setSkills((sk || []).map((s: Skill) => ({ ...s, originalName: s.name })))
    setProjects(pr || [])
    setResumeFiles(res.files || [])
    setActiveResume(res.active || null)
    setSettings(set)
    setExperienceList(Array.isArray(exp) ? exp : [])
  }

  useEffect(() => {
    if (authed) loadAll()
  }, [authed])

  useEffect(() => {
    if (!authed) return
    fetch("/api/admin/sync-status")
      .then((r) => r.json())
      .then((d) => setSyncMode(typeof d?.message === "string" ? d.message : null))
      .catch(() => setSyncMode(null))
  }, [authed])

  const publishToGitHub = async () => {
    setPublishing(true)
    setSyncError(null)
    try {
      const res = await adminFetch("/api/admin/publish-github", { method: "POST", headers: getAuthHeaders() })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setSyncError(typeof data.error === "string" ? data.error : "GitHub sync failed")
        setSyncNotice(null)
        setSyncPrUrl(null)
        return
      }
      if (data.skipped) {
        setSyncNotice(data.skipped)
      } else if (data.changed?.length) {
        setSyncNotice(`Synced ${data.changed.length} file(s) to GitHub.`)
      } else {
        setSyncNotice("GitHub sync complete.")
      }
      setSyncPrUrl(typeof data.prUrl === "string" ? data.prUrl : null)
    } catch {
      setSyncError("GitHub sync failed. Try again.")
    } finally {
      setPublishing(false)
    }
  }

  const logout = async () => {
    const session = getAdminSession()
    await fetch("/api/auth/session", {
      method: "DELETE",
      credentials: "include",
      headers: session ? { Authorization: `Bearer ${session.token}` } : {},
    })
    clearAdminSession()
    setAuthed(false)
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--text-secondary)]">Checking session…</p>
      </main>
    )
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => { setAuthed(true); setChecking(false) }} />
  }

  const saveProject = async (p: Project, index: number) => {
    setSaving(true)
    const isNew = p.id > 1_000_000_000_000
    const res = await adminFetch(isNew ? "/api/projects" : `/api/projects/${p.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(p),
    })
    if (res.ok) {
      const saved = await res.json()
      setProjects((arr) => arr.map((x, i) => (i === index ? saved : x)))
      noteSyncResponse(res)
    } else {
      await noteSaveError(res)
    }
    setSaving(false)
  }

  const createProject = () => {
    setProjects((p) => [
      ...p,
      { id: Date.now(), title: "New Project", description: "", tags: [], featured: false },
    ])
    setTab("projects")
  }

  const deleteProject = async (index: number) => {
    const p = projects[index]
    if (p.id > 1e12) {
      setProjects((arr) => arr.filter((_, i) => i !== index))
      return
    }
    const res = await adminFetch(`/api/projects/${p.id}`, { method: "DELETE", headers: getAuthHeaders() })
    if (res.ok) {
      setProjects((arr) => arr.filter((_, i) => i !== index))
      noteSyncResponse(res)
    } else {
      await noteSaveError(res)
    }
  }

  const toggleFeatured = async (index: number) => {
    const p = { ...projects[index], featured: !projects[index].featured }
    setProjects((arr) => arr.map((x, i) => (i === index ? p : x)))
    if (p.id <= 1e12) await saveProject(p, index)
  }

  const saveSkill = async (sk: Skill, index: number) => {
    const isNew = !sk.originalName
    const res = await adminFetch(isNew ? "/api/skills" : `/api/skills/${encodeURIComponent(sk.originalName!)}`, {
      method: isNew ? "POST" : "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name: sk.name, level: sk.level, image: sk.image }),
    })
    if (res.ok) {
      const saved = await res.json()
      setSkills((arr) => arr.map((x, i) => (i === index ? { ...saved, originalName: saved.name } : x)))
      noteSyncResponse(res)
    } else {
      await noteSaveError(res)
    }
  }

  const uploadResume = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    await adminFetch("/api/resume", { method: "POST", headers: getAuthHeaders(), body: fd })
    const d = await fetch("/api/resume").then((r) => r.json())
    setResumeFiles(d.files || [])
    setUploading(false)
  }

  const saveSettings = async () => {
    if (!settings) return
    setSaving(true)
    const payload = {
      ...settings,
      social: {
        ...settings.social,
        email: settings.email.startsWith("mailto:") ? settings.social.email : `mailto:${settings.email}`,
      },
    }
    const res = await adminFetch("/api/settings", { method: "PUT", headers: getAuthHeaders(), body: JSON.stringify(payload) })
    if (res.ok) {
      setSettings(await res.json())
      noteSyncResponse(res)
    } else if (res.status === 401) {
      clearAdminSession()
      setAuthed(false)
      setSyncError("Session expired. Please sign in again.")
    } else {
      await noteSaveError(res)
    }
    setSaving(false)
  }

  const saveExperience = async (exp: Experience, index: number) => {
    setSaving(true)
    const isNew = exp.id.startsWith("new-")
    const res = await adminFetch(isNew ? "/api/experience" : `/api/experience/${exp.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(exp),
    })
    if (res.ok) {
      const saved = await res.json()
      setExperienceList((arr) => arr.map((x, i) => (i === index ? saved : x)))
      noteSyncResponse(res)
    } else {
      await noteSaveError(res)
    }
    setSaving(false)
  }

  const deleteExperience = async (index: number) => {
    const exp = experienceList[index]
    if (exp.id.startsWith("new-")) {
      setExperienceList((arr) => arr.filter((_, i) => i !== index))
      return
    }
    const res = await adminFetch(`/api/experience/${exp.id}`, { method: "DELETE", headers: getAuthHeaders() })
    if (res.ok) {
      setExperienceList((arr) => arr.filter((_, i) => i !== index))
      noteSyncResponse(res)
    } else {
      await noteSaveError(res)
    }
  }

  const addExperience = () => {
    setExperienceList((list) => [
      {
        id: `new-${Date.now()}`,
        role: "Full Stack Software Engineer",
        company: "Company Name",
        period: "2025 - Present",
        location: "Remote",
        description: "",
        achievements: [""],
        technologies: [],
      },
      ...list,
    ])
    setTab("experience")
  }

  const updateExp = (index: number, patch: Partial<Experience>) => {
    setExperienceList((arr) => arr.map((x, i) => (i === index ? { ...x, ...patch } : x)))
  }

  return (
    <AdminShell
      tab={tab}
      onTab={setTab}
      onLogout={logout}
      stats={{ projects: projects.length, skills: skills.length, resumes: resumeFiles.length, experience: experienceList.length }}
    >
      {(syncNotice || syncError || syncMode || syncPrUrl) && (
        <div className="mb-6 space-y-2">
          {syncMode && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs text-[var(--text-muted)] border border-white/[0.06] rounded-lg px-3 py-2 bg-[#111827]/40 flex-1 min-w-[200px]">
                {syncMode}
              </p>
              <button
                type="button"
                onClick={publishToGitHub}
                disabled={publishing}
                className="btn-secondary !text-xs !py-2 !px-3 shrink-0"
              >
                {publishing ? "Syncing…" : "Sync to GitHub now"}
              </button>
            </div>
          )}
          {!syncMode && (
            <p className="text-xs text-[var(--text-muted)] border border-white/[0.06] rounded-lg px-3 py-2 bg-[#111827]/40">
              Loading sync status…
            </p>
          )}
          {syncNotice && (
            <p className="text-sm text-[var(--accent-primary)] border border-[var(--accent-primary)]/25 rounded-lg px-3 py-2 bg-[var(--accent-primary)]/10">
              {syncNotice}
            </p>
          )}
          {syncPrUrl && (
            <a
              href={syncPrUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm text-[var(--text-primary)] underline underline-offset-4"
            >
              Open pull request to review and merge
            </a>
          )}
          {syncError && (
            <p className="text-sm text-red-400 border border-red-400/25 rounded-lg px-3 py-2 bg-red-400/10">
              {syncError}
            </p>
          )}
        </div>
      )}
      {tab === "overview" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
            <p className="text-sm text-[var(--text-secondary)]">Manage your portfolio content in one place.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Experience" value={experienceList.length} />
            <StatCard label="Projects" value={projects.length} sub={`${projects.filter((p) => p.featured).length} featured`} />
            <StatCard label="Skills" value={skills.length} />
            <StatCard label="Resumes" value={resumeFiles.length} sub={activeResume || "None active"} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button type="button" onClick={() => setTab("profile")} className="glass-card rounded-xl p-5 text-left hover:border-white/[0.12] transition-colors">
              <p className="font-medium">Edit profile</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Name, hero, contact, links</p>
            </button>
            <button type="button" onClick={addExperience} className="glass-card rounded-xl p-5 text-left hover:border-white/[0.12] transition-colors">
              <p className="font-medium">Add experience</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Company roles & achievements</p>
            </button>
            <button type="button" onClick={createProject} className="glass-card rounded-xl p-5 text-left hover:border-white/[0.12] transition-colors">
              <p className="font-medium">Add project</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Case studies & demos</p>
            </button>
            <button type="button" onClick={() => setTab("resume")} className="glass-card rounded-xl p-5 text-left hover:border-white/[0.12] transition-colors">
              <p className="font-medium">Upload resume</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Active CV PDF</p>
            </button>
          </div>
        </div>
      )}

      {tab === "projects" && (
        <Panel
          title="Projects"
          action={
            <button type="button" onClick={createProject} className="btn-primary !py-1.5 !px-3 !text-xs">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          }
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {projects.map((pr, i) => (
              <div key={pr.id} className="rounded-lg border border-white/[0.08] p-4 space-y-3 bg-[#111827]/50">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(i)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors",
                      pr.featured ? "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10" : "border-white/[0.08] text-[var(--text-secondary)]"
                    )}
                  >
                    <Star className={cn("h-3.5 w-3.5", pr.featured && "fill-current")} /> Featured
                  </button>
                  <button type="button" onClick={() => deleteProject(i)} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input className="input-premium" value={pr.title} onChange={(e) => setProjects((a) => a.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} placeholder="Title" />
                <textarea className="input-premium resize-none" rows={2} value={pr.description} onChange={(e) => setProjects((a) => a.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} placeholder="Description" />
                <input className="input-premium" value={(pr.tags || []).join(", ")} onChange={(e) => setProjects((a) => a.map((x, j) => (j === i ? { ...x, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } : x)))} placeholder="Tags (comma separated)" />
                <input className="input-premium" value={pr.image || ""} onChange={(e) => setProjects((a) => a.map((x, j) => (j === i ? { ...x, image: e.target.value } : x)))} placeholder="Image URL (Cloudinary, etc.)" />
                <div className="grid sm:grid-cols-2 gap-2">
                  <input className="input-premium" value={pr.link || ""} onChange={(e) => setProjects((a) => a.map((x, j) => (j === i ? { ...x, link: e.target.value } : x)))} placeholder="Live demo URL" />
                  <input className="input-premium" value={pr.github || ""} onChange={(e) => setProjects((a) => a.map((x, j) => (j === i ? { ...x, github: e.target.value } : x)))} placeholder="GitHub URL" />
                </div>
                <button type="button" disabled={saving} onClick={() => saveProject(pr, i)} className="btn-primary !text-xs">
                  {saving ? "Saving…" : "Save project"}
                </button>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {tab === "skills" && (
        <Panel
          title="Skills"
          action={
            <button type="button" onClick={() => setSkills((s) => [...s, { name: "New Skill", level: 80 }])} className="btn-primary !py-1.5 !px-3 !text-xs">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          }
        >
          <div className="space-y-3">
            {skills.map((sk, i) => (
              <div key={i} className="grid sm:grid-cols-4 gap-2 items-center">
                <input className="input-premium" value={sk.name} onChange={(e) => setSkills((a) => a.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                <input type="number" min={0} max={100} className="input-premium" value={sk.level} onChange={(e) => setSkills((a) => a.map((x, j) => (j === i ? { ...x, level: Number(e.target.value) } : x)))} />
                <input className="input-premium sm:col-span-1" value={sk.image || ""} onChange={(e) => setSkills((a) => a.map((x, j) => (j === i ? { ...x, image: e.target.value } : x)))} placeholder="Icon URL" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => saveSkill(sk, i)} className="btn-primary flex-1 !text-xs">Save</button>
                  <button
                    type="button"
                    onClick={() => (sk.originalName ? adminFetch(`/api/skills/${encodeURIComponent(sk.originalName)}`, { method: "DELETE", headers: getAuthHeaders() }).then(() => setSkills((a) => a.filter((_, j) => j !== i))) : setSkills((a) => a.filter((_, j) => j !== i)))}
                    className="p-2 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {tab === "resume" && (
        <Panel title="Resume / CV">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs text-[var(--text-secondary)] mb-2 block">Upload PDF</span>
              <input
                type="file"
                accept="application/pdf"
                className="text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--accent-primary)] file:text-[#111111] file:text-sm file:font-medium"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) uploadResume(f)
                }}
              />
            </label>
            {uploading && <p className="text-xs text-[var(--accent-primary)]">Uploading…</p>}
            <div className="space-y-2">
              {resumeFiles.map((name) => (
                <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-[#111827] border border-white/[0.06]">
                  <span className="flex-1 text-sm truncate">{name}</span>
                  {activeResume === name && <span className="text-[10px] text-[var(--accent-primary)] uppercase font-medium">Active</span>}
                  <button type="button" onClick={async () => { await adminFetch("/api/resume", { method: "PUT", headers: getAuthHeaders(), body: JSON.stringify({ active: name }) }); setActiveResume(name) }} className="btn-secondary !text-xs !py-1.5">Set active</button>
                  <button type="button" onClick={async () => { await adminFetch(`/api/resume?name=${encodeURIComponent(name)}`, { method: "DELETE", headers: getAuthHeaders() }); loadAll() }} className="text-[var(--accent-primary)] text-xs">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      )}

      {tab === "profile" && settings && (
        <Panel title="Profile, hero & contact" action={<button type="button" disabled={saving} onClick={saveSettings} className="btn-primary !py-1.5 !px-3 !text-xs">{saving ? "Saving…" : "Save & publish"}</button>}>
          <p className="text-xs text-[var(--text-secondary)] mb-6">Changes appear on the live site immediately after saving.</p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Full name</label>
              <input className="input-premium" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Job title</label>
              <input className="input-premium" value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Hero tagline (under name)</label>
              <input className="input-premium" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Hero headline (main paragraph)</label>
              <textarea className="input-premium resize-none" rows={2} value={settings.headline} onChange={(e) => setSettings({ ...settings, headline: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">About summary</label>
              <textarea className="input-premium resize-none" rows={3} value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Contact email</label>
              <input
                className="input-premium"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
              <p className="text-[10px] text-[var(--text-muted)] mt-1">Public contact only. OTP uses alilogics007@gmail.com.</p>
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Phone</label>
              <input className="input-premium" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Location</label>
              <input className="input-premium" value={settings.location} onChange={(e) => setSettings({ ...settings, location: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">GitHub username</label>
              <input
                className="input-premium"
                value={settings.githubUsername}
                onChange={(e) => {
                  const u = e.target.value.replace(/^@/, "").trim()
                  setSettings({
                    ...settings,
                    githubUsername: u,
                    social: { ...settings.social, github: `https://github.com/${u}` },
                  })
                }}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Education</label>
              <input className="input-premium" value={settings.education} onChange={(e) => setSettings({ ...settings, education: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">GitHub profile URL</label>
              <input className="input-premium" value={settings.social.github} onChange={(e) => setSettings({ ...settings, social: { ...settings.social, github: e.target.value } })} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">LinkedIn URL</label>
              <input className="input-premium" value={settings.social.linkedin} onChange={(e) => setSettings({ ...settings, social: { ...settings.social, linkedin: e.target.value } })} />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" id="avail" checked={settings.available} onChange={(e) => setSettings({ ...settings, available: e.target.checked })} className="rounded" />
              <label htmlFor="avail" className="text-sm">Available for work (shows on site & contact)</label>
            </div>
          </div>
        </Panel>
      )}

      {tab === "experience" && (
        <Panel
          title="Work experience"
          action={
            <button type="button" onClick={addExperience} className="btn-primary !py-1.5 !px-3 !text-xs">
              <Plus className="h-3.5 w-3.5" /> Add company
            </button>
          }
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {experienceList.map((exp, i) => (
              <div key={exp.id} className="rounded-lg border border-white/[0.08] p-4 space-y-3 bg-[#111827]/50">
                <div className="flex justify-end">
                  <button type="button" onClick={() => deleteExperience(i)} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <input className="input-premium" value={exp.role} onChange={(e) => updateExp(i, { role: e.target.value })} placeholder="Role" />
                  <input className="input-premium" value={exp.company} onChange={(e) => updateExp(i, { company: e.target.value })} placeholder="Company" />
                  <input className="input-premium" value={exp.period} onChange={(e) => updateExp(i, { period: e.target.value })} placeholder="Period" />
                  <input className="input-premium" value={exp.location} onChange={(e) => updateExp(i, { location: e.target.value })} placeholder="Location" />
                </div>
                <textarea className="input-premium resize-none" rows={2} value={exp.description} onChange={(e) => updateExp(i, { description: e.target.value })} placeholder="Description" />
                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1 block">Achievements (one per line)</label>
                  <textarea
                    className="input-premium resize-none font-mono text-xs"
                    rows={4}
                    value={exp.achievements.join("\n")}
                    onChange={(e) => updateExp(i, { achievements: e.target.value.split("\n").filter(Boolean) })}
                  />
                </div>
                <input
                  className="input-premium"
                  value={exp.technologies.join(", ")}
                  onChange={(e) => updateExp(i, { technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  placeholder="Technologies (comma separated)"
                />
                <button type="button" disabled={saving} onClick={() => saveExperience(exp, i)} className="btn-primary !text-xs">
                  {saving ? "Saving…" : "Save experience"}
                </button>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </AdminShell>
  )
}
