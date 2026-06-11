"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type { Points } from "three"
import { brand } from "@/lib/brand"

function Particles({ count = 1200 }: { count?: number }) {
  const ref = useRef<Points>(null)
  const mouse = useRef({ x: 0, y: 0 })

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
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
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
    ref.current.rotation.x = mouse.current.y * 0.08
    ref.current.position.x += (mouse.current.x * 0.4 - ref.current.position.x) * 0.02
    ref.current.position.y += (mouse.current.y * 0.25 - ref.current.position.y) * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color={brand.sky} transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

export function HeroParticleCanvas() {
  const particleCount =
    typeof window !== "undefined"
      ? window.innerWidth < 1280
        ? 550
        : 1200
      : 550

  const dpr: [number, number] = [1, 1.5]

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={dpr}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Particles count={particleCount} />
      </Canvas>
    </div>
  )
}
