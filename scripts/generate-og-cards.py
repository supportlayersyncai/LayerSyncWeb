#!/usr/bin/env python3
"""
Compose the Open Graph share cards.
---------------------------------------------------------------------------
These are typographic cards, so they are COMPOSED, not AI-generated: image
models render text unreliably, and an OG card is almost entirely text.

Run:  python3 scripts/generate-og-cards.py
Needs: Pillow, plus a grotesque + a mono TTF (paths in FONT_DIR below).
Both faces used here are OFL-licensed.

Outputs:
  public/og-image.png       site-wide default (1200x630)
  public/og-layer-map.png   The Layer Map field guide

Rendered at 2x and downsampled so the type stays crisp.
"""
from PIL import Image, ImageDraw, ImageFont
import os

FONT_DIR = "/mnt/skills/examples/canvas-design/canvas-fonts"
SANS = os.path.join(FONT_DIR, "InstrumentSans-Regular.ttf")
SANS_BOLD = os.path.join(FONT_DIR, "InstrumentSans-Bold.ttf")
MONO_BOLD = os.path.join(FONT_DIR, "GeistMono-Bold.ttf")

S = 2                      # supersample factor
W, H = 1200 * S, 630 * S
PAD = 72 * S

BG = (5, 5, 5)
ORANGE = (211, 97, 53)
GREEN = (127, 176, 105)
TEXT = (248, 250, 252)
SECOND = (203, 213, 225)
TERT = (148, 163, 184)

LAYERS = [("1", "Asking"), ("2", "Assisting"), ("3", "Automating"),
          ("4", "Delegating"), ("5", "Compounding")]


def f(path, size):
    return ImageFont.truetype(path, size * S)


def lerp(a, b, t):
    return tuple(round(x + (y - x) * t) for x, y in zip(a, b))


def glow(img, cx, cy, radius, color, strength=0.20):
    """Soft radial brand glow, matching the site's ambient treatment."""
    layer = Image.new("RGB", img.size, BG)
    d = ImageDraw.Draw(layer)
    steps = 46
    for i in range(steps, 0, -1):
        t = i / steps
        r = int(radius * t)
        d.ellipse([cx - r, cy - r, cx + r, cy + r],
                  fill=lerp(BG, color, strength * (1 - t) ** 1.6))
    return Image.blend(img, layer, 0.85)


def tracked(d, xy, text, font, fill, track):
    """Letter-spaced text (PIL has no tracking)."""
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + track * S
    return x


def tracked_width(d, text, font, track):
    return sum(d.textlength(c, font=font) + track * S for c in text)


def wrap(d, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if d.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def base_canvas():
    img = Image.new("RGB", (W, H), BG)
    img = glow(img, int(W * 0.16), int(H * 0.10), int(W * 0.42), ORANGE, 0.22)
    img = glow(img, int(W * 0.92), int(H * 0.90), int(W * 0.38), GREEN, 0.16)
    return img


def footer(d, left, right):
    fm = f(MONO_BOLD, 14)
    y = H - PAD - 14 * S
    tracked(d, (PAD, y), left, fm, TERT, 1.6)
    rw = tracked_width(d, right, fm, 1.6)
    tracked(d, (W - PAD - rw, y), right, fm, TERT, 1.6)


def wordmark(d, x, y):
    """LAYERSYNC wordmark with the brand dot."""
    fw = f(MONO_BOLD, 16)
    end = tracked(d, (x, y), "LAYERSYNC", fw, TEXT, 3.2)
    r = 4 * S
    cy = y + 9 * S
    d.ellipse([end + 3 * S, cy - r, end + 3 * S + 2 * r, cy + r], fill=ORANGE)


def save(img, name):
    out = os.path.join("public", name)
    img.resize((W // S, H // S), Image.LANCZOS).save(out, "PNG", optimize=True)
    print(f"  {out}  {os.path.getsize(out)/1024:.0f} KB")


# ---------------------------------------------------------------- layer map
def layer_map_card():
    img = base_canvas()
    d = ImageDraw.Draw(img)

    wordmark(d, PAD, PAD - 6 * S)

    tracked(d, (PAD, PAD + 54 * S), "A LAYERSYNC FIELD GUIDE",
            f(MONO_BOLD, 15), ORANGE, 3.0)

    d.text((PAD, 146 * S), "The Layer Map", font=f(SANS_BOLD, 80), fill=TEXT)

    sub = ("What using AI actually looks like at each stage of a business — "
           "and how to tell which stage you're on.")
    fs = f(SANS, 24)
    y = 258 * S
    for line in wrap(d, sub, fs, W - 2 * PAD - 40 * S)[:2]:
        d.text((PAD, y), line, font=fs, fill=SECOND)
        y += 34 * S

    # Ascending ladder — the five layers. Bar height encodes the progression,
    # so the card reads as "five rising stages" even at thumbnail size.
    bottom = 486 * S          # baseline of the bars
    max_bh = 108 * S          # tallest bar; numbers sit 24px above each bar
    span = W - 2 * PAD
    gap = 18 * S
    cw = (span - gap * 4) / 5
    fn = f(MONO_BOLD, 15)
    fl = f(SANS, 17)

    for i, (num, label) in enumerate(LAYERS):
        c = lerp(ORANGE, GREEN, i / 4)
        x = PAD + i * (cw + gap)
        bh = max_bh * (0.34 + 0.66 * (i / 4))
        d.rounded_rectangle([x, bottom - bh, x + cw, bottom],
                            radius=6 * S, fill=lerp(BG, c, 0.30))
        d.rounded_rectangle([x, bottom - bh, x + cw, bottom - bh + 4 * S],
                            radius=2 * S, fill=c)
        d.text((x, bottom - bh - 25 * S), num, font=fn, fill=c)
        d.text((x, bottom + 12 * S), label, font=fl, fill=SECOND)

    footer(d, "LAYERSYNCAI.COM", "33 PAGES  ·  FREE")
    save(img, "og-layer-map.png")


# ------------------------------------------------------------------- site
def site_card():
    img = base_canvas()
    d = ImageDraw.Draw(img)

    wordmark(d, PAD, PAD - 6 * S)

    tracked(d, (PAD, PAD + 54 * S), "AI SYSTEMS & CUSTOM SOFTWARE",
            f(MONO_BOLD, 15), ORANGE, 3.0)

    ft = f(SANS_BOLD, 76)
    y = PAD + 96 * S
    for line in ["We build the systems", "businesses run on."]:
        d.text((PAD, y), line, font=ft, fill=TEXT)
        y += 88 * S

    fs = f(SANS, 25)
    d.text((PAD, y + 16 * S),
           "Custom operations systems, AI agents and SynCRM.",
           font=fs, fill=SECOND)

    # Layered planes — the "layer" motif, echoing the brand mark.
    bx, by = W - PAD - 250 * S, int(H * 0.66)
    for i in range(4):
        c = lerp(GREEN, ORANGE, i / 3)
        off = i * 26 * S
        d.polygon([(bx + off, by - off), (bx + 125 * S + off, by + 62 * S - off),
                   (bx + off, by + 124 * S - off), (bx - 125 * S + off, by + 62 * S - off)],
                  fill=lerp(BG, c, 0.20 + 0.16 * i))

    footer(d, "LAYERSYNCAI.COM", "HARARE, ZIMBABWE")
    save(img, "og-image.png")


if __name__ == "__main__":
    print("Composing OG cards:")
    layer_map_card()
    site_card()
