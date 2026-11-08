# Rules for VERGHÉTHORN articles (verghethorn.com/articles/)

Owner's instruction: three articles a week, professional level, built on fresh worldwide research — never written from memory alone.

## 1. Research first (every time)
- Before writing, search the web for what happened **in the last 2–7 days** worldwide on the article's topic: industry news, company announcements, studies and reports, statements by directors, cinematographers, agencies and brands, festival and award news, new tools and equipment.
- Areas to scan: advertising and brand campaigns; cinema and filmmaking (lighting, new lamps/LED, cameras, lenses, colour, screenwriting, VFX, virtual production); AI video and image generation; product and launch videos; fashion and beauty campaigns (topics only); hotels, travel and tourism marketing; AI agents and voice assistants; social video (Reels, TikTok, YouTube Shorts); music videos; restaurant, real-estate and marketplace video.
- Use both English and Russian sources. Prefer primary or reputable sources (company newsrooms, trade press such as Variety, The Hollywood Reporter, Adweek, Ad Age, Campaign, Shots, No Film School, American Cinematographer, Sostav, AdIndex, Cossa).
- Pick what people actually want to know right now: the most discussed news, a practical change, a new technique — and connect it to what a brand needs.

## 2. Writing
- One article = one clear search intent (a question people type into Google/Yandex). Put the main keyword naturally into the title, description, first paragraph and one H2.
- Write two versions: English and Russian. Each is written natively for its audience (not word-for-word translation); Russian uses Russian search phrasing (e.g. «реклама для брендов», «производство рекламных роликов», «кинематографичная реклама»).
- 700–1000 words each. Structure: short intro → 4–6 H2 sections → practical takeaway → one closing line about how VERGHÉTHORN helps.
- Facts: every number, quote or claim about a company must come from a source found in this run and be listed in `sources` (title + URL). Never invent statistics, quotes, clients or results. Quotes under 15 words, attributed; otherwise paraphrase.
- Tone: confident, calm, expert, no hype, no clickbait. Short paragraphs.
- Do not repeat a topic already covered in `tools/articles.mjs`; vary topics across the week (e.g. Mon cinema craft, Wed brands/advertising, Fri AI/production or a niche: hotels, restaurants, real estate, marketplaces, music videos).

## 3. Content limits (site owner's rules)
- No alcohol in images or as a topic angle.
- Never present real brands' products as VERGHÉTHORN's work. Mention real campaigns only as news with a source.
- Fashion/beauty may be a topic, but no images of fashion models/women.
- No prices or quotes for VERGHÉTHORN services — send readers to /start/.

## 4. Linking
- Each article has `page` = the matching service (films, commercials, agents, collab, design, nature); the page template adds the "Start a project" button, the service link and links to Instagram, YouTube and TikTok automatically.
- Where natural, link inside the body to 1–2 of our pages (`/commercials/`, `/films/`, `/ai-agents/`, `/product-design/`, `/nature-travel/`, `/collaborations/`) or earlier articles (`/articles/<slug>/`). The /ru/ prefix is added automatically for Russian.

## 5. Technical
- Add the article object at the TOP of the `ARTICLES` array in `tools/articles.mjs`: `{ slug, date: 'YYYY-MM-DD', img, page, sources: [[title, url], ...], en: { title, desc, body }, ru: { title, desc, body } }`.
- `slug`: short English keyword phrase, lowercase, hyphens. `desc`: 140–160 characters.
- `img`: one of the existing posters (`s-ads`, `s-films`, `s-collab`, `s-nature`, `p-pottery`, `c-fire`, `c-forest`, `c-ink`, `c-smoke`, `c-stars`, `reel`) or `/media/agent-call.webp`; choose the one that fits the topic and was used least recently.
- Body HTML: `<p>`, `<h2>`, `<ul><li>`, `<b>`, `<a href="/...">` only. Escape backticks.
- Then `node tools/build.mjs`, check the new pages exist in `articles/` and `ru/articles/`, check there are no errors, commit and push to `main`, and confirm the live URL returns 200.
