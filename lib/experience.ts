import type { Experience } from "./types"

export const experiences: Experience[] = [
  {
    id: "birxment",
    role: "Full Stack Software Engineer",
    company: "Birxment",
    period: "August 2025 — Present",
    location: "Remote",
    description:
      "Led full-stack delivery of a blockchain indexer and an AWS serverless healthcare & e-commerce platform — owning architecture, APIs, and deployment.",
    achievements: [
      "Architected microservice backends with Node.js, Moleculer.js, BullMQ, PostgreSQL, and Redis serving web, Android, and WebSocket channels",
      "Containerized with Docker and Kubernetes; CI/CD with Jest and code reviews — 40% fewer production defects",
      "Shipped 20+ REST API endpoints for inventory and order workflows",
      "Mentored 2 junior developers; improved PR turnaround by 25%",
    ],
    technologies: ["Node.js", "Moleculer.js", "BullMQ", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"],
  },
  {
    id: "exec9",
    role: "MERN Stack Developer",
    company: "Exec9",
    period: "June 2024 — July 2025",
    location: "Remote",
    description:
      "Delivered 6+ full-stack applications across e-commerce, CMS, and Web3 for thousands of users.",
    achievements: [
      "Deployed 5+ Solidity smart contracts with wallet integration for NFT and DeFi platforms",
      "Engineered REST and GraphQL APIs with 10+ third-party integrations (payments, content, blockchain)",
      "Launched responsive React UIs with reusable components — 30% faster page loads",
      "Built Senzi dropshipping platform with 5,000+ SKU automation",
    ],
    technologies: ["MongoDB", "Express", "React", "Next.js", "Solidity", "Ethers.js", "GraphQL"],
  },
  {
    id: "explore-logics",
    role: "React.js Developer",
    company: "Explore Logics",
    period: "July 2023 — May 2024",
    location: "Lahore, Pakistan",
    description:
      "Migrated legacy HTML and WordPress sites to React.js; built and maintained 8+ client-facing applications.",
    achievements: [
      "Reduced page load times by 50% and maintenance effort by 35% through React migrations",
      "Optimized cross-browser responsive layouts across 5+ browsers",
      "Delivered features in two-week agile sprints with design and product teams for 10 months",
    ],
    technologies: ["React.js", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Agile"],
  },
]
