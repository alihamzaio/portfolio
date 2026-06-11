import { headers } from "next/headers"
import { JsonLd } from "@/components/seo/json-ld"
import { buildHomePageGraph } from "@/lib/seo-structured"

export async function HomePageJsonLd() {
  const nonce = (await headers()).get("x-nonce") ?? undefined
  return <JsonLd data={buildHomePageGraph()} nonce={nonce} />
}
