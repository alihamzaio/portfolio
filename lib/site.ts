export const siteConfig = {
  name: "Ali Hamza",
  title: "Full Stack Developer",
  tagline: "MERN · AWS Serverless · Blockchain",
  headline:
    "Web applications, cloud infrastructure, REST APIs, and blockchain integrations in production.",
  description:
    "Full stack developer building web applications, REST APIs, and AWS infrastructure. Based in Lahore, Pakistan.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://alihamza-fawn.vercel.app",
  email: "hamzasarwer9@gmail.com",
  phone: "+92 309 7300913",
  location: "Lahore, Pakistan",
  education: "B.S. Computer Science, University of Education (2019–2023)",
  initials: "AH",
  available: true,
  social: {
    github: "https://github.com/alihamzaio",
    linkedin: "https://www.linkedin.com/in/alihamza-fullstack-developer",
    email: "mailto:hamzasarwer9@gmail.com",
  },
  resumeUrl: "/api/resume/download",
  githubUsername: "alihamzaio",
  specialties: [
    "Full Stack Development",
    "MERN Stack",
    "Next.js",
    "AWS Serverless",
    "REST API Development",
    "Blockchain / Web3",
    "MongoDB & PostgreSQL",
  ],
} as const

export const engineeringMetrics = [
  { label: "REST APIs built", value: "15+" },
  { label: "Blocks indexed (Verana)", value: "10,000+" },
  { label: "Fewer production defects", value: "40%" },
  { label: "SKUs automated (Senzi)", value: "5,000+" },
] as const

export const navItems = [
  { label: "Home", href: "/#home", id: "home" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Skills", href: "/#skills", id: "skills" },
  { label: "Work", href: "/#projects", id: "projects" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Contact", href: "/#contact", id: "contact" },
] as const

export type NavItem = (typeof navItems)[number]
