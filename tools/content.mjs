// All site copy (English). Edit text here and run `node tools/build.mjs`.

export const SITE = {
  url: 'https://verghethorn.com',
  email: 'verghethorn@gmail.com',
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
    ['c-stars', 'Worlds', 'Any world. No set.'],
    ['c-fire', 'Emotion', 'Pictures you can feel.'],
    ['c-forest', 'Atmosphere', 'Light, fog and rain — directed.'],
    ['c-ink', 'Colour', 'Every frame, graded like cinema.'],
    ['c-smoke', 'Detail', 'Crafted to the last frame.'],
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
  footCols: [['Create', ['Films', 'Commercials', 'Product design', 'Nature & travel']], ['AI', ['AI Agents', 'Concierge assistants', 'Customer support']], ['Together', ['Collaborations', 'Partnerships']]],
  notFound: { title: 'Page not found — VERGHÉTHORN', h1: 'Wrong scene.', text: 'This page doesn’t exist.', home: 'Back to the start' },
  moved: 'This page has moved.',
};

// ---------- Films page (Apple-style product page) ----------
export const FILMS = {
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
    { id: 'kind', h: 'What would you like to create?', opts: [['films', 'Film', 'Short film or series'], ['commercials', 'Commercial', 'Campaign for a brand'], ['design', 'Product design', 'From idea to production'], ['agents', 'AI agent', 'Assistant for your brand'], ['collab', 'Collaboration', 'Your brand in our story']] },
    { id: 'length', h: 'How long should it be?', opts: [['15–30 seconds'], ['30–60 seconds'], ['1–5 minutes'], ['Longer'], ['Not sure yet']] },
    { id: 'when', h: 'When do you need it?', opts: [['As soon as possible'], ['Within a month'], ['Within 3 months'], ['No rush']] },
  ],
  idea: { h: 'Tell us about your idea.', ph: 'A few sentences about the story, the brand, the feeling you want…' },
  you: { h: 'How can we reach you?', name: 'Your name', contact: 'Email, phone or Instagram' },
  send: 'Send request', note: 'Your email app will open with the request ready to send to verghethorn@gmail.com.',
  need: 'Please choose what you would like to create and leave a way to reach you.',
  subject: 'Project request',
};
