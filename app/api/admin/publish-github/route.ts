import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { runBatchGitHubSync } from "@/lib/github-batch-sync"

export async function POST(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await runBatchGitHubSync()
  return NextResponse.json(result)
}
