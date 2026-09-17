import { NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin"
import { uploadBlogCoverViaPr } from "@/lib/blog-github"
import { slugifyTitle } from "@/lib/blog"

export const runtime = "nodejs"

const MAX_BYTES = 4.5 * 1024 * 1024 // stay under typical serverless body limits

function extFromTypeOrName(type: string, name: string): string {
  const t = type.toLowerCase()
  if (t === "image/png" || name.endsWith(".png")) return "png"
  if (t === "image/webp" || name.endsWith(".webp")) return "webp"
  if (t === "image/gif" || name.endsWith(".gif")) return "gif"
  return "jpg"
}

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

  const raw = form.get("file")
  // On Vercel/Node, uploads may be File or Blob — do not require instanceof File
  if (!raw || typeof raw === "string") {
    return NextResponse.json({ error: "file is required" }, { status: 400 })
  }

  const blob = raw as Blob
  if (blob.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 4.5 MB" }, { status: 400 })
  }

  const type = (blob.type || "").toLowerCase()
  const originalName = "name" in raw && typeof (raw as File).name === "string" ? (raw as File).name : "cover.jpg"
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", ""]
  if (type && !allowed.includes(type) && !/\.(jpe?g|png|webp|gif)$/i.test(originalName)) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, or GIF allowed" }, { status: 400 })
  }

  const ext = extFromTypeOrName(type, originalName)
  const hint = String(form.get("name") || form.get("slug") || originalName.replace(/\.[^.]+$/, "") || "cover")
  const base = slugifyTitle(hint) || `cover-${Date.now().toString(36)}`
  const fileName = `${base}.${ext}`

  const buf = Buffer.from(await blob.arrayBuffer())
  if (buf.length < 32) {
    return NextResponse.json({ error: "File looks empty" }, { status: 400 })
  }
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
