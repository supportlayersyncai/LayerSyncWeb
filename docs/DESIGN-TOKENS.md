# LayerSync — Design Tokens (Phase C)

> The visual contract for the rebrand. These tokens already exist in the live runtime config (`index.html` Tailwind CDN block); this file documents them as the single source of truth so every new page stays coherent. No new color system is invented — we formalize what's there and add a few semantic helpers.

## 1. Brand color

| Token | Hex | Use |
|---|---|---|
| `brand.orange` / `brand.DEFAULT` | `#D36135` | Primary accent — CTAs, highlights, active states, glow |
| `brand.green` | `#7FB069` | Secondary accent — supporting highlights, success, gradient cool-end |

The CDN config **remaps legacy Tailwind hues onto the brand** so existing utility classes keep working:
- Warm hues (`blue/indigo/violet/purple/fuchsia/pink`) → **orange** ramp (`50…950`)
- Cool hues (`sky/cyan/teal/emerald/green`) → **green** ramp (`50…950`)

**Rule for new work:** prefer the explicit `brand-orange` / `brand-green` tokens (or the orange/green ramps) over raw hex. Avoid introducing any blue/purple *intent* — those class names now render orange and reading them as "blue" will mislead.

## 2. Surfaces

| Token | Value | Use |
|---|---|---|
| Dark bg | `#050505` | Default app background (dark mode is default) |
| Light bg | `#f5f5f7` | Light-mode background |
| Glass card | `glass-card` util | Frosted panel: subtle bg + blur + hairline border |
| Hairline border | `border-black/5` / `dark:border-white/5` | Card & section dividers |

## 3. Typography

- **Family:** Inter (Google Fonts), weights 100–900.
- **Display:** `.hero-heading` — `clamp(2.25rem, 6vw, 6rem)`, weight 300, tight tracking. Optional `.text-shimmer` for animated headings.
- **Body/sub:** `.sub-heading` — `clamp(1rem, 2vw, 1.25rem)`, weight 300, ~0.7 opacity.
- **Eyebrow/label:** uppercase, `tracking-[0.3em]`, `text-[10px]`, bold, tertiary color.
- **Highlight syntax:** in `TextBeat` and headings, wrap a word in `*asterisks*` to render it as the italic extralight accent span.
- **Text colors (dark):** `dark-text.primary #F8FAFC` · `secondary #CBD5E1` · `tertiary #94A3B8`. Light mode: `text-gray-900 / -600 / -500`.

## 4. Radii, motion, effects

| Token | Value |
|---|---|
| Card radius | `rounded-[32px]` (sm) → `rounded-[48px]` / `[64px]` (feature) |
| Pill / CTA | `rounded-full` |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Reveal | framer-motion `initial/whileInView` (`opacity`, `y:20–40`), `viewport={{ once: true }}` |
| CTA | `.btn-glow` (shimmer + orange/green glow on hover) |
| Card hover | `.card-hover-glow` (radial follow), `hover:border-*/10` |
| Ambient | `.ambient-glow`, `.animate-float` for hero imagery |

## 5. Standard CTA

Primary button (matches existing): 
```
btn-glow px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-xs
bg-black text-white dark:bg-white dark:text-black inline-flex items-center gap-3
```
Primary label across the site is now **"Book a diagnostic"** → `/contact` (replaces "Book a Call" / "Free AI Audit").

## 6. Section rhythm

- Section padding: `py-20 md:py-32` (feature sections `md:py-40`).
- Container: `max-w-7xl mx-auto px-4 md:px-6` (narrow prose: `max-w-3xl`).
- Eyebrow → `hero-heading` → `sub-heading` → content is the standard header stack.

## 7. Brand voice guardrails (applies to all copy)

**Never say:** "AI automation agency", "Synchronize/Synchronized Intelligence", "next-generation", "cutting-edge", "revolutionary", "ecosystem(s)", "compound your competitive advantage", "guaranteed ROI", fabricated metrics/logos.
**Say:** plain operator language — what breaks, what we build, what changes. Specific over grand. We build systems; we don't sell packages; we start with a diagnostic.

---

*Reference for Phase C implementation. Existing animation/util classes are reused as-is; nothing here changes the runtime config beyond what's already in `index.html`.*
