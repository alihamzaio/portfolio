import { headers } from "next/headers"
import { JsonLd } from "@/components/seo/json-ld"
import { type BlogPost, postSeoDescription } from "@/lib/blog"
import { absoluteUrl } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export async function BlogArticleJsonLd({ post }: { post: BlogPost }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined
  const url = absoluteUrl(`/blog/${post.slug}`)
  const image = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : absoluteUrl(post.coverImage)
    : absoluteUrl("/opengraph-image")

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: postSeoDescription(post),
    image: [image],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author || siteConfig.name,
      url: siteConfig.url,
      sameAs: [siteConfig.social.linkedin, siteConfig.social.github],
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    keywords: (post.keywords || post.tags || []).join(", "),
    articleSection: post.category,
    ...(post.youtubeUrl ? { video: { "@type": "VideoObject", contentUrl: post.youtubeUrl } } : {}),
  }

  return <JsonLd data={data} nonce={nonce} />
}
