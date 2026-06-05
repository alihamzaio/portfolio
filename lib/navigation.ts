import { prefersReducedMotion } from "@/lib/motion-prefs"

/** Map homepage section hashes to dedicated routes when navigating from other pages */
export const SECTION_ROUTES: Record<string, string> = {
  home: "/",
  about: "/about",
  skills: "/tech-stack",
  projects: "/projects",
  experience: "/experience",
  contact: "/contact",
}

export type LinkKind = "external" | "hash" | "internal" | "download"

export function getLinkKind(href: string): LinkKind {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return "external"
  }
  if (href.startsWith("/api/")) return "download"
  if (href.startsWith("/#") || href.startsWith("#")) return "hash"
  return "internal"
}

export function getSectionIdFromHash(href: string): string {
  return href.replace(/^\/#/, "").replace(/^#/, "")
}

export function scrollToSection(href: string) {
  const id = getSectionIdFromHash(href)
  if (!id) return
  const behavior = prefersReducedMotion() ? "auto" : "smooth"
  document.getElementById(id)?.scrollIntoView({ behavior })
}

/** Resolve nav href: on home use hash anchors; elsewhere use matching page routes */
export function resolveNavHref(href: string, pathname: string): string {
  if (!href.startsWith("/#")) return href
  if (pathname === "/") return href
  const sectionId = getSectionIdFromHash(href)
  return SECTION_ROUTES[sectionId] ?? "/"
}

export function shouldSmoothScrollHash(href: string, pathname: string): boolean {
  return pathname === "/" && href.startsWith("/#")
}
