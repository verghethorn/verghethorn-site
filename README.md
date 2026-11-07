# verghethorn.com

One video-first page in English, served by GitHub Pages from this branch. `/ru/` and older URLs redirect to it.

## Edit text
Change copy in `tools/content.mjs`, run `node tools/build.mjs`, commit and push.

## Sections
- **Hero** — stories-style montage of cinematic clips (vertical set on phones, wide set on desktop); tap to skip.
- **Short films** — vertical reels by genre.
- **On set** (`static/js/grade.js`) — one real clip re-lit and re-lensed live in WebGL: Daylight / Tungsten / Neon / Golden hour; 35mm / 85mm / 40mm anamorphic / 16mm film. Tap the frame to aim the key light.
- **Brand films** — full-bleed editorial panels.
- **Product design** — colour, material, form, film; try a colourway.
- **Script lab** — spin a story; it can be sent straight into the pitch form.
- **Portals** — YouTube, Instagram, TikTok, email with their own effects; **Pitch form** (Supabase `public.inquiries`).

## Footage
`media/v/` — clips from Mixkit (free licence), trimmed and re-encoded (H.264, no audio, posters `.webp`). Swap any file for your own film with the same name to replace it.
Sounds are synthesised in `static/js/sfx.js`.
