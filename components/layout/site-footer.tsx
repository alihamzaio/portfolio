import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { navItems } from "@/lib/site"
import { SiteFooterClient } from "./site-footer-client"

export function SiteFooter() {
  return <SiteFooterClient navItems={navItems} />
}
