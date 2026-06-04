"use client"

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 mesh-ambient mesh-shift opacity-90" />
      <div className="absolute inset-0 grid-fine opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,900px)] h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12),transparent_70%)]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.08),transparent_65%)]" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[350px] bg-[radial-gradient(ellipse_at_left,rgba(139,92,246,0.06),transparent_60%)]" />
    </div>
  )
}
