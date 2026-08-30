"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useReducedMotion } from "framer-motion"
import type { Points } from "three"
import { brand } from "@/lib/brand"

function GlobalParticles({ count = 500 }: { count?: number }) {
  const ref = useRef<Points>(null)
  const mouse = useRef({ x: 0, y: 0 })

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return arr
  }, [count])

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
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.008
    ref.current.rotation.x = mouse.current.y * 0.04
    ref.current.position.x += (mouse.current.x * 0.2 - ref.current.position.x) * 0.015
    ref.current.position.y += (mouse.current.y * 0.12 - ref.current.position.y) * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color={brand.accent} transparent opacity={0.2} sizeAttenuation />
    </points>
  )
}

export function SiteParticleBg() {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || reduceMotion) return null

  return (
    <div className="fixed inset-0 -z-[8] pointer-events-none opacity-55" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <GlobalParticles count={typeof window !== "undefined" && window.innerWidth < 768 ? 280 : 500} />
      </Canvas>
    </div>
  )
}
