import { navItems } from "@/lib/site"
import { scrollToSectionId } from "@/lib/lenis-scroll"

/** Map homepage section hashes to dedicated routes when navigating from other pages */
export const SECTION_ROUTES: Record<string, string> = {
  home: "/",
  about: "/about",
  skills: "/tech-stack",
  projects: "/projects",
  experience: "/experience",
  contact: "/contact",
  intelligence: "/",
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

export function isHttpUrl(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

/** Open real websites in a new tab. mailto/tel stay in the current window. */
export function offsiteAnchorProps(href: string): { target?: "_blank"; rel?: string } {
  if (!isHttpUrl(href)) return {}
  return { target: "_blank", rel: "noopener noreferrer" }
}

export function getSectionIdFromHash(href: string): string {
  return href.replace(/^\/#/, "").replace(/^#/, "")
}

export function scrollToSection(href: string) {
  const id = getSectionIdFromHash(href)
  if (!id) return
  scrollToSectionId(id)
}

/** Log warnings for nav hrefs that don't match a DOM section id on the homepage. */
export function validateNavSectionIds() {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return

  navItems.forEach((item) => {
    if (!item.href.startsWith("/#")) return
    const id = getSectionIdFromHash(item.href)
    if (!document.getElementById(id)) {
      console.warn(`[nav] Missing section id="${id}" for nav link "${item.label}" (${item.href})`)
    }
  })
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
