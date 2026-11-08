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
  title: 'VERGHÉTHORN — AI Filmmaker',
  desc: 'VERGHÉTHORN is an AI filmmaker. Brand commercials, short films and product design — written, directed and generated with AI, finished with the craft of cinema.',
  skip: 'Skip to content', soundOn: 'Sound on', soundOff: 'Sound off',
  nav: [['#process', 'Process'], ['#work', 'What I make'], ['#lab', 'Idea lab'], ['#contact', 'Contact']],
  talk: 'Contact',

  hero: {
    kicker: 'VERGHÉTHORN — AI Filmmaker',
    h1: 'Films made<br>with AI.',
    sub: 'Brand commercials, short films and product design — written, directed and generated with AI, finished with the craft of cinema.',
    cta: 'Start a project', cta2: 'See the process',
    file: 'verghethorn / scene',
    chips: ['AI video', '24 fps', '4K master'],
    gen: 'Generate', generating: 'Generating', done: 'Ready',
    tryLabel: 'Try a scene',
    // [video id, short label, prompt]
    scenes: [
      ['s-astro', 'Space', 'An astronaut drifts above Earth at sunrise. Slow push-in, anamorphic lens, 2.39:1.'],
      ['s-watch', 'Watch', 'Macro shot of a watch movement. Gears breathing, warm key light, 100mm lens.'],
      ['s-hourglass', 'Desert', 'An hourglass alone in the desert at dusk. Sand falling in slow motion.'],
      ['s-teapot', 'Product', 'A handmade blue ceramic teapot. Soft window light, product hero shot.'],
      ['s-rider', 'Rider', 'A rider on the shore at sunset. Silhouette, wide lens, golden hour.'],
      ['s-lake', 'Lake', 'A misty mountain lake at blue hour. Still water, drifting fog.'],
    ],
  },

  process: {
    num: '01', h2: 'From prompt<br>to premiere.',
    lead: 'AI generates. A filmmaker directs. Every frame is chosen, every cut is intentional.',
    steps: [
      ['Script', 'One clear idea, written as a film: scenes, lines, rhythm.'],
      ['Look & characters', 'Style frames, consistent characters and locations, the light of the film.'],
      ['Generate', 'Every shot generated, reviewed and regenerated until it is right.'],
      ['Finish', 'Edit, voice, music, sound design and colour. Delivered for every screen.'],
    ],
    script: ['INT. WATCHMAKER’S WORKSHOP — NIGHT', 'A single lamp. Old hands open a watch for the last time.', 'WATCHMAKER (V.O.)', '“Time is the only thing we cannot make.”'],
    shots: [['SH 012', 'Macro, gears', 100], ['SH 013', 'Hands under the lamp', 100], ['SH 014', 'Watch on the wrist', 72], ['SH 015', 'Window, first snow', 0]],
    tracks: ['Video', 'Voice', 'Music'],
  },

  work: {
    num: '02', h2: 'What I make.',
    items: [
      ['s-watch', 'AI commercials', 'Premium commercials for brands — watches, fragrance, cars, tech, hotels. Any world, any light, without building a set.'],
      ['s-rider', 'AI short films', 'Original stories with real characters and real emotion. Brands join as partners, inside the story.'],
      ['s-teapot', 'AI product design', 'A teapot, a pair of shoes, a lamp — designed with AI, modelled in 3D, ready for production. And for the camera.'],
    ],
  },

  why: {
    num: '03', h2: 'Why AI cinema.',
    items: [
      ['Any world', 'Space, the desert, the past, the future. No travel, no permits, no limits on the picture.'],
      ['See it early', 'Style frames and a first cut early on. You see your film before it is finished.'],
      ['Directed, not generated', 'AI is the camera. The taste, the story and the final cut stay human.'],
    ],
  },

  lab: {
    num: '04', h2: 'Idea lab.',
    sub: 'Every film starts as a prompt. Spin the reels — tap one to keep it.',
    reels: [
      ['Hero', ['A night‑shift baker', 'A retired racing driver', 'A young architect', 'A street musician', 'A lighthouse keeper', 'A watchmaker', 'A taxi driver', 'A football coach', 'A new pilot', 'A grandfather and his grandson']],
      ['Place', ['on the first snowy morning', 'in a city that never sleeps', 'on the last ferry home', 'in a quiet mountain village', 'on the surface of the Moon', 'in an empty airport at dawn', 'on a long desert road', 'in a busy kitchen', 'on the roof of a skyscraper', 'at the edge of the sea']],
      ['Twist', ['finds a letter written ten years ago', 'gets one minute to change everything', 'teaches a stranger something new', 'discovers the old family recipe', 'fixes something no one else could', 'keeps a promise against all odds', 'hears a song that brings back a memory', 'builds something with their own hands', 'meets the person who inspired them', 'chooses the harder, better road']],
    ],
    spin: 'Spin', lock: 'Kept', use: 'Send me this idea', subject: 'Idea from the VERGHÉTHORN idea lab',
  },

  contact: {
    num: '05', h2: 'Let’s make<br>your film.',
    lead: 'Tell me what you want to make. I reply personally.',
    emailName: 'Email',
  },

  footer: 'AI Filmmaker · Commercials · Short films · Product design',
  credits: 'Demo footage on this page: Mixkit',
  notFound: { title: 'Page not found — VERGHÉTHORN', h1: 'Wrong scene.', text: 'This page doesn’t exist.', home: 'Back to the start' },
  moved: 'This page has moved.',
};
