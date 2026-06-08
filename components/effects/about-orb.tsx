"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useReducedMotion } from "framer-motion"
import type { Mesh } from "three"

function Orb() {
  const mesh = useRef<Mesh>(null)
  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.15
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
  })
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.8, 2]} />
      <meshBasicMaterial color="#3B82F6" wireframe transparent opacity={0.12} />
    </mesh>
  )
}

export function AboutOrb() {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null

  return (
    <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.25]} gl={{ alpha: true }}>
        <Orb />
      </Canvas>
    </div>
  )
}
