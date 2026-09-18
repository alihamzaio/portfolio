export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Your Studio",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "hello@example.com",
  tagline: "Web apps that ship clean.",
} as const
