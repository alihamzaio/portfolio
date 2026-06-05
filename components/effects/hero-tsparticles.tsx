"use client"

import { useMemo } from "react"
import Particles, { ParticlesProvider } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { useReducedMotion } from "framer-motion"

const initParticles = async (engine: Parameters<typeof loadSlim>[0]) => {
  await loadSlim(engine)
}

function HeroParticlesInner() {
  const options = useMemo(
    () => ({
      fullScreen: false,
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: {
          value: typeof window !== "undefined" && window.innerWidth < 768 ? 35 : 70,
          density: { enable: true },
        },
        color: { value: ["#00d4ff", "#3b82f6", "#60a5fa"] },
        opacity: { value: { min: 0.25, max: 0.65 } },
        size: { value: { min: 1, max: 2.5 } },
        links: {
          enable: true,
          color: "#00d4ff",
          opacity: 0.18,
          distance: 130,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.45,
          direction: "none" as const,
          random: true,
          outModes: { default: "bounce" as const },
        },
      },
      interactivity: {
        detectsOn: "window" as const,
        events: {
          onHover: { enable: true, mode: "grab" },
          resize: { enable: true },
        },
        modes: {
          grab: { distance: 140, links: { opacity: 0.35 } },
        },
      },
    }),
    []
  )

  return (
    <Particles
      id="hero-particles"
      className="absolute inset-0 z-[1] pointer-events-none"
      options={options}
    />
  )
}

export function HeroTsParticles() {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return null

  return (
    <ParticlesProvider init={initParticles}>
      <HeroParticlesInner />
    </ParticlesProvider>
  )
}
