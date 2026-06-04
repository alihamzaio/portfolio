"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Activity, BarChart3, Cpu, Layers, Zap } from "lucide-react"
import { ease, easeCinematic } from "@/lib/motion"

const CODE_LINES = [
  { t: "keyword", v: "// production deploy pipeline" },
  { t: "keyword", v: "export async function" },
  { t: "name", v: " shipFeature" },
  { t: "plain", v: "(scope: Scope) {" },
  { t: "keyword", v: "  const" },
  { t: "plain", v: " build = " },
  { t: "fn", v: "await" },
  { t: "plain", v: " ci.run(scope)" },
  { t: "keyword", v: "  return" },
  { t: "plain", v: " { latency: " },
  { t: "string", v: '"-48ms"' },
  { t: "plain", v: ", score: " },
  { t: "string", v: "98" },
  { t: "plain", v: " }" },
  { t: "plain", v: "}" },
]

function CodeEditor() {
  const [line, setLine] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setLine((l) => (l + 1) % CODE_LINES.length), 2400)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="glass-float rounded-2xl p-4 sm:p-5 font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-hidden">
      <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-white/[0.06]">
        <span className="h-2 w-2 rounded-full bg-[#EF4444]/75" />
        <span className="h-2 w-2 rounded-full bg-[#F59E0B]/75" />
        <span className="h-2 w-2 rounded-full bg-[#22C55E]/75" />
        <span className="ml-2 text-[#64748B]">app/api/deploy/route.ts</span>
      </div>
      <pre className="text-[#94A3B8]">
        {CODE_LINES.map((row, i) => (
          <motion.div key={i} animate={{ opacity: i === line ? 1 : 0.5 }} className="flex">
            <span className="w-5 text-[#64748B] select-none">{i + 1}</span>
            <span>
              {row.t === "keyword" && <span className="text-[#3B82F6]">{row.v}</span>}
              {row.t === "name" && <span className="text-[#06B6D4]">{row.v}</span>}
              {row.t === "fn" && <span className="text-[#F8FAFC]">{row.v}</span>}
              {row.t === "string" && <span className="text-[#22C55E]">{row.v}</span>}
              {row.t === "plain" && <span>{row.v}</span>}
              {i === line && <span className="inline-block w-1.5 h-3.5 bg-[#3B82F6] ml-0.5 align-middle cursor-blink" />}
            </span>
          </motion.div>
        ))}
      </pre>
    </div>
  )
}

function DashboardPreview() {
  const bars = [42, 68, 55, 82, 71, 94, 78]
  return (
    <div className="glass-float rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#3B82F6]" />
          <span className="text-xs font-semibold text-[#F8FAFC]">Product metrics</span>
        </div>
        <span className="text-[10px] font-mono text-[#22C55E] flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          Live
        </span>
      </div>
      <div className="flex items-end gap-1.5 h-16 mb-4">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-[#3B82F6] to-[#06B6D4] opacity-80"
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.5 + i * 0.06, duration: 0.6, ease: easeCinematic }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Uptime", value: "99.9%", icon: Activity },
          { label: "LCP", value: "1.1s", icon: Zap },
        ].map((m) => (
          <div key={m.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2">
            <m.icon className="h-3 w-3 text-[#64748B] mb-1" />
            <p className="text-[10px] text-[#64748B]">{m.label}</p>
            <p className="text-sm font-bold text-[#F8FAFC] tabular-nums">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function GeometryLayer() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none" aria-hidden>
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
          <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="12%" y1="28%" x2="88%" y2="32%" stroke="url(#lineGrad)" strokeWidth="1" />
      <line x1="8%" y1="72%" x2="75%" y2="68%" stroke="url(#lineGrad)" strokeWidth="1" opacity="0.6" />
      <rect x="18%" y="22%" width="64" height="64" rx="12" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="1" className="float-drift" />
      <rect x="72%" y="58%" width="48" height="48" rx="10" fill="none" stroke="rgba(6,182,212,0.12)" strokeWidth="1" />
    </svg>
  )
}

export function HeroCinematic() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 70, damping: 24 })
  const sy = useSpring(my, { stiffness: 70, damping: 24 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8])
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)

  useEffect(() => setMounted(true), [])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(px)
    my.set(py)
    glowX.set(((e.clientX - rect.left) / rect.width) * 100)
    glowY.set(((e.clientY - rect.top) / rect.height) * 100)
    if (containerRef.current) {
      containerRef.current.style.setProperty("--gx", `${glowX.get()}%`)
      containerRef.current.style.setProperty("--gy", `${glowY.get()}%`)
    }
  }

  if (!mounted) {
    return (
      <div
        className="relative w-full aspect-[4/5] max-h-[580px] rounded-3xl bg-white/[0.02] border border-white/[0.06] animate-pulse"
        aria-hidden
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] max-h-[580px] rounded-3xl overflow-hidden border border-white/[0.08] bg-[#020617]/60"
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      style={{ "--gx": "50%", "--gy": "40%" } as Record<string, string>}
      aria-hidden
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at var(--gx,50%) var(--gy,40%), rgba(59,130,246,0.16), transparent 50%)`,
        }}
      />
      <div className="absolute inset-0 mesh-hero opacity-80 pointer-events-none" />
      <GeometryLayer />

      <div className="absolute top-[8%] right-[6%] w-20 h-20 rounded-2xl border border-[#3B82F6]/20 bg-[#3B82F6]/[0.06] float-slow pointer-events-none" />
      <div className="absolute bottom-[18%] left-[4%] w-14 h-14 rounded-full border border-[#06B6D4]/15 bg-[#06B6D4]/[0.05] float-slower pointer-events-none" />
      <div className="absolute top-[42%] left-[12%] w-px h-24 bg-gradient-to-b from-transparent via-[#8B5CF6]/30 to-transparent pointer-events-none" />

      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1600 }}
        className="relative w-full h-full p-4 sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: easeCinematic }}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 w-[78%] sm:w-[72%] z-30 float-slow"
        >
          <CodeEditor />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55, duration: 0.85, ease }}
          className="absolute bottom-6 sm:bottom-8 left-4 sm:left-6 w-[58%] sm:w-[52%] z-20"
        >
          <DashboardPreview />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75, ease }}
          className="absolute top-[38%] left-[6%] glass-panel rounded-xl px-3 py-2.5 z-40 float-slower"
        >
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-[#06B6D4]" />
            <div>
              <p className="text-[9px] text-[#64748B] uppercase tracking-wider">Core Web Vitals</p>
              <p className="text-sm font-bold text-[#06B6D4] tabular-nums">98</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, ease }}
          className="absolute top-[18%] left-[8%] glass-panel rounded-xl px-3 py-2 z-40"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-[#3B82F6]" />
            <p className="text-[10px] text-[#94A3B8]">
              <span className="text-[#F8FAFC] font-semibold">15+</span> APIs shipped
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, ease }}
          className="absolute bottom-[42%] right-[8%] flex flex-wrap gap-1.5 z-30 max-w-[140px]"
        >
          {["Next.js", "AWS", "Node"].map((t, i) => (
            <span
              key={t}
              className="text-[9px] font-medium px-2 py-1 rounded-lg bg-white/[0.05] text-[#94A3B8] border border-white/[0.08]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none z-10" />
    </div>
  )
}
