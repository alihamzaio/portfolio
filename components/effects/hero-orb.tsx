"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"

export function HeroOrb() {
  const orbRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    if (!orbRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(orbRef.current, {
        y: -12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          strokeDashoffset: -200,
          duration: 8,
          repeat: -1,
          ease: "none",
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center justify-center w-full max-w-[420px] mx-auto aspect-square"
    >
      <div className="absolute inset-0 rounded-full bg-[#3B82F6]/20 blur-[80px] animate-pulse" />
      <div ref={orbRef} className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
        <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden>
          <defs>
            <radialGradient id="orbGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="200" cy="200" r="120" fill="url(#orbGrad)" filter="url(#glow)" />
          <circle
            ref={ringRef}
            cx="200"
            cy="200"
            r="155"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="1.5"
            strokeDasharray="20 12"
            opacity="0.7"
          />
          <circle cx="200" cy="200" r="175" fill="none" stroke="rgba(0,255,178,0.15)" strokeWidth="1" />
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180
            const x = 200 + Math.cos(rad) * 155
            const y = 200 + Math.sin(rad) * 155
            return (
              <circle key={i} cx={x} cy={y} r="3" fill="#3B82F6" opacity="0.6">
                <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glass-card rounded-2xl px-5 py-3 border-[#3B82F6]/20 glow-emerald-sm">
            <p className="text-xs font-mono text-[#A78BFA] tracking-widest uppercase">Systems Online</p>
            <p className="text-lg font-display font-semibold text-white mt-0.5">MERN · AWS</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

