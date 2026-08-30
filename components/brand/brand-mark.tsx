import { cn } from "@/lib/utils"

/** Shared AH sigil — frameless slash-ligature for nav, footer, favicon, hero */
export const BRAND_MARK_VIEWBOX = "0 0 48 48"

/** Interlocking A+H cut by a gold diagonal slash — distinctive at every size */
export function BrandMarkPaths({ strokeScale = 1 }: { strokeScale?: number }) {
  const w = 2.6 * strokeScale
  return (
    <>
      <path
        d="M4 44 L18 6 H24"
        stroke="currentColor"
        strokeWidth={w}
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <path d="M28 6 V44" stroke="currentColor" strokeWidth={w} strokeLinecap="square" fill="none" />
      <path d="M40 6 V44" stroke="currentColor" strokeWidth={w} strokeLinecap="square" fill="none" />
      <path
        d="M8 30 L42 16"
        stroke="var(--accent-primary)"
        strokeWidth={w * 1.15}
        strokeLinecap="square"
        fill="none"
      />
    </>
  )
}

type BrandMarkProps = {
  size?: number
  className?: string
  weight?: "nav" | "hero"
}

export function BrandMark({ size, className, weight = "nav" }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={BRAND_MARK_VIEWBOX}
      fill="none"
      className={cn("logo-mark-svg shrink-0 text-[var(--text-primary)]", !size && "h-full w-full", className)}
      aria-hidden
    >
      <BrandMarkPaths strokeScale={weight === "hero" ? 1.15 : 1} />
    </svg>
  )
}
