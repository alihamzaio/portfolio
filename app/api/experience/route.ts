import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { getExperiences } from "@/lib/content"
import { getStoreJson, setStoreJson } from "@/lib/store"
import { jsonWithStoreSync } from "@/lib/store-response"
import type { Experience } from "@/lib/types"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function GET() {
  const list = await getExperiences()
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "") || null
  if (!(await requireAdminAuth(auth))) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const { role, company, period, location, description, achievements, technologies, id } = body || {}
  if (!role || !company) return new NextResponse("Role and company required", { status: 400 })

  const list = await getExperiences()
  const newEntry: Experience = {
    id: id || slugify(company) || `exp-${Date.now()}`,
    role,
    company,
    period: period || "",
    location: location || "",
    description: description || "",
    achievements: Array.isArray(achievements) ? achievements : [],
    technologies: Array.isArray(technologies) ? technologies : [],
  }

  list.unshift(newEntry)
  try {
    const writeResult = await setStoreJson("experience", list)
    return jsonWithStoreSync(newEntry, writeResult, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
