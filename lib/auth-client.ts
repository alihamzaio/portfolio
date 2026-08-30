const SESSION_KEY = "admin_session"
export const SESSION_TTL_DAYS = 7

export interface AdminSession {
  token: string
  expiresAt: number
  email: string
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as AdminSession
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function setAdminSession(session: AdminSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearAdminSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem("admin_token")
}

export function getAuthHeaders(): Record<string, string> {
  const session = getAdminSession()
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (session?.token) headers.Authorization = `Bearer ${session.token}`
  return headers
}

export function adminFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const session = getAdminSession()
  const headers = new Headers(init.headers)
  if (session?.token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${session.token}`)
  }
  return fetch(input, {
    ...init,
    credentials: "include",
    cache: init.cache ?? "no-store",
    headers,
  })
}
