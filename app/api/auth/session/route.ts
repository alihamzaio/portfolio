import { NextRequest, NextResponse } from "next/server"
import { revokeSession, verifySession } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || null
  const valid = await verifySession(token)
  return NextResponse.json({ valid })
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || null
  if (token) await revokeSession(token)
  return NextResponse.json({ ok: true })
}
