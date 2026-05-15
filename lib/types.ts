export interface Project {
  id: number
  title: string
  description: string
  details: string
  tags: string[]
  image: string
  link: string
  github: string
  slug?: string
  metrics?: { label: string; value: string }[]
  architecture?: string[]
  featured?: boolean
}

export interface Experience {
  id: string
  role: string
  company: string
  period: string
  location: string
  description: string
  achievements: string[]
  technologies: string[]
  logo?: string
}

export interface SkillItem {
  name: string
  icon?: string
  level?: number
}

export interface SkillCategory {
  id: string
  title: string
  description: string
  skills: SkillItem[]
}
