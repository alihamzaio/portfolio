"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react"
import { SESSION_TTL_DAYS, setAdminSession } from "@/lib/auth-client"
import { LogoMark } from "@/components/brand/logo"
import { OTP_ADMIN_EMAIL } from "@/lib/official-email"

interface AdminLoginProps {
  onSuccess: () => void
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [step, setStep] = useState<"email" | "otp">("email")
  const email = OTP_ADMIN_EMAIL
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [devCode, setDevCode] = useState<string | null>(null)

  useEffect(() => {
    if (step !== "otp") return
    const ping = () => {
      void fetch("/api/health", { method: "HEAD", cache: "no-store" }).catch(() => undefined)
    }
    ping()
    const id = window.setInterval(ping, 30_000)
    return () => window.clearInterval(id)
  }, [step])

  const sendOtp = async () => {
    setError("")
    setDevCode(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = typeof data.error === "string" ? data.error : "Failed to send OTP"
        setError(typeof data.hint === "string" ? `${msg} ${data.hint}` : msg)
        return
      }
      if (data.devCode) setDevCode(data.devCode)
      setStep("otp")
    } catch {
      setError("Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Invalid code")
        return
      }
      setAdminSession({
        token: data.token,
        expiresAt: data.expiresAt,
        email: data.email,
      })
      onSuccess()
    } catch {
      setError("Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-2xl p-8 md:p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <LogoMark size={48} instanceId="login" />
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Admin access</h1>
            <p className="text-xs text-[var(--text-secondary)]">Secure login via email OTP</p>
          </div>
        </div>

        {step === "email" ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="text-xs text-[var(--text-secondary)] mb-1.5 block">
                Admin email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  readOnly
                  aria-readonly="true"
                  className="input-premium pl-10 pr-10 opacity-80 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-2">
                OTP codes are sent only to {OTP_ADMIN_EMAIL}. Contact email is separate.
              </p>
            </div>
            {error && <p className="text-sm text-[var(--accent-primary)]">{error}</p>}
            <button type="button" onClick={sendOtp} disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send OTP <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Enter the 6-digit code sent to <span className="text-[var(--text-primary)] font-medium">{email}</span>
            </p>
            {devCode && (
              <p className="text-xs p-3 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                Dev mode - OTP: <strong className="tracking-widest">{devCode}</strong>
              </p>
            )}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="input-premium text-center text-2xl tracking-[0.4em] font-mono"
              placeholder="000000"
              autoFocus
            />
            {error && <p className="text-sm text-[var(--accent-primary)]">{error}</p>}
            <button type="button" onClick={verifyOtp} disabled={loading || otp.length !== 6} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email")
                setOtp("")
                setError("")
              }}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] w-full"
            >
              Resend code
            </button>
          </div>
        )}

        <p className="text-[10px] text-[var(--text-muted)] mt-6 text-center">
          Stay signed in for {SESSION_TTL_DAYS} days. OTP is only needed again after logout or when the session expires.
        </p>
      </motion.div>
    </main>
  )
}
