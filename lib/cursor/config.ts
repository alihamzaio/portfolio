import type { CursorMode } from "./types"

export const CURSOR_CONFIG = {
  ringLerp: 0.58,
  ringLerpSkill: 0.62,
  visualLerp: 0.28,
  magneticLerp: 0.38,
  magneticStrength: {
    button: 0.2,
    contact: 0.22,
    skill: 0.14,
    default: 0.18,
  } as Record<string, number>,
  ringSize: {
    default: 28,
    link: 40,
    button: 44,
    project: 52,
    contact: 48,
    external: 38,
    skill: 34,
    hidden: 0,
  } satisfies Record<CursorMode, number>,
  dotScale: {
    default: 1,
    link: 1,
    button: 1.35,
    project: 1.1,
    contact: 1.25,
    external: 1,
    skill: 1.15,
    hidden: 0,
  } satisfies Record<CursorMode, number>,
  glowOpacity: {
    default: 0.22,
    link: 0.38,
    button: 0.42,
    project: 0.45,
    contact: 0.48,
    external: 0.35,
    skill: 0.3,
    hidden: 0,
  } satisfies Record<CursorMode, number>,
  labels: {
    project: "View Project",
    contact: "Let's Talk",
  } as Partial<Record<CursorMode, string>>,
} as const
