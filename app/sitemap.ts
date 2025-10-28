import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alihamza-fawn.vercel.app'
    const routes = ['/', '#about', '#skills', '#projects', '#contact']
    const now = new Date()
    return routes.map((route) => ({
        url: `${baseUrl}${route.startsWith('#') ? '/' : ''}${route}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: route === '/' ? 1 : 0.6,
    }))
}


