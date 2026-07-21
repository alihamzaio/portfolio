import Script from "next/script"

/** Google Analytics 4 measurement ID (from Google tag / gtag.js). */
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-NLKFTN17M0"

/** Load after the page is idle so GA does not compete with LCP/FCP. */
export function GoogleAnalytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: true });
        `}
      </Script>
    </>
  )
}
