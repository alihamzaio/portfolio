"use client"

/** Quiet cool-slate atmosphere + soft gold wash */
export function AmbientScene() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[var(--bg-void)]" />
      <div
        className="absolute top-[-18%] left-[10%] h-[48vh] w-[55vw] rounded-full opacity-60 blur-[140px]"
        style={{ background: "color-mix(in srgb, var(--accent-primary) 5%, transparent)" }}
      />
      <div
        className="absolute bottom-[-12%] right-[-8%] h-[42vh] w-[48vw] rounded-full opacity-50 blur-[130px]"
        style={{ background: "rgba(255, 255, 255, 0.04)" }}
      />
    </div>
  )
}
