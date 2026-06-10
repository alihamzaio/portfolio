"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProfileAvatarProps {
  /** Pass a real headshot URL. Omit or pass null to show initials. */
  src?: string | null
  name?: string
  size?: number
  className?: string
  showRing?: boolean
}

export function ProfileAvatar({
  src = null,
  name = "Ali Hamza",
  size = 200,
  className,
  showRing = true,
}: ProfileAvatarProps) {
  const [imgError, setImgError] = useState(false)
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const hasPhoto = Boolean(src) && !imgError
  const compact = size <= 96

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {showRing && (
        <>
          <div
            className={cn(
              "absolute rounded-full opacity-50 blur-xl",
              compact ? "-inset-1.5" : "-inset-3"
            )}
            style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}
            aria-hidden
          />
          <div
            className={cn(
              "absolute rounded-full p-[2px]",
              compact ? "-inset-0.5" : "-inset-1"
            )}
            style={{ background: "linear-gradient(135deg, #7DD3FC, #3B82F6, #06B6D4)" }}
            aria-hidden
          >
            <div className="w-full h-full rounded-full bg-[#0a0f1a]" />
          </div>
        </>
      )}
      <div
        className="relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-[0_0_24px_rgba(59,130,246,0.2)]"
        style={{
          background: "linear-gradient(160deg, #1e3a8a 0%, #1e40af 45%, #0c4a6e 100%)",
        }}
      >
        {hasPhoto ? (
          <Image
            src={src!}
            alt={name}
            fill
            sizes={`${size}px`}
            className="object-cover object-center"
            priority={size >= 120}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-bold text-white/95 tracking-tight select-none"
              style={{ fontSize: size * (compact ? 0.32 : 0.28) }}
            >
              {initials}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
