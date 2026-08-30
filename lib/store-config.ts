export type StoreKey = "skills" | "projects" | "settings" | "experience"

export const STORE_FILE_PATHS: Record<StoreKey, string> = {
  skills: "lib/skill.json",
  projects: "lib/projects.json",
  experience: "lib/experience.json",
  settings: "lib/settings.json",
}

export const COMMIT_LABELS: Record<StoreKey, string> = {
  skills: "Update skills from admin panel.",
  projects: "Update projects from admin panel.",
  experience: "Update experience from admin panel.",
  settings: "Update site settings from admin panel.",
}

export const SYNC_DIRTY_KEY = "portfolio:sync-dirty"

export function listStoreKeys(): StoreKey[] {
  return ["skills", "projects", "settings", "experience"]
}
