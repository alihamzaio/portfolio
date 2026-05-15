import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  as?: "span" | "h1" | "h2" | "p"
}

export function GradientText({ children, className, as: Tag = "span" }: GradientTextProps) {
  return (
    <Tag
      className={cn(
        "bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </Tag>
  )
}
