export type SplitMode = "chars" | "words" | "lines"

export interface SplitResult {
  element: HTMLElement
  units: HTMLElement[]
  revert: () => void
}

function preserveWhitespace(text: string): string {
  return text.replace(/ /g, "\u00A0")
}

/**
 * Lightweight SplitText alternative — wraps chars/words/lines for GSAP choreography.
 */
export function splitText(el: HTMLElement, mode: SplitMode = "chars"): SplitResult {
  const original = el.innerHTML
  const text = el.textContent ?? ""

  el.setAttribute("aria-label", text)
  el.setAttribute("role", "text")

  const units: HTMLElement[] = []

  if (mode === "lines") {
    const lines = text.split(/\n+/).filter(Boolean)
    el.innerHTML = ""
    lines.forEach((line, li) => {
      const lineEl = document.createElement("span")
      lineEl.className = "split-line"
      lineEl.style.display = "block"
      lineEl.setAttribute("aria-hidden", "true")
      const inner = document.createElement("span")
      inner.className = "split-line-inner"
      inner.style.display = "inline-block"
      inner.textContent = line
      lineEl.appendChild(inner)
      el.appendChild(lineEl)
      units.push(inner)
      if (li < lines.length - 1) el.appendChild(document.createElement("br"))
    })
  } else if (mode === "words") {
    const words = text.split(/(\s+)/).filter((w) => w.length > 0)
    el.innerHTML = ""
    el.setAttribute("aria-hidden", "true")
    words.forEach((word) => {
      if (/^\s+$/.test(word)) {
        el.appendChild(document.createTextNode(" "))
        return
      }
      const wrap = document.createElement("span")
      wrap.className = "split-word"
      wrap.style.display = "inline-block"
      wrap.textContent = word
      el.appendChild(wrap)
      units.push(wrap)
    })
  } else {
    el.innerHTML = ""
    el.setAttribute("aria-hidden", "true")
    ;[...text].forEach((char) => {
      const span = document.createElement("span")
      span.className = "split-char"
      span.style.display = "inline-block"
      span.textContent = char === " " ? "\u00A0" : char
      el.appendChild(span)
      units.push(span)
    })
  }

  const revert = () => {
    el.innerHTML = original
    el.removeAttribute("aria-label")
    el.removeAttribute("role")
    el.removeAttribute("aria-hidden")
  }

  return { element: el, units, revert }
}

export function splitTextPreserve(el: HTMLElement, mode: SplitMode = "chars"): SplitResult {
  const result = splitText(el, mode)
  if (mode === "chars") {
    result.units.forEach((u) => {
      if (u.textContent === "\u00A0") u.textContent = preserveWhitespace(" ")
    })
  }
  return result
}
