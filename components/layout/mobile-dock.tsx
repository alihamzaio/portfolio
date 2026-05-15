"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, User, FolderKanban, Layers, BookOpen, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const dockItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/about", icon: User, label: "About" },
  { href: "/projects", icon: FolderKanban, label: "Work" },
  { href: "/tech-stack", icon: Layers, label: "Stack" },
  { href: "/blog", icon: BookOpen, label: "Blog" },
  { href: "/contact", icon: Mail, label: "Contact" },
]

export function MobileDock() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 lg:hidden"
      aria-label="Mobile dock"
    >
      <div className="flex items-center gap-0.5 px-2 py-2 rounded-2xl glass-panel border-[#00FFB2]/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
        {dockItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                "relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors",
                active ? "text-[#00FFB2]" : "text-muted-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="dock-pill"
                  className="absolute inset-0 rounded-xl bg-[#00FFB2]/12 border border-[#00FFB2]/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="relative h-5 w-5" />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
