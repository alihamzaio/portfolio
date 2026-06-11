import { headers } from "next/headers"
import { JsonLd } from "@/components/seo/json-ld"
import { buildBreadcrumbGraph } from "@/lib/seo-structured"

export async function PageBreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[]
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined
  return <JsonLd data={buildBreadcrumbGraph(items)} nonce={nonce} />
}
