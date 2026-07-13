import type { SkillCategory } from "./types"

/** All icons on cdn.jsdelivr.net — allowed by CSP img-src */
const d = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons"
const si = "https://cdn.jsdelivr.net/npm/simple-icons@11/icons"

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages",
    description: "Languages used for full-stack and smart contract development",
    skills: [
      { name: "JavaScript", icon: `${d}/javascript/javascript-original.svg` },
      { name: "TypeScript", icon: `${d}/typescript/typescript-original.svg` },
      { name: "Solidity", icon: `${d}/solidity/solidity-original.svg`, invertIcon: true },
      { name: "SQL", icon: `${d}/azuresqldatabase/azuresqldatabase-original.svg` },
      { name: "HTML5", icon: `${d}/html5/html5-original.svg` },
      { name: "CSS3", icon: `${d}/css3/css3-original.svg` },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    description: "React and Next.js interfaces with TypeScript and CSS",
    skills: [
      { name: "React.js", icon: `${d}/react/react-original.svg` },
      { name: "Next.js", icon: `${d}/nextjs/nextjs-original.svg`, invertIcon: true },
      { name: "Redux", icon: `${d}/redux/redux-original.svg` },
      { name: "Tailwind CSS", icon: `${d}/tailwindcss/tailwindcss-original.svg` },
      { name: "Material UI", icon: `${d}/materialui/materialui-original.svg` },
      { name: "Three.js", icon: `${d}/threejs/threejs-original.svg`, invertIcon: true },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    description: "Node.js services, REST APIs, and background workers",
    skills: [
      { name: "Node.js", icon: `${d}/nodejs/nodejs-original.svg` },
      { name: "Express.js", icon: `${d}/express/express-original.svg`, invertIcon: true },
      {
        name: "Moleculer.js",
        icon: "https://cdn.jsdelivr.net/gh/moleculerjs/branding@master/logo/logo.png",
      },
      { name: "BullMQ", icon: `${d}/redis/redis-original.svg` },
      { name: "REST APIs", icon: `${si}/openapiinitiative.svg`, invertIcon: true },
      { name: "GraphQL", icon: `${d}/graphql/graphql-plain.svg` },
      { name: "WebSockets", icon: `${d}/socketio/socketio-original.svg`, invertIcon: true },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    description: "Relational, document, and cache layers for production workloads",
    skills: [
      { name: "PostgreSQL", icon: `${d}/postgresql/postgresql-original.svg` },
      { name: "MongoDB", icon: `${d}/mongodb/mongodb-original.svg` },
      { name: "Redis", icon: `${d}/redis/redis-original.svg` },
      {
        name: "DynamoDB",
        icon: `${d}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
        invertIcon: true,
      },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    description: "AWS serverless, containers, and infrastructure as code",
    skills: [
      {
        name: "AWS Lambda",
        icon: `${d}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
        invertIcon: true,
      },
      {
        name: "RDS & DynamoDB",
        icon: `${d}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
        invertIcon: true,
      },
      { name: "Docker", icon: `${d}/docker/docker-original.svg` },
      { name: "Kubernetes", icon: `${d}/kubernetes/kubernetes-plain.svg` },
      { name: "Terraform", icon: `${d}/terraform/terraform-original.svg` },
      { name: "CI/CD", icon: `${d}/githubactions/githubactions-original.svg` },
    ],
  },
  {
    id: "blockchain",
    title: "Blockchain",
    description: "Smart contracts, indexing, and Web3 integrations",
    skills: [
      { name: "Solidity", icon: `${d}/solidity/solidity-original.svg`, invertIcon: true },
      { name: "Ethers.js", icon: `${si}/ethers.svg`, invertIcon: true },
      { name: "RPC Indexing", icon: `${d}/ethereum/ethereum-original.svg`, invertIcon: true },
      { name: "Wallet Integration", icon: `${si}/walletconnect.svg`, invertIcon: true },
      { name: "Ethereum", icon: `${d}/ethereum/ethereum-original.svg`, invertIcon: true },
      { name: "NFTs", icon: `${si}/opensea.svg`, invertIcon: true },
    ],
  },
]
