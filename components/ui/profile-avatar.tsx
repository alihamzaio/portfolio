"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProfileAvatarProps {
  src?: string
  name?: string
  size?: number
  className?: string
  showRing?: boolean
}

export function ProfileAvatar({
  src = "/profile.jpg",
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {showRing && (
        <>
          <div
            className="absolute -inset-3 rounded-full opacity-60 blur-xl animate-pulse"
            style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}
            aria-hidden
          />
          <div
            className="absolute -inset-1 rounded-full p-[2px]"
            style={{ background: "linear-gradient(135deg, #7DD3FC, #3B82F6, #06B6D4)" }}
            aria-hidden
          >
            <div className="w-full h-full rounded-full bg-[#0a0f1a]" />
          </div>
        </>
      )}
      <div
        className="relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.25)]"
        style={{
          background: "linear-gradient(160deg, #1e3a8a 0%, #1e40af 40%, #0c4a6e 100%)",
        }}
      >
        {!imgError ? (
          <Image
            src={src}
            alt={name}
            fill
            sizes={`${size}px`}
            className="object-cover"
            priority
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-bold text-white/90"
              style={{ fontSize: size * 0.28 }}
            >
              {initials}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
