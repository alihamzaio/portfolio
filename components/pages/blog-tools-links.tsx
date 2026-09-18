import { getAffiliatesConfig } from "@/lib/affiliates-store"
import { toolsForTopic } from "@/lib/affiliates"

type Props = {
  topic?: string
  category?: string
}

/** Soft "tools I use" line. Hidden until Admin adds real affiliate links. */
export async function BlogToolsLinks({ topic = "", category = "" }: Props) {
  const config = await getAffiliatesConfig()
  const tools = toolsForTopic(config.tools, `${category} ${topic}`, 3)
  if (!tools.length) return null

  return (
    <div className="text-sm text-neutral-500 leading-relaxed">
      <p className="text-[10px] uppercase tracking-wider text-neutral-600 mb-2">Tools I use</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {tools.map((t) => (
          <li key={t.id}>
            <a
              href={t.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-neutral-400 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              {t.name}
            </a>
            {t.blurb ? <span className="text-neutral-600"> · {t.blurb}</span> : null}
          </li>
        ))}
      </ul>
      {config.disclosure ? (
        <p className="mt-3 text-xs text-neutral-600">{config.disclosure}</p>
      ) : null}
    </div>
  )
}
