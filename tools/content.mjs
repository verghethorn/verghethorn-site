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
  ribbon: ['Now taking projects for 2027.', 'Start a conversation'],

  hero: { h1: 'AI Cinema', sub: 'Films and commercials for brands.<br>Created with AI.', a: 'Watch the reel', b: 'Start a project' },
  agents: { h2: 'AI Agents', sub: 'Your brand. Always on.', a: 'Learn more', b: 'Request a demo',
    chat: { name: 'Lumière Concierge', status: 'AI agent · online',
      msgs: [['u', 'Hi! Do you have a table for two tonight?'], ['a', 'Good evening. Yes — 8:30 pm by the window. Shall I book it?'], ['u', 'Perfect, please.'], ['a', 'Done. A confirmation is on its way. Anything else for your evening?']] } },
  ads: { h2: 'Commercials', sub: 'Make your brand unforgettable.', a: 'Learn more', b: 'Start a project' },
  tiles: [
    ['films', 'dark', 's-films', 'Films', 'Any world. Any era. Any light.'],
    ['collab', 'dark', 's-collab', 'Collaborations', 'Your brand inside our stories.'],
    ['design', 'light', 'p-teapot', 'Product design', 'From first sketch to production.', '50% 70%'],
    ['auto', 'light', 'w-dawn', 'Automotive', 'Every road. Every light.', '40% 60%'],
  ],
  tileA: 'Learn more', tileB: 'Start a project',

  know: { h2: 'Get to know VERGHÉTHORN.', items: [
    ['w-orbit', 'Worlds', 'Any world. No set.'],
    ['w-heirloom', 'Detail', 'Every frame, crafted like jewelry.', '72% 50%'],
    ['w-sand', 'Speed', 'See your film before it is finished.'],
    ['w-tide', 'Nature', 'Oceans, deserts, skies — on demand.'],
    ['w-still', 'Mood', 'Light and atmosphere on demand.'],
  ] },

  lineup: { h2: 'Explore the services.', items: [
    ['s-films', 'Film', 'Short films and series', ['Script, characters, worlds', 'AI-generated scenes', 'Sound, music and colour']],
    ['s-ads', 'Commercial', 'Campaigns for brands', ['Concept and storyboard', 'Every format: TV, web, social', 'Product and lifestyle scenes']],
    ['p-teapot', 'Product design', 'From idea to production', ['Concept and 3D', 'Photoreal renders', 'Launch film']],
    ['agent', 'AI Agent', 'Assistants for your brand', ['Answers clients 24/7', 'Your tone of voice', 'Website, Instagram, WhatsApp']],
  ], a: 'Learn more', b: 'Request' },

  why: { h2: 'Why VERGHÉTHORN.', items: [
    ['✦', 'A direct line to the director.', 'You talk to the person who makes your film.'],
    ['◐', 'Style frames first.', 'See the look of your film before production starts.'],
    ['▭', 'Ready for every screen.', 'Cinema, TV, web, vertical — one project, every format.'],
  ] },

  contact: { h2: 'Let’s create together.', sub: 'Films, commercials, AI agents and collaborations.', emailName: 'Email' },

  footNote: 'Demo footage on this site: Mixkit. Brand names in examples are fictional.',
  footCols: [['Create', ['Films', 'Commercials', 'Product design', 'Automotive']], ['AI', ['AI Agents', 'Concierge assistants', 'Customer support']], ['Together', ['Collaborations', 'Partnerships']]],
  notFound: { title: 'Page not found — VERGHÉTHORN', h1: 'Wrong scene.', text: 'This page doesn’t exist.', home: 'Back to the start' },
  moved: 'This page has moved.',
};
