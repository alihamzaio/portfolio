# How to sell Next.js Ship Starter

## 1. Zip the starter

From the portfolio repo root:

```powershell
Compress-Archive -Path "digital-products\nextjs-ship-starter\*" -DestinationPath "nextjs-ship-starter.zip" -Force
```

Do not include `node_modules` or `.next` (they are gitignored).

## 2. Create a Gumroad product

1. https://gumroad.com → New product  
2. Type: digital download  
3. Upload `nextjs-ship-starter.zip`  
4. Price: match `lib/products.ts` (`$29` or your price)  
5. Publish and copy the product URL  

## 3. Wire the portfolio

In `lib/products.ts`, set:

```ts
buyUrl: "https://yourname.gumroad.com/l/nextjs-ship-starter"
```

Redeploy. The product page Buy button goes live.

## 4. Promote

- Link from Shorts / Long descriptions  
- Mention at the end of related blog posts  
- Pin the product URL in YouTube channel About (optional)
