"use client"

import { siteConfig } from "@/lib/site"

export function LinkedInContinueButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.assign(siteConfig.social.linkedinProfile)
      }}
      className="inline-flex items-center justify-center rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-[#0a0f1a] font-semibold px-5 py-3 transition-colors"
    >
      Continue to LinkedIn profile
    </button>
  )
}
