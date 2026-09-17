"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { DEFAULT_BLOG_COVER, resolveBlogCover } from "@/lib/blog-cover"

type Props = {
  src?: string | null
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

/** Cover image with Ali Hamza brand placeholder when missing or broken. */
export function BlogCoverImage({ src, alt, className, priority, sizes }: Props) {
  const resolved = resolveBlogCover(src)
  const [failed, setFailed] = useState(false)
  const show = failed ? DEFAULT_BLOG_COVER : resolved
  const isRemote = show.startsWith("http")
  const isKnownCdn =
    isRemote &&
    /res\.cloudinary\.com|images\.pexels\.com|images\.unsplash\.com/i.test(show)

  return (
    <Image
      src={show}
      alt={alt || "Ali Hamza blog cover"}
      fill
      sizes={sizes || "(max-width: 768px) 100vw, 800px"}
      className={cn("object-cover", className)}
      priority={priority}
      // Optimize known CDNs via next/image; keep unknown remotes + SVG unoptimized
      unoptimized={!isKnownCdn && (isRemote || show.endsWith(".svg"))}
      referrerPolicy="no-referrer"
      onError={() => {
        if (show !== DEFAULT_BLOG_COVER) setFailed(true)
      }}
    />
  )
}
