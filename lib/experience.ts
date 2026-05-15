import type { Experience } from "./types"

export const experiences: Experience[] = [
  {
    id: "exec9",
    role: "Full Stack Developer",
    company: "Exec9",
    period: "2024 — Present",
    location: "Remote",
    description:
      "Building production web applications, dashboards, and blockchain integrations for global clients across fintech, healthcare, and Web3.",
    achievements: [
      "Delivered 15+ production apps including e-commerce, DeFi, and enterprise dashboards",
      "Architected scalable MERN backends with REST APIs and real-time data pipelines",
      "Integrated blockchain crawlers, NFT marketplaces, and Web3 wallet flows",
      "Optimized Core Web Vitals and achieved sub-2s load times on Next.js apps",
    ],
    technologies: ["Next.js", "React", "Node.js", "MongoDB", "Docker", "TypeScript"],
  },
  {
    id: "freelance",
    role: "MERN Stack Developer",
    company: "Freelance & Contract",
    period: "2022 — Present",
    location: "Lahore, Pakistan",
    description:
      "End-to-end development for startups and agencies — from landing pages to full-stack platforms with admin dashboards and API systems.",
    achievements: [
      "Built Adam Store — full e-commerce platform with customer & admin portals",
      "Developed Verana blockchain indexer with PostgreSQL and Bull.js workers",
      "Created healthcare, fintech, and SaaS dashboards with real-time analytics",
      "Deployed containerized apps with CI/CD pipelines and cloud hosting",
    ],
    technologies: ["MERN", "PostgreSQL", "AWS", "Docker", "Tailwind CSS"],
  },
  {
    id: "learning",
    role: "Cloud & DevOps Focus",
    company: "Continuous Learning",
    period: "2023 — Present",
    location: "Self-directed",
    description:
      "Expanding expertise in AWS serverless architecture, infrastructure as code, and production deployment workflows.",
    achievements: [
      "AWS Lambda, API Gateway, and serverless patterns",
      "Docker containerization and multi-service orchestration",
      "CI/CD with GitHub Actions and automated deployments",
      "Performance tuning and observability best practices",
    ],
    technologies: ["AWS", "Lambda", "Docker", "GitHub Actions", "Linux"],
  },
]
