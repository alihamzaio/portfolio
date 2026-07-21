/** Portfolio copy */
export const copy = {
  hero: {
    availability: "Available for full-time roles and contract work",
    greeting: "HI, I'M",
    name: "ALI HAMZA",
    h1: "Ali Hamza | Full Stack Developer in Lahore, Pakistan",
    lead: "Full Stack Developer with 3+ years building web applications, REST APIs, AWS serverless systems, and blockchain integrations for startups and product teams.",
    support:
      "I work with React, Next.js, Node.js, Express, MongoDB, PostgreSQL, and AWS. Based in Lahore, Pakistan, and open to remote full-time and contract roles worldwide.",
    detail:
      "Day to day I design API contracts, ship React and Next.js interfaces, provision AWS resources, and keep releases stable through automated tests and monitoring. Clients hire me when they need one engineer who can own the full delivery path from architecture through production support.",
    ctaPrimary: "Let's talk",
    ctaViewWork: "View projects",
    ctaResume: "Download resume",
  },
  sections: {
    about: {
      label: "About",
      title: "Background",
      description:
        "Three years building production systems for startups and product teams across APIs, cloud infrastructure, modern frontends, and reliable deployments.",
        bio: [
          "Over the last 3+ years, I've worked on web applications, backend services, cloud infrastructure, and blockchain-related projects. My primary stack includes React, Next.js, Node.js, MongoDB, PostgreSQL, and AWS.",
          "Recent delivery includes a blockchain crawler and indexer, healthcare and e-commerce platforms on AWS serverless, DeFi interfaces with wallet connectivity, and dropshipping systems with supplier API automation.",
          "I focus on clear service boundaries, typed APIs, reliable data models, and deployment pipelines that teams can run without guesswork. That means fewer production defects, faster feature cycles, and documentation that other engineers can pick up quickly.",
          "I work remotely from Lahore and have collaborated with startups, product teams, and international clients. Open to both full-time and contract opportunities focused on shipping maintainable production software.",
        ]
    },
    skills: {
      label: "Skills",
      title: "Technologies",
      description:
        "JavaScript and TypeScript across React, Next.js, Node.js, Express, MongoDB, PostgreSQL, and AWS serverless.",
    },
    projects: {
      label: "Projects",
      title: "Selected projects",
      description:
        "Production applications in e-commerce, healthcare, fintech, and blockchain.",
    },
    experience: {
      label: "Experience",
      title: "Work history",
      description:
        "Full stack roles building REST APIs, cloud infrastructure, and web applications in Lahore and remote.",
    },
    contact: {
      label: "Contact",
      title: "Contact",
      description:
        "Send your requirements, timeline, and technical constraints. I typically reply within one business day.",
    },
    offer: {
      label: "Services",
      title: "What I work on",
      description:
        "End-to-end development for teams that need an engineer to own implementation and delivery.",
    },
    testimonials: {
      label: "Testimonials",
      title: "Client feedback",
      description: "Feedback from engineering leads and founders on recent work.",
    },
    cta: {
      label: "Next step",
      title: "Interested in working together?",
      description:
        "Available for full-time roles and contract work: web applications, REST APIs, AWS infrastructure, and blockchain integrations.",
      button: "Contact",
    },
    approach: {
      label: "Process",
      title: "How I deliver production software",
      description:
        "A clear delivery process from discovery through launch, designed for startups and product teams that need reliable full stack execution.",
      paragraphs: [
        "Every engagement starts with clarifying the product goal, technical constraints, and what success looks like in production. I map the current system, identify risks around data, auth, deployment, and third-party APIs, then propose a delivery plan with milestones the team can review early.",
        "For web applications I build React and Next.js interfaces with TypeScript, accessible layouts, and clear component boundaries. On the backend I design REST APIs with validation, authentication, and predictable error handling so mobile and partner clients can integrate without guesswork.",
        "Cloud work usually lands on AWS serverless: Lambda, API Gateway, DynamoDB or RDS, plus Terraform for infrastructure that can be recreated. For blockchain projects I focus on indexing, wallet flows, Solidity contract interfaces, and reducing expensive on-chain reads with cached API layers.",
        "Before release I add automated tests where they protect critical paths, set up CI/CD, and document how to run, deploy, and monitor the system. After launch I help stabilize performance, fix production issues quickly, and hand over a codebase other engineers can extend without reverse engineering.",
        "This process has supported e-commerce platforms, healthcare dashboards, DeFi interfaces, and blockchain indexers used by real users. The goal is always the same: ship maintainable software that stays reliable under load and is easy for the next engineer to own.",
      ],
    },
  },
  services: [
    {
      title: "Full Stack Web Applications",
      desc: "React and Next.js frontends with Node.js, Express, and MongoDB backends. Built for maintainability under production load.",
    },
    {
      title: "REST API Development",
      desc: "APIs with authentication, validation, and third-party integrations for web, mobile, and partner use.",
    },
    {
      title: "AWS Cloud & Serverless",
      desc: "Lambda, API Gateway, DynamoDB, and RDS. Provisioned with Terraform and deployed through CI/CD.",
    },
    {
      title: "Blockchain & Web3 Development",
      desc: "Smart contracts, wallet integration, RPC indexing, and on-chain data pipelines.",
    },
    {
      title: "Performance & Reliability",
      desc: "Database tuning, caching, load optimization, and monitoring for uptime and predictable response times.",
    },
    {
      title: "Deployment & Maintenance",
      desc: "Docker, Kubernetes, automated releases, and production support.",
    },
  ],
} as const
