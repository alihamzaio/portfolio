import { JsonLd } from "@/components/seo/json-ld"
import { buildSiteGraph } from "@/lib/seo-structured"

/** Global JSON-LD injected in root layout (Person + WebSite) */
export function StructuredData() {
  return <JsonLd data={buildSiteGraph()} />
}
