/** Portfolio copy — direct, human tone */
export const copy = {
  hero: {
    availability: "Available for freelance & full-time — remote OK",
    greeting: "HI, I'M",
    name: "ALI HAMZA",
    lead: "3+ years shipping production code. 15+ REST APIs. 10,000+ blockchain blocks indexed. 40% fewer prod bugs after we fixed CI.",
    support: "I build things that work — MERN, AWS serverless, Web3 when it actually makes sense. Based in Lahore, work remote.",
    ctaPrimary: "Let's talk",
    ctaViewWork: "View Work ↓",
    ctaResume: "Resume",
  },
  sections: {
    about: {
      label: "About",
      title: "Real work, not buzzwords",
      description:
        "I didn't get into this to write LinkedIn posts. I like shipping — schema to deploy, one owner, fewer surprises.",
    },
    skills: {
      label: "Skills",
      title: "What I actually use",
      description: "Tools that survived real projects — not a keyword dump from a job board.",
    },
    projects: {
      label: "Work",
      title: "Things I've shipped",
      description: "Case studies with numbers. What broke, what shipped, what moved the needle.",
    },
    experience: {
      label: "Experience",
      title: "Where I've worked",
      description: "Birxment, Exec9, Explore Logics — roles where I owned delivery end-to-end.",
    },
    contact: {
      label: "Contact",
      title: "Say hello",
      description: "Tell me what you're building. I usually reply within a day or two.",
    },
    offer: {
      label: "Services",
      title: "How I work with teams",
      description: "Clear scopes. No mystery invoices.",
    },
    testimonials: {
      label: "Proof",
      title: "What people say",
      description: "Unedited notes from teams I've shipped with.",
    },
    cta: {
      label: "Hire me",
      title: "Need something built?",
      description: "MVP, rebuild, or a feature you're not sure about — I'll tell you straight if it's worth doing.",
      button: "Discuss your project",
    },
  },
  services: [
    {
      title: "Web applications",
      desc: "Next.js, Node APIs, auth, admin — with deploy docs your team can run without me.",
    },
    {
      title: "AWS & serverless",
      desc: "Lambda, DynamoDB, Terraform. Multi-tenant setups I've debugged at 2am so you don't have to.",
    },
    {
      title: "Blockchain systems",
      desc: "Indexers and wallet flows — when on-chain data is the product, not a slide deck flex.",
    },
    {
      title: "Performance & handover",
      desc: "Core Web Vitals, component libraries, docs that outlive the contract.",
    },
  ],
} as const
