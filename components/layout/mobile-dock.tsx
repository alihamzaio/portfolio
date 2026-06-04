"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, User, Layers, Briefcase, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const dockItems = [
  { href: "/#home", icon: Home, label: "Home", id: "home" },
  { href: "/#about", icon: User, label: "About", id: "about" },
  { href: "/#skills", icon: Layers, label: "Skills", id: "skills" },
  { href: "/#projects", icon: Briefcase, label: "Work", id: "projects" },
  { href: "/#contact", icon: Mail, label: "Contact", id: "contact" },
]

export function MobileDock() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  const handleClick = (e: React.MouseEvent, href: string) => {
    if (isHome && href.startsWith("/#")) {
      e.preventDefault()
      document.getElementById(href.replace("/#", ""))?.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!isHome) return null

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 xl:hidden px-2 w-full max-w-md" aria-label="Mobile dock">
      <div className="flex items-center justify-between gap-0.5 px-2 py-2 rounded-2xl glass-nav border border-white/[0.08] shadow-2xl">
        {dockItems.map(({ href, icon: Icon, label, id }) => (
          <Link
            key={id}
            href={href}
            onClick={(e) => handleClick(e, href)}
            aria-label={label}
            className="relative flex flex-col items-center justify-center flex-1 py-2 rounded-xl text-muted-foreground hover:text-[#60A5FA] transition-colors"
          >
            <Icon className="h-5 w-5" />
            <span className="text-[9px] mt-0.5 font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
