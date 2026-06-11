import { spawn } from "node:child_process"
import { mkdirSync } from "node:fs"
import { join } from "node:path"
import { setTimeout as sleep } from "node:timers/promises"

const tmpDir = join(process.cwd(), ".tmp")
mkdirSync(tmpDir, { recursive: true })
process.env.TEMP = tmpDir
process.env.TMP = tmpDir

const args = process.argv.slice(2)
const urlArg = args.find((a) => a.startsWith("--url="))
const target =
  urlArg?.slice("--url=".length) ??
  process.env.LIGHTHOUSE_URL ??
  "http://localhost:4000/"

const isHttps = target.startsWith("https://")
const chromeFlags = [
  "--headless=new",
  "--no-sandbox",
  ...(isHttps ? ["--ignore-certificate-errors"] : []),
].join(" ")

async function prewarm() {
  process.stdout.write(`Pre-warming ${target} (wait for Turbopack compile)...\n`)
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const res = await fetch(target, {
        headers: { Accept: "text/html" },
        signal: AbortSignal.timeout(120_000),
      })
      const html = await res.text()
      if (res.ok && html.length > 1000) {
        process.stdout.write(`Ready (${html.length} bytes, attempt ${attempt})\n`)
        return
      }
    } catch {
      // dev server still starting or compiling
    }
    await sleep(3000)
  }
  throw new Error(`Could not load ${target}. Is the dev server running?`)
}

await prewarm()
await sleep(2000)

const outFile = "lighthouse-dev-report.json"
const child = spawn(
  "npx",
  [
    "lighthouse",
    target,
    "--only-categories=best-practices",
    "--preset=desktop",
    "--throttling-method=devtools",
    "--throttling.cpuSlowdownMultiplier=1",
    "--output=json",
    "--output=html",
    `--output-path=./${outFile.replace(".json", "")}`,
    `--chrome-flags=${chromeFlags}`,
    "--max-wait-for-load=120000",
    "--quiet",
    "--no-enable-error-reporting",
  ],
  { stdio: "inherit", shell: true }
)

child.on("close", (code) => {
  if (code === 0) {
    process.stdout.write(`\nReport: ${outFile} and lighthouse-dev-report.report.html\n`)
    process.stdout.write(
      isHttps
        ? "HTTPS dev: security audits (HSTS, CSP, COOP) can score accurately.\n"
        : "HTTP dev: HTTPS/HSTS audits will show N/A — use npm run dev:https for those.\n"
    )
  }
  process.exit(code ?? 1)
})
