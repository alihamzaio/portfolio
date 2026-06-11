import { headers } from "next/headers"
import { JsonLd } from "@/components/seo/json-ld"
import { buildProjectGraph } from "@/lib/seo-structured"
import type { Project } from "@/lib/types"

export async function ProjectJsonLd({ project }: { project: Project & { slug: string } }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined
  return <JsonLd data={buildProjectGraph(project)} nonce={nonce} />
}
