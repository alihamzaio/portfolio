import { JsonLd } from "@/components/seo/json-ld"
import { buildHomePageGraph } from "@/lib/seo-structured"

export function HomePageJsonLd() {
  return <JsonLd data={buildHomePageGraph()} />
}
