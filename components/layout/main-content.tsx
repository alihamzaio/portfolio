import type { ReactNode } from "react"
import { headers } from "next/headers"
import { cn } from "@/lib/utils"

export async function MainContent({ children }: { children: ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? ""
  const isHome = pathname === "/" || pathname === ""

  return (
    <main
      id="main-content"
      className={cn("relative z-[2] min-h-screen", isHome && "pb-24 lg:pb-0")}
    >
      {children}
    </main>
  )
}
