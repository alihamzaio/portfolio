import { ImageResponse } from "next/og"
import { brandIconMarkup } from "@/lib/brand-icon"

export const size = { width: 192, height: 192 }
export const contentType = "image/png"

export default function Icon192() {
  return new ImageResponse(brandIconMarkup(192), { ...size })
}
