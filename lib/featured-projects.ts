export interface FeaturedProject {
  id: string
  title: string
  overview: string
  architecture: string[]
  metrics: { label: string; value: string }[]
  techStack: string[]
  image: string
  github?: string
  demo?: string
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: "verana",
    title: "Verana — Blockchain Crawler & Indexer",
    overview:
      "Verana's apps were hammering RPC nodes for every block lookup — slow and expensive. I built an indexer that ingests 10,000+ blocks, decodes protocol txs, and cut direct on-chain reads by ~90%. Hardest part: keeping BullMQ workers in sync when nodes lagged without duplicating work.",
    architecture: [
      "BullMQ microservice pipelines with sub-second sync",
      "Moleculer.js services for web, Android, and WebSocket channels",
      "PostgreSQL + Redis with Dockerized production stack",
      "Jest coverage and CI/CD for production stability",
    ],
    metrics: [
      { label: "Blocks indexed", value: "10,000+" },
      { label: "On-chain reads cut", value: "90%" },
      { label: "Client channels", value: "3" },
    ],
    techStack: ["Node.js", "Express", "Moleculer.js", "BullMQ", "PostgreSQL", "Redis", "Docker", "Jest"],
    image: "https://res.cloudinary.com/dfjnm7kyu/image/upload/v1761659471/ver_imkwft.png",
    demo: "https://idx.testnet.verana.network/verana/",
  },
  {
    id: "healops",
    title: "HealOps — Healthcare & E-Commerce AWS Platform",
    overview:
      "Five warehouse and vendor tenants needed isolated inventory flows on one AWS stack. I provisioned 12+ resources with Terraform, wired Lambda + DynamoDB + RDS, and plugged Snowflake in for analytics. Lesson learned: tenant boundaries in serverless are easy to sketch, painful to enforce — we got there.",
    architecture: [
      "12+ AWS resources provisioned with Terraform",
      "Lambda serverless services with DynamoDB and RDS",
      "Snowflake analytics integrated with AWS data pipelines",
      "Multi-tenant isolation across 4 business domains",
    ],
    metrics: [
      { label: "Tenants served", value: "5+" },
      { label: "AWS resources", value: "12+" },
      { label: "Business domains", value: "4" },
    ],
    techStack: ["AWS Lambda", "DynamoDB", "RDS", "Terraform", "Snowflake", "Node.js", "Serverless"],
    image: "https://res.cloudinary.com/dfjnm7kyu/image/upload/v1761657172/Dashboard_wtnmjb.png",
  },
  {
    id: "unilabs",
    title: "UniLabs — Blockchain Web Platform",
    overview:
      "UniLabs wanted DeFi that didn't feel like a spreadsheet. I shipped a Next.js UI with wallet flows and Solidity on mainnet for 1,000+ monthly users. The 3D bits were fun; the unglamorous win was getting contract reads reliable enough that support tickets dropped.",
    architecture: [
      "Next.js frontend with Three.js and Framer Motion",
      "Solidity smart contracts deployed to mainnet",
      "Ethers.js wallet flows and contract method bindings",
      "Live on-chain transaction and state reads",
    ],
    metrics: [
      { label: "Monthly users", value: "1,000+" },
      { label: "Smart contracts", value: "5+" },
      { label: "Stack", value: "Web3" },
    ],
    techStack: ["Next.js", "Solidity", "Ethereum", "Ethers.js", "Three.js", "Framer Motion"],
    image: "https://www.exec9.com/_next/image?url=%2Funilabs-case-study.png&w=1920&q=75",
    demo: "https://unliabs-web.cloud.exec9.com/",
  },
  {
    id: "senzi",
    title: "Senzi — Dropshipping E-Commerce Platform",
    overview:
      "Manual catalog updates were killing the ops team. I connected 1688 and Taobao APIs and automated 5,000+ SKUs — about 60% less hand-entered orders. Honestly, provider API docs were the real boss fight; the MongoDB schema was the easy part.",
    architecture: [
      "Next.js + Node.js REST services",
      "MongoDB for catalog, orders, and provider workflows",
      "Third-party provider API integrations (1688, Taobao)",
      "Automated catalog and order pipeline",
    ],
    metrics: [
      { label: "SKUs synced", value: "5,000+" },
      { label: "Provider APIs", value: "2" },
      { label: "Manual work cut", value: "60%" },
    ],
    techStack: ["Next.js", "Node.js", "MongoDB", "REST APIs"],
    image: "https://www.exec9.com/_next/image?url=%2Fsenzi-case-study.png&w=1920&q=75",
    demo: "https://senzi.ly/",
  },
]
