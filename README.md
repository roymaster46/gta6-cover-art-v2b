# Vice Cover Studio — Vice Heat

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/roymaster46/gta6-cover-art-v2b/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/roymaster46/gta6-cover-art-v2b/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

Turn your crew's photos into a GTA-style movie poster — **VICE HEAT: Kings of the Coast** — and export it as a PNG to share. Built for the [gta6-cover-art-01](https://make.fun/bounty/gta6-cover-art-01) bounty on make.fun. Everything runs offline in the browser; no photo ever leaves your device.

## What it makes

A 16:9 movie poster, drawn on canvas:

- **Seven portrait panels** — a hero driver close-up in the centre, flanked by the boss, mechanic, captain, rider, lookout and wheelman — each with its own role tag and a place · time · one-liner caption.
- **A chrome title** — big retro 3D lettering with a sunset gradient, sun stripes and a pink glow, spanning the middle of the poster.
- **Pink neon script subtitle**, a press-quote top bar (five gold stars, VOL. 02, ★ WANTED ★), an orange tagline strip, a gold **ORIGINAL COVER ART** starburst seal, and a billing block with COMING SOON and a barcode.

## The studio

1. **Words** — edit the title, subtitle, tagline and press quote; the poster repaints live.
2. **Grade** — four Vice City colour grades: Sunset, Neon Nights, Golden Hour, Dusk Blue.
3. **Layout** — Coast Grid (hero centre) or Wide Strip (hero left, six panels in a 3 × 2 grid).
4. **Panels** — click a panel on the poster (or in the list) to edit it: drop in your own photo, then zoom and pan it into place. One photo can fill all seven panels, or each panel can hold a different one. A seven-portrait sample crew loads on open so the poster is complete immediately.
5. **Export** — one click saves a PNG at **1920 × 1080**, **1080 × 1080** or **1080 × 1350**.

## Try it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network request: `app/` is plain static files, and every font is a system font. The seven sample portraits were made with an image model for this entry.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored `vendor/makefun-app.ts`. Screenshots live in `screenshots/` (see `shots.json` for how each was taken).

## License

MIT — see [LICENSE](LICENSE). All characters are original; no Rockstar Games logo, artwork or font is used.
