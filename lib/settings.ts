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
  social: { ...siteConfig.social },
}

export function mergeSettings(partial: Partial<SiteSettings> | null): SiteSettings {
  if (!partial) return defaultSettings
  return {
    ...defaultSettings,
    ...partial,
    social: { ...defaultSettings.social, ...partial.social },
  }
}
