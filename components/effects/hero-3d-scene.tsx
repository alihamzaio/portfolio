"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, RoundedBox, ContactShadows } from "@react-three/drei"
import type { Group, Mesh } from "three"

function DeveloperFigure() {
  const arms = useRef<Group>(null)

  useFrame((state) => {
    if (!arms.current) return
    arms.current.rotation.x = Math.sin(state.clock.elapsedTime * 3) * 0.05 - 0.42
  })

  return (
    <group position={[-0.05, 0.48, 0.42]}>
      <mesh position={[0, 0.64, 0]}>
        <sphereGeometry args={[0.13, 28, 28]} />
        <meshStandardMaterial color="#334155" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.018, 10, 32, Math.PI * 1.05]} />
        <meshStandardMaterial color="#3B82F6" metalness={0.9} roughness={0.15} emissive="#1d4ed8" emissiveIntensity={0.25} />
      </mesh>
      <RoundedBox args={[0.3, 0.4, 0.22]} radius={0.05} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.5} />
      </RoundedBox>
      <group ref={arms} position={[0, 0.24, 0.1]}>
        <mesh position={[-0.18, -0.04, 0.14]} rotation={[0.55, 0, 0.35]}>
          <capsuleGeometry args={[0.035, 0.2, 6, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0.18, -0.04, 0.14]} rotation={[0.55, 0, -0.35]}>
          <capsuleGeometry args={[0.035, 0.2, 6, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

function Workspace() {
  return (
    <group position={[0.1, -0.42, 0]} rotation={[0, -0.42, 0]} scale={1.05}>
      <RoundedBox args={[2.4, 0.07, 1.15]} radius={0.025} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0f172a" metalness={0.55} roughness={0.35} />
      </RoundedBox>

      <group position={[0.42, 0.2, -0.06]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.07, 0.2, 0.07]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.25} />
        </mesh>
        <group position={[0, 0.38, 0]}>
          <RoundedBox args={[0.95, 0.58, 0.05]} radius={0.02}>
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.35} />
          </RoundedBox>
          <mesh position={[0, 0, 0.032]}>
            <planeGeometry args={[0.82, 0.46]} />
            <meshStandardMaterial
              color="#0c4a6e"
              emissive="#3B82F6"
              emissiveIntensity={1.1}
              metalness={0.2}
              roughness={0.15}
            />
          </mesh>
        </group>
      </group>

      <group position={[-0.58, 0.1, 0.18]} rotation={[0, 0.35, 0]}>
        <RoundedBox args={[0.58, 0.025, 0.4]} radius={0.012}>
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
        </RoundedBox>
        <group position={[0, 0.2, -0.14]} rotation={[-0.38, 0, 0]}>
          <RoundedBox args={[0.58, 0.36, 0.02]} radius={0.012}>
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
          </RoundedBox>
          <mesh position={[0, 0, 0.014]}>
            <planeGeometry args={[0.5, 0.28]} />
            <meshStandardMaterial color="#0891b2" emissive="#06B6D4" emissiveIntensity={0.9} />
          </mesh>
        </group>
      </group>

      <mesh position={[0.05, 0.06, 0.32]}>
        <boxGeometry args={[0.5, 0.03, 0.16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.5} />
      </mesh>

      <group position={[-0.08, 0.24, 0.58]}>
        <RoundedBox args={[0.44, 0.055, 0.44]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1e293b" metalness={0.35} roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.44, 0.52, 0.055]} radius={0.03} position={[0, 0.3, 0.2]}>
          <meshStandardMaterial color="#0f172a" metalness={0.35} roughness={0.5} />
        </RoundedBox>
      </group>

      <DeveloperFigure />
    </group>
  )
}

function FloatingGlyphs() {
  const glyphs = useMemo(
    () => [
      { pos: [1.85, 1.1, 0.1] as [number, number, number], color: "#3B82F6", s: 0.11 },
      { pos: [-1.75, 1.35, -0.2] as [number, number, number], color: "#06B6D4", s: 0.09 },
      { pos: [1.55, -0.35, 0.5] as [number, number, number], color: "#22C55E", s: 0.08 },
      { pos: [-1.6, 0.15, 0.45] as [number, number, number], color: "#3B82F6", s: 0.1 },
    ],
    []
  )

  return (
    <>
      {glyphs.map((g, i) => (
        <Float key={i} speed={1.4 + i * 0.2} rotationIntensity={0.35} floatIntensity={0.5}>
          <mesh position={g.pos}>
            <octahedronGeometry args={[g.s, 0]} />
            <meshStandardMaterial
              color={g.color}
              emissive={g.color}
              emissiveIntensity={0.35}
              metalness={0.85}
              roughness={0.12}
              transparent
              opacity={0.88}
            />
          </mesh>
        </Float>
      ))}
    </>
  )
}

function OrbitRings() {
  const outer = useRef<Mesh>(null)
  const inner = useRef<Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (outer.current) outer.current.rotation.z = t * 0.05
    if (inner.current) inner.current.rotation.z = -t * 0.08
  })

  return (
    <group position={[0.15, 0.15, 0]}>
      <mesh ref={outer} rotation={[Math.PI / 2.15, 0.2, 0]}>
        <torusGeometry args={[2.05, 0.014, 10, 120]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.35} />
      </mesh>
      <mesh ref={inner} rotation={[Math.PI / 2.5, -0.15, 0.3]}>
        <torusGeometry args={[1.55, 0.01, 8, 96]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.28} />
      </mesh>
    </group>
  )
}

function Scene() {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const targetY = state.pointer.x * 0.22
    const targetX = state.pointer.y * 0.12
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04
  })

  return (
    <group ref={group}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={0.85} color="#f1f5f9" />
      <pointLight position={[3, 2, 4]} intensity={1.15} color="#3B82F6" />
      <pointLight position={[-3, 1, 3]} intensity={0.65} color="#06B6D4" />
      <spotLight position={[0, 5, 2]} angle={0.45} penumbra={0.6} intensity={0.45} color="#60a5fa" />

      <OrbitRings />
      <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.12}>
        <Workspace />
      </Float>
      <FloatingGlyphs />
      <ContactShadows
        position={[0, -0.55, 0]}
        opacity={0.4}
        scale={9}
        blur={2.5}
        far={4.5}
        color="#020617"
      />
    </group>
  )
}

export function Hero3DScene() {
  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1
    if (window.innerWidth < 768) return 1
    return Math.min(1.75, window.devicePixelRatio)
  }, [])

  return (
    <div className="absolute inset-0 z-[2]" aria-hidden>
      <div className="absolute left-[8%] top-[18%] w-[58%] h-[72%] rounded-full bg-[#3B82F6]/12 blur-[80px] pointer-events-none" />
      <div className="absolute left-[20%] bottom-[12%] w-[45%] h-[40%] rounded-full bg-[#06B6D4]/10 blur-[60px] pointer-events-none" />
      <Canvas
        className="touch-none"
        camera={{ position: [0, 0.35, 4.8], fov: 38 }}
        dpr={[1, dpr]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
