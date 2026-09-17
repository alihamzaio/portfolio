/** Curated copyright-free covers (Pexels). Keep in sync with yt-auto-studio pipeline/blog_covers.py */

export type CoverLibraryItem = {
  category: string
  url: string
  alt: string
}

const P = (id: string, file: string) =>
  `https://images.pexels.com/photos/${id}/${file}?auto=compress&cs=tinysrgb&w=1200`

export const BLOG_COVER_LIBRARY: CoverLibraryItem[] = [
  // Next.js
  {
    category: "Next.js",
    url: P("11035471", "pexels-photo-11035471.jpeg"),
    alt: "Laptop showing code in a modern workspace",
  },
  {
    category: "Next.js",
    url: P("4164418", "pexels-photo-4164418.jpeg"),
    alt: "Developer working on a web project",
  },
  {
    category: "Next.js",
    url: P("1181675", "pexels-photo-1181675.jpeg"),
    alt: "Close-up of code on a monitor",
  },
  {
    category: "Next.js",
    url: P("270404", "pexels-photo-270404.jpeg"),
    alt: "HTML and CSS code on a screen",
  },
  // React
  {
    category: "React",
    url: P("574071", "pexels-photo-574071.jpeg"),
    alt: "Hands typing on a laptop keyboard",
  },
  {
    category: "React",
    url: P("1181263", "pexels-photo-1181263.jpeg"),
    alt: "Dual monitors with software development tools",
  },
  {
    category: "React",
    url: P("879109", "pexels-photo-879109.jpeg"),
    alt: "Person coding at a standing desk",
  },
  // AWS
  {
    category: "AWS",
    url: P("325229", "pexels-photo-325229.jpeg"),
    alt: "Server room with network racks",
  },
  {
    category: "AWS",
    url: P("1148820", "pexels-photo-1148820.jpeg"),
    alt: "Cloud infrastructure and data center",
  },
  {
    category: "AWS",
    url: P("2881229", "pexels-photo-2881229.jpeg"),
    alt: "Network cables connected to a switch",
  },
  // DevOps
  {
    category: "DevOps",
    url: P("1181467", "pexels-photo-1181467.jpeg"),
    alt: "Terminal and deployment workflow on screen",
  },
  {
    category: "DevOps",
    url: P("577585", "pexels-photo-577585.jpeg"),
    alt: "Engineer reviewing system dashboards",
  },
  {
    category: "DevOps",
    url: P("3861969", "pexels-photo-3861969.jpeg"),
    alt: "Team reviewing a software product",
  },
  // MERN
  {
    category: "MERN",
    url: P("546819", "pexels-photo-546819.jpeg"),
    alt: "Full stack development setup with laptop",
  },
  {
    category: "MERN",
    url: P("270348", "pexels-photo-270348.jpeg"),
    alt: "JavaScript code on a dark editor theme",
  },
  {
    category: "MERN",
    url: P("1181244", "pexels-photo-1181244.jpeg"),
    alt: "Developer focused on multiple browser tabs",
  },
  // Career
  {
    category: "Career",
    url: P("3184292", "pexels-photo-3184292.jpeg"),
    alt: "Professionals collaborating in an office",
  },
  {
    category: "Career",
    url: P("1181396", "pexels-photo-1181396.jpeg"),
    alt: "Person writing notes during a work session",
  },
  {
    category: "Career",
    url: P("4065876", "pexels-photo-4065876.jpeg"),
    alt: "Remote worker on a video call",
  },
  {
    category: "Career",
    url: P("3184465", "pexels-photo-3184465.jpeg"),
    alt: "Job interview conversation at a table",
  },
  // AI Tools
  {
    category: "AI Tools",
    url: P("8386440", "pexels-photo-8386440.jpeg"),
    alt: "Abstract AI and technology visualization",
  },
  {
    category: "AI Tools",
    url: P("18069696", "pexels-photo-18069696.jpeg"),
    alt: "Person using AI tools on a laptop",
  },
  {
    category: "AI Tools",
    url: P("8728382", "pexels-photo-8728382.jpeg"),
    alt: "Futuristic digital interface lights",
  },
  {
    category: "AI Tools",
    url: P("5483077", "pexels-photo-5483077.jpeg"),
    alt: "Robot hand and human collaboration concept",
  },
  // Full Stack
  {
    category: "Full Stack",
    url: P("1181671", "pexels-photo-1181671.jpeg"),
    alt: "Developer desk with laptop and coffee",
  },
  {
    category: "Full Stack",
    url: P("3861969", "pexels-photo-3861969.jpeg"),
    alt: "Team reviewing a software product",
  },
  {
    category: "Full Stack",
    url: P("3183150", "pexels-photo-3183150.jpeg"),
    alt: "Whiteboard planning for a product build",
  },
  {
    category: "Full Stack",
    url: P("3182773", "pexels-photo-3182773.jpeg"),
    alt: "Startup team working around laptops",
  },
]

export function coversForCategory(category?: string): CoverLibraryItem[] {
  const c = (category || "").trim().toLowerCase()
  if (!c) return BLOG_COVER_LIBRARY
  const filtered = BLOG_COVER_LIBRARY.filter((x) => x.category.toLowerCase() === c)
  return filtered.length ? filtered : BLOG_COVER_LIBRARY
}

export function isLibraryCoverUrl(url?: string | null): boolean {
  if (!url) return false
  return BLOG_COVER_LIBRARY.some((x) => x.url === url)
}
