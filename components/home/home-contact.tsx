"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react"
import { PremiumIcon, PremiumSection } from "@/components/premium"
import { usePublicProfile } from "@/components/providers/site-content-provider"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { FloatingField } from "@/components/ui/floating-field"
import { RippleButton } from "@/components/ui/ripple-button"
import { copy } from "@/lib/copy"

const contactRows = [
  { key: "email", icon: Mail, label: "Email", getValue: (p: ReturnType<typeof usePublicProfile>) => p.email, href: (p: ReturnType<typeof usePublicProfile>) => `mailto:${p.email}` },
  { key: "phone", icon: Phone, label: "Phone", getValue: (p: ReturnType<typeof usePublicProfile>) => p.phone },
  { key: "location", icon: MapPin, label: "Location", getValue: (p: ReturnType<typeof usePublicProfile>) => p.location },
  { key: "linkedin", icon: Linkedin, label: "LinkedIn", getValue: () => "LinkedIn", href: (p: ReturnType<typeof usePublicProfile>) => p.social.linkedin, external: true },
  { key: "github", icon: Github, label: "GitHub", getValue: (p: ReturnType<typeof usePublicProfile>) => `GitHub · ${p.githubUsername}`, href: (p: ReturnType<typeof usePublicProfile>) => p.social.github, external: true },
] as const

export function HomeContact() {
  const profile = usePublicProfile()
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Inquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <PremiumSection id="contact" variant="muted">
      <SectionHeading
        sectionId="contact"
        label={copy.sections.contact.label}
        title={copy.sections.contact.title}
        description={copy.sections.contact.description}
        align="center"
        className="mx-auto"
      />

      <div className="grid lg:grid-cols-5 gap-5 max-w-4xl mx-auto lg:items-stretch">
        <div data-animate-stagger className="lg:col-span-2 flex flex-col gap-3 h-full">
          <PremiumCard className="!p-4 shrink-0" hover={false} data-animate>
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2 w-2 rounded-full shrink-0 ${profile.available ? "bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-neutral-500"}`}
              />
              <span className="text-sm text-white">
                {profile.available ? "Available for full-time and contract work" : "Not currently available"}
              </span>
            </div>
          </PremiumCard>

          {contactRows.map((row) => {
            const Icon = row.icon
            const value = row.getValue(profile)
            const href = "href" in row && row.href ? row.href(profile) : undefined
            const content = (
              <>
                <PremiumIcon icon={Icon} size={16} className="mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">{row.label}</p>
                  <p className="text-sm text-white truncate group-hover:text-sky-300 transition-colors">
                    {value}
                  </p>
                </div>
              </>
            )

            return (
              <PremiumCard key={row.key} className="!p-4 shrink-0" hover={false} data-animate>
                {href ? (
                  <a
                    href={href}
                    target={"external" in row && row.external ? "_blank" : undefined}
                    rel={"external" in row && row.external ? "noopener noreferrer" : undefined}
                    className="flex gap-3 group"
                    data-cursor
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex gap-3">{content}</div>
                )}
              </PremiumCard>
            )
          })}
        </div>

        <div data-animate className="lg:col-span-3 flex flex-col h-full min-h-0">
          <PremiumCard hover={false} className="flex-1 flex flex-col !p-5 h-full min-h-[320px] lg:min-h-0">
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-4 h-full">
              <div className="grid sm:grid-cols-2 gap-4 shrink-0">
                <FloatingField
                  label="Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <FloatingField
                  label="Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <FloatingField
                as="textarea"
                label="Message"
                required
                className="flex flex-col flex-1 min-h-[120px]"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <div className="shrink-0 pt-0">
                <RippleButton type="submit">
                  Send message <Send className="h-4 w-4" />
                </RippleButton>
              </div>
            </form>
          </PremiumCard>
        </div>
      </div>
    </PremiumSection>
  )
}
