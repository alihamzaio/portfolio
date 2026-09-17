import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { Download } from "lucide-react"
import { readFile } from "fs/promises"
import path from "path"
import { PremiumPage, PremiumReveal } from "@/components/premium"
import { AmberGlassCta } from "@/components/ui/amber-glass-cta"
import { HireCtaBlock } from "@/components/home/hire-cta-block"
import { getLeadMagnet, LEAD_MAGNETS } from "@/lib/lead-magnet"
import { buildPageMetadata } from "@/lib/seo"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return LEAD_MAGNETS.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const magnet = getLeadMagnet(slug)
  if (!magnet) return {}
  return buildPageMetadata({
    title: magnet.title,
    description: magnet.description,
    path: `/resources/${magnet.slug}`,
  })
}

function renderChecklist(md: string) {
  const lines = md.split("\n")
  const nodes: ReactNode[] = []
  let list: string[] = []

  const flushList = () => {
    if (!list.length) return
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="my-4 space-y-2">
        {list.map((item) => (
          <li key={item} className="text-neutral-300 text-[15px] leading-relaxed flex gap-2">
            <span className="text-neutral-500 shrink-0">☐</span>
            <span>{item.replace(/^- \[[ x]\]\s*/i, "")}</span>
          </li>
        ))}
      </ul>
    )
    list = []
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.startsWith("# ")) {
      flushList()
      continue // page already has h1 from magnet title
    }
    if (line.startsWith("## ")) {
      flushList()
      nodes.push(
        <h2 key={`h2-${nodes.length}`} className="mt-10 mb-3 text-lg font-semibold text-white tracking-tight">
          {line.slice(3)}
        </h2>
      )
      continue
    }
    if (line.startsWith("---")) {
      flushList()
      nodes.push(<hr key={`hr-${nodes.length}`} className="my-8 border-white/[0.08]" />)
      continue
    }
    if (/^- \[[ x]\]/i.test(line.trim())) {
      list.push(line.trim())
      continue
    }
    if (line.trim() === "") {
      flushList()
      continue
    }
    flushList()
    if (line.startsWith("→ ") || line.startsWith("Free resource") || line.startsWith("Need help") || line.startsWith("By Ali")) {
      continue
    }
    nodes.push(
      <p key={`p-${nodes.length}`} className="text-neutral-400 text-[15px] leading-relaxed my-3">
        {line}
      </p>
    )
  }
  flushList()
  return nodes
}

export default async function LeadMagnetPage({ params }: Props) {
  const { slug } = await params
  const magnet = getLeadMagnet(slug)
  if (!magnet) notFound()

  const filePath = path.join(process.cwd(), "public", magnet.downloadPath.replace(/^\//, ""))
  let body = ""
  try {
    body = await readFile(filePath, "utf8")
  } catch {
    notFound()
  }

  return (
    <PremiumPage>
      <PremiumReveal>
        <article className="mx-auto max-w-3xl">
          <p className="meta-label mb-3">Free checklist</p>
          <h1 className="text-3xl md:text-[2.2rem] font-semibold text-white tracking-tight leading-tight">
            {magnet.title}
          </h1>
          <p className="mt-4 text-neutral-400 leading-relaxed max-w-2xl">{magnet.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={magnet.downloadPath}
              download={magnet.fileName}
              className="btn-secondary btn-responsive inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download .md
            </a>
            <AmberGlassCta href="/contact">Hire me to ship this</AmberGlassCta>
          </div>

          <div className="mt-10 pt-2 border-t border-white/[0.08]">{renderChecklist(body)}</div>

          <div className="mt-12">
            <HireCtaBlock variant="compact" />
          </div>

          <p className="mt-8">
            <Link href="/resources" className="text-sm text-neutral-400 hover:text-white transition-colors">
              ← All free resources
            </Link>
          </p>
        </article>
      </PremiumReveal>
    </PremiumPage>
  )
}
