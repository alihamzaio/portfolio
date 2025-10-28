"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Github } from "lucide-react"
import projects from '../lib/projects.json'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    hover: { y: -10, transition: { duration: 0.3 } },
  }

  return (
    <section id="projects" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3, margin: "0px 0px -20% 0px" }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
        >
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Featured Projects
          </span>
        </motion.h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          spaceBetween={20}
          className="project-swiper"
          breakpoints={{
            0: { slidesPerView: 1.05, centeredSlides: true },
            640: { slidesPerView: 1.5, centeredSlides: true },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {projects.map((project, idx) => (
            <SwiperSlide key={project.id} className="h-auto">
              <motion.div
                key={project.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="glass rounded-xl overflow-hidden neon-border cursor-pointer group h-full flex flex-col project-card"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative overflow-hidden flex-shrink-0 aspect-[16/9] w-full">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 text-foreground line-clamp-2">{project.title}</h3>
                  <p className="text-foreground/70 mb-4 text-sm line-clamp-3">{project.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto neon-border"
            >
              <div className="relative">
                <img
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-foreground">{selectedProject.title}</h2>
                <p className="text-foreground/80 mb-6 leading-relaxed">{selectedProject.details}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 text-sm rounded-full bg-primary/20 text-primary border border-primary/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a
                    href={selectedProject.link}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-foreground font-semibold rounded-lg hover:shadow-lg hover:glow-primary transition-all"
                  >
                    <ExternalLink size={20} />
                    View Project
                  </a>
                  <a
                    href={selectedProject.github}
                    className="flex items-center gap-2 px-6 py-3 border border-primary/50 text-foreground font-semibold rounded-lg hover:bg-primary/10 transition-all"
                  >
                    <Github size={20} />
                    Source Code
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
