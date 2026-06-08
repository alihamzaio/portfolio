import { prefersFinePointer, prefersReducedMotion } from "@/lib/motion-prefs"

const TRAIL_COUNT = 8

export function initPremiumCursor() {
  if (!prefersFinePointer() || prefersReducedMotion()) return () => {}

  const ring = document.createElement("div")
  ring.className = "premium-cursor-ring cursor-trail-ring"
  document.body.appendChild(ring)

  const trails: HTMLDivElement[] = []
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const t = document.createElement("div")
    t.className = "cursor-trail-dot"
    t.style.opacity = String(0.45 - i * 0.05)
    document.body.appendChild(t)
    trails.push(t)
  }

  let mx = 0
  let my = 0
  let rx = 0
  let ry = 0
  const trailPos = trails.map(() => ({ x: 0, y: 0 }))
  let hovering = false
  let raf = 0

  const onMove = (e: MouseEvent) => {
    mx = e.clientX
    my = e.clientY
  }

  const onOver = (e: MouseEvent) => {
    const t = e.target as HTMLElement
    hovering = !!t.closest("a, button, [data-cursor], input, textarea, select, label")
  }

  const tick = () => {
    rx += (mx - rx) * 0.14
    ry += (my - ry) * 0.14
    const size = hovering ? 56 : 40
    ring.style.width = `${size}px`
    ring.style.height = `${size}px`
    ring.style.borderColor = hovering ? "rgba(34,211,238,0.65)" : "rgba(255,255,255,0.25)"
    ring.style.background = hovering ? "rgba(59,130,246,0.12)" : "transparent"
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`

    trailPos.forEach((p, i) => {
      const target = i === 0 ? { x: mx, y: my } : trailPos[i - 1]
      const factor = 0.22 + i * 0.04
      p.x += (target.x - p.x) * factor
      p.y += (target.y - p.y) * factor
      trails[i].style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`
    })

    raf = requestAnimationFrame(tick)
  }

  window.addEventListener("mousemove", onMove, { passive: true })
  document.addEventListener("mouseover", onOver, { passive: true })
  document.body.classList.add("premium-cursor-active")
  raf = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener("mousemove", onMove)
    document.removeEventListener("mouseover", onOver)
    ring.remove()
    trails.forEach((t) => t.remove())
    document.body.classList.remove("premium-cursor-active")
  }
}
