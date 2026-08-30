"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { FloatingField } from "@/components/ui/floating-field"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { copy } from "@/lib/copy"
import { offsiteAnchorProps } from "@/lib/navigation"

const contactRows = [
  { key: "email", icon: Mail, label: "Email", getValue: () => "Send an email", href: (p: ReturnType<typeof usePublicProfile>) => `mailto:${p.email}` },
  { key: "phone", icon: Phone, label: "Phone", getValue: (p: ReturnType<typeof usePublicProfile>) => p.phone, href: (p: ReturnType<typeof usePublicProfile>) => `tel:${p.phone.replace(/\s+/g, "")}` },
  { key: "location", icon: MapPin, label: "Location", getValue: (p: ReturnType<typeof usePublicProfile>) => p.location },
] as const

export function HomeContact() {
  const profile = usePublicProfile()
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Inquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n- ${form.name} (${form.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section-pad !pb-[var(--space-4)] relative bg-[var(--bg-secondary)] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 100%, rgba(232,68,47,0.06), transparent 60%)" }}
        aria-hidden
      />

      <div className="site-grid relative z-[1]">
        <header className="section-header" data-animate>
          <p className="section-label">{copy.sections.contact.label}</p>
          <h2 id="contact-heading" className="section-title" data-reveal-title>
            {copy.sections.contact.title}
          </h2>
          <p className="type-body-sm max-w-md">{copy.sections.contact.description}</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-[var(--space-6)]">
          <div data-animate className="lg:col-span-5 space-y-[var(--space-5)]">
            <p className="flex items-center gap-[var(--space-2)] type-label">
              <span className={`h-1.5 w-1.5 rounded-full ${profile.available ? "bg-[var(--accent-primary)]" : "bg-[var(--text-muted)]"}`} />
              {profile.available ? "Available for full-time and contract work" : "Not currently available"}
            </p>

            <ul className="space-y-[var(--space-4)] border-t border-[var(--border-subtle)] pt-[var(--space-4)]">
              {contactRows.map((row) => {
                const Icon = row.icon
                const value = row.getValue(profile)
                const href = "href" in row && row.href ? row.href(profile) : undefined
                const inner = (
                  <>
                    <Icon className="h-4 w-4 text-[var(--text-muted)] shrink-0 mt-0.5" aria-hidden />
                    <div className="min-w-0">
                      <p className="type-label !text-[0.625rem]">{row.label}</p>
                      <p className="type-body-sm mt-[var(--space-1)] !text-[var(--text-primary)] break-all">{value}</p>
                    </div>
                  </>
                )

                return (
                  <li key={row.key}>
                    {href ? (
                      <a href={href} {...offsiteAnchorProps(href)} className="flex gap-[var(--space-2)] group hover:text-[var(--accent-primary)] transition-colors" data-cursor="link">
                        {inner}
                      </a>
                    ) : (
                      <div className="flex gap-[var(--space-2)]">{inner}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          <div data-animate className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[var(--space-3)] border border-[var(--border-subtle)] p-[var(--space-5)] bg-[var(--bg-elevated)]"
            >
              <div className="grid sm:grid-cols-2 gap-[var(--space-3)]">
                <FloatingField id="contact-name" name="name" label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <FloatingField id="contact-email" name="email" label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <FloatingField
                id="contact-message"
                name="message"
                as="textarea"
                label="Message"
                required
                className="flex flex-col min-h-[150px]"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <MagneticButton type="submit" variant="primary" className="btn-responsive sm:w-auto mt-[var(--space-1)]">
                Send message <Send className="h-4 w-4" />
              </MagneticButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
