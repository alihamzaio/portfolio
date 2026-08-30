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
  /** Case study path when the project exists in projects.json */
  caseStudyHref?: string
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
    image: "/projects/verana.png",
    demo: "https://app.testnet.verana.network/discover",
    github: "https://github.com/verana-labs/verana-indexer",
    caseStudyHref: "/projects/verana-blockchain-crawler-indexing-system",
  },
  {
    id: "adam",
    title: "Adam Store: Multi-Vendor E-Commerce",
    overview:
      "A multi-vendor marketplace needing catalog, checkout, and order flows on a modern stack. Built production e-commerce with reliable APIs and storefront performance for shoppers and vendors.",
    architecture: [
      "Next.js storefront and vendor-facing flows",
      "Node.js APIs for catalog and orders",
      "MongoDB-backed product and order data",
      "Image and catalog performance for retail traffic",
    ],
    metrics: [
      { label: "stack", value: "MERN / Next" },
      { label: "focus", value: "Commerce" },
      { label: "delivery", value: "Production" },
    ],
    techStack: ["Next.js", "Node.js", "MongoDB", "Express.js"],
    image: "/projects/adam.png",
    demo: "https://adamstore.pk",
    caseStudyHref: "/projects/adam-store-full-e-commerce-platform",
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
    image: "/projects/unilabs.png",
    demo: "https://unliabs-web.cloud.exec9.com/",
    caseStudyHref: "/projects/unilabs-defi-asset-management",
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
    image: "/projects/senzi.png",
    demo: "https://senzi.ly/",
    caseStudyHref: "/projects/senzi",
  },
]
