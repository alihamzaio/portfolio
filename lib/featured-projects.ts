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
    title: "Verana: Blockchain Crawler & Indexer",
    overview:
      "Client applications queried RPC nodes for every block lookup, which was slow and expensive at scale. Built a distributed indexer ingesting 10,000+ blocks with BullMQ workers and Moleculer.js services. PostgreSQL-backed APIs reduced direct on-chain reads by about 90%.",
    architecture: [
      "BullMQ worker pipelines for block ingestion and sync",
      "Moleculer.js services for web, Android, and WebSocket channels",
      "PostgreSQL and Redis with Dockerized production deployment",
      "Jest test coverage and CI/CD for release stability",
    ],
    metrics: [
      { label: "blocks indexed", value: "10,000+" },
      { label: "on-chain reads reduced", value: "90%" },
      { label: "client channels", value: "3" },
    ],
    techStack: ["Node.js", "Express.js", "Moleculer.js", "BullMQ", "PostgreSQL", "Redis", "Docker", "Jest"],
    image: "https://res.cloudinary.com/dfjnm7kyu/image/upload/w_800,q_auto,f_auto/v1761659471/ver_imkwft.png",
    demo: "https://idx.testnet.verana.network/",
  },
  {
    id: "healops",
    title: "HealOps: Healthcare & E-Commerce AWS Platform",
    overview:
      "Five warehouse and vendor tenants needed isolated inventory flows on a shared AWS stack. Built Terraform-provisioned serverless architecture with Lambda, DynamoDB, RDS, and Snowflake analytics. Multi-tenant platform across four business domains with 12+ managed AWS resources.",
    architecture: [
      "12+ AWS resources provisioned with Terraform",
      "Lambda serverless services with DynamoDB and RDS",
      "Snowflake analytics integrated with AWS data pipelines",
      "Tenant isolation across healthcare and e-commerce domains",
    ],
    metrics: [
      { label: "tenants served", value: "5+" },
      { label: "AWS resources", value: "12+" },
      { label: "business domains", value: "4" },
    ],
    techStack: ["AWS Lambda", "DynamoDB", "RDS", "Terraform", "Snowflake", "Node.js", "Serverless"],
    image: "https://res.cloudinary.com/dfjnm7kyu/image/upload/w_800,q_auto,f_auto/v1761657172/Dashboard_wtnmjb.png",
  },
  {
    id: "unilabs",
    title: "UniLabs: DeFi Web Platform",
    overview:
      "Web3 asset management product requiring wallet flows and on-chain reads. Built Next.js frontend with Solidity contracts on mainnet and Ethers.js integration. Serves 1,000+ monthly users with contract state reads and reduced support load.",
    architecture: [
      "Next.js frontend with wallet connection flows",
      "Solidity smart contracts deployed to Ethereum mainnet",
      "Ethers.js bindings for contract methods and transaction state",
      "Real-time on-chain data reads for portfolio views",
    ],
    metrics: [
      { label: "monthly users", value: "1,000+" },
      { label: "smart contracts", value: "5+" },
      { label: "stack", value: "Web3" },
    ],
    techStack: ["Next.js", "Solidity", "Ethereum", "Ethers.js", "TypeScript", "Node.js"],
    image: "/projects/unilabs.svg",
    demo: "https://unliabs-web.cloud.exec9.com/",
  },
  {
    id: "senzi",
    title: "Senzi: Dropshipping E-Commerce Platform",
    overview:
      "Manual catalog updates blocked operations for a Libya-focused dropshipping business. Built MERN stack platform with 1688 and Taobao API integrations and automated order pipelines. 5,000+ SKUs synced with about 60% less manual order handling.",
    architecture: [
      "Next.js and Node.js REST services",
      "MongoDB for catalog, orders, and provider workflows",
      "Third-party marketplace API integrations (1688, Taobao)",
      "Automated catalog import and order processing",
    ],
    metrics: [
      { label: "SKUs synced", value: "5,000+" },
      { label: "provider APIs", value: "2" },
      { label: "manual work reduced", value: "60%" },
    ],
    techStack: ["Next.js", "Node.js", "MongoDB", "Express.js", "REST APIs"],
    image: "/projects/senzi.svg",
    demo: "https://senzi.ly/",
  },
]
