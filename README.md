# verghethorn.com

One interactive page in English, served by GitHub Pages from this branch. `/ru/` and older URLs redirect to it.

## Edit text
1. Change copy in `tools/content.mjs`.
2. Run `node tools/build.mjs`.
3. Commit and push. Pages publishes in about a minute.

## What is on the page
- **The screen** (`static/js/hero.js`) — six live, generated film worlds (Neon, Space, Sunset, Noir, Aurora, Warp) rendered with WebGL. Tap the screen for explosions, sparks, lightning, portals and confetti; Action cuts to a new scene.
- **Script lab** — a story slot machine; tap a reel to lock it; "Make it our next ad" drops the idea into the pitch form.
- **Design it. Film it. Ship it.** (`product.js`, three.js) — design your own drink can (name, flavour, finish), then see it in a film ad or inside a shop app.
- **Make some noise** — nine special-effect pads (keys Q W E · A S D · Z X C).
- **Five ways to work with us** — flip cards.
- **Pick a portal** — YouTube, Instagram, TikTok and email, each opened with its own effect and sound.
- **Pitch form**.

Effects engine: `fx.js`. Sounds are synthesised in `sfx.js` (no audio files) and start only after the first tap; the header button mutes them.
Scrolling is always native: taps only fire when the finger didn't move, nothing captures vertical swipes.

## Pitch form
Submissions go to Supabase project **verghethorn-site**, table `public.inquiries` (insert-only for the public via row-level security).
