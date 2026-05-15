export const siteConfig = {
  name: "Ali Hamza",
  title: "Full Stack Engineer",
  tagline: "MERN + AWS Cloud Engineer",
  headline: "Engineering premium digital products at scale.",
  description:
    "Elite full stack engineer building cinematic web experiences, scalable MERN systems, and AWS cloud infrastructure for ambitious teams.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://alihamza-fawn.vercel.app",
  email: "hamzasarwer9@gmail.com",
  phone: "+923097300913",
  location: "Lahore, Pakistan",
  initials: "AH",
  available: true,
  roles: [
    "Full Stack MERN Engineer",
    "AWS Cloud Architect",
    "Next.js Product Engineer",
    "Serverless Systems Builder",
  ],
  social: {
    github: "https://github.com/alihamzaio",
    linkedin: "https://www.linkedin.com/in/alihamza-fullstack-developer/",
    email: "mailto:hamzasarwer9@gmail.com",
  },
  resumeUrl: "/api/resume/download",
  stats: [
    { label: "Production Apps", value: "25+" },
    { label: "Years Experience", value: "3+" },
    { label: "Client Domains", value: "8+" },
    { label: "Core Stack", value: "MERN" },
  ],
} as const

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Tech Stack", href: "/tech-stack" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const

export type NavItem = (typeof navItems)[number]
