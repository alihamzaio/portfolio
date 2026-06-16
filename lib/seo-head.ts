import { SEO_KEYWORDS, absoluteUrl } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

/** Default home page title — rendered in layout <head> for Lighthouse SEO */
export const HOME_PAGE_TITLE = "Ali Hamza | Full Stack Developer (MERN, AWS & Web3)"

export const HOME_META_DESCRIPTION = siteConfig.description

export const HOME_KEYWORDS = SEO_KEYWORDS.join(", ")

export const HOME_CANONICAL = absoluteUrl("/")

export const HOME_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
