import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site"

export const alt = `${siteConfig.name} — ${siteConfig.title}`
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
          background: "linear-gradient(155deg, #030712 0%, #0a0f1a 45%, #0f172a 100%)",
          color: "#F8FAFC",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(160deg, #1a2336, #0a0f1a)",
              border: "2px solid rgba(59, 130, 246, 0.45)",
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              color: "#93C5FD",
              position: "relative",
            }}
          >
            AH
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 10,
                height: 10,
                borderRadius: 10,
                background: "#22D3EE",
              }}
            />
          </div>
          <span style={{ fontSize: 20, color: "#64748B" }}>{siteConfig.location}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.02 }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 34, marginTop: 14, color: "#60A5FA", fontWeight: 600 }}>
            {siteConfig.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              marginTop: 22,
              color: "#94A3B8",
              maxWidth: 880,
              lineHeight: 1.5,
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>
        <div style={{ fontSize: 17, color: "#64748B" }}>github.com/alihamzaio</div>
      </div>
    ),
    { ...size }
  )
}
