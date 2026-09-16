const sharp = require("sharp");
const fs = require("fs");

const W = 1584;
const H = 396;
const textX = 620;

async function main() {
  const bgPath = "C:/Users/alilo/.cursor/projects/d-New-folder-portfolio/assets/linkedin-banner-bg-only.png";

  // Dark veil to kill leftover AI text / soften right side
  const veil = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#07080C" stop-opacity="0.55"/>
      <stop offset="35%" stop-color="#07080C" stop-opacity="0.35"/>
      <stop offset="70%" stop-color="#07080C" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#07080C" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
</svg>`);

  const type = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- left reserved for avatar -->
  <rect x="${textX - 30}" y="112" width="3" height="172" fill="#E8442F"/>

  <text x="${textX}" y="172"
        font-family="Segoe UI, Arial, Helvetica, sans-serif"
        font-size="70" font-weight="700" letter-spacing="0.4"
        fill="#F7F5F0">Ali Hamza</text>

  <text x="${textX}" y="226"
        font-family="Segoe UI, Arial, Helvetica, sans-serif"
        font-size="28" font-weight="500" letter-spacing="0.3"
        fill="#E2DFD8">Full Stack Software Engineer</text>

  <rect x="${textX}" y="248" width="240" height="1" fill="#FFFFFF" fill-opacity="0.18"/>

  <text x="${textX}" y="282"
        font-family="Segoe UI, Arial, Helvetica, sans-serif"
        font-size="15" font-weight="500" letter-spacing="2.6"
        fill="#A8A49C">MERN   ·   AWS   ·   BLOCKCHAIN</text>
</svg>`);

  const out = "public/linkedin-banner-ali-hamza-1584x396.png";

  await sharp(bgPath)
    .resize(W, H, { fit: "cover", position: "centre" })
    .composite([
      { input: await sharp(veil).png().toBuffer(), top: 0, left: 0 },
      { input: await sharp(type).png().toBuffer(), top: 0, left: 0 },
    ])
    .png()
    .toFile(out);

  fs.copyFileSync(out, "C:/Users/alilo/.cursor/projects/d-New-folder-portfolio/assets/linkedin-banner-ali-hamza-1584x396.png");
  console.log("done", out);
}

main().catch((e) => { console.error(e); process.exit(1); });
