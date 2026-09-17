"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

/** Cover image with gradient fallback if remote host fails. */
export function BlogCoverImage({ src, alt, className, priority, sizes }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-amber-500/25 via-neutral-900 to-neutral-950",
          className
        )}
        aria-hidden
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes || "(max-width: 768px) 100vw, 800px"}
      className={cn("object-cover", className)}
      priority={priority}
      unoptimized={src.startsWith("http")}
      onError={() => setFailed(true)}
    />
  )
}
