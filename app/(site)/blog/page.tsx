import type { Metadata } from "next"
import { BlogContent } from "@/components/pages/blog-content"

export const metadata: Metadata = {
  title: "Blog",
  description: "Engineering insights on MERN, AWS, Next.js, and premium developer experiences.",
}

export default function BlogPage() {
  return <BlogContent />
}
