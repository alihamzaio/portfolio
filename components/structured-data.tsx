import { headers } from "next/headers"
import { JsonLd } from "@/components/seo/json-ld"
import { buildSiteGraph } from "@/lib/seo-structured"

/** Global JSON-LD injected in root layout (Person + WebSite) */
export async function StructuredData({ nonce }: { nonce?: string }) {
  const resolvedNonce = nonce ?? (await headers()).get("x-nonce") ?? undefined
  return <JsonLd data={buildSiteGraph()} nonce={resolvedNonce} />
}
