import type { SkillCategory } from "./types"

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages",
    description: "Languages used for full-stack and smart contract development",
    skills: [
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "Solidity" },
      { name: "SQL" },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    description: "React and Next.js interfaces with TypeScript and CSS",
    skills: [
      { name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "Redux" },
      { name: "Tailwind CSS" },
      { name: "Material UI" },
      { name: "Three.js" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    description: "Node.js services, REST APIs, and background workers",
    skills: [
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express.js" },
      { name: "Moleculer.js" },
      { name: "BullMQ" },
      { name: "REST APIs" },
      { name: "GraphQL" },
      { name: "WebSockets" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    description: "Relational, document, and cache layers for production workloads",
    skills: [
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "Redis" },
      { name: "DynamoDB" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    description: "AWS serverless, containers, and infrastructure as code",
    skills: [
      { name: "AWS Lambda" },
      { name: "RDS & DynamoDB" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "Kubernetes" },
      { name: "Terraform" },
      { name: "CI/CD", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg" },
    ],
  },
  {
    id: "blockchain",
    title: "Blockchain",
    description: "Smart contracts, indexing, and Web3 integrations",
    skills: [
      { name: "Solidity" },
      { name: "Ethers.js" },
      { name: "RPC Indexing" },
      { name: "Wallet Integration" },
      { name: "Ethereum" },
      { name: "NFTs" },
    ],
  },
]
