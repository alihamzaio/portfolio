"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { scrollToSection } from "@/lib/navigation"

/** Scroll to section after client navigation to /#section */
export function HashScrollHandler() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== "/") return
    const hash = window.location.hash
    if (!hash) return

    const id = hash.replace("#", "")
    const t = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    })
    return () => cancelAnimationFrame(t)
  }, [pathname])

  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.replace("#", "")
      if (id) scrollToSection(`#${id}`)
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return null
}
