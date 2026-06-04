import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "accent" | "secondary"
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full",
        variant === "default" && "bg-primary/10 text-primary border border-primary/20",
        variant === "outline" && "bg-transparent text-foreground/70 border border-white/10",
        variant === "accent" && "bg-accent/10 text-accent border border-accent/20",
        variant === "secondary" && "bg-secondary text-secondary-foreground border border-white/10",
        className
      )}
    >
      {children}
    </span>
  )
}
