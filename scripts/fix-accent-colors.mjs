import fs from "fs"
import path from "path"

const exts = new Set([".tsx", ".ts", ".css", ".svg"])
const skip = new Set(["node_modules", ".next", "scripts", "color-audit-hex.txt", "color-audit-rgb.txt", "color-audit-tailwind.txt"])

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(ent.name)) continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, files)
    else if (exts.has(path.extname(ent.name))) files.push(p)
  }
  return files
}

const reps = [
  // Wrong accent hues → design tokens
  [/#00[Dd]9[Ff][Ff]/g, "var(--accent-primary)"],
  [/rgba\(255,\s*236,\s*170,/g, "rgba(232, 68, 47,"],
  [/rgba\(240,\s*216,\s*120,/g, "rgba(232, 68, 47,"],
  [/rgba\(255,\s*240,\s*180,/g, "rgba(232, 68, 47,"],
  [/rgba\(255,\s*248,\s*220,/g, "rgba(232, 68, 47,"],
  [/rgba\(56,\s*78,\s*110,/g, "rgba(255, 255, 255,"],
  [/rgba\(26,\s*26,\s*62,/g, "rgba(10, 10, 15,"],

  // Tailwind named colors → accent token (public + admin destructive)
  [/hover:text-red-400/g, "hover:text-[var(--accent-primary)]"],
  [/text-red-400/g, "text-[var(--accent-primary)]"],
  [/hover:bg-red-500\/10/g, "hover:bg-[var(--accent-primary)]/10"],
  [/bg-red-500\/10/g, "bg-[var(--accent-primary)]/10"],
  [/bg-red-500\/15/g, "bg-[var(--accent-primary)]/15"],
  [/border-red-400\/25/g, "border-[var(--accent-primary)]/25"],
  [/border-red-400\/40/g, "border-[var(--accent-primary)]/40"],
  [/hover:border-red-500\/25/g, "hover:border-[var(--accent-primary)]/25"],
  [/text-red-100/g, "text-[var(--text-primary)]"],
  [/bg-red-400\/80/g, "bg-[var(--accent-primary)]/80"],

  // Hardcoded hex → CSS variables (case-insensitive where noted)
  [/text-\[#F8FAFC\]/gi, "text-[var(--text-primary)]"],
  [/text-\[#f8fafc\]/g, "text-[var(--text-primary)]"],
  [/text-\[#f5f5f5\]/g, "text-[var(--text-primary)]"],
  [/text-\[#f3f4f6\]/g, "text-[var(--text-primary)]"],
  [/text-\[#fafafa\]/g, "text-[var(--text-primary)]"],
  [/text-\[#e8eaed\]/g, "text-[var(--text-primary)]"],
  [/text-\[#c5cbd4\]/g, "text-[var(--text-secondary)]"],
  [/text-\[#d1d5db\]/g, "text-[var(--text-secondary)]"],
  [/text-\[#a1a1a1\]/g, "text-[var(--text-secondary)]"],
  [/text-\[#a8b0ba\]/g, "text-[var(--text-secondary)]"],
  [/text-\[#9aa3af\]/g, "text-[var(--text-secondary)]"],
  [/text-\[#8b93a0\]/g, "text-[var(--text-muted)]"],
  [/text-\[#737373\]/g, "text-[var(--text-muted)]"],
  [/text-\[#6b7380\]/g, "text-neutral-500"],
  [/text-\[#5c6573\]/g, "text-neutral-500"],
  [/text-\[#525a66\]/g, "text-neutral-600"],
  [/text-\[#94A3B8\]/g, "text-[var(--text-secondary)]"],
  [/text-\[#64748B\]/gi, "text-[var(--text-muted)]"],

  [/border-\[#1c222b\]/g, "border-[var(--border-subtle)]"],
  [/border-\[#1a1a1a\]/g, "border-[var(--border-subtle)]"],
  [/divide-\[#1c222b\]/g, "divide-[var(--border-subtle)]"],
  [/via-\[#1c222b\]/g, "via-[var(--border-subtle)]"],

  [/bg-\[#0c0c0c\]/g, "bg-[var(--bg-secondary)]"],
  [/bg-\[#05070b\]/g, "bg-[var(--bg-void)]"],
  [/bg-\[#080b10\]/g, "bg-[var(--bg-primary)]"],
  [/bg-\[#0a0e14\]/g, "bg-[var(--bg-primary)]"],
  [/bg-\[#07090e\]/g, "bg-[var(--bg-primary)]"],
  [/bg-\[#030303\]/g, "bg-[var(--bg-void)]"],
  [/bg-\[#111111\]/g, "bg-[var(--bg-elevated)]"],
  [/from-\[#030303\]/g, "from-[var(--bg-void)]"],
  [/from-\[#05070b\]/g, "from-[var(--bg-void)]"],
  [/via-\[#05070b\]/g, "via-[var(--bg-void)]"],
  [/via-\[#030303\]/g, "via-[var(--bg-void)]"],

  [/stroke="#E8442F"/g, 'stroke="var(--accent-primary)"'],
  [/stroke="#e8442f"/g, 'stroke="var(--accent-primary)"'],
  [/stopColor="#e8442f"/g, 'stopColor="var(--accent-primary)"'],
  [/color="#E8442F"/g, 'color="var(--accent-primary)"'],
  [/color: "#E8442F"/g, 'color: "var(--accent-primary)"'],

  // Manifest / viewport / SVG brand surfaces (literal hex only — not CSS var)
  [/fill="#F8FAFC"/gi, 'fill="#ede9e1"'],
  [/fill="#f8fafc"/g, 'fill="#ede9e1"'],
  [/stroke="#f8fafc"/g, 'stroke="#ede9e1"'],
]

let changed = 0
for (const f of walk(".")) {
  if (f.includes(`${path.sep}styles${path.sep}globals.css`)) continue
  let c = fs.readFileSync(f, "utf8")
  const o = c
  for (const [re, sub] of reps) c = c.replace(re, sub)
  if (c !== o) {
    fs.writeFileSync(f, c)
    changed++
    console.log(f)
  }
}
console.log("changed", changed)
