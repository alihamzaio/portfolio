import { NextResponse } from "next/server"
import { absoluteUrl } from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const dynamic = "force-static"

/** AI / LLM discovery file — URLs always match siteConfig / NEXT_PUBLIC_SITE_URL */
export function GET() {
  const body = `# ${siteConfig.name}

> ${siteConfig.title} in ${siteConfig.location}. Builds MERN, Next.js, AWS serverless, REST APIs, and blockchain applications for startups and product teams.

## About

- Name: ${siteConfig.name}
- Role: ${siteConfig.title}
- Location: ${siteConfig.location}
- Experience: 3+ years
- Contact: ${absoluteUrl("/contact")}
- GitHub: ${siteConfig.social.github}
- LinkedIn: ${siteConfig.social.linkedinProfile}

## Services

- Full stack web applications (React, Next.js, Node.js)
- REST API development
- AWS cloud and serverless (Lambda, DynamoDB, RDS, Terraform)
- Blockchain and Web3 (Solidity, indexing, wallet integrations)
- Performance, reliability, and deployment

## Key pages

- Home: ${absoluteUrl("/")}
- About: ${absoluteUrl("/about")}
- Projects: ${absoluteUrl("/projects")}
- Experience: ${absoluteUrl("/experience")}
- Tech stack: ${absoluteUrl("/tech-stack")}
- Contact: ${absoluteUrl("/contact")}
- Privacy: ${absoluteUrl("/privacy")}
- Sitemap: ${absoluteUrl("/sitemap.xml")}

## Featured projects

- Verana: Blockchain crawler and indexer
- Adam Store: Full e-commerce platform
- UniLabs: DeFi web platform
- Senzi: Dropshipping e-commerce platform
- KYPI: Campaign performance dashboard

## Optional

- Resume: ${absoluteUrl(siteConfig.resumeUrl)}
`

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
