import { JsonLd } from "@/components/seo/json-ld"
import { buildBreadcrumbGraph } from "@/lib/seo-structured"

export function PageBreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[]
}) {
  return <JsonLd data={buildBreadcrumbGraph(items)} />
}
