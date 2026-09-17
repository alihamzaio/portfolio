"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { DEFAULT_BLOG_COVER, isDefaultBlogCover } from "@/lib/blog-cover"

export type CoverMode = "default" | "url" | "upload"

type Props = {
  coverImage: string
  onCoverChange: (url: string) => void
  onUpload: (file: File) => Promise<void>
  uploading: boolean
  fieldClass: string
}

function looksLikeRiskyHotlink(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase()
    return (
      host.includes("gstatic.com") ||
      host.includes("google.com") ||
      host.includes("googleusercontent.com") ||
      host.includes("pinimg.com")
    )
  } catch {
    return false
  }
}

export function AdminBlogCoverField({
  coverImage,
  onCoverChange,
  onUpload,
  uploading,
  fieldClass,
}: Props) {
  const initialMode: CoverMode = !coverImage || isDefaultBlogCover(coverImage)
    ? "default"
    : coverImage.startsWith("http")
      ? "url"
      : "upload"

  const [mode, setMode] = useState<CoverMode>(initialMode)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [urlDraft, setUrlDraft] = useState(
    coverImage.startsWith("http") ? coverImage : ""
  )
  const [previewFailed, setPreviewFailed] = useState(false)

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  useEffect(() => {
    setPreviewFailed(false)
  }, [coverImage, localPreview, mode])

  // Keep mode in sync only when switching posts (slug-driven), not on every cover keystroke
  useEffect(() => {
    if (!coverImage || isDefaultBlogCover(coverImage)) setMode("default")
    else if (coverImage.startsWith("http")) {
      setMode("url")
      setUrlDraft(coverImage)
    } else setMode("upload")
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: init from cover when editor opens
  }, [])

  const selectMode = (next: CoverMode) => {
    setMode(next)
    setPreviewFailed(false)
    if (next === "default") {
      if (localPreview) {
        URL.revokeObjectURL(localPreview)
        setLocalPreview(null)
      }
      onCoverChange(DEFAULT_BLOG_COVER)
    }
  }

  const previewSrc =
    mode === "default"
      ? DEFAULT_BLOG_COVER
      : localPreview || (coverImage && !isDefaultBlogCover(coverImage) ? coverImage : DEFAULT_BLOG_COVER)

  const showBroken = previewFailed && mode !== "default"
  const riskyUrl = mode === "url" && urlDraft.trim().startsWith("http") && looksLikeRiskyHotlink(urlDraft.trim())

  return (
    <div className="sm:col-span-2 space-y-3">
      <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
        Cover image
      </span>

      <div className="inline-flex rounded-lg border border-white/[0.08] p-0.5 bg-white/[0.02]">
        {(
          [
            { id: "default", label: "Brand default" },
            { id: "url", label: "Live URL" },
            { id: "upload", label: "Upload" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => selectMode(tab.id)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              mode === tab.id
                ? "bg-[var(--accent-primary)]/15 text-[var(--text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === "default" && (
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
          Uses the Ali Hamza brand placeholder. Fine for drafts and posts without a custom image.
        </p>
      )}

      {mode === "url" && (
        <div className="space-y-2">
          <input
            className={fieldClass}
            value={urlDraft}
            onChange={(e) => {
              const v = e.target.value
              setUrlDraft(v)
              setPreviewFailed(false)
              onCoverChange(v.trim() || DEFAULT_BLOG_COVER)
              if (localPreview) {
                URL.revokeObjectURL(localPreview)
                setLocalPreview(null)
              }
            }}
            placeholder="https://images.pexels.com/photos/…/….jpeg"
          />
          <p className="text-[11px] text-amber-200/80 leading-relaxed">
            Paste a direct image link (ends in .jpg / .png / .webp), copyright-free only —
            Pexels, Unsplash, or your own CDN. Google Images thumbnails often break; open the
            photo → right‑click → Copy image address.
          </p>
          {riskyUrl && (
            <p className="text-[11px] text-red-300/90 leading-relaxed">
              This looks like a Google thumbnail URL. Prefer a direct Pexels/Unsplash image link
              or use Upload instead.
            </p>
          )}
        </div>
      )}

      {mode === "upload" && (
        <div className="space-y-2">
          <label className="btn-secondary !text-xs !py-2 !px-3 cursor-pointer inline-flex items-center gap-1.5">
            {uploading ? "Uploading…" : "Choose image from device"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                if (localPreview) URL.revokeObjectURL(localPreview)
                setLocalPreview(URL.createObjectURL(f))
                setPreviewFailed(false)
                void onUpload(f)
                e.target.value = ""
              }}
            />
          </label>
          <p className="text-[11px] text-[var(--text-muted)]">
            JPG / PNG / WebP under 4.5 MB. Saved to <span className="font-mono">/blog/covers</span> via
            PR. Preview shows your file immediately; live site updates after deploy.
          </p>
          {coverImage && !isDefaultBlogCover(coverImage) && !localPreview && (
            <p className="text-[11px] text-[var(--text-muted)] font-mono truncate">{coverImage}</p>
          )}
        </div>
      )}

      <div className="relative h-36 w-full max-w-md overflow-hidden rounded-xl border border-white/[0.08] bg-neutral-950">
        {showBroken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={DEFAULT_BLOG_COVER}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setPreviewFailed(true)}
          />
        )}
        <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/60 text-white/80">
          {showBroken
            ? "Fallback (image failed)"
            : mode === "default"
              ? "Brand default"
              : mode === "url"
                ? "Live URL"
                : localPreview
                  ? "Local preview"
                  : "Uploaded"}
        </span>
      </div>
    </div>
  )
}
