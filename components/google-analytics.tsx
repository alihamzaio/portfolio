import Script from "next/script"

/** Google Analytics 4 measurement ID (from Google tag / gtag.js). */
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-NLKFTN17M0"

export function GoogleAnalytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
