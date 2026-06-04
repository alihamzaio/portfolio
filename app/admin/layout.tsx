import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true, noimageindex: true },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#020617] text-[#F8FAFC]">{children}</div>
}
