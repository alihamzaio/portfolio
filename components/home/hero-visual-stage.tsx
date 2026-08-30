"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { engineeringMetrics } from "@/lib/site"
import { HeroStatCounter } from "@/components/home/hero-stat-counter"
import { prefersReducedMotion } from "@/lib/motion-prefs"

const HeroDevScene = dynamic(
  () => import("@/components/effects/hero-dev-scene").then((m) => m.HeroDevScene),
  { ssr: false }
)

const STACK_FEED = [
  "Next.js · React · TypeScript",
  "Node.js · Express · REST",
  "AWS Lambda · Terraform",
  "PostgreSQL · MongoDB · Redis",
  "Solidity · Ethers.js · Web3",
] as const

export function HeroVisualStage() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [loadScene, setLoadScene] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = sceneRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoadScene(true)
          io.disconnect()
        }
      },
      { rootMargin: "120px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="hero-visual-stage relative w-full max-w-[30rem] lg:ml-auto" data-hero-visual>
      <div className="hero-visual-frame pointer-events-none absolute -inset-3 border border-[var(--border-subtle)]/70" aria-hidden />
      <div className="hero-visual-grid pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-[2] flex flex-col gap-[var(--space-3)] p-[var(--space-3)]">
        <div className="hero-visual-hud flex items-center justify-between gap-3 px-3 py-2.5 border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/85 backdrop-blur-md">
          <span className="type-label !text-[0.625rem] !tracking-[0.2em]">build.pipeline</span>
          <span className="inline-flex items-center gap-2 type-label !text-[0.625rem] !text-[var(--accent-primary)]">
            <span className="hero-avail-dot scale-75" aria-hidden />
            shipping
          </span>
        </div>

        <div ref={sceneRef} className="flex justify-center py-[var(--space-1)] hero-visual-scene-wrap min-h-[12rem]">
          {loadScene ? <HeroDevScene /> : <div className="h-[12rem] w-full max-w-[16rem]" aria-hidden />}
        </div>

        <div className="hero-stack-feed overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/75 backdrop-blur-sm py-2.5" aria-hidden>
          <div className="hero-stack-feed-track flex gap-10 whitespace-nowrap type-label !text-[0.625rem] !tracking-[0.14em] !text-[var(--text-muted)]">
            {[...STACK_FEED, ...STACK_FEED].map((line, i) => (
              <span key={`${line}-${i}`}>{line}</span>
            ))}
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-[var(--space-2)]" data-hero-stats>
          {engineeringMetrics.map((m) => (
            <HeroStatCounter key={m.label} value={m.value} label={m.label} />
          ))}
        </ul>
      </div>
    </div>
  )
}
