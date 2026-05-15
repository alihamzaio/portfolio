import type { Metadata } from "next"
import { TechStackContent } from "@/components/pages/tech-stack-content"

export const metadata: Metadata = {
  title: "Tech Stack",
  description: "Frontend, backend, cloud, databases, DevOps — the full MERN + AWS toolkit.",
}

export default function TechStackPage() {
  return <TechStackContent />
}
