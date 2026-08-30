/** Clean model output before display — content preserved, markup normalized */
export function normalizeAgentReply(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/```[\w]*\n?/g, "")
    .replace(/```/g, "")
    .trim()
}

export type ChatBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "brief"; rows: Array<{ label: string; value: string }> }

function isListLine(line: string) {
  return /^(\s*)([•\-*]|\d+[.)])\s+/.test(line)
}

function stripListMarker(line: string) {
  return line.replace(/^(\s*)([•\-*]|\d+[.)])\s+/, "").trim()
}

function parseBrief(text: string): { block: ChatBlock; trailing: string } | null {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (!lines.length) return null
  const head = lines[0]!.toLowerCase()
  if (!head.includes("project brief") && !head.startsWith("idea:")) return null

  const rows: Array<{ label: string; value: string }> = []
  let lastField = -1
  lines.forEach((line, i) => {
    const m = line.match(/^([A-Za-z][A-Za-z\s/]+):\s*(.*)$/)
    if (m) {
      rows.push({ label: m[1]!.trim(), value: m[2]!.trim() || "—" })
      lastField = i
    }
  })
  if (rows.length < 3) return null
  const trailing = lines
    .slice(lastField + 1)
    .filter((l) => !/^project brief/i.test(l))
    .join(" ")
    .trim()
  return { block: { type: "brief", rows }, trailing }
}

export function parseChatBlocks(raw: string): ChatBlock[] {
  const text = normalizeAgentReply(raw)
  if (!text) return []

  const briefIdx = (() => {
    const a = text.search(/(?:^|\n)Project brief draft\b/i)
    if (a >= 0) return a === 0 ? 0 : a + 1
    const b = text.search(/(?:^|\n)Idea:\s/i)
    if (b < 0) return -1
    // Prefer Idea: only when enough brief fields follow
    const slice = text.slice(b === 0 ? 0 : b + 1)
    return /Type:|Audience:|Features:|Contact:/i.test(slice) ? (b === 0 ? 0 : b + 1) : -1
  })()

  if (briefIdx >= 0) {
    const before = text.slice(0, briefIdx).trim()
    const briefPart = text.slice(briefIdx).trim()
    const parsed = parseBrief(briefPart)
    if (parsed) {
      const blocks: ChatBlock[] = []
      if (before) {
        for (const chunk of before.split(/\n{2,}/)) {
          const t = chunk.replace(/\s+/g, " ").trim()
          if (t) blocks.push({ type: "p", text: t })
        }
      }
      blocks.push(parsed.block)
      if (parsed.trailing) blocks.push({ type: "p", text: parsed.trailing })
      return blocks
    }
  }

  const whole = parseBrief(text)
  if (whole) {
    const blocks: ChatBlock[] = [whole.block]
    if (whole.trailing) blocks.push({ type: "p", text: whole.trailing })
    return blocks
  }

  const blocks: ChatBlock[] = []
  const chunks = text.split(/\n{2,}/)

  for (const chunk of chunks) {
    const lines = chunk
      .split("\n")
      .map((l) => l.trimEnd())
      .filter((l) => l.trim().length > 0)
    if (!lines.length) continue

    const allList = lines.every(isListLine)
    if (allList) {
      const ordered = lines.every((l) => /^\s*\d+[.)]\s+/.test(l))
      const items = lines.map(stripListMarker)
      blocks.push(ordered ? { type: "ol", items } : { type: "ul", items })
      continue
    }

    let buf: string[] = []
    let listBuf: string[] = []
    let listOrdered = false

    const flushP = () => {
      if (!buf.length) return
      blocks.push({ type: "p", text: buf.join(" ").replace(/\s+/g, " ").trim() })
      buf = []
    }
    const flushList = () => {
      if (!listBuf.length) return
      blocks.push(listOrdered ? { type: "ol", items: listBuf } : { type: "ul", items: listBuf })
      listBuf = []
    }

    for (const line of lines) {
      if (isListLine(line)) {
        flushP()
        if (!listBuf.length) listOrdered = /^\s*\d+[.)]\s+/.test(line)
        listBuf.push(stripListMarker(line))
      } else {
        flushList()
        buf.push(line.trim())
      }
    }
    flushList()
    flushP()
  }

  return blocks.length ? blocks : [{ type: "p", text }]
}
