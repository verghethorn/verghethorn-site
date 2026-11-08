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
