const sharp = require('sharp');
const path = require('path');

const svg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d0d1a"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <linearGradient id="ok" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5e5ce6"/>
      <stop offset="100%" stop-color="#0a84ff"/>
    </linearGradient>
    <radialGradient id="glow1" cx="35%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#5e5ce6" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#5e5ce6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="65%" cy="70%" r="50%">
      <stop offset="0%" stop-color="#0a84ff" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0a84ff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)"/>

  <!-- Ambient glow -->
  <ellipse cx="${size*0.35}" cy="${size*0.3}" rx="${size*0.45}" ry="${size*0.4}" fill="url(#glow1)"/>
  <ellipse cx="${size*0.65}" cy="${size*0.7}" rx="${size*0.45}" ry="${size*0.4}" fill="url(#glow2)"/>

  <!-- Outer ring -->
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.34}" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="${size*0.004}"/>

  <!-- Cross lines on ring -->
  <line x1="${size/2}" y1="${size*0.16}" x2="${size/2}" y2="${size*0.84}" stroke="rgba(255,255,255,0.07)" stroke-width="${size*0.003}"/>
  <line x1="${size*0.16}" y1="${size/2}" x2="${size*0.84}" y2="${size/2}" stroke="rgba(255,255,255,0.07)" stroke-width="${size*0.003}"/>

  <!-- Up arrow -->
  <polyline points="${size/2-size*0.06},${size*0.26} ${size/2},${size*0.2} ${size/2+size*0.06},${size*0.26}"
    fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="${size*0.028}" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Down arrow -->
  <polyline points="${size/2-size*0.06},${size*0.74} ${size/2},${size*0.8} ${size/2+size*0.06},${size*0.74}"
    fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="${size*0.028}" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Left arrow -->
  <polyline points="${size*0.26},${size/2-size*0.06} ${size*0.2},${size/2} ${size*0.26},${size/2+size*0.06}"
    fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="${size*0.028}" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Right arrow -->
  <polyline points="${size*0.74},${size/2-size*0.06} ${size*0.8},${size/2} ${size*0.74},${size/2+size*0.06}"
    fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="${size*0.028}" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- OK button -->
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.165}" fill="url(#ok)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.165}" fill="url(#ok)" opacity="0.6"/>

  <!-- OK shadow/glow -->
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.165}" fill="none" stroke="rgba(10,132,255,0.4)" stroke-width="${size*0.02}" filter="blur(4px)"/>

  <!-- OK text -->
  <text x="${size/2}" y="${size/2 + size*0.042}" text-anchor="middle"
    fill="white" font-size="${size*0.1}" font-weight="700"
    font-family="-apple-system, 'SF Pro Display', Helvetica, sans-serif"
    letter-spacing="${size*0.005}">OK</text>
</svg>`;

async function generate() {
  const sizes = [192, 512];
  for (const size of sizes) {
    const buf = Buffer.from(svg(size));
    await sharp(buf)
      .png()
      .toFile(path.join(__dirname, 'public', `icon-${size}.png`));
    console.log(`✅ icon-${size}.png`);
  }
}

generate().catch(console.error);
