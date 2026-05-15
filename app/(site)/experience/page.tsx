import type { Metadata } from "next"
import { ExperienceContent } from "@/components/pages/experience-content"

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience building production MERN + AWS systems.",
}

export default function ExperiencePage() {
  return <ExperienceContent />
}
