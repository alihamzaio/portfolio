"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { MagneticButton } from "@/components/ui/magnetic-button"

export function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Project inquiry from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => {
      setForm({ name: "", email: "", message: "" })
      setSent(false)
    }, 3000)
  }

  return (
    <div className="pt-28 section-pad">
      <div className="section-shell">
        <SectionHeading
          label="Contact"
          title="Let's build something exceptional"
          description="Tell me about your product, timeline, and vision. I'll respond within 24 hours."
          align="center"
          className="mx-auto"
        />

        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, label: "Email", value: siteConfig.email, href: siteConfig.social.email },
              { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
              { icon: MapPin, label: "Location", value: siteConfig.location },
            ].map((item) => (
              <PremiumCard key={item.label} className="!p-5">
                {item.href ? (
                  <a href={item.href} className="flex gap-4 group">
                    <item.icon className="h-5 w-5 text-[#00FFB2] shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm text-white group-hover:text-[#00FFB2] transition-colors mt-1">{item.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex gap-4">
                    <item.icon className="h-5 w-5 text-[#00FFB2] shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm text-white mt-1">{item.value}</p>
                    </div>
                  </div>
                )}
              </PremiumCard>
            ))}
          </div>

          <PremiumCard className="lg:col-span-3" hover={false}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-muted-foreground mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-premium"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-premium"
                    placeholder="you@company.com"
                  />
                </div>
              </motion.div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-muted-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-premium resize-none"
                  placeholder="Describe your project..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm bg-[#00FFB2] text-[#050505] hover:shadow-[0_0_32px_rgba(0,255,178,0.45)] transition-all w-full sm:w-auto"
              >
                {sent ? "Opening email..." : (
                  <>
                    Send message <Send className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground">Email integration ready — connect Resend, SendGrid, or API route.</p>
            </form>
          </PremiumCard>
        </div>
      </div>
    </div>
  )
}
