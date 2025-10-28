"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Mail, Linkedin, Github, Twitter, MapPin, Phone } from "lucide-react"
import { link } from "fs"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const { ref, inView } = useInView({ threshold: 0.3 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const { name, email, message } = formData
    const subject = encodeURIComponent(`New message from ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=hamzasarwer9@gmail.com&su=${subject}&body=${body}`

    const mailtoUrl = `mailto:hamzasarwer9@gmail.com?subject=${subject}&body=${body}`

    const win = window.open(gmailUrl, "_blank")
    if (!win) {
      window.location.href = mailtoUrl
    }

    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="contact" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Get In Touch</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="glass p-6 rounded-xl neon-border hover:shadow-lg hover:glow-primary transition-all">
                <div className="flex items-start gap-4">
                  <Mail className="text-primary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-foreground/70">hamzasarwer9@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-xl neon-border hover:shadow-lg hover:glow-accent transition-all">
                <div className="flex items-start gap-4">
                  <Phone className="text-accent mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-foreground/70">+923097300913</p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-xl neon-border hover:shadow-lg hover:glow-secondary transition-all">
                <div className="flex items-start gap-4">
                  <MapPin className="text-secondary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Location</h3>
                    <p className="text-foreground/70">Lahore, Pakistan</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <h3 className="font-semibold text-foreground mb-4">Follow Me</h3>
                <div className="flex gap-4">
                  {[
                    { icon: Github, label: "GitHub", link: "https://github.com/alilogics007" },
                    { icon: Linkedin, label: "LinkedIn", link: "https://www.linkedin.com/in/alihamza9" },
                    { icon: Mail, label: "Email", link: "mailto:hamzasarwer9@gmail.com" },
                  ]
                    .map(({ icon: Icon, label, link }) => (
                      <motion.a
                        key={label}
                        href={link}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 glass rounded-lg neon-border hover:glow-primary transition-all"
                        title={label}
                      >
                        <Icon size={20} className="text-primary" />
                      </motion.a>
                    ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="glass p-8 rounded-xl neon-border space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all resize-none h-32"
                  placeholder="Your message..."
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-foreground font-semibold rounded-lg hover:shadow-lg hover:glow-primary transition-all"
              >
                {submitted ? "Message Sent! ✓" : "Send Message"}
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
