import { JsonLd } from "@/components/seo/json-ld"
import { buildProjectGraph } from "@/lib/seo-structured"
import type { Project } from "@/lib/types"

export function ProjectJsonLd({ project }: { project: Project & { slug: string } }) {
  return <JsonLd data={buildProjectGraph(project)} />
}
