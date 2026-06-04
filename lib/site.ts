export const siteConfig = {
  name: "Ali Hamza",
  title: "Full Stack Software Engineer",
  tagline: "MERN · AWS Serverless · Blockchain",
  headline:
    "I help teams ship MERN applications, AWS backends, and blockchain features — with maintainable code and clear communication.",
  description:
    "Full Stack Software Engineer (3+ years). Built production systems at Birxment, Exec9, and Explore Logics — REST APIs, AWS serverless, blockchain indexers, and e-commerce/Web3 UIs. Based in Lahore, Pakistan; available remote.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://alihamza-fawn.vercel.app",
  email: "hamzasarwer9@gmail.com",
  phone: "+92 309 7300913",
  location: "Lahore, Pakistan",
  education: "B.S. Computer Science — University of Education (2019–2023)",
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
    "MERN Stack",
    "AWS Serverless",
    "Blockchain / Web3",
    "Microservices",
    "PostgreSQL & MongoDB",
  ],
} as const

export const engineeringMetrics = [
  { label: "REST APIs delivered", value: "15+" },
  { label: "Blocks indexed (Verana)", value: "10,000+" },
  { label: "Fewer prod defects", value: "40%" },
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
