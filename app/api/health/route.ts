import { NextResponse } from "next/server"
import { getResendConfigStatus } from "@/lib/env-server"

export const dynamic = "force-dynamic"

export async function GET() {
  const resend = getResendConfigStatus()
  const kv =
    (!!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN) ||
    (!!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN)

  return NextResponse.json(
    {
      ok: true,
      status: "live",
      ts: new Date().toISOString(),
      checks: {
        resendKey: resend.hasApiKey,
        kv,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  )
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  })
}
