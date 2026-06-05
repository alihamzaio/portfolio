"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useReducedMotion } from "framer-motion"
import type { Group, Mesh } from "three"

function GlobeDots() {
  const dots = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const phi = Math.acos(-1 + (2 * i) / 24)
      const theta = Math.sqrt(24 * Math.PI) * phi
      const r = 2.5
      return [
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      ] as [number, number, number]
    })
  }, [])

  return (
    <>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      ))}
    </>
  )
}

function GlobeMesh() {
  const outer = useRef<Mesh>(null)
  const inner = useRef<Mesh>(null)
  const rig = useRef<Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (outer.current) outer.current.rotation.y = t * 0.08
    if (inner.current) inner.current.rotation.y = -t * 0.05
    if (rig.current) {
      const ty = state.pointer.x * 0.35
      const tx = state.pointer.y * 0.22
      rig.current.rotation.y += (ty - rig.current.rotation.y) * 0.04
      rig.current.rotation.x += (tx - rig.current.rotation.x) * 0.04
    }
  })

  return (
    <group ref={rig}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[2.4, 5]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh ref={inner} scale={0.92}>
        <icosahedronGeometry args={[2.4, 3]} />
        <meshBasicMaterial color="#a3a3a3" wireframe transparent opacity={0.06} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.15, 32, 32]} />
        <meshBasicMaterial color="#171717" transparent opacity={0.35} />
      </mesh>
      <GlobeDots />
    </group>
  )
}

export function HeroWireframeGlobe() {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1
    return Math.min(1.5, window.devicePixelRatio)
  }, [])

  if (!mounted || reduceMotion) {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,255,255,0.04), transparent 70%)",
        }}
      />
    )
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        className="!h-full !w-full touch-none"
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, dpr]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={0.6} color="#ffffff" />
        <GlobeMesh />
      </Canvas>
    </div>
  )
}
