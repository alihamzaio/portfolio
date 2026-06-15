"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { getIntroDelayMs } from "@/lib/motion-prefs"

interface HeroNameRevealProps {
  lines: string[]
  className?: string
  lineClassName?: string
}

export function HeroNameReveal({ lines, className, lineClassName }: HeroNameRevealProps) {
  const reduceMotion = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      setReady(true)
      return
    }
    const t = window.setTimeout(() => setReady(true), getIntroDelayMs())
    return () => window.clearTimeout(t)
  }, [reduceMotion])

  return (
    <h1 className={className}>
      {lines.map((line, li) => (
        <span key={li} className={`block ${lineClassName ?? ""}`}>
          {line.split("").map((char, ci) => {
            const globalIndex = lines.slice(0, li).join("").length + ci
            return (
              <span
                key={`${li}-${ci}`}
                className="hero-letter inline-block"
                style={
                  ready
                    ? {
                        filter: "blur(0)",
                        opacity: 1,
                        transform: "translateY(0)",
                        transition: reduceMotion
                          ? "none"
                          : "filter 0.5s ease, opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                        transitionDelay: reduceMotion ? "0ms" : `${globalIndex * 55}ms`,
                      }
                    : {
                        filter: "blur(16px)",
                        opacity: 0,
                        transform: "translateY(20px)",
                      }
                }
              >
                {char === " " ? "\u00A0" : char}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}
