"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TypingTextProps {
  words: string[]
  className?: string
  speed?: number
}

export function TypingText({ words, className, speed = 80 }: TypingTextProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex] ?? ""
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (displayed.length < current.length) {
            setDisplayed(current.slice(0, displayed.length + 1))
          } else {
            setTimeout(() => setDeleting(true), 1800)
          }
        } else {
          if (displayed.length > 0) {
            setDisplayed(displayed.slice(0, -1))
          } else {
            setDeleting(false)
            setWordIndex((i) => (i + 1) % words.length)
          }
        }
      },
      deleting ? speed / 2 : speed
    )
    return () => clearTimeout(timeout)
  }, [displayed, deleting, wordIndex, words, speed])

  return (
    <span className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="inline-block w-[3px] h-[1em] bg-[#60A5FA] ml-0.5 align-middle"
      />
    </span>
  )
}
