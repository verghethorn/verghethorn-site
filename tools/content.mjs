// All site copy (English). Edit text here and run `node tools/build.mjs`.

export const SITE = {
  url: 'https://verghethorn.com',
  email: 'verghethorn@gmail.com',
  social: {
    youtube: { name: 'YouTube', handle: '@verghethorn', href: 'https://www.youtube.com/@verghethorn' },
    instagram: { name: 'Instagram', handle: '@verghethorn.studio', href: 'https://www.instagram.com/verghethorn.studio' },
    tiktok: { name: 'TikTok', handle: '@verghethorn_official', href: 'https://www.tiktok.com/@verghethorn_official' },
  },
  inquiries: {
    endpoint: 'https://vgotvplikubsncujcxmk.supabase.co/rest/v1/inquiries',
    key: 'sb_publishable_N2ea44ITl-54nQS16gD0NQ_O_ywKAmd', // publishable: insert-only by row-level security
  },
};

// Video clips live in /media/v/<id>.mp4 with a poster /media/v/<id>.webp
export const L = {
  title: 'VERGHÉTHORN — cinema for brands',
  desc: 'VERGHÉTHORN is a film studio: short films, brand films for fashion, jewellery, beauty and fragrance, and product design — from the first sketch to the final frame.',
  skip: 'Skip to content', pitch: 'Pitch a project', soundOn: 'Sound on', soundOff: 'Sound off',

  hero: {
    eyebrow: 'VERGHÉTHORN · Film studio',
    h1: 'Cinema<br>for brands.',
    sub: 'Short films, brand films and product design — from the first sketch to the final frame.',
    cta: 'Pitch a project', cta2: 'Step on set',
    mobile: [['m-noir', 'Neo‑noir'], ['m-jewel', 'Jewellery film'], ['m-neon', 'Night drive'], ['m-sun', 'Summer campaign']],
    desktop: [['d-tunnel', 'Neo‑noir'], ['d-diamond', 'Jewellery film'], ['d-hourglass', 'Short film'], ['d-candle', 'Beauty film'], ['d-shore', 'Fragrance film']],
    tapHint: 'Tap to skip',
  },

  films: {
    eyebrow: 'Short films', h2: 'Stories that stay<br>after the credits.',
    sub: 'Original short films in every genre — with brands living inside them, naturally.',
    reels: [['r-scifi', 'Sci‑fi'], ['m-noir', 'Neo‑noir'], ['r-drama', 'Drama'], ['r-thriller', 'Thriller'], ['m-sun', 'Romance'], ['r-road', 'Road movie'], ['r-docu', 'Behind the lens']],
  },

  set: {
    eyebrow: 'On set', h2: 'One scene.<br>Your light. Your lens.',
    sub: 'This is how a frame is made. Switch the lamp, swap the lens — tap the picture to move the key light.',
    light: 'Light', lens: 'Lens', tapKey: 'Tap the frame to aim the key light',
    lights: [['day', 'l-day', 'Daylight', '5600K · soft'], ['tungsten', 'l-spot', 'Tungsten', '3200K · hard'], ['neon', 'l-neon', 'Neon', 'magenta · cyan'], ['golden', 'l-golden', 'Golden hour', 'low sun · haze']],
    lenses: [['35', 'c-35', '35mm', 'spherical'], ['85', 'c-85', '85mm', 'portrait · T1.5'], ['ana', 'c-ana', '40mm', 'anamorphic'], ['16', 'c-16', '16mm', 'film stock']],
    alt: 'A woman in a teal sari with gold jewellery, filmed in a studio',
  },

  brand: {
    eyebrow: 'Brand films', h2: 'For houses<br>that sell desire.',
    panels: [
      ['d-diamond', 'Jewellery', 'Light,<br>cut to fit.'],
      ['b-perfume', 'Fragrance', 'One second.<br>One memory.'],
      ['b-eye', 'Beauty', 'Closer<br>than life.'],
      ['d-tunnel', 'Automotive', 'Speed, in<br>slow motion.'],
    ],
    line: 'Fashion · Jewellery · Beauty · Fragrance · Automotive',
  },

  design: {
    eyebrow: 'Product design', h2: 'We design the product.<br>Then we film it.',
    sub: 'Form, colour, material and light — designed together, so the product is born ready for its film.',
    steps: [['p-colour', 'Colour', 'A colour story, not a swatch.'], ['p-metal', 'Material', 'Metal, glass and fabric chosen for how they catch light.'], ['p-ring', 'Form', 'Beautiful in a hand. Even better in a close‑up.'], ['b-perfume', 'Film', 'The launch film, the campaign, the app.']],
    cwTitle: 'Try a colourway', cwSub: 'Same piece. Four moods.',
    colourways: [['champagne', 'Champagne'], ['rose', 'Rose gold'], ['emerald', 'Emerald'], ['onyx', 'Onyx']],
  },

  story: {
    eyebrow: 'Script lab', h2: 'Spin a story.',
    sub: 'Every film starts as a wild idea. Spin the reels — tap one to lock it.',
    reels: [
      ['Hero', ['A shy skater', 'A grandma DJ', 'Two rival influencers', 'A robot barista', 'A lost astronaut', 'A street dancer', 'A jeweller’s apprentice', 'A cat with a million followers', 'The new kid in town', 'A retired racing driver']],
      ['Place', ['on the last night of summer', 'in a city that never sleeps', 'on Mars, with bad Wi‑Fi', 'inside a perfume bottle', 'at a rooftop party', 'in Tokyo, 2049', 'on a ferry to nowhere', 'at a 24‑hour laundromat', 'in a silent cinema', 'backstage at a sold‑out show']],
      ['Twist', ['finds shoes that remember every step', 'swaps lives with their reflection', 'has sixty seconds to change everything', 'falls for a hologram', 'starts a band with total strangers', 'learns a scent can bring back a memory', 'wins — but the prize is a kettle', 'realises everyone is in a commercial', 'finds a ring that stops time', 'becomes famous overnight']],
    ],
    spin: 'Spin', lock: 'Locked', tapLock: 'Tap a reel to lock it',
    use: 'Make it our next film', count: 'stories spun',
  },

  portals: {
    eyebrow: 'Follow the work', h2: 'Pick a portal.', sub: 'Each one opens with its own effect.',
    items: [['youtube', 'Watch'], ['instagram', 'Follow'], ['tiktok', 'Scroll'], ['email', 'Write to us']],
    email: 'Email',
  },

  contact: {
    eyebrow: 'Pitch us', h2: 'Have a film<br>in mind?',
    name: 'Name', mail: 'Email', what: 'What is it?', message: 'Your idea', messageHint: 'A few lines are enough.',
    kinds: [['film', 'Short film'], ['campaign', 'Brand film'], ['collaboration', 'Collab'], ['product', 'Product design'], ['interactive', 'App / site'], ['other', 'Other']],
    send: 'Send', privacy: 'Used only to reply to you.',
  },

  footer: 'Short films · Brand films · Collabs · Product design',
  stock: 'Footage: Mixkit',
  js: {
    form: {
      sending: 'Sending…', errName: 'Add your name so we know who to answer.', errEmail: 'Check the email — it needs an @ and a domain.',
      errMessage: 'A few more words, please — at least 10 characters.',
      okTitle: 'Sent. That’s a wrap.', okText: 'We read every pitch personally and will reply to {email}.',
      errTitle: 'The message wasn’t sent.', errNet: 'Your text is still here. Try again in a moment, or write to verghethorn@gmail.com.',
      errBot: 'That was a bit too fast. Wait a few seconds and send again.',
    },
    pitchPrefix: 'Story idea from the Script lab:',
  },
  notFound: { title: 'Page not found — VERGHÉTHORN', h1: 'Cut. Wrong scene.', text: 'This page doesn’t exist.', home: 'Back to the set' },
  moved: 'This page has moved.',
};
