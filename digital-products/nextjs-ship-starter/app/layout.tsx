import type { Metadata } from "next"
import { site } from "@/lib/site"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a href="/" className="logo">
            {site.name}
          </a>
          <nav>
            <a href="/#work">Work</a>
            <a href="/#contact">Contact</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
        </footer>
      </body>
    </html>
  )
}
