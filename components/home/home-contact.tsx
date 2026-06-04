"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send, Calendar } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { MagneticButton } from "@/components/ui/magnetic-button"

export function HomeContact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Project from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
  }

  return (
    <section id="contact" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          label="Contact"
          title="Let's build something unforgettable"
          description="Tell me about your vision. I'll respond within 24 hours."
          align="center"
          className="mx-auto"
        />

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, label: "Email", value: siteConfig.email, href: siteConfig.social.email },
              { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
              { icon: MapPin, label: "Location", value: siteConfig.location },
            ].map((item) => (
              <PremiumCard key={item.label} className="!p-5">
                {item.href ? (
                  <a href={item.href} className="flex gap-4 group">
                    <item.icon className="h-5 w-5 text-[#60A5FA] shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm text-white group-hover:text-[#60A5FA] transition-colors mt-1">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex gap-4">
                    <item.icon className="h-5 w-5 text-[#60A5FA] shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm text-white mt-1">{item.value}</p>
                    </div>
                  </div>
                )}
              </PremiumCard>
            ))}
            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD] text-sm font-medium hover:bg-[#8B5CF6]/20 transition-colors"
            >
              <Calendar className="h-4 w-4" /> Book on Calendly
            </a>
          </div>

          <PremiumCard className="lg:col-span-3" hover={false}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {(["name", "email"] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-muted-foreground mb-2 capitalize">
                      {field}
                    </label>
                    <input
                      required
                      type={field === "email" ? "email" : "text"}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      onFocus={() => setFocused(field)}
                      onBlur={() => setFocused(null)}
                      className={`input-premium ${focused === field ? "ring-2 ring-[#3B82F6]/30" : ""}`}
                      placeholder={field === "email" ? "you@company.com" : "Your name"}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  className={`input-premium resize-none ${focused === "message" ? "ring-2 ring-[#8B5CF6]/30" : ""}`}
                  placeholder="Describe your project..."
                />
              </div>
              <MagneticButton type="submit">
                Send message <Send className="h-4 w-4" />
              </MagneticButton>
            </form>
          </PremiumCard>
        </div>
      </div>
    </section>
  )
}
