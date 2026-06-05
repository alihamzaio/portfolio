export function SectionSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="section-pad border-t border-white/[0.06]" aria-hidden>
      <div className="section-shell space-y-6 animate-pulse">
        <div className="h-3 w-24 rounded bg-white/[0.06]" />
        <div className="h-10 w-2/3 max-w-md rounded bg-white/[0.08]" />
        <div className="h-4 w-full max-w-xl rounded bg-white/[0.04]" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/[0.03] border border-white/[0.06]" />
          ))}
        </div>
      </div>
    </div>
  )
}
