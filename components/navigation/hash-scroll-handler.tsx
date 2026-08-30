"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { getSectionIdFromHash, scrollToSection } from "@/lib/navigation"
import { scrollToSectionId } from "@/lib/lenis-scroll"

/** Scroll to section after client navigation to /#section — always via Lenis when available. */
export function HashScrollHandler() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== "/") return
    const hash = window.location.hash
    if (!hash) return

    const id = getSectionIdFromHash(hash)
    if (!id) return

    const run = () => scrollToSectionId(id)
    const t = window.setTimeout(run, 80)
    return () => window.clearTimeout(t)
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
