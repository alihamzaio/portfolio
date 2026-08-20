import { siteConfig } from "./site"

export interface SiteSettings {
  name: string
  title: string
  tagline: string
  headline: string
  description: string
  email: string
  phone: string
  location: string
  education: string
  available: boolean
  githubUsername: string
  social: {
    github: string
    linkedin: string
    email: string
  }
}

export const defaultSettings: SiteSettings = {
  name: siteConfig.name,
  title: siteConfig.title,
  tagline: siteConfig.tagline,
  headline: siteConfig.headline,
  description: siteConfig.description,
  email: siteConfig.email,
  phone: siteConfig.phone,
  location: siteConfig.location,
  education: siteConfig.education,
  available: siteConfig.available,
  githubUsername: siteConfig.githubUsername,
  social: {
    github: siteConfig.social.github,
    linkedin: siteConfig.social.linkedin,
    email: siteConfig.social.email,
  },
}

function resolveOffsite(url: string | undefined, fallback: string, localPaths: string[]): string {
  const value = (url || "").trim()
  if (!value || localPaths.includes(value) || localPaths.some((p) => value.endsWith(p))) {
    return fallback
  }
  return value
}

export function mergeSettings(partial: Partial<SiteSettings> | null): SiteSettings {
  if (!partial) return defaultSettings
  const social = { ...defaultSettings.social, ...partial.social }
  return {
    ...defaultSettings,
    ...partial,
    social: {
      ...social,
      github: resolveOffsite(social.github, siteConfig.social.github, ["/github"]),
      linkedin: resolveOffsite(social.linkedin, siteConfig.social.linkedin, ["/linkedin"]),
    },
  }
}
