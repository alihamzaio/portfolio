"use client"

/** Human recorded intro — public/agent/pitch.wav (optional) */
export const HUMAN_PITCH_SRC = "/agent/pitch.wav"

type SpeechRec = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((ev: {
    resultIndex: number
    results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>
  }) => void) | null
  onerror: ((ev: { error?: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

let pitchAudio: HTMLAudioElement | null = null

export function getSpeechRecognition(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRec
    webkitSpeechRecognition?: new () => SpeechRec
  }
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

/** Prefer natural / human-sounding English voices */
export function pickHumanVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const en = voices.filter((v) => /^en(-|_)/i.test(v.lang) || /^en$/i.test(v.lang))
  const pool = en.length ? en : voices
  const prefer =
    /Natural|Neural|Online \(Natural\)|Google US English|Google UK English Female|Microsoft (Aria|Jenny|Guy|Sara|Ana) Online|Samantha|Daniel|Karen|Moira|Zoe|Allison/i
  return pool.find((v) => prefer.test(v.name)) || pool.find((v) => /Google|Microsoft/i.test(v.name)) || pool[0] || null
}

export function stopAgentVoice() {
  if (typeof window === "undefined") return
  window.speechSynthesis?.cancel()
  if (pitchAudio) {
    pitchAudio.pause()
    pitchAudio.currentTime = 0
  }
}

/** Play the recorded human pitch once (no-op if file missing) */
export function playHumanPitch(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  stopAgentVoice()
  if (!pitchAudio) {
    pitchAudio = new Audio(HUMAN_PITCH_SRC)
    pitchAudio.preload = "none"
  }
  pitchAudio.currentTime = 0
  return pitchAudio.play().catch(() => undefined)
}

/** Speak dynamic replies with the most human browser voice available */
export function speakHuman(text: string, enabled: boolean) {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return
  const clean = text.replace(/\n+/g, ". ").replace(/[•*#`]/g, "").trim()
  if (!clean) return

  stopAgentVoice()

  const run = () => {
    const utter = new SpeechSynthesisUtterance(clean.slice(0, 1200))
    utter.rate = 0.96
    utter.pitch = 1
    utter.lang = "en-US"
    const voice = pickHumanVoice(window.speechSynthesis.getVoices())
    if (voice) {
      utter.voice = voice
      utter.lang = voice.lang || "en-US"
    }
    window.speechSynthesis.speak(utter)
  }

  const voices = window.speechSynthesis.getVoices()
  if (voices.length) run()
  else {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null
      run()
    }
    window.setTimeout(run, 250)
  }
}

export async function ensureMicPermission(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return false
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((t) => t.stop())
    return true
  } catch {
    return false
  }
}

export type { SpeechRec }
