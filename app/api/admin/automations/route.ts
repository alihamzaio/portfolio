import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import {
  getLastUploadRun,
  getUploadHistory,
  listRecentWorkflowRuns,
  PLATFORM_LINKS,
  ytAutoRepo,
} from "@/lib/yt-auto-ops"

export const runtime = "nodejs"

/** Admin: DevBuildDaily upload tracker (last run + history + Actions). */
export async function GET(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const [lastRun, history, runs] = await Promise.all([
    getLastUploadRun(),
    getUploadHistory(),
    listRecentWorkflowRuns(15),
  ])
  return NextResponse.json({
    repo: ytAutoRepo(),
    lastRun,
    history: history.slice(0, 30),
    runs,
    platforms: PLATFORM_LINKS,
  })
}
