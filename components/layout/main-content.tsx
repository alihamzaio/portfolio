import type { ReactNode } from "react"

export function MainContent({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="relative z-[2] min-h-screen">
      {children}
    </main>
  )
}
