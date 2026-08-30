import type { Project } from "@/lib/types"

/** Case study copy for Ali Hamza's portfolio projects */
export const CASE_STUDY_OVERRIDES: Record<
  number,
  Pick<Project, "problem" | "solution" | "architecture" | "metrics">
> = {
  26: {
    problem:
      "Pakistani shoppers needed a trusted local store for original products with cash on delivery, easy returns, and 24/7 support — not a generic marketplace. The merchant needed one system for storefront, inventory, orders, and admin instead of disconnected tools.",
    solution:
      "I built Adam Store as a full MERN e-commerce platform: customer storefront with product browsing, cart, and checkout; admin dashboard for inventory, orders, and users; REST APIs on Node.js, Express, and MongoDB. Live at adamstore.pk with free delivery, COD, and 15-day returns.",
    architecture: [
      "React storefront with catalog, cart, and checkout flows",
      "Admin dashboard for inventory, orders, and user management",
      "Node.js and Express REST API with MongoDB",
      "Axios-based client communication and Bootstrap layouts",
    ],
    metrics: [
      { label: "surfaces", value: "2" },
      { label: "stack", value: "MERN" },
      { label: "live", value: "adamstore.pk" },
    ],
  },
  25: {
    problem:
      "Client applications queried RPC nodes for every block lookup, which was slow and expensive at scale.",
    solution:
      "I built a distributed blockchain crawler and indexer ingesting 10,000+ blocks with BullMQ workers and Moleculer.js services. PostgreSQL-backed APIs reduced direct on-chain reads by about 90% while supporting web, Android, and WebSocket client channels. Live discover UI: app.testnet.verana.network/discover.",
    architecture: [
      "BullMQ worker pipelines for block ingestion and sync",
      "Moleculer.js services for web, Android, and WebSocket channels",
      "PostgreSQL and Redis with Dockerized production deployment",
      "Jest test coverage and CI/CD for release stability",
    ],
    metrics: [
      { label: "blocks indexed", value: "10,000+" },
      { label: "on-chain reads reduced", value: "90%" },
      { label: "client channels", value: "3" },
    ],
  },
  24: {
    problem:
      "MagicCraft needed marketplace, rental, and gameplay dashboards that felt native to a blockchain game: wallet-owned NFTs, minting, and trading without leaving the app.",
    solution:
      "I contributed to the MagicCraft NFT marketplace frontend: marketplace pages, rental flows, gameplay dashboards, wallet connect, NFT metadata, and Polymarket transaction logic. Live at app.magiccraft.io with listings, minting, and on-chain volume stats.",
    architecture: [
      "React and Tailwind CSS marketplace and lobby UI",
      "Wallet connectivity and NFT metadata handling",
      "Polymarket-based transaction logic for digital assets",
      "Marketplace, minting, and recently listed/sold views",
    ],
    metrics: [
      { label: "NFT holders", value: "4,635+" },
      { label: "focus", value: "Web3 UI" },
      { label: "stack", value: "React" },
    ],
  },
  11: {
    problem:
      "The DeFi market presented significant barriers to average investors: complex financial strategies requiring deep expertise, high minimum investment requirements for professional management, time-intensive portfolio monitoring and rebalancing, risk of smart contract vulnerabilities and exploits, lack of accessible tools for yield optimization, and information asymmetry between retail and institutional investors.",
    solution:
      "I built UniLabs as an AI-powered DeFi asset management platform combining AI with blockchain to automate portfolio management, yield optimization, and risk management. Delivered AI-powered portfolio rebalancing and risk assessment, strategy automation for multiple risk profiles, secure smart contract interactions with gas optimization, and real-time performance analytics.",
    architecture: [
      "Next.js and React frontend with D3.js analytics visualizations",
      "Node.js and Express microservices with Redis caching",
      "Solidity smart contracts on Ethereum with Web3.js / Ethers.js",
      "MongoDB for user and portfolio data with automated strategy jobs",
    ],
    metrics: [
      { label: "monthly users", value: "1,000+" },
      { label: "smart contracts", value: "5+" },
      { label: "stack", value: "Web3" },
    ],
  },
  10: {
    problem:
      "Entrepreneurs in Libya faced significant barriers to starting e-commerce businesses: limited access to reliable product sourcing channels, complex international supply chain management, language barriers with Chinese suppliers, payment processing challenges for cross-border transactions, shipping logistics and customs documentation, and no unified platform for managing orders and inventory.",
    solution:
      "I built Senzi as a dropshipping platform for the Libyan market with direct 1688 and Taobao API integrations, one-click product import, automated order processing, multi-provider shipping workflows, local payment method support, and business analytics for sellers—reducing time-to-market from months to days.",
    architecture: [
      "Next.js and React frontend with SEO-friendly product discovery",
      "Node.js and Express REST services with background order jobs",
      "MongoDB catalog and order storage with Redis caching",
      "Third-party integrations for 1688, Taobao, payments, and shipping",
    ],
    metrics: [
      { label: "SKUs synced", value: "5,000+" },
      { label: "provider APIs", value: "2" },
      { label: "manual work reduced", value: "60%" },
    ],
  },
  23: {
    problem:
      "Patients with hand and wrist complaints needed a clear, accessible way to understand treatment options, find a specialist nearby, and start care — without a generic clinic template that hid the medical offer.",
    solution:
      "I built HandenPols.nl with Next.js and Tailwind CSS: accessible layouts, SEO, and mobile-first pages for therapy and rehabilitation. Copy and flows explain diagnosis, therapy vs surgery, and how to contact a hand surgeon.",
    architecture: [
      "Next.js and React pages with Tailwind CSS",
      "Modular, accessible components and mobile-first layouts",
      "SEO configuration for Dutch healthcare search",
      "Contact and cookie-consent flows aligned with EU practice",
    ],
    metrics: [
      { label: "focus", value: "Healthcare" },
      { label: "locale", value: "NL" },
      { label: "stack", value: "Next.js" },
    ],
  },
  22: {
    problem:
      "Energy operators needed one operational view of UK energy mix, interconnectors, gas prices, and generation — not scattered spreadsheets and delayed reports.",
    solution:
      "I built Solanity Grid as a real-time dashboard for gas, oil, weather, and generation data from REST APIs. React and TypeScript UI with charts, tables, map-ready layouts, and Tailwind CSS for operational monitoring.",
    architecture: [
      "React and TypeScript dashboard with Tailwind CSS",
      "REST API integration for energy, gas, and weather feeds",
      "KPI cards, generation tables, and trend charts",
      "Authenticated portal for operational users",
    ],
    metrics: [
      { label: "domain", value: "Energy" },
      { label: "data", value: "Real-time" },
      { label: "stack", value: "React" },
    ],
  },
  14: {
    problem:
      "Clinical teams needed a single place for medical records by diagnosis area (SEH, mamma, abdomen, hand/foot, tumors) instead of fragmented files and informal tracking.",
    solution:
      "I built DOTgod as a healthcare dashboard with authenticated access, role-based navigation, and REST-backed records. MERN stack with file upload for group data insertion and real-time updates for clinical overview screens.",
    architecture: [
      "Next.js / React dashboard with React Bootstrap",
      "Express and Node.js REST API with MongoDB",
      "Authentication and role-based access",
      "File upload for bulk clinical data insertion",
    ],
    metrics: [
      { label: "domain", value: "Healthcare" },
      { label: "access", value: "RBAC" },
      { label: "stack", value: "MERN" },
    ],
  },
  13: {
    problem:
      "Pest-control operators needed location-level KPIs — appointments, tech time on site, production, re-service rate — without rebuilding reports in spreadsheets every month.",
    solution:
      "I built Pest Insights as an operational dashboard: React charts and admin flows, Express APIs for company creation and metrics, MongoDB storage, and Google Sheets import so campaign and location data stay in one place.",
    architecture: [
      "React.js dashboard with charts and location tables",
      "Express.js APIs for companies and KPI endpoints",
      "MongoDB for profiles and campaign metrics",
      "Google Sheets API for data import",
    ],
    metrics: [
      { label: "views", value: "Location KPIs" },
      { label: "import", value: "Sheets" },
      { label: "stack", value: "MERN" },
    ],
  },
  12: {
    problem:
      "The client managed multiple marketing campaigns with fully manual workflows: collecting data from platforms, spreadsheet reporting, no real-time performance view, slow detection of underperforming campaigns, weak historical analysis, and no way to correlate metrics across channels.",
    solution:
      "I built KYPI as a campaign performance dashboard that centralizes marketing analytics: company creation, Google Sheets import, Chart.js visualizations, real-time KPIs, scheduled reporting, and APIs so teams move from 8-hour weekly reporting to automated generation.",
    architecture: [
      "React dashboard with Chart.js and WebSocket-style live updates",
      "Node.js and Express APIs with scheduled collection jobs",
      "MongoDB for campaign metrics and historical records",
      "Google Sheets / ads-platform API ingestion",
    ],
    metrics: [
      { label: "reporting time", value: "8h → 15m" },
      { label: "ROI lift", value: "35%" },
      { label: "uptime", value: "99.9%" },
    ],
  },
  16: {
    problem:
      "PyMC Labs needed a public site that matches a Bayesian AI consultancy: services, workshops, blog, and CRM capture — not a generic agency template that hid the open-source and enterprise story.",
    solution:
      "I built the PyMC Labs website with Next.js and Tailwind CSS: service pages, Strapi-powered blog, CRM integration, and a layout that presents Bayesian consulting, case studies, and training to enterprise visitors.",
    architecture: [
      "Next.js and TypeScript marketing site",
      "Tailwind CSS layout and component system",
      "Strapi CMS for blog and editorial content",
      "CRM integration for inbound consulting leads",
    ],
    metrics: [
      { label: "CMS", value: "Strapi" },
      { label: "focus", value: "Bayesian AI" },
      { label: "stack", value: "Next.js" },
    ],
  },
  21: {
    problem:
      "Truvest Capital Market GmbH needed a professional public site for commodity trading and medical supply: segments, global network, and inquiry capture — not a placeholder brochure.",
    solution:
      "I built the Truvest frontend with Create React App: responsive layouts for minerals, steel, medical PPE, global reach, and inquiry forms integrated with backend portals and banking-oriented service access.",
    architecture: [
      "React (Create React App) marketing frontend",
      "Responsive section layouts for trading and medical divisions",
      "Inquiry forms and contact flows",
      "Integration with backend portals and service APIs",
    ],
    metrics: [
      { label: "HQ", value: "Germany" },
      { label: "focus", value: "Trade + PPE" },
      { label: "stack", value: "React" },
    ],
  },
  20: {
    problem:
      "Traditional dating apps over-rely on photos, lose tone in text, enable catfishing, mismatch profiles vs personality, produce low-quality chat, and raise safety issues with anonymous messaging.",
    solution:
      "I shipped RizzDate as a voice-first dating product: landing pages plus app coaching (AI coach, message writer, date planner), with React Native, Node.js, Socket.io, Firebase, voice profiles, matching, and verification. Live marketing site: rizzdate.app.",
    architecture: [
      "Next.js, Tailwind CSS, and Framer Motion landing pages",
      "React Native app with Node.js and Express APIs",
      "Socket.io and WebRTC for real-time voice and presence",
      "Firebase for auth, storage, and voice message media",
    ],
    metrics: [
      { label: "downloads (3 mo)", value: "50,000+" },
      { label: "rating", value: "4.6/5" },
      { label: "meet rate", value: "58%" },
    ],
  },
  19: {
    problem:
      "Emirates Publishers Association needed a bilingual (English/Arabic) public site for members, events, services, and join flows that matches government-adjacent design standards.",
    solution:
      "I built a bilingual onboarding and association website with HTML, CSS, and JavaScript: language toggle, accessible layouts, services, event calendar, and membership CTAs for EPA.org.ae.",
    architecture: [
      "HTML, CSS, and vanilla JavaScript",
      "English / Arabic language toggle",
      "Accessible association layouts",
      "Events, members, and join conversion paths",
    ],
    metrics: [
      { label: "languages", value: "2" },
      { label: "org", value: "EPA UAE" },
      { label: "stack", value: "HTML/JS" },
    ],
  },
  18: {
    problem:
      "An interiors studio needed a portfolio that shows material palettes next to CGI rooms — not a generic template that buried the work.",
    solution:
      "I built Liddy Silver Interiors with React and Swiper.js: project galleries, background color transitions, and slider-based case views so material boards and bedroom CGI sit side by side.",
    architecture: [
      "React portfolio with Swiper.js galleries",
      "Dynamic background colors per project",
      "Responsive image-led layouts",
      "CSS animation for transitions",
    ],
    metrics: [
      { label: "focus", value: "Interiors" },
      { label: "gallery", value: "Swiper" },
      { label: "stack", value: "React" },
    ],
  },
  17: {
    problem:
      "Living Wall needed a landing site that explains turn-key digital placemaking — concept, coordination, installation — for architects and developers, not a thin brochure.",
    solution:
      "I built livingwall.au with React, Vite, and Bootstrap: hero, interior/exterior/experience solutions, process phases, and contact. CSS transforms for section motion and SEO-ready marketing pages.",
    architecture: [
      "React and Vite landing application",
      "Bootstrap components with CSS transforms",
      "Solution, process, and contact sections",
      "SEO-oriented marketing structure",
    ],
    metrics: [
      { label: "locale", value: "AU" },
      { label: "focus", value: "AV / LED" },
      { label: "stack", value: "React" },
    ],
  },
  15: {
    problem:
      "DevenCodes needed a software-studio site that sells AI agents and full-stack delivery, with a stack story and a path to book a consult — not a generic dark template.",
    solution:
      "I built devencodes.com with Next.js, Tailwind CSS, Framer Motion, and Shadcn UI: services, process, testimonials, and tech stack, with Cloudinary-backed media and a dark theme.",
    architecture: [
      "Next.js and TypeScript marketing site",
      "Tailwind CSS and Shadcn UI components",
      "Framer Motion section motion",
      "Cloudinary for media delivery",
    ],
    metrics: [
      { label: "theme", value: "Dark" },
      { label: "focus", value: "AI studio" },
      { label: "stack", value: "Next.js" },
    ],
  },
}

/** Project IDs with full case study content. */
export const COMPLETE_CASE_STUDY_IDS = new Set(Object.keys(CASE_STUDY_OVERRIDES).map(Number))

export function applyCaseStudyDefaults(project: Project): Project {
  const override = CASE_STUDY_OVERRIDES[project.id]
  if (override) {
    return { ...project, ...override }
  }

  return {
    ...project,
    problem: project.problem ?? project.description,
    solution: project.solution ?? project.details,
  }
}

export function listIncompleteCaseStudies(projects: Project[]) {
  return projects
    .filter((p) => p.featured && !p.hidden && !COMPLETE_CASE_STUDY_IDS.has(p.id))
    .map((p) => ({ id: p.id, title: p.title, slug: p.slug }))
}
