"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 10 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-foreground/60 mb-4">© 2025 Ali Hamza. All rights reserved.</p>

        </motion.div>
      </div>
    </footer>
  )
}
