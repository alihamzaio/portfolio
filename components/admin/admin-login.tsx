"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Mail } from "lucide-react"
import { setAdminSession } from "@/lib/auth-client"
import { LogoMark } from "@/components/brand/logo"

interface AdminLoginProps {
  onSuccess: () => void
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("hamzasarwer9@gmail.com")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [devCode, setDevCode] = useState<string | null>(null)

  const sendOtp = async () => {
    setError("")
    setDevCode(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = typeof data.error === "string" ? data.error : "Failed to send OTP"
        setError(msg)
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
          <LogoMark size={48} />
          <div>
            <h1 className="text-xl font-bold text-[#F8FAFC]">Admin access</h1>
            <p className="text-xs text-[#94A3B8]">Secure login via email OTP</p>
          </div>
        </div>

        {step === "email" ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="text-xs text-[#94A3B8] mb-1.5 block">
                Admin email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-10"
                  placeholder="hamzasarwer9@gmail.com"
                />
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-2">Only your registered admin email can receive a code.</p>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="button" onClick={sendOtp} disabled={loading || !email} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send OTP <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#94A3B8]">
              Enter the 6-digit code sent to <span className="text-[#F8FAFC] font-medium">{email}</span>
            </p>
            {devCode && (
              <p className="text-xs p-3 rounded-lg bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/20">
                Dev mode — OTP: <strong className="tracking-widest">{devCode}</strong>
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
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="button" onClick={verifyOtp} disabled={loading || otp.length !== 6} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & sign in"}
            </button>
            <button type="button" onClick={() => { setStep("email"); setOtp(""); setError("") }} className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] w-full">
              Use a different email
            </button>
          </div>
        )}

        <p className="text-[10px] text-[#64748b] mt-6 text-center">
          Session saved locally for 7 days · Powered by Resend
        </p>
      </motion.div>
    </main>
  )
}
