"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import skills from '../lib/skill.json'
import Image from "next/image"

export function SkillsSection() {
  const { ref, inView } = useInView({ threshold: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)",
    },
  }

  return (
    <section id="skills" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
        >
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Skills & Technologies
          </span>
        </motion.h2>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              variants={cardVariants}
              whileHover="hover"
              className="glass p-6 rounded-xl neon-border cursor-pointer group"
            >
              {skill.image ?
                <Image src={skill?.image} alt="Icon" width={30} height={30} className="mb-4 group-hover:scale-110 transition-transform" /> : ""
              }
              <h3 className="text-lg font-semibold mb-3 text-foreground">{skill.name}</h3>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
              <div className="text-sm text-foreground/60 mt-2">{skill.level}%</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
