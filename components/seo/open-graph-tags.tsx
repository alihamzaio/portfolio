import { HOME_PAGE_TITLE, absoluteUrl } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

/**
 * Explicit Open Graph tags in <head> for crawlers that miss Next.js Metadata API output.
 */
export function OpenGraphTags() {
  const title = HOME_PAGE_TITLE
  const description = siteConfig.description
  const url = absoluteUrl("/")
  const image = absoluteUrl("/og.png")

  return (
    <>
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={`${siteConfig.name} - Portfolio`} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${siteConfig.name} - ${siteConfig.title}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
