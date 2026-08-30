/** PNG favicon — shared brand sigil */
export function brandIconMarkup(size: number) {
  const s = size * 0.68
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050507",
        overflow: "hidden",
        borderRadius: Math.round(size * 0.18),
      }}
    >
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <path d="M4 44 L18 6 H24" stroke="#ede9e1" strokeWidth="2.6" strokeLinecap="square" />
        <path d="M28 6 V44" stroke="#ede9e1" strokeWidth="2.6" strokeLinecap="square" />
        <path d="M40 6 V44" stroke="#ede9e1" strokeWidth="2.6" strokeLinecap="square" />
        <path d="M8 30 L42 16" stroke="#e8442f" strokeWidth="3" strokeLinecap="square" />
      </svg>
    </div>
  )
}
