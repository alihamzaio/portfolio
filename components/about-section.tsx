"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function AboutSection() {
  const { ref, inView } = useInView({ threshold: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section id="about" className="py-24 px-6 md:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative z-10"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold mb-16 text-center tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              About Me
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* LEFT SIDE */}
            <motion.div variants={itemVariants} className="space-y-6 text-lg text-foreground/80 leading-relaxed">
              <p>
                I’m a full-stack JavaScript developer who builds custom, end-to-end web solutions — from scalable
                front-end interfaces to robust back-end systems. I focus on delivering secure, performant, and visually
                engaging digital experiences.
              </p>
              <p>
                My core expertise includes <span className="text-primary font-semibold">React</span>,{" "}
                <span className="text-primary font-semibold">Next.js</span>,{" "}
                <span className="text-primary font-semibold">Node.js</span>, and{" "}
                <span className="text-primary font-semibold">Express</span>, with strong experience in{" "}
                <span className="text-accent font-semibold">APIs</span>,{" "}
                <span className="text-accent font-semibold">MongoDB</span>, and{" "}
                <span className="text-accent font-semibold">TypeScript</span>. I also explore{" "}
                <span className="text-secondary font-semibold">Blockchain</span> and{" "}
                <span className="text-secondary font-semibold">Docker</span> for modern deployment workflows.
              </p>
              <p>
                I’m passionate about crafting tailored solutions, optimizing performance, and building systems that
                balance innovation, design, and functionality.
              </p>

            </motion.div>

            {/* RIGHT SIDE */}
            <motion.div
              variants={itemVariants}
              className="glass p-8 md:p-10 rounded-2xl shadow-lg border border-white/10 backdrop-blur-xl"
            >
              <div className="space-y-6">
                {[
                  { name: "React & Next.js", percent: 95, color: "from-primary to-accent" },
                  { name: "Node.js & Express", percent: 90, color: "from-accent to-secondary" },
                  { name: "API & Database Architecture", percent: 85, color: "from-secondary to-primary" },
                  { name: "Docker & Deployment", percent: 75, color: "from-primary to-accent" },
                ].map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-foreground/80">{skill.name}</span>
                      <span
                        className={`${index % 2 === 0 ? "text-primary" : index === 1 ? "text-accent" : "text-secondary"
                          } font-semibold`}
                      >
                        {skill.percent}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.percent}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.2 }}
                        className={`h-full bg-gradient-to-r ${skill.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1),transparent_60%)] pointer-events-none" />
    </section>
  )
}
