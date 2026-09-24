"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AdminShell, type AdminTab } from "@/components/admin/admin-shell"
import { AdminLogin } from "@/components/admin/admin-login"
import {
  adminFetch,
  clearAdminSession,
  getAdminSession,
  getAuthHeaders,
  setAdminSession,
} from "@/lib/auth-client"

export type AdminWorkspaceHandlers = {
  onNotice: (message: string, prUrl?: string | null) => void
  onError: (message: string) => void
}

function adminPathForTab(tab: AdminTab): string {
  if (tab === "blog") return "/admin/blog"
  if (tab === "overview") return "/admin"
  return `/admin?tab=${tab}`
}

type Props = {
  tab: AdminTab
  pageTitle?: string
  children: (handlers: AdminWorkspaceHandlers) => ReactNode
}

export function AdminWorkspace({ tab, pageTitle, children }: Props) {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [linkUrl, setLinkUrl] = useState<string | null>(null)
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    resumes: 0,
    experience: 0,
    blogPublished: 0,
    blogDrafts: 0,
  })

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
      } else {
        clearAdminSession()
        setAuthed(false)
      }
    } catch {
      if (cached && Date.now() < cached.expiresAt) setAuthed(true)
      else {
        clearAdminSession()
        setAuthed(false)
      }
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    void verifyStoredSession()
  }, [verifyStoredSession])

  useEffect(() => {
    if (!authed) return
    adminFetch("/api/admin/overview", { headers: getAuthHeaders() })
      .then((r) => r.json())
      .then((d) => {
        if (!d?.counts) return
        setStats({
          projects: Number(d.counts.projects) || 0,
          skills: Number(d.counts.skills) || 0,
          resumes: Number(d.counts.resumes) || 0,
          experience: Number(d.counts.experience) || 0,
          blogPublished: Number(d.counts.blogPublished) || 0,
          blogDrafts: Number(d.counts.blogDrafts) || 0,
        })
      })
      .catch(() => {})
  }, [authed])

  const logout = async () => {
    const session = getAdminSession()
    await fetch("/api/auth/session", {
      method: "DELETE",
      credentials: "include",
      headers: session ? { Authorization: `Bearer ${session.token}` } : {},
    })
    clearAdminSession()
    setAuthed(false)
    router.push("/admin")
  }

  const onNotice = useCallback((message: string, prUrl?: string | null) => {
    setNotice(message)
    setError(null)
    setLinkUrl(prUrl || null)
  }, [])

  const onError = useCallback((message: string) => {
    setError(message)
    setNotice(null)
    setLinkUrl(null)
  }, [])

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--text-secondary)]">Checking session…</p>
      </main>
    )
  }

  if (!authed) {
    return (
      <AdminLogin
        onSuccess={() => {
          setAuthed(true)
          setChecking(false)
        }}
      />
    )
  }

  return (
    <AdminShell
      tab={tab}
      pageTitle={pageTitle}
      onTab={(next) => router.push(adminPathForTab(next))}
      onLogout={() => void logout()}
      stats={stats}
    >
      {(notice || error || linkUrl) && (
        <div className="mb-6 space-y-2">
          {notice && (
            <p className="text-sm text-[var(--accent-primary)] border border-[var(--accent-primary)]/25 rounded-lg px-3 py-2 bg-[var(--accent-primary)]/10">
              {notice}
            </p>
          )}
          {linkUrl && (
            <a
              href={linkUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm text-[var(--text-primary)] underline underline-offset-4"
            >
              Open on GitHub
            </a>
          )}
          {error && (
            <p className="text-sm text-red-400 border border-red-400/25 rounded-lg px-3 py-2 bg-red-400/10">
              {error}
            </p>
          )}
        </div>
      )}
      {children({ onNotice, onError })}
    </AdminShell>
  )
}
