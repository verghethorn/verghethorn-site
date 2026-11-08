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
  title: 'VERGHÉTHORN — films for brands and product design',
  desc: 'VERGHÉTHORN is a studio for brand films and product design. We design the product, then make the film that makes people want it.',
  skip: 'Skip to content', soundOn: 'Sound on', soundOff: 'Sound off',
  nav: [['#films', 'Films'], ['#design', 'Design'], ['#contact', 'Contact']],
  talk: 'Contact',

  hero: {
    eyebrow: 'Film & product studio',
    h1: 'Everyone is in a hurry.<br><em>Good films make them stop.</em>',
    hold: 'Hold to stop time', held: 'Time stopped',
    scroll: 'Scroll',
  },

  statement: 'We are a studio with two crafts. We design products — and we make the films that make people want them.',

  films: {
    num: '01', h2: 'Films',
    lead: 'Commercials for premium brands and short films with a story. Script, cast, light, camera, edit, colour and sound — one team, one standard.',
    tiles: [
      ['f-watch', 'Macro · 100mm', 'tall'],
      ['f-perfume', 'Product · low key', 'wide'],
      ['f-set', 'On set · Scene 9, take 3', ''],
      ['f-crane', 'Crane shot · street', ''],
    ],
    list: [
      ['Brand commercials', 'Watches, fragrance, cars, tech, hotels. Thirty to ninety seconds that people remember.'],
      ['Short films', 'Original stories made with the craft of cinema. Brands join as partners, naturally.'],
      ['Product films', 'Your product, lit and shot like the lead actor.'],
    ],
  },

  design: {
    num: '02', h2: 'Product design',
    leadA: 'Bring us an idea —', leadB: 'We take it all the way to the real thing.',
    words: ['a teapot.', 'a pair of shoes.', 'a desk lamp.', 'a chair.', 'a bottle.', 'headphones.', 'a backpack.', 'a watch.'],
    steps: [
      ['d-sketch', 'Sketch', 'The idea on paper. Shape, purpose, feeling.'],
      ['d-model', '3D model', 'Every millimetre on the computer. Colours and materials.'],
      ['d-print', 'Prototype', 'Printed, held in the hand, tested, improved.'],
      ['d-clay', 'Production', 'Made for real — we see it through to the shelf.'],
    ],
  },

  bridge: { h2: 'Then we film it.', p: 'Design and film under one roof. The product is born ready for its close-up.' },

  contact: {
    num: '03', h2: 'Let’s make<br>something.',
    lead: 'Tell us what you want to make. We reply personally.',
    emailName: 'Email',
  },

  footer: 'Films for brands · Short films · Product design',
  credits: 'Footage: Mixkit',
  notFound: { title: 'Page not found — VERGHÉTHORN', h1: 'Wrong scene.', text: 'This page doesn’t exist.', home: 'Back to the start' },
  moved: 'This page has moved.',
};
