"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <main
      id="main-content"
      className={cn("relative z-[2] min-h-screen", isHome && "pb-24 lg:pb-0")}
      role="main"
    >
      {children}
    </main>
  )
}
