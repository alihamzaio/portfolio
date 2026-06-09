import { CURSOR_CONFIG } from "./config"
import { DEFAULT_CURSOR_TARGET, type CursorMode, type CursorTarget } from "./types"

const NATIVE_CURSOR =
  "input, textarea, select, option, [contenteditable='true'], [data-native-cursor]"

const MAGNETIC_MODES = new Set<CursorMode>(["button", "contact", "skill"])

function resolveTheme(el: HTMLElement): CursorTarget["theme"] {
  return el.closest('[data-cursor-bg="light"]') ? "light" : "dark"
}

function fromHost(host: HTMLElement): CursorTarget {
  const mode = (host.dataset.cursor as CursorMode) || "default"
  const label = host.dataset.cursorLabel || CURSOR_CONFIG.labels[mode] || ""
  const magnetic =
    host.hasAttribute("data-cursor-magnetic") || MAGNETIC_MODES.has(mode)
  const showArrow = mode === "external" || host.dataset.cursorArrow === "true"

  return {
    mode,
    label,
    showArrow,
    magnetic,
    element: magnetic ? host : null,
    theme: resolveTheme(host),
  }
}

export function resolveCursorTarget(from: EventTarget | null): CursorTarget {
  if (!from || !(from instanceof Element)) return DEFAULT_CURSOR_TARGET

  const el = from as HTMLElement

  if (el.closest(NATIVE_CURSOR)) {
    return { ...DEFAULT_CURSOR_TARGET, mode: "hidden" }
  }

  const explicit = el.closest("[data-cursor]") as HTMLElement | null
  if (explicit) return fromHost(explicit)

  const anchor = el.closest("a") as HTMLAnchorElement | null
  if (anchor) {
    const external =
      anchor.target === "_blank" ||
      (anchor.hostname && anchor.hostname !== window.location.hostname)
    if (external) {
      return {
        mode: "external",
        label: anchor.dataset.cursorLabel || "",
        showArrow: true,
        magnetic: false,
        element: null,
        theme: resolveTheme(anchor),
      }
    }
    return {
      mode: "link",
      label: "",
      showArrow: false,
      magnetic: false,
      element: null,
      theme: resolveTheme(anchor),
    }
  }

  const button = el.closest("button") as HTMLButtonElement | null
  if (button) {
    return {
      mode: "button",
      label: "",
      showArrow: false,
      magnetic: true,
      element: button,
      theme: resolveTheme(button),
    }
  }

  return DEFAULT_CURSOR_TARGET
}
