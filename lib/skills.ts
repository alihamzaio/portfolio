import { getStoreJson } from "./store"

export type Skill = { name: string; level: number; image?: string }

import skillsData from "./skill.json"

export async function getSkills(): Promise<Skill[]> {
  const kv = await getStoreJson("skills")
  if (Array.isArray(kv) && kv.length > 0) return kv as Skill[]
  return skillsData as Skill[]
}
