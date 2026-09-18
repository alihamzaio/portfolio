# Sell Kickoff Forge on Gumroad

## 1. Zip (already scripted)

From portfolio root:

```powershell
Compress-Archive -Path "digital-products\kickoff-forge\*" -DestinationPath "kickoff-forge.zip" -Force
```

Or use the committed `public/downloads/kickoff-forge.zip` after running the zip step in CI/local.

## 2. Gumroad

1. New product → digital download  
2. Upload `kickoff-forge.zip`  
3. Price: **$19** (or your choice)  
4. Publish → copy product URL  

## 3. Wire checkout

In `lib/products.ts`:

```ts
buyUrl: "https://yourname.gumroad.com/l/kickoff-forge"
```

Redeploy. Buy button unlocks on `/products/kickoff-forge`.

## Why this product

Not another code starter. It sells the **process** freelancers skip: discovery → scope → estimate → week one → handoff.
