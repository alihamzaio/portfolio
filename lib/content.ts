import { readJsonFile } from "./admin"
import { defaultSettings, mergeSettings, type SiteSettings } from "./settings"
import "server-only"

import { getStoreJson } from "./store"
import type { Experience } from "./types"
import { experiences as staticExperiences } from "./experience"

const SETTINGS_PATH = "lib/settings.json"
const EXPERIENCE_PATH = "lib/experience.json"

export async function getSiteSettings(): Promise<SiteSettings> {
  const kv = await getStoreJson("settings")
  if (kv && typeof kv === "object") return mergeSettings(kv as Partial<SiteSettings>)
  try {
    const file = await readJsonFile<SiteSettings>(SETTINGS_PATH)
    return mergeSettings(file)
  } catch {
    return defaultSettings
  }
}

export async function getExperiences(): Promise<Experience[]> {
  const kv = await getStoreJson("experience")
  if (Array.isArray(kv) && kv.length > 0) return kv as Experience[]
  try {
    return await readJsonFile<Experience[]>(EXPERIENCE_PATH)
  } catch {
    return staticExperiences
  }
}
