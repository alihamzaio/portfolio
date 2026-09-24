export type StoreKey =
  | "skills"
  | "projects"
  | "settings"
  | "experience"
  | "affiliates"
  | "products"
  | "paymentSettings"
  | "blogAgent"

export const STORE_FILE_PATHS: Record<StoreKey, string> = {
  skills: "lib/skill.json",
  projects: "lib/projects.json",
  experience: "lib/experience.json",
  settings: "lib/settings.json",
  affiliates: "content/affiliates.json",
  products: "content/products.json",
  paymentSettings: "content/payment-settings.json",
  blogAgent: "content/blog-agent.json",
}

export const COMMIT_LABELS: Record<StoreKey, string> = {
  skills: "Update skills from admin panel.",
  projects: "Update projects from admin panel.",
  experience: "Update experience from admin panel.",
  settings: "Update site settings from admin panel.",
  affiliates: "Update affiliate links from admin panel.",
  products: "Update digital products from admin panel.",
  paymentSettings: "Update direct payment settings from admin panel.",
  blogAgent: "Update blog agent state from admin panel.",
}

export const SYNC_DIRTY_KEY = "portfolio:sync-dirty"

export function listStoreKeys(): StoreKey[] {
  return [
    "skills",
    "projects",
    "settings",
    "experience",
    "affiliates",
    "products",
    "paymentSettings",
    "blogAgent",
  ]
}
