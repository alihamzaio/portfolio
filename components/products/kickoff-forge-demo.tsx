import type { ReactNode } from "react"

/**
 * Filled sample of one Kickoff Forge template. Marketing preview only.
 * Buyers get the blank pack on Gumroad.
 */
export function KickoffForgeDemo() {
  return (
    <section className="mt-14" aria-labelledby="kickoff-demo-heading">
      <p className="meta-label mb-3">Sample preview</p>
      <h2 id="kickoff-demo-heading" className="text-lg font-semibold text-white tracking-tight">
        Discovery call: filled example
      </h2>
      <p className="mt-2 text-sm text-neutral-500 max-w-2xl leading-relaxed">
        This is what a completed sheet looks like. The pack you buy is blank templates you reuse per
        client.
      </p>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-6 sm:px-7 sm:py-8 font-mono text-[13px] leading-relaxed text-neutral-300">
        <p className="text-neutral-500">
          Client: <span className="text-neutral-200">Nova Clinics</span>
          <span className="mx-3 text-neutral-700">·</span>
          Date: <span className="text-neutral-200">12 Mar 2026</span>
          <span className="mx-3 text-neutral-700">·</span>
          Channel: <span className="text-neutral-200">call</span>
        </p>

        <div className="mt-5 space-y-5">
          <DemoBlock title="Problem in their words">
            Patients book by WhatsApp; the front desk double-books and loses follow-ups. They want a
            simple booking site with SMS reminders before building a full EMR.
          </DemoBlock>

          <DemoBlock title="Who is hurt if this stays broken?">
            Front desk (chaos), doctors (no-shows), patients (wait / mistrust).
          </DemoBlock>

          <DemoBlock title="What “done” looks like in 30 days">
            Live booking page, admin list of appointments, SMS reminder 24h before, owner can export
            CSV.
          </DemoBlock>

          <DemoBlock title="Must-haves (max 5)">
            <ol className="list-decimal pl-4 space-y-1 text-neutral-300">
              <li>Public booking form (service + doctor + slot)</li>
              <li>Admin calendar / list view</li>
              <li>SMS reminder (one provider)</li>
              <li>Basic brand (logo + 2 colors)</li>
              <li>Deploy on their domain</li>
            </ol>
          </DemoBlock>

          <DemoBlock title="Constraints">
            <ul className="space-y-1 text-neutral-300">
              <li>Budget band: $1.5k-$2.5k MVP</li>
              <li>Deadline: soft, before Ramadan rush</li>
              <li>Who approves: clinic owner (Dr. Sara)</li>
              <li>Stack: no preference; keep it simple</li>
              <li>Brand assets: logo yes, photos partial</li>
            </ul>
          </DemoBlock>

          <DemoBlock title="Next step proposed">
            <ul className="space-y-1 text-neutral-300">
              <li>[x] Send scope one-pager</li>
              <li>[x] Send estimate bands</li>
              <li>[ ] Schedule follow-up for sign-off</li>
            </ul>
          </DemoBlock>
        </div>
      </div>
    </section>
  )
}

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5">{title}</p>
      <div className="text-neutral-300 font-sans text-sm leading-relaxed">{children}</div>
    </div>
  )
}
