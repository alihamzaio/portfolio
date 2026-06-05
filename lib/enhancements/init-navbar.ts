export function initNavbarScroll() {
  const header = document.querySelector<HTMLElement>("[data-site-header]")
  if (!header) return () => {}

  let lastY = window.scrollY
  let hidden = false

  const onScroll = () => {
    const y = window.scrollY
    if (y > lastY && y > 80) {
      if (!hidden) {
        hidden = true
        header.style.transform = "translateY(-100%)"
      }
    } else if (y < lastY || y <= 80) {
      if (hidden) {
        hidden = false
        header.style.transform = "translateY(0)"
      }
    }
    lastY = y
  }

  header.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)"
  window.addEventListener("scroll", onScroll, { passive: true })

  return () => window.removeEventListener("scroll", onScroll)
}
