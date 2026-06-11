/**
 * Build production, start server, run Lighthouse Best Practices.
 * Use this for source-map and security audits — next dev cannot pass source maps.
 */
import { spawn } from "node:child_process"
import { mkdirSync } from "node:fs"
import { join } from "node:path"
import { setTimeout as sleep } from "node:timers/promises"

const port = process.env.LIGHTHOUSE_PORT ?? "4010"
const target = `http://localhost:${port}/`
const tmpDir = join(process.cwd(), ".tmp")
mkdirSync(tmpDir, { recursive: true })
process.env.TEMP = tmpDir
process.env.TMP = tmpDir

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: true, ...opts })
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))))
  })
}

process.stdout.write("Building production...\n")
await run("npm", ["run", "build"])

const server = spawn("npm", ["run", "start", "--", "-p", port], {
  stdio: "pipe",
  shell: true,
})

await sleep(3000)

try {
  await run("node", ["scripts/lighthouse-dev.mjs", `--url=${target}`])
} finally {
  server.kill("SIGTERM")
}
