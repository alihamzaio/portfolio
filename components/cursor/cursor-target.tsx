import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type CursorMode = "link" | "button" | "project" | "contact" | "external" | "skill"

interface CursorTargetProps {
  children: ReactNode
  mode?: CursorMode
  label?: string
  magnetic?: boolean
  arrow?: boolean
  className?: string
  as?: "div" | "span" | "article"
}

export function CursorTarget({
  children,
  mode,
  label,
  magnetic,
  arrow,
  className,
  as: Tag = "div",
}: CursorTargetProps) {
  return (
    <Tag
      className={cn(className)}
      {...(mode ? { "data-cursor": mode } : {})}
      {...(label ? { "data-cursor-label": label } : {})}
      {...(magnetic ? { "data-cursor-magnetic": true } : {})}
      {...(arrow ? { "data-cursor-arrow": "true" } : {})}
    >
      {children}
    </Tag>
  )
}
