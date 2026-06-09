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
    title: "Structuring Serverless MERN on AWS for Production",
    excerpt:
      "How I organize Lambda functions, API Gateway routes, and Next.js deployments: auth patterns, environment separation, and release workflows under real traffic.",
    date: "2025-03-12",
    readTime: "8 min",
    category: "Cloud",
    featured: true,
  },
  {
    slug: "nextjs-performance-playbook",
    title: "Next.js Performance Patterns for Client Dashboards",
    excerpt:
      "Steps for Core Web Vitals, server component boundaries, image strategy, and animation budgets on data-heavy React applications.",
    date: "2025-02-04",
    readTime: "6 min",
    category: "Frontend",
  },
  {
    slug: "blockchain-indexer-architecture",
    title: "Building a Reliable Blockchain Indexer with Node.js",
    excerpt:
      "Worker queues, idempotent ingestion, and PostgreSQL schema design for RPC indexing. Notes from shipping 10,000+ indexed blocks in production.",
    date: "2025-01-18",
    readTime: "7 min",
    category: "Blockchain",
  },
]

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug)
}
