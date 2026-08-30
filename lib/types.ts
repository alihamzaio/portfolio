export interface Project {
  id: number
  title: string
  description: string
  details: string
  /** Client / business problem — case study */
  problem?: string
  /** What was built and delivered — case study */
  solution?: string
  tags: string[]
  image: string
  link: string
  github?: string
  slug?: string
  metrics?: { label: string; value: string }[]
  architecture?: string[]
  featured?: boolean
  /** Learning/demo work — hidden from the public projects grid */
  hidden?: boolean
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
  /** Black/monochrome logos — invert so they stay visible on dark theme */
  invertIcon?: boolean
}

export interface SkillCategory {
  id: string
  title: string
  description: string
  skills: SkillItem[]
}
