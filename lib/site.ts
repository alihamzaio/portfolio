export const siteConfig = {
  name: "Ali Hamza",
  title: "MERN Stack Developer & AI Engineer",
  tagline: "Full Stack · MERN · AI Integration",
  headline: "Building intelligent, cinematic digital products.",
  description:
    "Premium full stack engineer specializing in MERN, Next.js, AWS, and AI-powered applications for ambitious startups and global teams.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://alihamza-fawn.vercel.app",
  email: "hamzasarwer9@gmail.com",
  phone: "+923097300913",
  location: "Lahore, Pakistan",
  initials: "AH",
  available: true,
  calendlyUrl: "https://calendly.com",
  roles: [
    "MERN Stack Architect",
    "AI Integration Engineer",
    "Next.js Product Builder",
    "Cloud & Serverless Developer",
  ],
  social: {
    github: "https://github.com/alilogics007",
    linkedin: "https://www.linkedin.com/in/alihamza9",
    email: "mailto:hamzasarwer9@gmail.com",
  },
  resumeUrl: "/api/resume/download",
  stats: [
    { label: "Projects Delivered", value: 25, suffix: "+" },
    { label: "Years Experience", value: 3, suffix: "+" },
    { label: "Technologies", value: 20, suffix: "+" },
    { label: "Client Satisfaction", value: 100, suffix: "%" },
  ],
} as const

export const navItems = [
  { label: "Home", href: "/#home", id: "home" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Skills", href: "/#skills", id: "skills" },
  { label: "Work", href: "/#projects", id: "projects" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Contact", href: "/#contact", id: "contact" },
] as const

export type NavItem = (typeof navItems)[number]
