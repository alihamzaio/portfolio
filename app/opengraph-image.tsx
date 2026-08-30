import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site"

export const alt = `${siteConfig.name} - ${siteConfig.title}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#050507",
          color: "#ede9e1",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 20 }}>
            <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
            <path
              d="M7 41 L21 7 H25"
              stroke="#ede9e1"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            <path
              d="M25 7 L37.5 41"
              stroke="#ede9e1"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              opacity="0.16"
            />
            <path d="M13 25.5 H34.5" stroke="#e8442f" strokeWidth="2" strokeLinecap="square" />
            <path d="M27.5 7 V41" stroke="#ede9e1" strokeWidth="2" strokeLinecap="square" />
            <path d="M34.5 7 V41" stroke="#ede9e1" strokeWidth="2" strokeLinecap="square" />
          </svg>
          <span style={{ fontSize: 20, color: "#9a9690" }}>{siteConfig.location}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.02 }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 32, marginTop: 14, color: "#e8442f", fontWeight: 600 }}>
            {siteConfig.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              marginTop: 22,
              color: "#9a9690",
              maxWidth: 880,
              lineHeight: 1.5,
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>
        <div style={{ fontSize: 17, color: "#5e5c64" }}>github.com/alihamzaio</div>
      </div>
    ),
    { ...size }
  )
}
