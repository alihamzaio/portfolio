import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PremiumIconProps {
  icon: LucideIcon
  className?: string
  size?: number
}

export function PremiumIcon({ icon: Icon, className, size = 20 }: PremiumIconProps) {
  return (
    <Icon
      className={cn("text-[var(--accent-primary)] shrink-0", className)}
      size={size}
      strokeWidth={1.6}
      aria-hidden
    />
  )
}
