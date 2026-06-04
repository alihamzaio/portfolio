"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei"
import type { Group, Mesh } from "three"

function GlassOrb({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const ref = useRef<Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.15
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.2
  })
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <Sphere ref={ref} args={[scale, 32, 32]} position={position}>
        <MeshDistortMaterial
          color="#3B82F6"
          attach="material"
          distort={0.25}
          speed={1.5}
          roughness={0.15}
          metalness={0.85}
          transparent
          opacity={0.55}
        />
      </Sphere>
    </Float>
  )
}

function AccentRing() {
  const ref = useRef<Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * 0.08
    ref.current.rotation.x = Math.PI / 2.5
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.2, 0.02, 16, 100]} />
      <meshBasicMaterial color="#8B5CF6" transparent opacity={0.35} />
    </mesh>
  )
}

function Scene() {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const x = (state.pointer.x * 0.15)
    const y = (state.pointer.y * 0.1)
    group.current.rotation.y += (x - group.current.rotation.y) * 0.02
    group.current.rotation.x += (y - group.current.rotation.x) * 0.02
  })

  return (
    <group ref={group}>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#3B82F6" />
      <pointLight position={[-4, -2, 2]} intensity={0.6} color="#8B5CF6" />
      <pointLight position={[0, 2, -3]} intensity={0.4} color="#06B6D4" />
      <GlassOrb position={[0, 0, 0]} scale={0.85} speed={1} />
      <GlassOrb position={[1.4, 0.3, -0.5]} scale={0.35} speed={1.3} />
      <GlassOrb position={[-1.2, -0.4, 0.3]} scale={0.28} speed={0.9} />
      <AccentRing />
    </group>
  )
}

export function HeroScene() {
  const dpr = useMemo(() => (typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 1.5), [])

  return (
    <div className="absolute inset-0 -z-0 opacity-90 pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, dpr]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
