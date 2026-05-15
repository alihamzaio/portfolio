/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.exec9.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
    ],
  },
}

export default nextConfig
