import { toolsForTopic, anyAffiliateActive, AFFILIATE_DISCLOSURE } from "@/lib/affiliates"

type Props = {
  topic?: string
  category?: string
}

/** Soft "tools I use" line under blog posts. No cards. */
export function BlogToolsLinks({ topic = "", category = "" }: Props) {
  const tools = toolsForTopic(`${category} ${topic}`, 3)
  if (!tools.length) return null

  const showDisclosure = anyAffiliateActive(tools)

  return (
    <div className="text-sm text-neutral-500 leading-relaxed">
      <p className="text-[10px] uppercase tracking-wider text-neutral-600 mb-2">Tools I use</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {tools.map((t) => (
          <li key={t.id}>
            <a
              href={t.url}
              target="_blank"
              rel={t.affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
              className="text-neutral-400 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              {t.name}
            </a>
            <span className="text-neutral-600"> · {t.blurb}</span>
          </li>
        ))}
      </ul>
      {showDisclosure && <p className="mt-3 text-xs text-neutral-600">{AFFILIATE_DISCLOSURE}</p>}
    </div>
  )
}
