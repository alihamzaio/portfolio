export type CursorMode =
  | "default"
  | "link"
  | "button"
  | "project"
  | "contact"
  | "external"
  | "skill"
  | "hidden"

export type CursorTheme = "dark" | "light"

export interface CursorTarget {
  mode: CursorMode
  label: string
  showArrow: boolean
  magnetic: boolean
  element: HTMLElement | null
  theme: CursorTheme
}

export const DEFAULT_CURSOR_TARGET: CursorTarget = {
  mode: "default",
  label: "",
  showArrow: false,
  magnetic: false,
  element: null,
  theme: "dark",
}
