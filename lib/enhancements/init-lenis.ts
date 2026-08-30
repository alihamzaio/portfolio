import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { prefersReducedMotion } from "@/lib/motion-prefs"
import { setLenis } from "@/lib/lenis-scroll"

let registered = false
let lenisInstance: Lenis | null = null

function ensurePlugin() {
  if (registered || typeof window === "undefined") return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

function onRefresh() {
  lenisInstance?.resize()
}

export function initLenis() {
  ensurePlugin()

  if (prefersReducedMotion()) {
    setLenis(null)
    return () => setLenis(null)
  }

  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    smoothWheel: true,
    touchMultiplier: 1.15,
  })

  lenisInstance = lenis
  setLenis(lenis)
  document.documentElement.classList.add("lenis-active")

  lenis.on("scroll", ScrollTrigger.update)

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && value !== undefined) {
        lenis.scrollTo(value, { immediate: true })
      }
      return lenis.scroll
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
    pinType: document.documentElement.style.transform ? "transform" : "fixed",
  })

  ScrollTrigger.addEventListener("refresh", onRefresh)

  const tick = (time: number) => {
    lenis.raf(time * 1000)
  }

  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  lenis.scrollTo(0, { immediate: true })

  return () => {
    gsap.ticker.remove(tick)
    ScrollTrigger.removeEventListener("refresh", onRefresh)
    ScrollTrigger.scrollerProxy(document.documentElement, {})
    lenis.destroy()
    lenisInstance = null
    setLenis(null)
    document.documentElement.classList.remove("lenis-active")
  }
}
