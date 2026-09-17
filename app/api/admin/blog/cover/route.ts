import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { uploadBlogCoverViaPr } from "@/lib/blog-github"
import { slugifyTitle } from "@/lib/blog"

export const runtime = "nodejs"

const MAX_BYTES = 4.5 * 1024 * 1024 // stay under typical serverless body limits

/**
 * POST /api/admin/blog/cover
 * multipart form: file (image), optional name/slug
 * Uploads to public/blog/covers/ via GitHub PR + merge.
 */
export async function POST(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 })
  }

  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 4.5 MB" }, { status: 400 })
  }

  const type = (file.type || "").toLowerCase()
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (type && !allowed.includes(type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, or GIF allowed" }, { status: 400 })
  }

  const ext =
    type === "image/png"
      ? "png"
      : type === "image/webp"
        ? "webp"
        : type === "image/gif"
          ? "gif"
          : "jpg"

  const hint = String(form.get("name") || form.get("slug") || file.name.replace(/\.[^.]+$/, "") || "cover")
  const base = slugifyTitle(hint) || `cover-${Date.now().toString(36)}`
  const fileName = `${base}.${ext}`

  const buf = Buffer.from(await file.arrayBuffer())
  const contentBase64 = buf.toString("base64")

  try {
    const result = await uploadBlogCoverViaPr({
      fileName,
      contentBase64,
      autoMerge: true,
    })
    return NextResponse.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
