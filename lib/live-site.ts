/** Honest labels for fragile / gated demos */
export function liveSiteCta(url: string): { label: string; cursorLabel: string } {
  const u = url.toLowerCase()
  if (u.includes("/login") || u.includes("signin")) {
    return { label: "Open (sign-in required)", cursorLabel: "Sign-in" }
  }
  if (u.includes("testnet") || u.includes(".exec9.")) {
    return { label: "Open staging", cursorLabel: "Staging" }
  }
  return { label: "View live site", cursorLabel: "Open live site" }
}
