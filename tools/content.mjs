// All site copy (English only). Edit text here and run `node tools/build.mjs`.

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

export const L = {
  title: 'VERGHÉTHORN — films you can’t scroll past',
  desc: 'VERGHÉTHORN is a film studio for short films, brand ads, collabs and product design. Tap the screen, spin a story, design a drink and set off some special effects.',
  skip: 'Skip to content',
  pitch: 'Pitch us', soundOn: 'Sound on', soundOff: 'Sound off',

  hero: {
    eyebrow: 'Short films · Brand ads · Collabs · Products',
    h1: 'Films you can’t<br>scroll past.',
    sub: 'We’re VERGHÉTHORN — a film studio for brands and big ideas. Go on, tap the screen.',
    hint: 'Tap anywhere',
    action: 'Action',
    genres: [['neon', 'Neon', 'NEON NIGHTS'], ['space', 'Space', 'LAST SIGNAL'], ['sunset', 'Sunset', 'SUMMER NEVER ENDS'], ['noir', 'Noir', 'RAIN CITY'], ['aurora', 'Aurora', 'NORTHERN LIGHTS'], ['warp', 'Warp', 'LIGHTSPEED']],
    canvas: 'A live, generated film scene. Tap it to set off effects; choose a genre or press Action to cut to a new scene.',
  },

  story: {
    eyebrow: 'Script lab', h2: 'Spin a story.',
    sub: 'Every great ad starts with a wild idea. Spin the reels — tap one to lock it.',
    reels: [
      ['Hero', ['A shy skater', 'A grandma DJ', 'Two rival influencers', 'A robot barista', 'A lost astronaut', 'A street dancer', 'A gamer who never sleeps', 'A cat with a million followers', 'The new kid in town', 'A very serious pigeon']],
      ['Place', ['on the last night of summer', 'in a city that never logs off', 'on Mars, with bad Wi‑Fi', 'inside a vending machine', 'at a rooftop party', 'in Tokyo, 2049', 'on a ferry to nowhere', 'at a 24‑hour laundromat', 'in the school’s lost & found', 'backstage at a sold‑out show']],
      ['Twist', ['finds sneakers that can fly', 'swaps lives with their phone', 'has 60 seconds to go viral', 'falls for their own hologram', 'starts a band with total strangers', 'learns the soda tastes like memories', 'wins — but the prize is a kettle', 'realises everyone is in a commercial', 'gets one wish and wastes it on snacks', 'becomes a meme overnight']],
    ],
    spin: 'Spin', lock: 'Locked', tapLock: 'Tap a reel to lock it',
    use: 'Make it our next ad', count: 'stories spun',
  },

  product: {
    eyebrow: 'Product → film → app', h2: 'Design it.<br>Film it. Ship it.',
    sub: 'Invent your own drink. Then watch us shoot the ad and drop it in an app — that’s what we do for brands.',
    name: 'Name it', flavour: 'Flavour', finish: 'Finish',
    flavours: [['citrus', 'Citrus'], ['berry', 'Berry'], ['mint', 'Mint'], ['ice', 'Ice'], ['night', 'Night'], ['pearl', 'Pearl']],
    finishes: [['gloss', 'Gloss'], ['matte', 'Matte'], ['chrome', 'Chrome'], ['neon', 'Neon']],
    modes: [['design', 'Design'], ['film', 'Film'], ['app', 'App']],
    tagline: 'Taste the future.', ad: 'AD', drop: 'New drop', add: 'Add to bag', added: 'In your bag ✓',
    canvas: 'A drink can you design: it spins in 3D, can be filmed in a dramatic ad, or shown inside a shop app. Drag sideways to turn it.',
    drag: 'Drag to spin',
  },

  fx: {
    eyebrow: 'Special effects', h2: 'Make some noise.',
    sub: 'Nine effects from our toolkit. Tap fast — it’s a beat machine.',
    pads: [['boom', 'Boom'], ['bolt', 'Bolt'], ['rain', 'Rain'], ['snow', 'Snow'], ['warp', 'Warp'], ['glitch', 'Glitch'], ['confetti', 'Confetti'], ['slowmo', 'Slo‑mo'], ['cut', 'Cut']],
    keys: 'QWEASDZXC', keysHint: 'On a keyboard? Use Q W E · A S D · Z X C',
    canvas: 'A stage for special effects triggered by the pads below.',
  },

  what: {
    eyebrow: 'What we do', h2: 'Five ways to<br>work with us.', tap: 'Tap a card',
    cards: [
      ['film', 'Short films', 'Original stories with real feelings. Festival‑ready, feed‑ready.'],
      ['ads', 'Brand ads', 'Scripts that hook in the first second — and a film to match.'],
      ['collab', 'Collabs', 'Your brand inside our films. Natural, never cringe.'],
      ['design', 'Product design', 'From a sketch to the thing in your hand. Then we film it.'],
      ['apps', 'Apps & sites', 'When your product needs a home online, we build that too.'],
    ],
  },

  portals: {
    eyebrow: 'Follow the story', h2: 'Pick a portal.', sub: 'Each one opens with its own effect. Sound on.',
    items: [['youtube', 'Watch'], ['instagram', 'Follow'], ['tiktok', 'Scroll'], ['email', 'Write to us']],
    email: 'Email',
  },

  contact: {
    eyebrow: 'Pitch us', h2: 'Got an idea?<br>Pitch it.',
    name: 'Name', mail: 'Email', what: 'What is it?', message: 'Your idea', messageHint: 'A few lines are enough.',
    kinds: [['film', 'Short film'], ['campaign', 'Brand ad'], ['collaboration', 'Collab'], ['product', 'Product'], ['interactive', 'App / site'], ['other', 'Other']],
    send: 'Send it', privacy: 'Used only to reply to you.',
  },

  footer: 'Short films · Brand ads · Collabs · Product design',
  js: {
    form: {
      sending: 'Sending…', errName: 'Add your name so we know who to answer.', errEmail: 'Check the email — it needs an @ and a domain.',
      errMessage: 'A few more words, please — at least 10 characters.',
      okTitle: 'Sent. Cut — that’s a wrap!', okText: 'We read every pitch personally and will reply to {email}.',
      errTitle: 'The message wasn’t sent.', errNet: 'Your text is still here. Try again in a moment, or write to verghethorn@gmail.com.',
      errBot: 'That was a bit too fast. Wait a few seconds and send again.',
    },
    pitchPrefix: 'Story idea from the Script lab:',
  },
  notFound: { title: 'Page not found — VERGHÉTHORN', h1: 'Cut. Wrong scene.', text: 'This page doesn’t exist.', home: 'Back to the set' },
  moved: 'This page has moved.',
};
