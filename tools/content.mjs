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
  title: 'VERGHÉTHORN — AI Cinema',
  desc: 'VERGHÉTHORN creates films, commercials and brand collaborations with AI — crafted like cinema.',
  skip: 'Skip to content', soundOn: 'Sound on', soundOff: 'Sound off',
  nav: [['#work', 'Work'], ['#services', 'Services'], ['#contact', 'Contact']],

  hero: {
    tag: 'AI Cinema',
    reel: 'Showreel',
    // segment titles of media/v/reel.mp4 (4 s each)
    clips: ['Brilliance', 'Tide', 'Orbit', 'Dawn', 'Movement', 'Horizon'],
    over: 'Cinema,<br>created with AI.',
    scroll: 'Scroll',
  },

  statement: 'We create films and commercials for brands that want to be remembered.',

  services: {
    label: 'Services',
    items: [
      ['s-films', 'Films', 'Original short films. Any world, any era, any light.'],
      ['s-ads', 'Commercials', 'Premium campaigns for brands — from one frame to the final cut.'],
      ['s-collab', 'Collaborations', 'Your brand inside our stories. Created together.'],
    ],
  },

  work: {
    label: 'Selected work', h2: 'Concept films',
    items: [
      ['w-orbit', 'Orbit', 'Short film', '70%'],
      ['w-heirloom', 'Heirloom', 'Jewelry', '72%'],
      ['w-tide', 'Tide', 'Brand film'],
      ['w-dawn', 'Dawn', 'Automotive', '30%'],
      ['w-sand', 'Sand', 'Short film'],
      ['w-still', 'Stillness', 'Hospitality'],
    ],
    prev: 'Previous', next: 'Next',
  },

  craft: {
    label: 'Process', h2: 'From idea<br>to final cut.',
    steps: ['Idea', 'Script', 'AI production', 'Final cut'],
  },

  contact: {
    label: 'Contact', h2: 'Let’s create<br>together.',
    lead: 'Films, commercials and collaborations.',
    emailName: 'Email',
  },

  footer: 'AI Cinema · Films · Commercials · Collaborations',
  credits: 'Demo footage: Mixkit',
  notFound: { title: 'Page not found — VERGHÉTHORN', h1: 'Wrong scene.', text: 'This page doesn’t exist.', home: 'Back to the start' },
  moved: 'This page has moved.',
};
