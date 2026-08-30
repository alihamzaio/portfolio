import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { getExperiences } from "@/lib/content"
import { setStoreJson } from "@/lib/store"
import { jsonWithStoreSync } from "@/lib/store-response"

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const list = await getExperiences()
  const item = list.find((e) => e.id === id)
  if (!item) return new NextResponse("Not found", { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminAuth(req))) return new NextResponse("Unauthorized", { status: 401 })

  const { id } = await ctx.params
  const body = await req.json()
  const list = await getExperiences()
  const idx = list.findIndex((e) => e.id === id)
  if (idx === -1) return new NextResponse("Not found", { status: 404 })

  const updated = { ...list[idx], ...body, id }
  list[idx] = updated
  try {
    const writeResult = await setStoreJson("experience", list)
    return jsonWithStoreSync(updated, writeResult)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminAuth(req))) return new NextResponse("Unauthorized", { status: 401 })

  const { id } = await ctx.params
  const list = await getExperiences()
  const next = list.filter((e) => e.id !== id)
  if (next.length === list.length) return new NextResponse("Not found", { status: 404 })
  try {
    const writeResult = await setStoreJson("experience", next)
    return jsonWithStoreSync({ ok: true }, writeResult)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
