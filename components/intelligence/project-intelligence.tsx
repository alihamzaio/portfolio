"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import { Loader2, Mic, MicOff, RotateCcw, Send, Sparkles, Trash2, Volume2 } from "lucide-react"
import { PremiumSection } from "@/components/premium"
import { SectionHeading } from "@/components/ui/section-heading"
import { RippleButton } from "@/components/ui/ripple-button"
import { ChatMessageBody } from "@/components/intelligence/chat-message-body"
import {
  emptyBrief,
  formatBrief,
  intelligencePrompts,
  intelligenceSteps,
  type AgentMode,
  type AgentUiState,
  type ChatMessage,
  type ProjectBrief,
} from "@/lib/project-intelligence"
import {
  ensureMicPermission,
  getSpeechRecognition,
  playHumanPitch,
  speakHuman,
  stopAgentVoice,
  type SpeechRec,
} from "@/lib/agent-voice"
import { normalizeAgentReply } from "@/lib/chat-format"
import { cn } from "@/lib/utils"

export function ProjectIntelligence() {
  const [reduce, setReduce] = useState(false)
  const listId = "pi-chat-log"
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const recRef = useRef<SpeechRec | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [state, setState] = useState<AgentUiState>("idle")
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<AgentMode>("explorer")
  const [brief, setBrief] = useState<ProjectBrief>(emptyBrief())
  const [briefStep, setBriefStep] = useState(0)
  const [briefComplete, setBriefComplete] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [listening, setListening] = useState(false)
  const [voiceOut, setVoiceOut] = useState(true)

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, state, briefComplete, reviewOpen])

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices()
    }
    return () => {
      try {
        recRef.current?.abort()
      } catch {
        /* ignore */
      }
      stopAgentVoice()
    }
  }, [])

  const send = useCallback(
    async (raw: string, action?: string) => {
      const clean = raw.trim()
      if ((!clean && action !== "start_brief" && action !== "submit_brief") || state === "loading") return

      setError(null)
      setState("loading")
      stopAgentVoice()

      const nextMessages =
        clean && action !== "submit_brief"
          ? [...messages, { role: "user" as const, content: clean }]
          : messages

      if (clean && action !== "submit_brief") {
        setMessages(nextMessages)
        setInput("")
      }

      try {
        const res = await fetch("/api/project-intelligence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action:
              action ||
              (mode === "brief" && !briefComplete ? "brief_answer" : "ask"),
            message: clean,
            history: messages,
            mode,
            brief,
            briefStep,
            honeypot,
          }),
        })

        const data = await res.json()
        if (res.status === 429 || data.state === "rate_limited") {
          setState("rate_limited")
          setError(data.error || "Too many requests. Please wait.")
          return
        }
        if (!res.ok || data.state === "error") {
          setState("error")
          setError(data.error || "Something went wrong.")
          return
        }

        if (data.mode === "brief") setMode("brief")
        if (data.brief) setBrief(data.brief)
        if (typeof data.briefStep === "number") setBriefStep(data.briefStep)
        if (typeof data.briefComplete === "boolean") setBriefComplete(data.briefComplete)
        if (data.briefComplete) setReviewOpen(true)

        if (data.mailto && action === "submit_brief") {
          window.location.href = data.mailto
        }

        if (typeof data.reply === "string") {
          const reply = normalizeAgentReply(data.reply)
          setMessages([...nextMessages, { role: "assistant", content: reply }])
          speakHuman(reply, voiceOut && !reduce)
        }
        setState("success")
      } catch {
        setState("error")
        setError("Connection issue. Retry when ready.")
      }
    },
    [brief, briefComplete, briefStep, honeypot, messages, mode, reduce, state, voiceOut]
  )

  const stopListening = useCallback(() => {
    try {
      recRef.current?.stop()
    } catch {
      /* ignore */
    }
    setListening(false)
  }, [])

  const startListening = useCallback(async () => {
    const Ctor = getSpeechRecognition()
    if (!Ctor) {
      setError("Voice needs Chrome or Edge. You can still type.")
      return
    }

    stopAgentVoice()
    stopListening()

    const ok = await ensureMicPermission()
    if (!ok) {
      setError("Microphone blocked. Allow mic access, then tap Talk again.")
      return
    }

    const rec = new Ctor()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = "en-US"
    recRef.current = rec
    let finalText = ""

    rec.onresult = (ev) => {
      let interim = ""
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const chunk = ev.results[i]
        if (chunk.isFinal) finalText += chunk[0].transcript
        else interim += chunk[0].transcript
      }
      setInput((finalText || interim).trim())
    }

    rec.onerror = (ev) => {
      setListening(false)
      if (ev.error === "not-allowed") {
        setError("Microphone blocked. Allow mic access, then tap Talk again.")
      } else if (ev.error !== "aborted" && ev.error !== "no-speech") {
        setError("Could not catch speech. Tap Talk and try again.")
      }
    }

    rec.onend = () => {
      setListening(false)
      const text = finalText.trim()
      if (text) void send(text)
    }

    try {
      rec.start()
      setListening(true)
      setError(null)
    } catch {
      setListening(false)
      setError("Could not start the mic. Close other tabs using it, then try again.")
    }
  }, [send, stopListening])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void send(input)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void send(input)
    }
  }

  const clear = () => {
    stopListening()
    stopAgentVoice()
    setMessages([])
    setMode("explorer")
    setBrief(emptyBrief())
    setBriefStep(0)
    setBriefComplete(false)
    setReviewOpen(false)
    setError(null)
    setState("idle")
    setInput("")
    inputRef.current?.focus()
  }

  return (
    <PremiumSection id="intelligence" variant="default">
      <SectionHeading
        sectionId="intelligence"
        label="AI"
        title="Project Intelligence"
        description="Explore the work, understand the stack, or turn an idea into a clear project brief."
      />

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
        <div data-animate className="flex flex-col">
          <ol className="space-y-3.5" data-animate-stagger>
            {intelligenceSteps.map((step, i) => (
              <li
                key={step.label}
                data-animate
                className="group flex gap-4 rounded-2xl border border-[var(--border-subtle)]/80 bg-[var(--bg-primary)]/70 px-5 py-5 transition-all duration-300 hover:border-[var(--accent-primary)]/25 hover:bg-[var(--bg-primary)]"
              >
                <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--accent-primary)]/75 transition-colors group-hover:text-[var(--accent-primary)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{step.label}</p>
                  <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <RippleButton onClick={() => void send("", "start_brief")}>
              Start Project Brief Builder
            </RippleButton>
            <button
              type="button"
              onClick={() => {
                setMode("explorer")
                setBriefComplete(false)
                void send("Show me relevant projects.")
              }}
              className="btn-secondary"
            >
              Portfolio Explorer
            </button>
            <button
              type="button"
              onClick={() => {
                void playHumanPitch()
              }}
              className="btn-ghost"
            >
              <Volume2 className="h-3.5 w-3.5" aria-hidden />
              Hear human intro
            </button>
          </div>
        </div>

        {/* Fixed-height product shell — only .pi-chat-messages scrolls */}
        <div className="pi-chat-shell w-full min-w-0 self-start">
          <div className="pi-chat-header">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--accent-primary)]/2 bg-[var(--accent-primary)]/08 text-[var(--accent-primary)]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">Conversation workspace</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]/85" aria-hidden />
                  <span className="text-[var(--accent-primary)]/8">
                    {listening ? "Listening…" : mode === "brief" ? "Brief builder · Ready" : "Ready"}
                  </span>
                  <span>· Portfolio-aware</span>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => setVoiceOut((v) => !v)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs transition-colors",
                  voiceOut ? "text-[var(--accent-primary)]" : "text-neutral-500 hover:text-[var(--text-primary)]"
                )}
                aria-pressed={voiceOut}
                aria-label={voiceOut ? "Voice on, mute spoken replies" : "Voice off, enable spoken replies"}
              >
                <Volume2 className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">{voiceOut ? "Voice on" : "Voice off"}</span>
              </button>
              <button
                type="button"
                onClick={clear}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs text-neutral-500 hover:text-[var(--text-primary)]"
                aria-label="Clear conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          <div ref={scrollerRef} id={listId} role="log" aria-live="polite" className="pi-chat-messages">
            {messages.length === 0 && state !== "loading" && (
              <div className="rounded-xl border border-dashed border-[var(--border-subtle)] px-4 py-8 text-center text-sm leading-relaxed text-neutral-500">
                Ask about selected work and technologies, or start a project brief. Answers stay within this
                portfolio’s content. Use the mic to talk, or type below.
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}-${m.content.slice(0, 24)}`}
                className={cn(
                  "pi-chat-bubble max-w-[94%] shrink-0 rounded-2xl px-4 py-3",
                  m.role === "user"
                    ? "ml-auto bg-[var(--accent-primary)]/14 text-[var(--text-primary)]"
                    : "mr-auto border border-[var(--border-subtle)] bg-[var(--bg-void)]/70"
                )}
              >
                <ChatMessageBody content={m.content} role={m.role === "user" ? "user" : "assistant"} />
              </div>
            ))}

            {state === "loading" && (
              <div className="mr-auto inline-flex shrink-0 items-center gap-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-void)]/70 px-4 py-3 text-sm text-neutral-500">
                <Loader2 className={cn("h-3.5 w-3.5", !reduce && "animate-spin")} />
                Thinking…
              </div>
            )}

            {error && (
              <div
                className="shrink-0 rounded-2xl border border-[var(--accent-primary)]/25 bg-[var(--accent-primary)]/10 px-4 py-3 text-sm text-[var(--text-primary)]"
                role="alert"
              >
                <p>{error}</p>
                <button
                  type="button"
                  className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-xs underline-offset-2 hover:underline"
                  onClick={() => {
                    const last = [...messages].reverse().find((m) => m.role === "user")
                    if (last) void send(last.content)
                    else setError(null)
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Retry
                </button>
              </div>
            )}

            {briefComplete && reviewOpen && (
              <div className="shrink-0 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] p-3.5 sm:p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent-primary)]/75">
                  Review Project Brief
                </p>
                <div className="mt-3">
                  <ChatMessageBody content={formatBrief(brief)} role="assistant" />
                </div>
                <label className="mt-3 block text-xs text-neutral-500">
                  Edit contact details if needed
                  <input
                    className="mt-1.5 min-h-11 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 text-sm text-white outline-none transition-colors focus:border-[var(--accent-primary)]/45"
                    value={brief.contactValue}
                    onChange={(e) => setBrief((b) => ({ ...b, contactValue: e.target.value }))}
                  />
                </label>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <RippleButton onClick={() => void send("submit", "submit_brief")}>Send to Ali</RippleButton>
                  <button type="button" onClick={() => setReviewOpen(false)} className="btn-secondary">
                    Keep chatting
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pi-chat-footer">
            <div
              className="pi-chat-prompts flex gap-2 overflow-x-auto px-3 py-2 sm:flex-wrap sm:overflow-visible sm:px-4"
              aria-label="Suggested prompts"
            >
              {intelligencePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={state === "loading"}
                  onClick={() => void send(prompt)}
                  className="min-h-8 shrink-0 rounded-lg border border-[var(--border-subtle)] px-2.5 text-[11px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)]/25 hover:text-[var(--text-primary)] disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="border-t border-[var(--border-subtle)] p-3">
              <label className="sr-only" htmlFor="pi-input">
                Message Project Intelligence
              </label>
              <input
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                aria-hidden
              />
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => (listening ? stopListening() : void startListening())}
                  disabled={state === "loading"}
                  className={cn(
                    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    listening
                      ? "border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/15 text-[var(--text-primary)]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-void)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/35"
                  )}
                  aria-label={listening ? "Stop listening" : "Talk with microphone"}
                >
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <textarea
                  id="pi-input"
                  ref={inputRef}
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={listening ? "Listening… speak now" : "Ask about projects, stack, or your idea…"}
                  className="min-h-11 max-h-11 flex-1 resize-none rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-void)] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-[var(--accent-primary)]/45"
                />
                <button
                  type="submit"
                  disabled={state === "loading" || !input.trim()}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)] text-[#0a0e14] transition-colors hover:bg-[var(--accent-primary)] disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PremiumSection>
  )
}
