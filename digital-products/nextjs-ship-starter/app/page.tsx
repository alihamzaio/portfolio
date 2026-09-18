import { buildMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

export const metadata = buildMetadata({
  title: site.name,
  description: site.tagline,
  path: "/",
})

export default function HomePage() {
  return (
    <div className="shell">
      <section className="hero">
        <h1>{site.tagline}</h1>
        <p>
          Replace this copy with your offer. This starter gives you a clean home page, SEO helpers,
          and a contact path so you can brand and deploy instead of rebuilding the base every time.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <a className="btn btn-primary" href="/#contact">
            Start a project
          </a>
          <a className="btn btn-ghost" href="/#work">
            See approach
          </a>
        </div>
      </section>

      <section id="work" className="section">
        <h2>How delivery works</h2>
        <p>
          Clarify the goal, ship a thin vertical slice early, then harden auth, SEO, and deploy
          before launch. Edit this section to match your process.
        </p>
      </section>

      <section id="contact" className="section">
        <h2>Contact</h2>
        <p>Prefer email for first contact. Swap this mailto for your form API when ready.</p>
        <div className="contact-box">
          <a className="btn btn-primary" href={`mailto:${site.email}?subject=Project%20inquiry`}>
            Email {site.email}
          </a>
        </div>
      </section>
    </div>
  )
}
