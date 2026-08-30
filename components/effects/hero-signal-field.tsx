"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { prefersReducedMotion } from "@/lib/motion-prefs"

const ACCENT = { r: 232, g: 68, b: 47 }

export function HeroSignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0.5, y: 0.5, active: false })
  const frame = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0
    let h = 0
    let t = 0
    let tick: ((time: number) => void) | null = null

    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      w = parent.clientWidth
      h = parent.clientHeight
      const dpr = Math.min(devicePixelRatio, 1.75)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      mouse.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
        active: true,
      }
    }

    const onLeave = () => {
      mouse.current.active = false
    }

    const draw = () => {
      frame.current += 1
      if (frame.current % 2 !== 0) return

      t += 0.004
      ctx.clearRect(0, 0, w, h)

      const mx = mouse.current.active ? mouse.current.x : 0.5 + Math.sin(t) * 0.08
      const my = mouse.current.active ? mouse.current.y : 0.45 + Math.cos(t * 0.7) * 0.06

      const grad = ctx.createRadialGradient(mx * w, my * h, 0, mx * w, my * h, w * 0.7)
      grad.addColorStop(0, `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, 0.16)`)
      grad.addColorStop(0.4, `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, 0.05)`)
      grad.addColorStop(1, "rgba(5, 5, 7, 0)")

      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      const grad2 = ctx.createRadialGradient(w * 0.15, h * 0.85, 0, w * 0.15, h * 0.85, w * 0.45)
      grad2.addColorStop(0, "rgba(255, 255, 255, 0.035)")
      grad2.addColorStop(1, "rgba(5, 5, 7, 0)")
      ctx.fillStyle = grad2
      ctx.fillRect(0, 0, w, h)

      const gridSize = 56
      ctx.strokeStyle = "rgba(255, 255, 255, 0.022)"
      ctx.lineWidth = 1
      const offsetX = (mx - 0.5) * 10
      const offsetY = (my - 0.5) * 10

      for (let x = 0; x < w + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x + offsetX, 0)
        ctx.lineTo(x + offsetX, h)
        ctx.stroke()
      }
      for (let y = 0; y < h + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y + offsetY)
        ctx.lineTo(w, y + offsetY)
        ctx.stroke()
      }
    }

    tick = () => draw()
    gsap.ticker.add(tick)

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseleave", onLeave)

    return () => {
      if (tick) gsap.ticker.remove(tick)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      data-hero-field
      className="absolute inset-0 h-full w-full pointer-events-none opacity-0"
      aria-hidden
    />
  )
}
