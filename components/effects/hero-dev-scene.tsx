"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { motion, useReducedMotion } from "framer-motion"
import type { Group, Mesh } from "three"
import { brand } from "@/lib/brand"
import { engineeringMetrics } from "@/lib/site"

const CODE_LINES = [
  "const stack = ['React', 'Next', 'Node']",
  "await deploy({ env: 'production' })",
  "indexer.sync(blocks: 10_000+)",
  "pipeline.ci() // 40% fewer bugs",
] as const

const FLOAT_CHIPS = ["MERN", "AWS", "Web3", "TypeScript"] as const

function DevCore() {
  const group = useRef<Group>(null)
  const knot = useRef<Mesh>(null)
  const inner = useRef<Mesh>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = t * 0.18 + mouse.current.x * 0.2
      group.current.rotation.x = Math.sin(t * 0.3) * 0.08 + mouse.current.y * 0.1
    }
    if (knot.current) knot.current.rotation.z = t * 0.12
    if (inner.current) inner.current.rotation.y = -t * 0.35
  })

  return (
    <group ref={group} scale={0.82} position={[0, 0.05, 0]}>
      <mesh ref={knot}>
        <torusKnotGeometry args={[0.95, 0.24, 128, 16]} />
        <meshBasicMaterial color={brand.blue} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshBasicMaterial color={brand.cyan} wireframe transparent opacity={0.75} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.01, 8, 64]} />
        <meshBasicMaterial color={brand.sky} transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

function CodeTerminal({ reduceMotion }: { reduceMotion: boolean }) {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const line = CODE_LINES[lineIdx]
  const displayed = line.slice(0, charIdx)

  useEffect(() => {
    if (reduceMotion) return
    if (charIdx < line.length) {
      const t = window.setTimeout(() => setCharIdx((c) => c + 1), 42)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => {
      setLineIdx((i) => (i + 1) % CODE_LINES.length)
      setCharIdx(0)
    }, 1200)
    return () => window.clearTimeout(t)
  }, [charIdx, line.length, reduceMotion])

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-[#0a0f1a]/85 backdrop-blur-xl p-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_32px_rgba(59,130,246,0.12)]">
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="h-2 w-2 rounded-full bg-red-400/80" />
        <span className="h-2 w-2 rounded-full bg-amber-400/80" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-[9px] font-mono text-neutral-500">~/portfolio</span>
      </div>
      <p className="font-mono text-[11px] leading-relaxed text-cyan-300/90 min-h-[2.75rem]">
        <span className="text-blue-400/70">$ </span>
        {reduceMotion ? CODE_LINES[0] : displayed}
        {!reduceMotion && (
          <span className="inline-block w-[6px] h-[13px] ml-0.5 bg-cyan-400/80 align-middle animate-pulse" />
        )}
      </p>
    </div>
  )
}

export function HeroDevScene() {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-[min(340px,42vw)] h-[380px] shrink-0"
      aria-hidden
    >
      <div
        className="absolute -inset-8 rounded-full opacity-60 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.28), transparent 68%)" }}
      />

      <div
        className={`absolute inset-0 rounded-full border border-dashed border-cyan-400/12 pointer-events-none ${reduceMotion ? "" : "hero-dev-orbit-slow"}`}
      />
      <div
        className={`absolute inset-6 rounded-full border border-blue-500/10 pointer-events-none ${reduceMotion ? "" : "hero-dev-orbit-reverse"}`}
      />

      {FLOAT_CHIPS.map((chip, i) => (
        <motion.span
          key={chip}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
          className={`absolute z-20 premium-chip text-[10px] font-mono px-2.5 py-1 shadow-lg ${
            i === 0 ? "top-2 right-0" : i === 1 ? "top-[38%] -left-2" : i === 2 ? "bottom-[38%] -right-1" : "bottom-16 left-2"
          } ${reduceMotion ? "" : "hero-dev-chip-float"}`}
          style={{ animationDelay: `${i * 0.6}s` }}
        >
          {chip}
        </motion.span>
      ))}

      <div className="absolute inset-x-2 top-4 bottom-[7.5rem] overflow-visible pointer-events-none">
        {mounted && !reduceMotion ? (
          <Canvas
            camera={{ position: [0, 0.1, 5.4], fov: 36, near: 0.1, far: 100 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent", width: "100%", height: "100%" }}
          >
            <DevCore />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-36 h-36 rounded-full border border-cyan-500/30"
              style={{
                background:
                  "radial-gradient(circle at 40% 35%, rgba(59,130,246,0.2), transparent 60%), radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)",
              }}
            />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 inset-x-0 z-10">
        <CodeTerminal reduceMotion={!!reduceMotion} />
      </div>

      <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {engineeringMetrics.slice(0, 2).map((m, i) => (
          <motion.span
            key={m.label}
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.08 }}
            className="text-[9px] font-mono px-2 py-1 rounded-md border border-white/[0.08] bg-white/[0.04] text-cyan-400/80 whitespace-nowrap"
          >
            {m.value} {m.label.split(" ")[0]}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}
