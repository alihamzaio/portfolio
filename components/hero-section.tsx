"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Link from "next/link";

const roles = [
  "Full Stack JavaScript Developer",
  "MERN Stack Engineer",
  "React & Next.js Expert",
  "Node.js & Express Backend Developer",
  "API & Database Architect",
  "Blockchain Enthusiast",
  "Docker & DevOps Learner",
  "Creative Problem Solver"
];

const tagline = "Building custom, end-to-end web solutions — from scalable frontends to robust backends. Specializing in React, Next.js, Node.js, and modern architectures to deliver fast, secure, and user-centered digital experiences.";

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      <div className="max-w-4xl mx-auto px-4 text-center z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 md:mt-auto mt-20">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Welcome to My Portfolio
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="h-20 mb-8"
        >
          <motion.p
            key={roleIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-2xl text-accent font-semibold"
          >
            {roles[roleIndex]}
          </motion.p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-foreground/70 text-lg mb-12 max-w-2xl mx-auto"
        >
          {tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link href={"#projects"} className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-foreground font-semibold rounded-lg hover:shadow-lg hover:glow-primary transition-all">
            View My Work
          </Link>
          <Link href={"#contact"} className="px-8 py-3 border border-primary/50 text-foreground font-semibold rounded-lg hover:bg-primary/10 transition-all">
            Get In Touch
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown className="text-primary" size={32} />
      </motion.div>
    </section>
  )
}
