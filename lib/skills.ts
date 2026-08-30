import "server-only"

import { getStoreJson } from "./store"
import skillsData from "./skill.json"

export type Skill = { name: string; level: number; image?: string }

export async function getSkills(): Promise<Skill[]> {
  const kv = await getStoreJson("skills")
  if (Array.isArray(kv) && kv.length > 0) return kv as Skill[]
  return skillsData as Skill[]
}
