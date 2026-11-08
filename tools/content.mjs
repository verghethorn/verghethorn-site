// All site copy (English). Edit text here and run `node tools/build.mjs`.

export const SITE = {
  url: 'https://verghethorn.com',
  email: 'verghethorn@gmail.com',
  // search-engine ownership codes (Google Search Console, Yandex Webmaster, Bing Webmaster)
  verify: { google: '', yandex: '', bing: '' },
  social: {
    instagram: { name: 'Instagram', handle: '@verghethorn.studio', href: 'https://www.instagram.com/verghethorn.studio', color: '#d6249f' },
    youtube: { name: 'YouTube', handle: '@verghethorn', href: 'https://www.youtube.com/@verghethorn', color: '#ff0033' },
    tiktok: { name: 'TikTok', handle: '@verghethorn_official', href: 'https://www.tiktok.com/@verghethorn_official', color: '#000000' },
  },
};

export const L = {
  title: 'VERGHÉTHORN — AI Cinema, Commercials and AI Agents',
  desc: 'VERGHÉTHORN creates films, brand commercials and AI agents. Cinema, created with AI.',
  skip: 'Skip to content', soundOn: 'Sound on', soundOff: 'Sound off', menu: 'Menu', close: 'Close',
  nav: [['#films', 'Films'], ['#commercials', 'Commercials'], ['#agents', 'AI Agents'], ['#collab', 'Collaborations'], ['#lineup', 'Services'], ['#contact', 'Contact']],
  reels: { label: 'Reels', pick: 'Choose a reel', items: [['show', 'Showreel', 'reel'], ['films', 'Films', 's-films'], ['ads', 'Commercials', 's-ads'], ['worlds', 'Worlds', 'c-stars']] },
  ribbon: ['Now taking projects for 2027.', 'Start a conversation'],

  hero: { h1: 'AI Cinema', sub: 'Films and commercials for brands.<br>Created with AI.', a: 'Watch the reel', b: 'Start a project' },
  agents: { h2: 'AI Agents', sub: 'Chat, voice and video. Always on.', a: 'Talk to the agent', b: 'Request a demo',
    chat: { agentId: 'agent_8301m6y0jvjce27are2pzqj9k34v', type: 'Message the agent…', send: 'Send', call: 'Talk to the agent', end: 'End the call',
      t: { connecting: 'Connecting…', listening: 'Listening…', speaking: 'Speaking…', online: 'AI agent · online', ended: 'Call ended · AI agent', mic: 'Microphone access is off — you can type to me instead.', busy: 'I can’t take calls right now. Please send your request by email — the director will reply personally:', hello: 'Hi! I’m the VERGHÉTHORN agent. Connecting you now — when you hear me, just speak. Or type below.' },
      name: 'VERGHÉTHORN Agent', status: 'AI agent · online', live: 'Live', alt: 'The VERGHÉTHORN AI agent: a figure in a dark suit with a black helmet and a glowing blue visor',
      msgs: [['u', 'Can you make a 30-second film for my coffee brand?'], ['a', 'Of course. Tell me about your brand and your audience — I’ll prepare a concept.'], ['u', 'Perfect. Let’s talk.']] } },
  ads: { h2: 'Commercials', sub: 'Make your brand unforgettable.', a: 'Learn more', b: 'Start a project' },
  tiles: [
    ['films', 'dark', 's-films', 'Films', 'Any world. Any era. Any light.'],
    ['collab', 'dark', 's-collab', 'Collaborations', 'Your brand inside our stories.'],
    ['design', 'light', 'p-pottery', 'Product design', 'From first sketch to production.'],
    ['nature', 'light', 's-nature', 'Nature & travel', 'Every place on Earth. And beyond.'],
  ],
  tileA: 'Learn more', tileB: 'Start a project',

  know: { h2: 'Get to know VERGHÉTHORN.', items: [
    ['c-stars', 'Worlds', 'Any world. No set.', '', ['Deserts, oceans, mountain tops, other planets — every location is created for the story, not found and rented.', 'No travel, no permits, no weather to wait for.'], '/films/'],
    ['c-fire', 'Emotion', 'Pictures you can feel.', '', ['Technology is only the tool. A film works when it moves someone.', 'Every shot is chosen for what it makes the viewer feel — then cut, scored and coloured like cinema.'], '/films/'],
    ['c-forest', 'Atmosphere', 'Light, fog and rain — directed.', '', ['Golden hour that lasts as long as the scene needs. Fog that rolls in on cue. Rain only where the story asks for it.'], '/nature-travel/'],
    ['c-ink', 'Colour', 'Every frame, graded like cinema.', '', ['Colour carries mood and brand. Every film is graded shot by shot — including your brand palette for commercials.'], '/commercials/'],
    ['c-smoke', 'Detail', 'Crafted to the last frame.', '', ['Every shot is generated, reviewed and refined until it is right — then edited, scored and finished by hand.'], '/films/'],
  ] },

  lineup: { h2: 'Explore the services.', items: [
    ['s-films', 'Film', 'Short films and series', ['Script and characters', 'AI-generated scenes', 'Sound and colour']],
    ['s-ads', 'Commercial', 'Campaigns for brands', ['Concept and storyboard', 'TV, web and social', 'Product scenes']],
    ['p-pottery', 'Product design', 'From idea to production', ['Concept and 3D', 'Photoreal renders', 'Launch film']],
    ['agent', 'AI Agent', 'Assistants for brands', ['Answers 24/7', 'Your tone of voice', 'Web and messengers']],
  ], a: 'Learn more', b: 'Request' },

  why: { h2: 'Why VERGHÉTHORN.', items: [
    ['✦', 'A direct line to the director.', 'You talk to the person who makes your film.'],
    ['◐', 'Style frames first.', 'See the look of your film before production starts.'],
    ['▭', 'Ready for every screen.', 'Cinema, TV, web, vertical — one project, every format.'],
  ] },

  contact: { h2: 'Let’s create together.', sub: 'Films, commercials, AI agents and collaborations.', emailName: 'Email' },

  footNote: 'Demo footage, music and sound effects on this site: Mixkit. Brand names in examples are fictional.',
  footCols: [['Create', [['films', 'Films'], ['commercials', 'Commercials'], ['design', 'Product design'], ['nature', 'Nature & travel']]], ['AI', [['agents', 'AI Agents'], ['agents', 'Concierge assistants'], ['agents', 'Customer support']]], ['Together', [['collab', 'Collaborations'], ['collab', 'Partnerships']]]],
  ui: { home: 'Home', back: 'Back', details: 'Details', prev: 'Previous', next: 'Next', more: 'More about', contact: 'Contact', start: 'Start a project', rights: 'All rights reserved.', main: 'Main', about: 'About', homeLabel: 'VERGHÉTHORN home', lang: 'Language', sections: 'Sections' },
  notFound: { title: 'Page not found — VERGHÉTHORN', h1: 'Wrong scene.', text: 'This page doesn’t exist.', home: 'Back to the start' },
  moved: 'This page has moved.',
};

// ---------- Films page (Apple-style product page) ----------
export const FILMS = {
  slug: 'films', kind: 'films', heroMedia: 's-films', endMedia: 'c-stars', reel: 'films',
  title: 'VERGHÉTHORN Films — AI short films and series',
  desc: 'Original short films and series created with AI and directed like cinema. Any world, any era, any light.',
  name: 'Films',
  local: [['#overview', 'Overview'], ['#highlights', 'Highlights'], ['#how', 'How it works'], ['#faq', 'FAQ']],
  cta: 'Start a project',
  hero: { eyebrow: 'VERGHÉTHORN Films', h1: 'Any world.<br>Any era.<br>Any light.', sub: 'Original short films and series — created with AI, directed like cinema.', a: 'Watch the film reel', b: 'Start a project' },
  statement: 'Every frame is written, directed and finished by a filmmaker. AI is the camera.',
  highlights: { h2: 'Get to know VERGHÉTHORN Films.', items: [
    ['c-stars', 'Worlds', 'Any world.<br>No set.', 'Any world. No set.', ['Deserts, oceans, mountain tops, other planets — every location is created for your story, not found and rented.', 'No travel, no permits, no weather to wait for. The world of the film is designed once and stays consistent in every shot.']],
    ['s-nature', 'Scale', 'Shots that used<br>to need a crew.', 'Shots that used to need a crew.', ['Aerial views, wide landscapes, crowds and journeys — the kind of shots that once needed helicopters, crews and weeks of travel.', 'Here they are generated, reviewed and regenerated until they serve the story.']],
    ['c-forest', 'Atmosphere', 'Light, fog and rain —<br>directed.', 'Light, fog and rain — directed.', ['Golden hour that lasts as long as the scene needs. Fog that rolls in on cue. Rain only where the story asks for it.', 'Atmosphere is not luck anymore. It is a decision.']],
    ['c-fire', 'Emotion', 'Pictures you<br>can feel.', 'Pictures you can feel.', ['Technology is only the tool. A film works when it moves someone.', 'Every shot is chosen for what it makes the viewer feel — then cut, scored and coloured with the same care as cinema.']],
    ['s-collab', 'Cities', 'Every city.<br>Any hour.', 'Every city. Any hour.', ['Night trains, empty streets at dawn, rooftops above the lights — cities that feel real, at the exact hour your story needs.']],
  ] },
  how: { h2: 'How it works.', sub: 'From one sentence to a finished film.', steps: [
    ['Idea', 'Tell us the story, the feeling or simply a sentence. That is enough to start.'],
    ['Script & look', 'A script and style frames — you see the look of your film before production starts.'],
    ['AI production', 'Every shot is generated, reviewed and refined until it serves the story.'],
    ['Final cut', 'Edit, voice, music, sound design and colour. Delivered for every screen.'],
  ] },
  get: { h2: 'What you get.', items: [
    ['A finished film', 'Edited, scored and colour-graded — ready to premiere.'],
    ['Every format', 'Cinema and YouTube 16:9, Reels and TikTok 9:16, square 1:1.'],
    ['Style frames first', 'You approve the look before the film is made.'],
    ['A direct line to the director', 'You talk to the person who makes your film.'],
  ] },
  faq: { h2: 'Questions? Answers.', items: [
    ['How long does a film take?', 'It depends on the length and the story. After a short conversation the director proposes a timeline for your project.'],
    ['How much does it cost?', 'Every film is quoted individually. Start a project and you will receive a personal proposal.'],
    ['What do you need from me?', 'An idea, a feeling or a brief. Even one sentence is enough to begin — the rest we shape together.'],
    ['Is everything made by AI?', 'AI generates the footage. The story, direction, edit, sound and colour are made by a filmmaker.'],
  ] },
  end: { h2: 'Let’s make<br>your film.', a: 'Start a project', b: 'Talk on Instagram' },
};

// ---------- Start a project (the “Buy” flow) ----------
export const START = {
  title: 'Start a project — VERGHÉTHORN',
  desc: 'Tell VERGHÉTHORN about your film, commercial, product or AI agent. A few quick steps — the director replies personally.',
  h1: 'Start a project.',
  sub: 'A few quick questions. The director replies personally.',
  steps: [
    { id: 'kind', h: 'What would you like to create?', opts: [['films', 'Film', 'Short film or series'], ['commercials', 'Commercial', 'Campaign for a brand'], ['design', 'Product design', 'From idea to production'], ['agents', 'AI agent', 'Assistant for your brand'], ['collab', 'Collaboration', 'Your brand in our story'], ['nature', 'Nature & travel', 'Places, landscapes, journeys']] },
    { id: 'length', h: 'How long should it be?', opts: [['15–30 seconds'], ['30–60 seconds'], ['1–5 minutes'], ['Longer'], ['Not sure yet']] },
    { id: 'when', h: 'When do you need it?', opts: [['As soon as possible'], ['Within a month'], ['Within 3 months'], ['No rush']] },
  ],
  idea: { h: 'Tell us about your idea.', ph: 'A few sentences about the story, the brand, the feeling you want…' },
  you: { h: 'How can we reach you?', name: 'Your name', contact: 'Email, phone or Instagram' },
  send: 'Send request', sending: 'Sending…', note: 'Your request goes straight to the director. No account needed.',
  done: { h: 'Thank you. Your request is sent.', p: 'The director will read it and reply to you personally.', home: 'Back to VERGHÉTHORN' },
  fail: { h: 'Almost there.', p: 'We couldn’t send your request automatically. Open your email app with the request ready, or copy it and send it to verghethorn@gmail.com.', mail: 'Open email', copy: 'Copy request', copied: 'Copied' },
  need: 'Please choose what you would like to create and leave a way to reach you.',
  subject: '⭐ New request',
};

// ---------- the other directions (same product-page template as Films) ----------
const local = [['#overview', 'Overview'], ['#highlights', 'Highlights'], ['#how', 'How it works'], ['#faq', 'FAQ']];
const priceQ = ['How much does it cost?', 'Every project is quoted individually. Start a project and you will receive a personal proposal.'];

export const COMMERCIALS = {
  slug: 'commercials', kind: 'commercials', heroMedia: 's-ads', endMedia: 'c-ink', reel: 'ads', name: 'Commercials', local, cta: 'Start a project',
  title: 'VERGHÉTHORN Commercials — AI campaigns for brands',
  desc: 'Commercials and campaigns for brands, created with AI and finished like cinema. Every format, every screen.',
  hero: { eyebrow: 'VERGHÉTHORN Commercials', h1: 'Make your brand<br>unforgettable.', sub: 'Campaigns for brands — created with AI, finished like cinema.', a: 'Watch the commercials reel', b: 'Start a project' },
  statement: 'People forget ads. They remember films. We make commercials that feel like cinema.',
  highlights: { h2: 'Get to know VERGHÉTHORN Commercials.', items: [
    ['s-ads', 'Product', 'The product<br>is the hero.', 'The product is the hero.', ['Macro shots, slow motion, perfect light — the product shown the way it deserves, without a studio day.', 'Every angle can be explored before the final cut is chosen.']],
    ['c-ink', 'Colour', 'Your brand colours,<br>in motion.', 'Your brand colours, in motion.', ['Your palette is built into every frame — from the first style frame to the final grade.']],
    ['c-smoke', 'Mood', 'A feeling people<br>remember.', 'A feeling people remember.', ['A commercial is remembered for how it feels. We design the mood first, then the shots.']],
    ['s-collab', 'Places', 'Any city.<br>Any season.', 'Any city. Any season.', ['A night city, a winter street, a summer coast — the right location for your campaign, without travel.']],
    ['c-fire', 'Energy', 'Moments that<br>stop the scroll.', 'Moments that stop the scroll.', ['The first second decides everything on social. Every version is cut to catch the eye — and hold it.']],
  ] },
  how: { h2: 'How it works.', sub: 'From brief to campaign.', steps: [
    ['Brief', 'Tell us about the brand, the product and the audience.'],
    ['Concept & storyboard', 'A concept, a storyboard and style frames — approved before production.'],
    ['AI production', 'Every shot generated, reviewed and refined in your brand’s look.'],
    ['Every format', 'Final cut with sound and colour, delivered for TV, web and social.'],
  ] },
  get: { h2: 'What you get.', items: [
    ['A finished commercial', 'Edited, scored and colour-graded — ready to launch.'],
    ['Every format', 'Horizontal for TV and YouTube, vertical for Reels and TikTok, square for feeds.'],
    ['Style frames first', 'You approve the look before the commercial is made.'],
    ['A direct line to the director', 'You talk to the person who makes your commercial.'],
  ] },
  faq: { h2: 'Questions? Answers.', items: [
    ['How long does a commercial take?', 'It depends on the length and the number of versions. After a short conversation the director proposes a timeline.'],
    priceQ,
    ['Can you use our real product?', 'Yes. Send photos or a 3D model of your product, and it becomes the hero of the commercial.'],
    ['Do you make versions for social media?', 'Yes. Every commercial can be delivered in horizontal, vertical and square formats.'],
  ] },
  end: { h2: 'Let’s make<br>your commercial.', a: 'Start a project', b: 'Talk on Instagram' },
};

export const AGENTS = {
  slug: 'ai-agents', kind: 'agents', heroMedia: 'img:/media/agent-call.webp', endMedia: 'img:/media/agent-call.webp', reel: null, name: 'AI Agents', local, cta: 'Request a demo',
  title: 'VERGHÉTHORN AI Agents — assistants for your brand',
  desc: 'AI agents for brands: chat, voice and video. Answers your clients 24/7 in your tone of voice, in any language.',
  hero: { eyebrow: 'VERGHÉTHORN AI Agents', h1: 'Your brand.<br>Always on.', sub: 'AI agents that talk to your clients — in chat, by voice and on video.', a: 'Talk to our agent', aHref: '/#agents', b: 'Request a demo' },
  statement: 'Your clients have questions at midnight. Your agent is there — calm, polite, in their language.',
  highlights: { h2: 'Get to know VERGHÉTHORN AI Agents.', items: [
    ['img:/media/agent-card.webp', 'Always on', 'Day and night.<br>Every day.', 'Day and night. Every day.', ['The agent answers clients at any hour — on your website, in messengers, by voice.', 'When a question needs a human, it invites the client to contact you directly.']],
    ['img:/media/agent-call.webp', 'Voice & video', 'It talks.<br>Like a person.', 'It talks. Like a person.', ['A natural voice, a face if you want one, and answers in real time — not a menu of buttons.']],
    ['c-stars', 'Languages', 'Every language<br>your clients speak.', 'Every language your clients speak.', ['The agent starts in your main language and switches when a client speaks another one — Russian, Arabic, Japanese and more.']],
    ['c-smoke', 'Your tone', 'Your voice.<br>Your rules.', 'Your voice. Your rules.', ['It speaks in your brand’s tone and follows your rules — for example, it never discusses prices and sends those questions to you.']],
  ] },
  how: { h2: 'How it works.', sub: 'From your knowledge to a working agent.', steps: [
    ['Your brand', 'Tell us what the agent should know, say and never say.'],
    ['Character & voice', 'We design its look, voice and manner — like a character in a film.'],
    ['Launch', 'The agent goes live on your website or in your messengers.'],
    ['Tuning', 'We review real conversations and refine the agent.'],
  ] },
  get: { h2: 'What you get.', items: [
    ['A working AI agent', 'Chat and voice, on your website or in messengers.'],
    ['Your character', 'A look and a voice designed for your brand.'],
    ['Many languages', 'It answers clients in the language they use.'],
    ['Clear rules', 'It knows what to say — and when to hand over to you.'],
  ] },
  faq: { h2: 'Questions? Answers.', items: [
    ['Can I try an agent first?', 'Yes — talk to the VERGHÉTHORN agent on our home page. It works the same way an agent for your brand would.'],
    priceQ,
    ['Where can the agent work?', 'On your website, and depending on the project, in messengers or on the phone.'],
    ['What if the agent does not know the answer?', 'It says so politely and invites the client to contact you directly.'],
  ] },
  end: { h2: 'Let’s build<br>your agent.', a: 'Request a demo', b: 'Talk on Instagram' },
};

export const COLLAB = {
  slug: 'collaborations', kind: 'collab', heroMedia: 's-collab', endMedia: 's-nature', reel: 'worlds', name: 'Collaborations', local, cta: 'Start a project',
  title: 'VERGHÉTHORN Collaborations — your brand inside our stories',
  desc: 'Brand collaborations with VERGHÉTHORN: your brand becomes part of an original AI film, created together.',
  hero: { eyebrow: 'VERGHÉTHORN Collaborations', h1: 'Your brand.<br>Inside the story.', sub: 'Original films where your brand is part of the story — created together.', a: 'Watch the reel', b: 'Start a project' },
  statement: 'The best placement is not an ad break. It is a moment inside a story people want to watch.',
  highlights: { h2: 'Get to know VERGHÉTHORN Collaborations.', items: [
    ['c-stars', 'Story first', 'A story people<br>want to watch.', 'A story people want to watch.', ['We start with a story worth watching — then find the natural place for your brand inside it.']],
    ['s-collab', 'Natural fit', 'In the story.<br>Not on top of it.', 'In the story. Not on top of it.', ['Your product, your place or your values become part of the plot — never a logo pasted in the corner.']],
    ['s-nature', 'Worlds', 'Worlds built<br>around your brand.', 'Worlds built around your brand.', ['From a mountain journey to a night city — the world of the film is designed to feel like your brand.']],
    ['c-fire', 'Emotion', 'Remembered<br>for the feeling.', 'Remembered for the feeling.', ['People share films that move them. Your brand travels with that feeling.']],
  ] },
  how: { h2: 'How it works.', sub: 'From an idea to a shared premiere.', steps: [
    ['Meet', 'Tell us about your brand, your values and your audience.'],
    ['Story', 'We propose a story with a natural role for your brand.'],
    ['Production', 'The film is created with AI and directed like cinema.'],
    ['Premiere', 'A launch on our channels and yours.'],
  ] },
  get: { h2: 'What you get.', items: [
    ['An original film', 'A finished story with your brand inside it.'],
    ['Every format', 'Versions for YouTube, Reels, TikTok and your website.'],
    ['Story approval', 'You approve the story and the look before production.'],
    ['A direct line to the director', 'You work with the person who makes the film.'],
  ] },
  faq: { h2: 'Questions? Answers.', items: [
    ['How is a collaboration different from a commercial?', 'A commercial is about your product. A collaboration is a story people watch for itself — with your brand naturally inside it.'],
    priceQ,
    ['Do we approve the story?', 'Yes. You see the story and the style frames before production starts.'],
    ['Where will the film be published?', 'On VERGHÉTHORN channels and on yours — we plan the premiere together.'],
  ] },
  end: { h2: 'Let’s create<br>together.', a: 'Start a project', b: 'Talk on Instagram' },
};

export const DESIGN = {
  slug: 'product-design', kind: 'design', heroMedia: 'p-pottery', endMedia: 'c-ink', reel: 'ads', name: 'Product design', local, cta: 'Start a project',
  title: 'VERGHÉTHORN Product design — from idea to production',
  desc: 'Product design with AI: concept, 3D, photoreal renders and a launch film — from the first sketch to production.',
  hero: { eyebrow: 'VERGHÉTHORN Product design', h1: 'From first sketch<br>to production.', sub: 'A teapot, a pair of shoes, a lamp — designed with AI, ready for production. And for the camera.', a: 'Watch the reel', b: 'Start a project' },
  statement: 'A great product is designed twice: once to be made, and once to be seen.',
  highlights: { h2: 'Get to know VERGHÉTHORN Product design.', items: [
    ['c-ink', 'Concept', 'Hundreds of ideas.<br>One direction.', 'Hundreds of ideas. One direction.', ['AI lets us explore many directions quickly — then we choose and refine the one that is right.']],
    ['p-pottery', 'Material', 'Form, colour<br>and material.', 'Form, colour and material.', ['Glaze, leather, metal, glass — every material is explored before anything is made.']],
    ['c-smoke', 'Renders', 'See it before<br>it exists.', 'See it before it exists.', ['Photoreal renders show the product from every angle, ready for presentations and pre-orders.']],
    ['s-ads', 'Launch', 'A launch film,<br>included in the vision.', 'A launch film, included in the vision.', ['When the product is ready, we can make the film that introduces it to the world.']],
  ] },
  how: { h2: 'How it works.', sub: 'From an idea to something real.', steps: [
    ['Idea', 'Tell us what the product is, who it is for and how it should feel.'],
    ['Concepts', 'Directions in sketches and AI images — you choose the one to develop.'],
    ['3D & renders', 'A 3D model and photoreal renders, refined with you.'],
    ['Production', 'Files prepared for production — and a launch film if you need one.'],
  ] },
  get: { h2: 'What you get.', items: [
    ['A product concept', 'A clear design direction you can build on.'],
    ['3D and renders', 'Photoreal images from every angle.'],
    ['Production-ready files', 'Prepared together with your manufacturer.'],
    ['A launch film', 'Optional — the film that introduces your product.'],
  ] },
  faq: { h2: 'Questions? Answers.', items: [
    ['What kinds of products do you design?', 'Objects people use and love — tableware, shoes, lamps, accessories and more.'],
    priceQ,
    ['Do you work with manufacturers?', 'Yes. Files are prepared together with your manufacturer for production.'],
    ['Can you also make the launch film?', 'Yes — product design and the launch film can be one project.'],
  ] },
  end: { h2: 'Let’s design<br>your product.', a: 'Start a project', b: 'Talk on Instagram' },
};

export const NATURE = {
  slug: 'nature-travel', kind: 'nature', heroMedia: 's-nature', endMedia: 'c-forest', reel: 'worlds', name: 'Nature & travel', local, cta: 'Start a project',
  title: 'VERGHÉTHORN Nature & travel — places, landscapes, journeys',
  desc: 'Films about places: landscapes, journeys and destinations for travel brands, hotels and regions — created with AI.',
  hero: { eyebrow: 'VERGHÉTHORN Nature & travel', h1: 'Every place on Earth.<br>And beyond.', sub: 'Films about places — for travel brands, hotels, regions and dreamers.', a: 'Watch the reel', b: 'Start a project' },
  statement: 'A place is more than a view. It is light, air, silence — and the wish to be there.',
  highlights: { h2: 'Get to know VERGHÉTHORN Nature & travel.', items: [
    ['s-nature', 'Landscapes', 'Mountains, seas<br>and deserts.', 'Mountains, seas and deserts.', ['Wide landscapes at the perfect hour — the kind of shots that once needed helicopters and weeks of travel.']],
    ['c-forest', 'Atmosphere', 'Fog, light<br>and silence.', 'Fog, light and silence.', ['Weather and light become part of the story, exactly when the scene needs them.']],
    ['c-stars', 'Night', 'Under the<br>stars.', 'Under the stars.', ['Night skies and starlight that make people want to pack their bags.']],
    ['s-collab', 'Cities', 'Cities at<br>every hour.', 'Cities at every hour.', ['Night trains, morning streets, rooftops above the lights.']],
  ] },
  how: { h2: 'How it works.', sub: 'From a place to a film people feel.', steps: [
    ['The place', 'Tell us about the destination, the hotel or the region.'],
    ['Story & look', 'A story and style frames that capture the feeling of the place.'],
    ['AI production', 'Every shot generated, reviewed and refined.'],
    ['Final cut', 'Edit, music, sound and colour — for every screen.'],
  ] },
  get: { h2: 'What you get.', items: [
    ['A finished film', 'Edited, scored and colour-graded.'],
    ['Every format', 'Horizontal, vertical and square versions.'],
    ['Style frames first', 'You approve the look before production.'],
    ['A direct line to the director', 'You talk to the person who makes your film.'],
  ] },
  faq: { h2: 'Questions? Answers.', items: [
    ['Can you show a real place?', 'Yes. Send photos and references, and the film is built around the real character of the place.'],
    priceQ,
    ['Who is this for?', 'Travel brands, hotels, resorts, regions — and anyone who wants to tell the story of a place.'],
    ['How long does a film take?', 'It depends on the length. After a short conversation the director proposes a timeline.'],
  ] },
  end: { h2: 'Let’s show<br>your place.', a: 'Start a project', b: 'Talk on Instagram' },
};

// ---------- SEO: search titles, descriptions and a calm text block per page ----------
L.title = 'VERGHÉTHORN — Brand Commercials, Cinematic Advertising & AI Video Production';
L.desc = 'Brand commercials, cinematic advertising and brand films — produced with AI and directed like cinema. Commercial production, product videos and AI agents for brands worldwide.';
L.ui.articles = 'Articles';
L.seo = { h: 'A commercial production studio — powered by AI.', p: [
  'VERGHÉTHORN is a film and commercial production studio. We create brand commercials, cinematic advertising, brand films, product videos and short films — written, directed and finished by a filmmaker, with AI as the camera. That means any location, any light and any era, without building a set.',
  'Brands come to us for TV and online commercials, social ads in every format, product launch films, brand collaborations and AI agents that talk to their clients. We work with companies worldwide, in English and Russian.',
] };
FILMS.title = 'Short Films & Brand Films — Film Production with AI | VERGHÉTHORN';
FILMS.desc = 'Short films, brand films and series — cinematic film production created with AI and directed like cinema. Script, characters, worlds, sound and colour.';
FILMS.seo = { h: 'Film production for brands and storytellers.', p: [
  'We produce short films, brand films and series: from the first idea and script to characters, locations, sound, music and colour grading. AI generates the footage; a director shapes every scene, so the result feels like cinema, not like a template.',
  'A brand film tells who you are without selling directly. A short film can launch a channel, a campaign or a festival run. Both are delivered in every format — 16:9 for cinema and YouTube, 9:16 for Reels and TikTok, 1:1 for feeds.',
] };
COMMERCIALS.title = 'Brand Commercials & Cinematic Advertising — Commercial Production | VERGHÉTHORN';
COMMERCIALS.desc = 'Commercial production for brands: TV and online commercials, cinematic advertising, product videos and social ads — created with AI, finished like cinema.';
COMMERCIALS.seo = { h: 'Commercial production, from brief to launch.', p: [
  'VERGHÉTHORN produces brand commercials and advertising videos: TV spots, online and social ads, product videos and launch campaigns. Concept, storyboard, production, edit, sound design and colour are handled in one place.',
  'Cinematic advertising means the commercial feels like a film — with a story, light and mood people remember. Because the footage is created with AI, there is no studio day, no travel and no limits on location, and every version is cut for TV, web and social.',
] };
AGENTS.title = 'AI Agents for Business — Chat & Voice Assistants for Brands | VERGHÉTHORN';
AGENTS.desc = 'AI agents and AI assistants for business: a website chat and voice assistant that answers clients 24/7 in your brand’s tone, in many languages.';
AGENTS.seo = { h: 'AI assistants that represent your brand.', p: [
  'An AI agent is a virtual assistant for your business: it answers client questions on your website, by voice and in messengers, day and night. Unlike a simple chatbot, it holds a natural conversation, switches languages and follows your rules.',
  'We design the agent like a character — its look, voice and manner — and set clear boundaries: what it knows, what it never discusses, and when it hands the client over to you.',
] };
COLLAB.title = 'Brand Collaborations & Product Placement in Films | VERGHÉTHORN';
COLLAB.desc = 'Brand collaborations and branded content: your brand becomes part of an original film — natural product placement inside a story people want to watch.';
COLLAB.seo = { h: 'Branded content and product placement, done naturally.', p: [
  'A brand collaboration is branded content that people watch for the story: your product, place or values become part of an original film instead of an ad break. It is product placement that feels natural.',
  'We propose the story, you approve it, and the film premieres on VERGHÉTHORN channels and yours — with versions for YouTube, Reels, TikTok and your website.',
] };
DESIGN.title = 'Product Design, 3D Renders & Product Videos | VERGHÉTHORN';
DESIGN.desc = 'Product design from idea to production: concepts, 3D models, photoreal product renders and product launch videos — designed with AI.';
DESIGN.seo = { h: 'Product design, 3D visualisation and product videos.', p: [
  'We design physical products — tableware, shoes, lamps, accessories — from the first sketch to production files, with 3D models and photoreal renders you can use for presentations and pre-orders.',
  'When the product is ready, the same team can produce the product video or launch commercial, so the design and the way it is shown to the world belong together.',
] };
NATURE.title = 'Travel, Hotel & Destination Videos | VERGHÉTHORN';
NATURE.desc = 'Travel videos, hotel and resort videos, destination films for tourism brands and regions — cinematic landscapes created with AI.';
NATURE.seo = { h: 'Destination marketing videos for travel, hotels and regions.', p: [
  'We create travel videos and destination films for tourism brands, hotels, resorts and regions: landscapes, journeys and atmosphere that make people want to be there.',
  'Aerial shots, golden hour and night skies are created without a crew or helicopter, built around the real character of the place from your photos and references.',
] };
START.title = 'Start a Project — Commercial & Film Production | VERGHÉTHORN';
