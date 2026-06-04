import { ImageResponse } from "next/og"
import { brandIconMarkup } from "@/lib/brand-icon"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(brandIconMarkup(180), { ...size })
}
