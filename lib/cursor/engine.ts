import { CURSOR_CONFIG } from "./config"
import { resolveCursorTarget } from "./resolve-target"
import { DEFAULT_CURSOR_TARGET, type CursorTarget } from "./types"

const BODY_CLASS = "custom-cursor-active"

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor
}

function setTranslate3d(el: HTMLElement, x: number, y: number, scale = 1) {
  el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`
}

export function createCursorEngine(root: HTMLElement) {
  const dot = root.querySelector<HTMLElement>("[data-pc-dot]")!
  const ring = root.querySelector<HTMLElement>("[data-pc-ring]")!
  const glow = root.querySelector<HTMLElement>("[data-pc-glow]")!
  const label = root.querySelector<HTMLElement>("[data-pc-label]")!
  const labelText = root.querySelector<HTMLElement>("[data-pc-label-text]")!
  const labelArrow = root.querySelector<HTMLElement>("[data-pc-label-arrow]")!

  let mx = -200
  let my = -200
  let fx = mx
  let fy = my
  let visible = false
  let rafId = 0

  let target: CursorTarget = DEFAULT_CURSOR_TARGET
  let ringSize = CURSOR_CONFIG.ringSize.default
  let dotScale = CURSOR_CONFIG.dotScale.default
  let glowOpacity = CURSOR_CONFIG.glowOpacity.default
  let labelOpacity = 0

  let magneticEl: HTMLElement | null = null
  let magneticX = 0
  let magneticY = 0

  const resetMagnetic = (el: HTMLElement) => {
    el.style.transform = ""
    magneticX = 0
    magneticY = 0
  }

  const applyTarget = (next: CursorTarget) => {
    if (magneticEl && magneticEl !== next.element) {
      resetMagnetic(magneticEl)
    }
    target = next
    magneticEl = next.magnetic && next.element ? next.element : null

    labelText.textContent = next.label
    labelArrow.hidden = !next.showArrow
    label.hidden = !next.label && !next.showArrow

    root.dataset.mode = next.mode
    root.dataset.theme = next.theme

    if (next.mode === "hidden") {
      document.body.classList.remove(BODY_CLASS)
      root.classList.remove("pc--visible")
    } else {
      document.body.classList.add(BODY_CLASS)
      root.classList.add("pc--visible")
    }
  }

  const onMove = (e: MouseEvent) => {
    mx = e.clientX
    my = e.clientY
    if (!visible) {
      visible = true
      fx = mx
      fy = my
      root.classList.add("pc--visible")
    }
  }

  const onOver = (e: MouseEvent) => {
    applyTarget(resolveCursorTarget(e.target))
  }

  const onLeave = () => {
    applyTarget(DEFAULT_CURSOR_TARGET)
  }

  const tick = () => {
    const hidden = target.mode === "hidden"
    const ringLerp =
      target.mode === "skill" ? CURSOR_CONFIG.ringLerpSkill : CURSOR_CONFIG.ringLerp
    const v = CURSOR_CONFIG.visualLerp

    if (!hidden) {
      fx = lerp(fx, mx, ringLerp)
      fy = lerp(fy, my, ringLerp)
    }

    const sizeTarget = CURSOR_CONFIG.ringSize[target.mode]
    const scaleTarget = CURSOR_CONFIG.dotScale[target.mode]
    const glowTarget = CURSOR_CONFIG.glowOpacity[target.mode]
    const labelTarget = target.label || target.showArrow ? 1 : 0

    ringSize = lerp(ringSize, sizeTarget, v)
    dotScale = lerp(dotScale, scaleTarget, v)
    glowOpacity = lerp(glowOpacity, glowTarget, v)
    labelOpacity = lerp(labelOpacity, labelTarget, v)

    if (magneticEl && !hidden) {
      const rect = magneticEl.getBoundingClientRect()
      const strength =
        CURSOR_CONFIG.magneticStrength[target.mode] ??
        CURSOR_CONFIG.magneticStrength.default
      const tx = (mx - rect.left - rect.width / 2) * strength
      const ty = (my - rect.top - rect.height / 2) * strength
      magneticX = lerp(magneticX, tx, CURSOR_CONFIG.magneticLerp)
      magneticY = lerp(magneticY, ty, CURSOR_CONFIG.magneticLerp)
      magneticEl.style.transform = `translate3d(${magneticX}px, ${magneticY}px, 0)`
    }

    if (!hidden && visible) {
      setTranslate3d(dot, mx, my, dotScale)
      setTranslate3d(ring, fx, fy, 1)
      setTranslate3d(glow, fx, fy, 1)

      ring.style.width = `${ringSize}px`
      ring.style.height = `${ringSize}px`
      glow.style.width = `${ringSize + 24}px`
      glow.style.height = `${ringSize + 24}px`
      glow.style.opacity = String(glowOpacity)

      label.style.transform = `translate3d(${mx + 16}px, ${my + 16}px, 0)`
      label.style.opacity = String(labelOpacity)
    }

    rafId = requestAnimationFrame(tick)
  }

  document.addEventListener("mousemove", onMove, { passive: true })
  document.addEventListener("mouseover", onOver, { passive: true })
  document.addEventListener("mouseleave", onLeave, { passive: true })

  document.body.classList.add(BODY_CLASS)
  rafId = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(rafId)
    document.removeEventListener("mousemove", onMove)
    document.removeEventListener("mouseover", onOver)
    document.removeEventListener("mouseleave", onLeave)
    document.body.classList.remove(BODY_CLASS)
    if (magneticEl) resetMagnetic(magneticEl)
  }
}
