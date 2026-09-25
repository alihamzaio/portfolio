import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Click Case Files Studio",
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
}

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)]">{children}</div>
}
