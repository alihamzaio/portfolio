"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, GitBranch, Github, Star, Users } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { PremiumCard } from "@/components/ui/premium-card"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { usePublicProfile } from "@/components/providers/site-content-provider"

interface GitHubProfile {
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export function HomeGithub() {
  const site = usePublicProfile()
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const username = site.githubUsername

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setProfile(data))
      .catch(() => {})
  }, [username])

  const stats = [
    { icon: BookOpen, label: "Public repos", value: profile?.public_repos ?? "—" },
    { icon: Users, label: "Followers", value: profile?.followers ?? "—" },
    { icon: GitBranch, label: "Following", value: profile?.following ?? "—" },
    { icon: Star, label: "Active since", value: profile ? new Date(profile.created_at).getFullYear() : "—" },
  ]

  return (
    <section id="github" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          label="Open source"
          title="GitHub activity"
          description="Consistent contribution across production repositories — APIs, indexers, and full-stack applications."
          align="center"
          className="mx-auto"
        />

        <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          <PremiumCard className="lg:col-span-2" hover={false}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Github className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-display font-semibold text-white">@{username}</p>
                <p className="text-xs text-muted-foreground">github.com/{username}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3"
                >
                  <stat.icon className="h-4 w-4 text-[#60A5FA] mb-2" />
                  <p className="font-display text-lg font-semibold text-white">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <MagneticButton href={site.social.github} className="w-full justify-center">
              <Github className="h-4 w-4" /> View GitHub profile
            </MagneticButton>
          </PremiumCard>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <PremiumCard hover={false} className="p-4 sm:p-6 overflow-hidden">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
                Contribution graph
              </p>
              <div className="rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0f1e]/80">
                <Image
                  src={`https://ghchart.rshah.org/${username}`}
                  alt={`GitHub contribution chart for ${username}`}
                  width={800}
                  height={120}
                  className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
                  unoptimized
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Shipping code across MERN, AWS, and blockchain infrastructure repositories.
              </p>
            </PremiumCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
