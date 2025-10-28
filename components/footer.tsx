"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-foreground/60 mb-4">© 2025 Your Name. All rights reserved.</p>
          <p className="text-foreground/40 text-sm">Crafted with passion using Next.js, React, and Framer Motion</p>
        </motion.div>
      </div>
    </footer>
  )
}
