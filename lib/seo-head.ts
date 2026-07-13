import { SEO_KEYWORDS, absoluteUrl, HOME_PAGE_TITLE } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export { HOME_PAGE_TITLE }

export const HOME_META_DESCRIPTION = siteConfig.description

export const HOME_KEYWORDS = SEO_KEYWORDS.join(", ")

export const HOME_CANONICAL = absoluteUrl("/")

export const HOME_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
