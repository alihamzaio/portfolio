"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import gsap from "gsap"
import { getGalleryProjects } from "@/lib/gallery-projects"
import { copy } from "@/lib/copy"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { prefersReducedMotion } from "@/lib/motion-prefs"

export function ProjectsGallery() {
  const projects = getGalleryProjects()
  const total = projects.length
  const [index, setIndex] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)

  const project = projects[index]
  const progress = total > 1 ? (index + 1) / total : 1

  const goTo = useCallback(
    (next: number) => {
      if (total <= 1) return
      const wrapped = (next + total) % total
      setIndex(wrapped)
      setAnimKey((k) => k + 1)
    },
    [total]
  )

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])
  const goNext = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goPrev, goNext])

  useEffect(() => {
    const track = trackRef.current
    if (!track || prefersReducedMotion()) {
      track?.style.setProperty("transform", `translate3d(${-index * 100}%, 0, 0)`)
      return
    }

    gsap.to(track, {
      xPercent: -index * 100,
      duration: 0.72,
      ease: "power3.inOut",
    })
  }, [index])

  useEffect(() => {
    if (prefersReducedMotion() || !copyRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        copyRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.48, ease: "power2.out" }
      )
    })

    return () => ctx.revert()
  }, [animKey])

  useEffect(() => {
    const panel = viewportRef.current?.querySelector<HTMLElement>(`[data-slide-index="${index}"]`)
    const image = panel?.querySelector<HTMLElement>("[data-project-image]")
    if (!image || prefersReducedMotion()) return

    gsap.fromTo(
      image,
      { clipPath: "inset(0 100% 0 0 round 0.75rem)" },
      { clipPath: "inset(0 0% 0 0 round 0.75rem)", duration: 0.75, ease: "power3.out" }
    )
  }, [index])

  if (!project) return null

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative bg-[var(--bg-secondary)] overflow-hidden section-pad"
    >
      <div className="site-grid">
        <header className="section-header lg:flex lg:items-end lg:justify-between lg:gap-[var(--space-6)] mb-[var(--space-6)]" data-animate>
          <div className="lg:max-w-lg">
            <p className="section-label">{copy.sections.projects.label}</p>
            <h2 id="projects-heading" className="section-title" data-reveal-title>
              {copy.sections.projects.title}
            </h2>
            <p className="type-caption max-w-md">{copy.sections.projects.description}</p>
          </div>
          <p className="type-label mt-[var(--space-3)] lg:mt-0 !text-[var(--text-muted)]">
            {String(total).padStart(2, "0")} featured
          </p>
        </header>

        <div className="projects-carousel" data-projects-carousel>
          <div className="projects-carousel-toolbar flex items-center justify-between gap-[var(--space-3)] mb-[var(--space-4)]">
            <p className="projects-carousel-counter type-label tabular-nums" aria-live="polite">
              <span className="!text-[var(--text-primary)]">{String(index + 1).padStart(2, "0")}</span>
              <span className="mx-1.5 !text-[var(--text-muted)]">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </p>
            <p className="type-label !text-[0.625rem] !text-[var(--text-muted)] hidden sm:block">
              Use arrows or swipe
            </p>
          </div>

          <div className="projects-carousel-stage relative">
            <button
              type="button"
              className="projects-carousel-btn projects-carousel-btn--prev"
              onClick={goPrev}
              aria-label="Previous project"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              className="projects-carousel-btn projects-carousel-btn--next"
              onClick={goNext}
              aria-label="Next project"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>

            <div
              ref={viewportRef}
              className="projects-carousel-viewport overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/40"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0]?.clientX ?? 0
              touchDelta.current = 0
            }}
            onTouchMove={(e) => {
              touchDelta.current = (e.touches[0]?.clientX ?? 0) - touchStartX.current
            }}
            onTouchEnd={() => {
              if (touchDelta.current > 48) goPrev()
              else if (touchDelta.current < -48) goNext()
            }}
          >
            <div
              ref={trackRef}
              className="projects-carousel-track flex"
              style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
            >
              {projects.map((item, i) => (
                <article
                  key={item.id}
                  data-slide-index={i}
                  data-cursor="project"
                  className="project-panel group shrink-0 w-full min-w-full flex flex-col lg:flex-row lg:items-stretch gap-[var(--space-4)] lg:gap-[var(--space-5)] p-[var(--space-4)] lg:p-[var(--space-5)]"
                  aria-hidden={i !== index}
                >
                  <Link
                    href={`/projects/${item.slug}`}
                    className="project-panel-image relative shrink-0 overflow-hidden bg-[var(--bg-elevated)] w-full lg:w-[58%] aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]"
                    data-project-image
                    tabIndex={i === index ? 0 : -1}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="project-panel-photo object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      priority={i === 0}
                    />
                    <span className="project-panel-image-shade pointer-events-none absolute inset-0" aria-hidden />
                    <span className="project-panel-image-tint pointer-events-none absolute inset-0" aria-hidden />
                    <span className="absolute top-[var(--space-2)] left-[var(--space-2)] type-label !text-[0.625rem] bg-[var(--bg-void)]/85 backdrop-blur-sm px-[var(--space-2)] py-[var(--space-1)] border border-[var(--border-subtle)]/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>

                  <div
                    ref={i === index ? copyRef : undefined}
                    className="project-panel-copy flex flex-col justify-center w-full lg:w-[42%] lg:py-[var(--space-2)]"
                  >
                    <Link href={`/projects/${item.slug}`} className="group/title" tabIndex={i === index ? 0 : -1}>
                      <h3 className="type-display-sm mb-[var(--space-3)] transition-colors group-hover/title:text-[var(--accent-primary)]">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="type-body-sm mb-[var(--space-4)] line-clamp-4">{item.overview}</p>

                    <ul className="space-y-[var(--space-2)] mb-[var(--space-4)]">
                      {item.architecture.slice(0, 3).map((point) => (
                        <li key={point} className="flex gap-[var(--space-2)] type-body-sm !text-[var(--text-secondary)]">
                          <span className="mt-[0.65rem] h-px w-3 shrink-0 bg-[var(--accent-primary)]/50" aria-hidden />
                          <span className="line-clamp-2">{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-x-[var(--space-2)] gap-y-[var(--space-1)] mb-[var(--space-4)]">
                      {item.techStack.slice(0, 6).map((tech) => (
                        <span key={tech} className="type-caption">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-[var(--space-3)]">
                      <Link
                        href={`/projects/${item.slug}`}
                        className="inline-flex items-center gap-[var(--space-2)] type-label !text-[var(--accent-primary)] hover:opacity-80 transition-opacity"
                        tabIndex={i === index ? 0 : -1}
                      >
                        Case study
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      {(item.demo || item.github) && (
                        <Link
                          href={item.demo || item.github || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-[var(--space-2)] type-label !text-[var(--text-muted)] hover:!text-[var(--text-primary)] transition-colors"
                          data-cursor="external"
                          tabIndex={i === index ? 0 : -1}
                        >
                          {item.demo ? "Live" : "Source"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          </div>

          <div className="projects-carousel-controls mt-[var(--space-4)] flex flex-col gap-[var(--space-3)] sm:flex-row sm:items-center sm:justify-between">
            <div className="projects-carousel-dots flex flex-wrap gap-2" role="tablist" aria-label="Project slides">
              {projects.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to project ${i + 1}: ${item.title}`}
                  className={`projects-carousel-dot ${i === index ? "is-active" : ""}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>

            <div className="projects-carousel-progress flex-1 max-w-xs" aria-hidden>
              <span className="projects-carousel-progress-fill" style={{ transform: `scaleX(${progress})` }} />
            </div>

            <Link
              href="/projects"
              className="type-label !text-[var(--accent-primary)] hover:opacity-80 transition-opacity inline-flex items-center gap-1.5 shrink-0"
            >
              View all {total} projects
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-[var(--space-4)] flex justify-center sm:hidden">
            <MagneticButton href="/projects" variant="secondary" className="btn-responsive">
              View all projects <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
