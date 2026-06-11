type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
  nonce?: string
}

export function JsonLd({ data, nonce }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data]
  return (
    <>
      {payload.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
        >
          {JSON.stringify(item)}
        </script>
      ))}
    </>
  )
}
