"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Stars, MeshDistortMaterial } from "@react-three/drei"
import type { Group, Mesh } from "three"
import { useReducedMotion } from "framer-motion"

function CoreSculpture() {
  const mesh = useRef<Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.12
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08
  })

  return (
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.25}>
      <group scale={1.15}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color="#0f172a"
            emissive="#06B6D4"
            emissiveIntensity={0.35}
            metalness={0.85}
            roughness={0.2}
            distort={0.22}
            speed={1.5}
            transparent
            opacity={0.92}
          />
        </mesh>
        <mesh scale={1.02}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#00D9FF" wireframe transparent opacity={0.28} />
        </mesh>
      </group>
    </Float>
  )
}

function OrbitNodes() {
  const group = useRef<Group>(null)
  const nodes = useMemo(
    () => [
      { r: 2.1, speed: 0.35, y: 0.2, color: "#3B82F6" },
      { r: 1.65, speed: -0.28, y: -0.15, color: "#06B6D4" },
      { r: 2.45, speed: 0.2, y: 0.35, color: "#8B5CF6" },
    ],
    []
  )

  useFrame((state) => {
    if (!group.current) return
    group.current.children.forEach((child, i) => {
      const n = nodes[i]
      if (!n) return
      const t = state.clock.elapsedTime * n.speed
      child.position.x = Math.cos(t) * n.r
      child.position.z = Math.sin(t) * n.r
      child.position.y = n.y + Math.sin(t * 2) * 0.08
    })
  })

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial
            color={n.color}
            emissive={n.color}
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
      ))}
    </group>
  )
}

function Scene() {
  const rig = useRef<Group>(null)

  useFrame((state) => {
    if (!rig.current) return
    const ty = state.pointer.x * 0.18
    const tx = state.pointer.y * 0.1
    rig.current.rotation.y += (ty - rig.current.rotation.y) * 0.035
    rig.current.rotation.x += (tx - rig.current.rotation.x) * 0.035
  })

  return (
    <group ref={rig}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 6]} intensity={0.7} color="#e2e8f0" />
      <pointLight position={[2, 1, 3]} intensity={1} color="#00D9FF" />
      <pointLight position={[-3, -1, 2]} intensity={0.5} color="#6366f1" />
      <Stars radius={80} depth={40} count={1200} factor={3} saturation={0} fade speed={0.4} />
      <CoreSculpture />
      <OrbitNodes />
    </group>
  )
}

export function HeroTechScene() {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsMobile(window.innerWidth < 768)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", onResize, { passive: true })
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1
    if (window.innerWidth < 768) return 1
    return Math.min(1.5, window.devicePixelRatio)
  }, [])

  if (!mounted || reduceMotion || isMobile) {
    return (
      <div
        className="w-full aspect-[4/5] max-h-[580px] rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0F172A] via-[#020617] to-[#0F172A] relative overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,217,255,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(99,102,241,0.12),transparent_50%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(0,217,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>
    )
  }

  return (
    <div
      className="w-full aspect-[4/5] max-h-[580px] rounded-3xl border border-white/[0.08] overflow-hidden relative"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,217,255,0.08),transparent_70%)] pointer-events-none z-[1]" />
      <Canvas
        className="touch-none !h-full"
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        dpr={[1, dpr]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
