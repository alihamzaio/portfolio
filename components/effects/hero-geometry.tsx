"use client"

import { useEffect, useId, useRef } from "react"
import { BrandMarkPaths } from "@/components/brand/brand-mark"

/**
 * Prism Reliquary — faceted obsidian monolith with inner AH sanctum,
 * gold light column, floating shards, and multi-depth pointer parallax.
 */
export function HeroGeometry() {
  const rootRef = useRef<HTMLDivElement>(null)
  const uid = useId().replace(/:/g, "")
  const g = (n: string) => `${n}-${uid}`

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const layers = root.querySelectorAll<HTMLElement>("[data-hero-depth]")
    if (!layers.length) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      tx = (e.clientX - rect.left) / rect.width - 0.5
      ty = (e.clientY - rect.top) / rect.height - 0.5
    }

    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06

      layers.forEach((el) => {
        const depth = Number.parseFloat(el.dataset.heroDepth || "1")
        const px = cx * depth * 18
        const py = cy * depth * 14
        const rx = cy * depth * 5
        const ry = cx * depth * 7
        el.style.transform = `translate3d(${px}px, ${py}px, 0) rotateX(${-rx}deg) rotateY(${ry}deg)`
      })

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="hero-prism relative aspect-[0.88/1] w-full min-h-[24rem] sm:min-h-[30rem] lg:min-h-[38rem] select-none"
      data-hero-sigil
      aria-hidden
    >
      {/* Atmospheric layers */}
      <div className="hero-prism-aura pointer-events-none absolute -inset-[28%]" />
      <div className="hero-prism-aura-core pointer-events-none absolute left-1/2 top-[42%] h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2" />

      {/* Vertical light column */}
      <div className="hero-prism-beam pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2" data-hero-beam />

      {/* Perspective floor */}
      <div className="hero-prism-floor pointer-events-none absolute inset-x-[-10%] bottom-[-2%] h-[38%]" data-hero-depth="0.35" />

      {/* Floating shards */}
      <span className="hero-prism-shard hero-prism-shard--1" data-hero-shard data-hero-depth="0.55" />
      <span className="hero-prism-shard hero-prism-shard--2" data-hero-shard data-hero-depth="0.7" />
      <span className="hero-prism-shard hero-prism-shard--3" data-hero-shard data-hero-depth="0.45" />
      <span className="hero-prism-shard hero-prism-shard--4" data-hero-shard data-hero-depth="0.65" />

      {/* Hex wire ring — angular, not circular */}
      <svg className="hero-prism-ring pointer-events-none absolute inset-[2%]" viewBox="0 0 200 200" fill="none" data-hero-depth="0.5">
        <polygon
          points="100,18 168,58 168,142 100,182 32,142 32,58"
          stroke="rgba(232, 68, 47,0.22)"
          strokeWidth="0.6"
          strokeDasharray="4 7"
        />
        <polygon
          points="100,28 158,62 158,138 100,172 42,138 42,62"
          stroke="rgba(232, 68, 47,0.1)"
          strokeWidth="0.35"
        />
      </svg>

      {/* Main stage */}
      <div className="hero-prism-stage absolute inset-[6%] flex items-center justify-center" data-hero-stage data-hero-depth="1">
        <svg className="hero-prism-monolith h-full w-full max-w-[92%]" viewBox="0 0 200 260" fill="none">
          <defs>
            <linearGradient id={g("face-l")} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#0c1018" />
              <stop offset="1" stopColor="#05070b" />
            </linearGradient>
            <linearGradient id={g("face-r")} x1="1" y1="0" x2="0" y2="1">
              <stop stopColor="#141a24" />
              <stop offset="1" stopColor="#080b10" />
            </linearGradient>
            <linearGradient id={g("face-f")} x1="0.5" y1="0" x2="0.5" y2="1">
              <stop stopColor="#1a2030" />
              <stop offset="0.5" stopColor="#0e1319" />
              <stop offset="1" stopColor="#06080c" />
            </linearGradient>
            <linearGradient id={g("top")} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="var(--accent-primary)" stopOpacity="0.35" />
              <stop offset="0.5" stopColor="var(--accent-primary)" stopOpacity="0.18" />
              <stop offset="1" stopColor="var(--accent-primary)" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id={g("edge")} x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="transparent" />
              <stop offset="0.3" stopColor="var(--accent-primary)" />
              <stop offset="0.7" stopColor="var(--accent-primary)" />
              <stop offset="1" stopColor="transparent" />
            </linearGradient>
            <filter id={g("glow")} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id={g("front-clip")}>
              <path d="M100 48 L158 78 L158 198 L100 228 L42 198 L42 78 Z" />
            </clipPath>
          </defs>

          {/* Shadow base */}
          <ellipse cx="100" cy="238" rx="72" ry="10" fill="rgba(232, 68, 47,0.08)" className="hero-prism-shadow" />

          {/* Left facet */}
          <path d="M42 78 L100 48 L100 228 L42 198 Z" fill={`url(#${g("face-l")})`} stroke="rgba(232, 68, 47,0.15)" strokeWidth="0.8" />

          {/* Right facet */}
          <path d="M100 48 L158 78 L158 198 L100 228 Z" fill={`url(#${g("face-r")})`} stroke="rgba(232, 68, 47,0.2)" strokeWidth="0.8" />

          {/* Front facet */}
          <path
            d="M58 88 L142 88 L148 188 L52 188 Z"
            fill={`url(#${g("face-f")})`}
            stroke="rgba(232, 68, 47,0.28)"
            strokeWidth="1"
            className="hero-prism-face"
          />

          {/* Top facet */}
          <path d="M58 88 L100 68 L142 88 L100 78 Z" fill={`url(#${g("top")})`} stroke="var(--accent-primary)" strokeWidth="0.6" strokeOpacity="0.5" />

          {/* Gold seam lines */}
          <line x1="58" y1="88" x2="142" y2="88" stroke={`url(#${g("edge")})`} strokeWidth="1.2" />
          <line x1="52" y1="188" x2="148" y2="188" stroke="rgba(232, 68, 47,0.35)" strokeWidth="0.8" />
          <line x1="100" y1="68" x2="100" y2="228" stroke="rgba(232, 68, 47,0.12)" strokeWidth="0.5" strokeDasharray="3 5" />

          {/* Inner glow sanctum */}
          <rect
            x="68"
            y="108"
            width="64"
            height="64"
            rx="1"
            fill="rgba(232, 68, 47,0.04)"
            stroke="rgba(232, 68, 47,0.18)"
            strokeWidth="0.6"
            className="hero-prism-sanctum"
          />

          {/* Scan line */}
          <rect
            x="52"
            y="100"
            width="96"
            height="2"
            fill="rgba(232, 68, 47, 0.5)"
            clipPath={`url(#${g("front-clip")})`}
            className="hero-prism-scan"
            filter={`url(#${g("glow")})`}
          />
        </svg>

        {/* Inner AH mark — wire sanctum */}
        <svg
          className="hero-prism-mark absolute h-[28%] w-[28%]"
          viewBox="0 0 48 48"
          fill="none"
          data-hero-mark
        >
          <defs>
            <filter id={g("mark-glow")}>
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g className="hero-prism-mark-glow" filter={`url(#${g("mark-glow")})`}>
            <BrandMarkPaths strokeScale={1.2} />
          </g>
        </svg>

        {/* Wire cage overlay */}
        <svg className="hero-prism-cage pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 200 260" fill="none">
          <path
            d="M42 78 L100 48 L158 78 L158 198 L100 228 L42 198 Z"
            stroke="rgba(232, 68, 47,0.35)"
            strokeWidth="0.7"
            fill="none"
            className="hero-prism-cage-line"
          />
          <path d="M42 78 L158 198" stroke="rgba(232, 68, 47,0.08)" strokeWidth="0.4" />
          <path d="M158 78 L42 198" stroke="rgba(232, 68, 47,0.08)" strokeWidth="0.4" />
        </svg>
      </div>

      {/* Gold dust particles */}
      <span className="hero-prism-dust hero-prism-dust--1" />
      <span className="hero-prism-dust hero-prism-dust--2" />
      <span className="hero-prism-dust hero-prism-dust--3" />
      <span className="hero-prism-dust hero-prism-dust--4" />
      <span className="hero-prism-dust hero-prism-dust--5" />

      {/* HUD annotations */}
      <div className="hero-prism-hud pointer-events-none absolute inset-0">
        <span className="hero-prism-hud-line hero-prism-hud-line--tl" />
        <span className="hero-prism-hud-line hero-prism-hud-line--br" />
        <span className="hero-prism-hud-label hero-prism-hud-label--tl font-mono text-[9px] tracking-[0.2em] text-[var(--accent-primary)]/55">
          PRISM.VAULT
        </span>
        <span className="hero-prism-hud-label hero-prism-hud-label--br font-mono text-[9px] tracking-[0.16em] text-neutral-500">
          38.2°N · 01
        </span>
      </div>
    </div>
  )
}
