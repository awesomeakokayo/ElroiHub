# Fractul fonts — ElRoi Hub

Fractul is a commercial typeface (Adam Ladd). The site is wired for it.

**Current behavior:** `app/globals.css` defines `font-family: "Fractul"` for all Figma-mapped text (see `app/fractul.css` for the exact selector list). Until you add licensed files, the browser falls back to **Space Grotesk** (Google Fonts, imported in `globals.css`) — the closest free geometric match — so you still see a clear change from Outfit.

**To enable true Fractul (pixel-perfect Figma match):**
1. Purchase/license Fractul from https://ladd-design.com/family/fractul/ (or via Adobe Fonts if you have CC)
2. Generate webfonts (woff2 + woff) for weights 600 / 700 / 900
3. Drop them here as:
   - `Fractul-SemiBold.woff2` / `.woff` (600)
   - `Fractul-Bold.woff2` / `.woff` (700)
   - `Fractul-Black.woff2` / `.woff` (900)
4. In `app/globals.css:8-28`, uncomment the `url('/fonts/...')` lines inside the three `@font-face` blocks

No code change needed beyond that — ` --font-fractul: "Fractul","Space Grotesk","Outfit",sans-serif` will then use the local files automatically.

