// All site copy (English). Edit text here and run `node tools/build.mjs`.

export const SITE = {
  url: 'https://verghethorn.com',
  email: 'verghethorn@gmail.com',
  social: {
    instagram: { name: 'Instagram', handle: '@verghethorn.studio', href: 'https://www.instagram.com/verghethorn.studio', color: '#d6249f' },
    youtube: { name: 'YouTube', handle: '@verghethorn', href: 'https://www.youtube.com/@verghethorn', color: '#ff0033' },
    tiktok: { name: 'TikTok', handle: '@verghethorn_official', href: 'https://www.tiktok.com/@verghethorn_official', color: '#111111' },
  },
  inquiries: {
    endpoint: 'https://vgotvplikubsncujcxmk.supabase.co/rest/v1/inquiries',
    key: 'sb_publishable_N2ea44ITl-54nQS16gD0NQ_O_ywKAmd', // publishable: insert-only by row-level security
  },
};

export const L = {
  title: 'VERGHÉTHORN — brand commercials and short films',
  desc: 'VERGHÉTHORN is a film studio. We make brand commercials and short films, and design the products we film.',
  skip: 'Skip to content', contactBtn: 'Contact', soundOn: 'Sound on', soundOff: 'Sound off',

  hero: {
    slate: 'Brand commercial · Scene 4 · Take 2',
    h1: 'Brand commercials<br>and short films.',
    hint: 'Tap a light, a camera or an actor.',
    views: [['set', 'Set'], ['a', 'Camera A'], ['b', 'Camera B']],
    labels: { 'lamp:key': 'Key light', 'lamp:fill': 'Fill light', 'lamp:back': 'Back light', 'lamp:set': 'Background', 'cam:a': 'Camera A', 'cam:b': 'Camera B · dolly', 'actor:presenter': 'Presenter', 'actor:guest': 'Actor' },
    lines: ['Every brand has a story worth filming.', 'We write it, we light it, we shoot it.', 'This is VERGHÉTHORN.'],
    productCard: 'Product shot · 85mm',
    loading: 'Building the set…',
    fallback: 'A 3D film set: a presenter beside a product on a plinth, lit by a key light, a softbox and a back light, filmed by two cinema cameras.',
  },

  intro: 'VERGHÉTHORN is a film studio. We make <b>brand commercials</b> and <b>short films</b> — and design the products we film.',

  services: {
    eyebrow: 'What we do',
    items: [
      ['s-camera', 'Brand commercials', 'From the script to the final grade. One team, one standard — for brands that want to be remembered.'],
      ['s-film', 'Short films', 'Original stories made with the craft of cinema. Brands appear inside them naturally, as collaborations.'],
      ['s-design', 'Product design', 'We design the product, its colours and materials — then film it, and build its app or website.'],
    ],
  },

  process: {
    eyebrow: 'How we work', h2: 'From the first idea<br>to the first screening.',
    steps: [['Script', 'One clear idea for one audience.'], ['Set & light', 'Locations, actors, cameras, light.'], ['Shoot', 'Shot on cinema cameras.'], ['Edit & release', 'Edit, colour, sound — then out into the world.']],
  },

  story: {
    eyebrow: 'Script lab', h2: 'Spin a story.',
    sub: 'Every commercial starts as an idea. Spin the reels — tap one to keep it.',
    reels: [
      ['Hero', ['A night‑shift baker', 'A retired racing driver', 'A young architect', 'A street musician', 'A lighthouse keeper', 'A watchmaker', 'A taxi driver', 'A football coach', 'A new pilot', 'A grandfather and his grandson']],
      ['Place', ['on the first snowy morning', 'in a city that never sleeps', 'on the last ferry home', 'in a quiet mountain village', 'at a sold‑out stadium', 'in an empty airport at dawn', 'on a long desert road', 'in a busy kitchen', 'on the roof of a skyscraper', 'at the edge of the sea']],
      ['Twist', ['finds a letter written ten years ago', 'gets one minute to change everything', 'teaches a stranger something new', 'discovers the old family recipe', 'fixes something no one else could', 'keeps a promise against all odds', 'hears a song that brings back a memory', 'builds something with their own hands', 'meets the person who inspired them', 'chooses the harder, better road']],
    ],
    spin: 'Spin', lock: 'Kept', use: 'Pitch this idea', count: 'stories spun',
  },

  contact: {
    eyebrow: 'Contact', h2: 'Let’s make<br>your film.',
    emailName: 'Email', emailNote: 'Write to us',
    formTitle: 'Tell us about your project',
    name: 'Name', mail: 'Email', what: 'Project', message: 'Message', messageHint: 'A few lines are enough.',
    kinds: [['campaign', 'Brand commercial'], ['film', 'Short film'], ['collaboration', 'Collaboration'], ['product', 'Product design'], ['interactive', 'App / website'], ['other', 'Other']],
    send: 'Send', privacy: 'We use your details only to reply.',
  },

  footer: 'Brand commercials · Short films · Product design',
  credits: '3D actor: three.js / Mixamo · Footage: Mixkit',
  js: {
    form: {
      sending: 'Sending…', errName: 'Please add your name.', errEmail: 'Please check the email address.',
      errMessage: 'A few more words, please — at least 10 characters.',
      okTitle: 'Thank you. Message received.', okText: 'We will reply to {email} personally.',
      errTitle: 'The message wasn’t sent.', errNet: 'Your text is still here. Try again in a moment, or write to verghethorn@gmail.com.',
      errBot: 'That was a little too fast. Please wait a few seconds and send again.',
    },
    pitchPrefix: 'Idea from the Script lab:',
  },
  notFound: { title: 'Page not found — VERGHÉTHORN', h1: 'Wrong scene.', text: 'This page doesn’t exist.', home: 'Back to the set' },
  moved: 'This page has moved.',
};
