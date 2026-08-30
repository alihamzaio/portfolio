import { ImageResponse } from "next/og"
import { brandIconMarkup } from "@/lib/brand-icon"

export const size = { width: 512, height: 512 }
export const contentType = "image/png"

export default function Icon512() {
  return new ImageResponse(brandIconMarkup(512), { ...size })
}
