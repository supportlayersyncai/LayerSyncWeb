# LayerSync — Brand & Identity Guide

This document records the LayerSync visual identity after the 2026 rebrand away
from the legacy purple→cyan look.

## Colour system

| Token | Hex | Role |
| --- | --- | --- |
| **Brand Orange** | `#D36135` | Primary / warm. Replaces the old purple & blue. |
| **Brand Green** | `#7FB069` | Secondary / cool. Replaces the old cyan & sky. |
| Surface (dark) | `#050505` | Default app background (dark mode) |
| Surface (light) | `#f5f5f7` | Light mode background |

The brand gradient runs **orange → green** (top → bottom), matching the logo
mark.

### Palette ramps

Both colours are expanded into full 50–950 ramps (see `tailwind.config.ts` and
the inline config in `index.html`). The live site loads Tailwind from the CDN,
so the ramps are injected there as well.

```
orange  50 #FCF1EC · 100 #F8DDD1 · 200 #F0B89F · 300 #E5926E · 400 #DC7A4F
        500 #D36135 · 600 #BC4F28 · 700 #973D20 · 800 #79331C · 900 #632C1B · 950 #35140A
green   50 #F2F7EE · 100 #E2EED8 · 200 #C7DDB4 · 300 #A6C98A · 400 #92BD74
        500 #7FB069 · 600 #649551 · 700 #4E7641 · 800 #405E37 · 900 #374E30 · 950 #1B2916
```

### How the recolour works

Rather than rewriting ~300 utility classes, the legacy Tailwind palette names
are **remapped** to the brand ramps so the design is preserved exactly:

- `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink` → **orange** ramp
- `sky`, `cyan`, `teal`, `emerald`, `green` → **green** ramp

This happens in two places that must stay in sync:
1. `index.html` — inline `tailwind.config` for the runtime CDN build (the live site).
2. `tailwind.config.ts` — for the PostCSS pipeline / Next.js path.

Non-class colours (inline `rgb()/rgba()`, `<canvas>` drawing, SVG gradients,
CSS variables) are set directly to the brand colours in their source files.

New work should prefer the explicit `brand-orange` / `brand-green` tokens.

## Logo & icon package (`/public`)

All raster assets are generated from the master artwork, masked to the exact
brand gradient (`#D36135` → `#7FB069`).

| File | Purpose |
| --- | --- |
| `assets/logo.png`, `logo-mark.png` | Primary mark (used in Navbar & Footer) |
| `favicon.ico` | Multi-size ICO (16/32/48) |
| `favicon.svg` | Scalable favicon |
| `favicon-16x16.png`, `favicon-32x32.png` | PNG favicons |
| `apple-touch-icon.png` | 180×180 iOS home-screen icon |
| `android-chrome-192x192.png`, `android-chrome-512x512.png` | PWA / Android icons |
| `icon-512-maskable.png` | Maskable PWA icon (safe-zone padded) |
| `og-image.png` | 1200×630 social share card |
| `site.webmanifest` | PWA manifest (theme `#050505`) |

The legacy in-repo brand SVGs (`LayerSyncAI_full.svg`, `LayerSyncAI_icon.svg`)
and the `LayerSyncLogo` React component have also been recoloured to the brand
gradient.

Favicon / icon / Open Graph / theme-color tags are wired up in `index.html`
(live Vite app) and `app/layout.tsx` (Next.js path).

## Usage notes

- The mark is full-colour on transparency and reads on both light and dark
  surfaces — **do not** apply invert/recolour filters to it.
- Keep clear space around the mark roughly equal to the width of its left stroke.
