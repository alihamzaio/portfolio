import { siteConfig } from "@/lib/site"
import { absoluteUrl } from "@/lib/seo"
import { experiences } from "@/lib/experience"
import { projects } from "@/lib/projects"
import { copy } from "@/lib/copy"
import type { Project } from "@/lib/types"

/** Site-wide @graph for Person + WebSite (root layout) */
export function buildSiteGraph() {
  const personId = `${absoluteUrl()}/#person`
  const websiteId = `${absoluteUrl()}/#website`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: absoluteUrl(),
        name: `${siteConfig.name} - Portfolio`,
        description: siteConfig.description,
        inLanguage: "en-US",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.name,
        givenName: "Ali",
        familyName: "Hamza",
        jobTitle: siteConfig.title,
        description: siteConfig.description,
        url: absoluteUrl(),
        image: absoluteUrl("/icon"),
        email: siteConfig.email,
        telephone: siteConfig.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "University of Education",
        },
        sameAs: [siteConfig.social.github, siteConfig.social.linkedinProfile],
        knowsAbout: [
          ...siteConfig.specialties,
          "REST APIs",
          "TypeScript",
          "Next.js",
          "Docker",
          "Kubernetes",
        ],
        worksFor: experiences.slice(0, 1).map((job) => ({
          "@type": "Organization",
          name: job.company,
        })),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${absoluteUrl()}/#service`,
        name: `${siteConfig.name} Full Stack Development`,
        description: siteConfig.description,
        url: absoluteUrl(),
        image: absoluteUrl("/icon"),
        telephone: siteConfig.phone,
        email: siteConfig.email,
        areaServed: [
          { "@type": "City", name: "Lahore" },
          { "@type": "Country", name: "Pakistan" },
          { "@type": "Place", name: "Remote" },
        ],
        sameAs: [siteConfig.social.github, siteConfig.social.linkedinProfile],
        founder: { "@id": personId },
      },
    ],
  }
}

/** Homepage ProfilePage + work history + FAQ */
export function buildHomePageGraph() {
  const personId = `${absoluteUrl()}/#person`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${absoluteUrl()}/#webpage`,
        url: absoluteUrl(),
        name: `${siteConfig.name} | ${siteConfig.title}`,
        description: siteConfig.headline,
        isPartOf: { "@id": `${absoluteUrl()}/#website` },
        mainEntity: { "@id": personId },
        inLanguage: "en-US",
      },
      {
        "@type": "ItemList",
        name: "Work Experience",
        itemListElement: experiences.map((job, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "OrganizationRole",
            roleName: job.role,
            description: job.description,
            startDate: job.period.split(/\s[-–—]\s/)[0]?.trim(),
            worksFor: {
              "@type": "Organization",
              name: job.company,
            },
          },
        })),
      },
      {
        "@type": "ItemList",
        name: "Featured Projects",
        itemListElement: projects.slice(0, 6).map((p, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/projects/${p.slug}`),
          name: p.title,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${absoluteUrl()}/#faq`,
        mainEntity: copy.sections.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  }
}

export function buildProjectGraph(project: Project & { slug: string }) {
  const caseStudyUrl = absoluteUrl(`/projects/${project.slug}`)
  const liveUrl = project.link && project.link !== "#" ? project.link : undefined

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl() },
          { "@type": "ListItem", position: 2, name: "Projects", item: absoluteUrl("/projects") },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: caseStudyUrl,
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: project.title,
        description: project.description,
        url: caseStudyUrl,
        image: project.image,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        author: {
          "@type": "Person",
          name: siteConfig.name,
          url: absoluteUrl(),
        },
        keywords: (project.tags ?? []).join(", "),
        ...(liveUrl ? { sameAs: [liveUrl] } : {}),
      },
    ],
  }
}

export function buildBreadcrumbGraph(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
