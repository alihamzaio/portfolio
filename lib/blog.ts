export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  featured?: boolean
}

export const blogPosts: BlogPost[] = [
  {
    slug: "serverless-mern-on-aws",
    title: "Shipping Serverless MERN on AWS Without the Chaos",
    excerpt:
      "A practical architecture for Lambda, API Gateway, and Next.js — how I structure APIs, auth, and deployments for production velocity.",
    date: "2025-03-12",
    readTime: "8 min",
    category: "Cloud",
    featured: true,
  },
  {
    slug: "nextjs-performance-playbook",
    title: "The Next.js Performance Playbook I Use on Client Projects",
    excerpt:
      "Core Web Vitals, RSC boundaries, image strategy, and animation budgets that keep SaaS dashboards feeling instant.",
    date: "2025-02-04",
    readTime: "6 min",
    category: "Frontend",
  },
  {
    slug: "designing-premium-developer-brands",
    title: "Designing a Premium Developer Brand (Not Another Portfolio)",
    excerpt:
      "Why motion, typography, and restraint matter more than stacking libraries — lessons from building product-grade personal sites.",
    date: "2025-01-18",
    readTime: "5 min",
    category: "Design",
  },
]

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug)
}
