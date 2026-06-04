import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { getExperiences } from "@/lib/content"
import { setStoreJson } from "@/lib/store"

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const list = await getExperiences()
  const item = list.find((e) => e.id === id)
  if (!item) return new NextResponse("Not found", { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "") || null
  if (!(await requireAdminAuth(auth))) return new NextResponse("Unauthorized", { status: 401 })

  const { id } = await ctx.params
  const body = await req.json()
  const list = await getExperiences()
  const idx = list.findIndex((e) => e.id === id)
  if (idx === -1) return new NextResponse("Not found", { status: 404 })

  const updated = { ...list[idx], ...body, id }
  list[idx] = updated
  await setStoreJson("experience", list)
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "") || null
  if (!(await requireAdminAuth(auth))) return new NextResponse("Unauthorized", { status: 401 })

  const { id } = await ctx.params
  const list = await getExperiences()
  const next = list.filter((e) => e.id !== id)
  if (next.length === list.length) return new NextResponse("Not found", { status: 404 })
  await setStoreJson("experience", next)
  return NextResponse.json({ ok: true })
}
