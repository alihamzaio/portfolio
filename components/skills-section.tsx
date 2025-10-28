"use client"

import { motion } from "framer-motion"
import skills from '../lib/skill.json'
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import * as React from 'react'

export function SkillsSection() {

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

  // Carousel auto-slide logic
  const carouselApiRef = React.useRef<any>(null)
  React.useEffect(() => {
    // Only on mobile
    const handle = setInterval(() => {
      if (window.innerWidth < 768 && carouselApiRef.current) {
        carouselApiRef.current.scrollNext()
      }
    }, 3000)
    return () => clearInterval(handle)
  }, [])

  return (
    <section id="skills" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3, margin: "0px 0px -20% 0px" }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
        >
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Skills & Technologies
          </span>
        </motion.h2>
        {/* MOBILE CAROUSEL */}
        <div className="md:hidden">
          <Carousel opts={{ align: 'start', loop: true }} setApi={api => (carouselApiRef.current = api)}>
            <CarouselContent>
              {skills.map((skill, idx) => (
                <CarouselItem key={skill.name} className="flex min-w-0">
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="glass p-6 rounded-xl neon-border w-full cursor-pointer group mx-2"
                  >
                    {skill.image && <Image src={skill.image} alt="Icon" width={30} height={30} className="mb-4 group-hover:scale-110 transition-transform" />}
                    <h3 className="text-lg font-semibold mb-3 text-foreground">{skill.name}</h3>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.9, delay: idx * 0.06, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                    <div className="text-sm text-foreground/60 mt-2">{skill.level}%</div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        {/* Desktop/Tablet grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -15% 0px" }}
          className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6"
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
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, delay: index * 0.06, ease: "easeOut" }}
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
