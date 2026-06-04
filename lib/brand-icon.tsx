/** PNG favicon / apple-icon — clear AH letterforms for Ali Hamza */
export function brandIconMarkup(size: number) {
  const radius = Math.round(size * 0.28)
  const fontSize = Math.round(size * 0.3)

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #1a2336 0%, #0a0f1a 100%)",
        borderRadius: radius,
        border: `${Math.max(1, Math.floor(size / 20))}px solid rgba(59, 130, 246, 0.45)`,
        position: "relative",
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 800,
          letterSpacing: "-0.12em",
          color: "#93C5FD",
          marginTop: size * 0.02,
        }}
      >
        AH
      </div>
      <div
        style={{
          position: "absolute",
          top: size * 0.12,
          right: size * 0.12,
          width: Math.max(3, size * 0.09),
          height: Math.max(3, size * 0.09),
          borderRadius: "50%",
          background: "#22D3EE",
        }}
      />
    </div>
  )
}
