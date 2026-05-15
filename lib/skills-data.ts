import type { SkillCategory } from "./types"

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "Product-grade interfaces with React & Next.js",
    skills: [
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "Tailwind CSS" },
      { name: "Framer Motion" },
      { name: "GSAP" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    description: "Scalable APIs & data systems",
    skills: [
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express.js" },
      { name: "REST APIs" },
      { name: "GraphQL" },
      { name: "WebSockets" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & AWS",
    description: "Serverless & cloud-native delivery",
    skills: [
      { name: "AWS Lambda" },
      { name: "API Gateway" },
      { name: "S3 & CloudFront" },
      { name: "EC2 & VPC" },
      { name: "Serverless Framework" },
      { name: "IAM & Security" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    description: "Relational & document stores",
    skills: [
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "Redis" },
      { name: "Indexing & Query Design" },
    ],
  },
  {
    id: "devops",
    title: "DevOps",
    description: "Ship fast, ship safe",
    skills: [
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "CI/CD", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg" },
      { name: "Git & GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Linux" },
      { name: "Nginx" },
    ],
  },
  {
    id: "tooling",
    title: "Tooling",
    description: "Workflow & collaboration",
    skills: [
      { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
      { name: "Postman" },
      { name: "Figma" },
      { name: "Vercel" },
      { name: "Cloudinary" },
    ],
  },
]
