"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { siteConfig } from "@/lib/site"
import { defaultSettings, mergeSettings, type SiteSettings } from "@/lib/settings"
import { experiences as staticExperiences } from "@/lib/experience"
import type { Experience } from "@/lib/types"

interface SiteContentContextValue {
  settings: SiteSettings
  experiences: Experience[]
  loading: boolean
  refresh: () => Promise<void>
}

const SiteContentContext = createContext<SiteContentContextValue>({
  settings: defaultSettings,
  experiences: staticExperiences,
  loading: true,
  refresh: async () => {},
})

export function useSiteContent() {
  return useContext(SiteContentContext)
}

/** Profile fields merged with static fallbacks for URLs and resume */
export function usePublicProfile() {
  const { settings, loading } = useSiteContent()
  return {
    loading,
    name: settings.name,
    title: settings.title,
    tagline: settings.tagline,
    headline: settings.headline,
    description: settings.description,
    email: settings.email,
    phone: settings.phone,
    location: settings.location,
    education: settings.education,
    available: settings.available,
    githubUsername: settings.githubUsername,
    initials: settings.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    resumeUrl: siteConfig.resumeUrl,
    url: siteConfig.url,
    social: settings.social,
  }
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [experiences, setExperiences] = useState<Experience[]>(staticExperiences)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const [s, e] = await Promise.all([
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/experience").then((r) => r.json()),
      ])
      if (s?.name) setSettings(mergeSettings(s))
      if (Array.isArray(e) && e.length > 0) setExperiences(e)
    } catch {
      /* keep defaults */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <SiteContentContext.Provider value={{ settings, experiences, loading, refresh }}>
      {children}
    </SiteContentContext.Provider>
  )
}
