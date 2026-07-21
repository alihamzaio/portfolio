import { siteConfig } from "@/lib/site"
import { absoluteUrl } from "@/lib/seo"
import { experiences } from "@/lib/experience"
import { projects } from "@/lib/projects"
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
        image: absoluteUrl("/icon.png"),
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
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": `${absoluteUrl()}/#localbusiness`,
        name: `${siteConfig.name} Full Stack Development`,
        description: siteConfig.description,
        url: absoluteUrl(),
        image: absoluteUrl("/icon"),
        telephone: siteConfig.phone,
        email: siteConfig.email,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 31.5204,
          longitude: 74.3587,
        },
        areaServed: [
          { "@type": "City", name: "Lahore" },
          { "@type": "Country", name: "Pakistan" },
          { "@type": "Place", name: "Remote" },
        ],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        sameAs: [siteConfig.social.github, siteConfig.social.linkedinProfile],
        founder: { "@id": personId },
      },
    ],
  }
}

/** Homepage ProfilePage + work history */
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
    ],
  }
}

export function buildProjectGraph(project: Project & { slug: string }) {
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
            item: absoluteUrl(`/projects/${project.slug}`),
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: project.title,
        description: project.description,
        url: project.link && project.link !== "#" ? project.link : absoluteUrl(`/projects/${project.slug}`),
        image: project.image,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        author: {
          "@type": "Person",
          name: siteConfig.name,
          url: absoluteUrl(),
        },
        keywords: (project.tags ?? []).join(", "),
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
