import type { Metadata } from "next"
import { ProjectsGrid } from "@/components/pages/projects-grid"

export const metadata: Metadata = {
  title: "Projects",
  description: "Premium case studies — MERN + AWS production applications.",
}

export default function ProjectsPage() {
  return <ProjectsGrid />
}
