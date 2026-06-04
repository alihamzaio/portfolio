"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ease } from "@/lib/motion"

const CODE_LINES = [
  { t: "keyword", v: "// Birxment — indexer worker" },
  { t: "keyword", v: "async function" },
  { t: "name", v: " syncBlock" },
  { t: "plain", v: "(hash: string) {" },
  { t: "keyword", v: "  const" },
  { t: "plain", v: " tx = " },
  { t: "fn", v: "await" },
  { t: "plain", v: " rpc.getBlock(hash)" },
  { t: "keyword", v: "  await" },
  { t: "plain", v: " db.blocks.upsert(tx)" },
  { t: "keyword", v: "  return" },
  { t: "plain", v: " { ok: " },
  { t: "string", v: "true" },
  { t: "plain", v: " }" },
  { t: "plain", v: "}" },
]

function CodePanel() {
  const [line, setLine] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setLine((l) => (l + 1) % CODE_LINES.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 font-mono text-[11px] sm:text-xs leading-relaxed overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-white/[0.06]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/80" />
        <span className="ml-2 text-[#64748B]">workers/block-sync.ts</span>
      </div>
      <pre className="text-[#94A3B8]">
        {CODE_LINES.map((row, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i === line ? 1 : 0.55 }}
            className="flex"
          >
            <span className="w-6 text-[#64748B] select-none">{i + 1}</span>
            <span>
              {row.t === "keyword" && <span className="text-[#3B82F6]">{row.v}</span>}
              {row.t === "name" && <span className="text-[#06B6D4]">{row.v}</span>}
              {row.t === "fn" && <span className="text-[#F8FAFC]">{row.v}</span>}
              {row.t === "string" && <span className="text-[#22C55E]">{row.v}</span>}
              {row.t === "plain" && <span>{row.v}</span>}
              {i === line && (
                <span className="inline-block w-2 h-4 bg-[#3B82F6] ml-0.5 align-middle cursor-blink" />
              )}
            </span>
          </motion.div>
        ))}
      </pre>
    </div>
  )
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    const dpr = devicePixelRatio

    const resize = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const particles = Array.from({ length: 56 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.4 + 0.3,
      o: Math.random() * 0.4 + 0.08,
    }))

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = i % 3 === 0 ? `rgba(6, 182, 212, ${p.o})` : `rgba(59, 130, 246, ${p.o})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" aria-hidden />
}

export function HeroVisual() {
  const [mounted, setMounted] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 22 })
  const sy = useSpring(my, { stiffness: 90, damping: 22 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-10, 10])

  useEffect(() => setMounted(true), [])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  if (!mounted) {
    return (
      <div className="relative w-full aspect-[4/5] max-h-[540px] rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" aria-hidden />
    )
  }

  return (
    <div
      className="relative w-full aspect-[4/5] max-h-[560px] pointer-events-none"
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      aria-hidden
    >
      <ParticleField />

      {/* Left zone stays open so the 3D dev workspace stays visible */}
      <div className="absolute inset-y-0 left-0 w-[42%] z-[1] bg-gradient-to-r from-transparent to-[#030712]/40 pointer-events-none" />

      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1400 }}
        className="relative w-full h-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.85, ease }}
          className="absolute top-0 right-0 w-[72%] sm:w-[68%] float-slow z-20"
        >
          <CodePanel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65, ease }}
          className="absolute bottom-4 right-0 w-[52%] glass-card rounded-2xl p-4 z-10 border-[#3B82F6]/15"
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B] mb-2">Production stack</p>
          <div className="flex flex-wrap gap-1.5">
            {["Next.js", "Node.js", "AWS", "PostgreSQL", "Solidity"].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.06 }}
                className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.05] text-[#94A3B8] border border-white/[0.08]"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, ease }}
          className="absolute top-[12%] left-[4%] glass-panel rounded-xl px-3 py-2 z-20 float-slower backdrop-blur-md"
        >
          <p className="text-[10px] text-[#64748B]">Page load (Exec9)</p>
          <p className="text-sm font-bold text-[#06B6D4] tabular-nums">−50%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, ease }}
          className="absolute bottom-[38%] left-[2%] glass-panel rounded-xl px-3 py-2 z-20 backdrop-blur-md"
        >
          <p className="text-[10px] text-[#64748B]">REST APIs shipped</p>
          <p className="text-base font-bold text-[#3B82F6] tabular-nums">15+</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
