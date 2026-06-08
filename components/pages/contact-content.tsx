"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { PremiumIcon, PremiumPage, PremiumReveal } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { RippleButton } from "@/components/ui/ripple-button"
import { siteConfig } from "@/lib/site"

export function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Project inquiry from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
  }

  const rows: {
    icon: typeof Mail
    label: string
    value: string
    href?: string
  }[] = [
    { icon: Mail, label: "Email", value: siteConfig.email, href: siteConfig.social.email },
    { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
    { icon: MapPin, label: "Location", value: siteConfig.location },
  ]

  return (
    <PremiumPage narrow>
      <SectionHeading
        headingLevel={1}
        label="Contact"
        title="Let's build something exceptional"
        description="Tell me about your product, timeline, and vision. I'll respond within 24 hours."
        align="center"
        className="mx-auto"
      />

      <div className="grid lg:grid-cols-5 gap-5 lg:items-stretch">
        <PremiumReveal className="lg:col-span-2 flex flex-col gap-3">
          {rows.map((item) => (
            <PremiumCard key={item.label} className="!p-4 shrink-0" hover={false}>
              {item.href ? (
                <a href={item.href} className="flex gap-4 group">
                  <PremiumIcon icon={item.icon} size={20} />
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-white group-hover:text-cyan-400 transition-colors mt-1">{item.value}</p>
                  </div>
                </a>
              ) : (
                <div className="flex gap-4">
                  <PremiumIcon icon={item.icon} size={20} />
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-white mt-1">{item.value}</p>
                  </div>
                </div>
              )}
            </PremiumCard>
          ))}
        </PremiumReveal>

        <PremiumReveal delay={0.1} className="lg:col-span-3 flex flex-col min-h-0">
          <PremiumCard hover={false} className="flex-1 flex flex-col !p-5 min-h-[320px]">
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-4">
              <div className="grid sm:grid-cols-2 gap-4 shrink-0">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-neutral-500 mb-1.5">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-premium"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-neutral-500 mb-1.5">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-premium"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div className="flex flex-col flex-1 min-h-[120px]">
                <label htmlFor="contact-message" className="block text-xs font-medium text-neutral-500 mb-1.5 shrink-0">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-premium resize-none flex-1 min-h-[120px] w-full"
                  placeholder="Describe your project..."
                />
              </div>
              <RippleButton type="submit" className="w-full sm:w-auto">
                Send message <Send className="h-4 w-4" />
              </RippleButton>
            </form>
          </PremiumCard>
        </PremiumReveal>
      </div>
    </PremiumPage>
  )
}
