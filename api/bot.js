const mem = globalThis.__cbUsers || (globalThis.__cbUsers = new Map());

function hasRedis() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redis(command) {
  const res = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error('redis ' + res.status);
  const data = await res.json();
  return data.result;
}

async function touchUser(chatId, meta = {}) {
  const id = String(chatId);
  const now = Date.now();
  const payload = JSON.stringify({
    id,
    lastSeen: now,
    lang: meta.lang || 'ru',
    name: meta.name || '',
  });
  if (hasRedis()) {
    await redis(['HSET', 'cb:users', id, payload]);
    await redis(['SADD', 'cb:user_ids', id]);
    return;
  }
  mem.set(id, JSON.parse(payload));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Cosmic Boost Bot is running');
  }

  const TOKEN = process.env.BOT_TOKEN;
  if (!TOKEN) {
    return res.status(500).json({ error: 'BOT_TOKEN not set' });
  }

  const update = req.body;
  const message = update?.message;

  if (!message) {
    return res.status(200).json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text || '';
  const from = message.from || {};
  const lang = (from.language_code || 'ru').startsWith('ru') ? 'ru' : 'en';
  const name = from.first_name || '';

  // Always track activity
  try {
    await touchUser(chatId, { lang, name });
  } catch (e) {
    console.error('track', e);
  }

  if (text.startsWith('/start')) {
    const welcomeText =
`🚀 *Добро пожаловать в Cosmic Boost!*

Твой личный источник космического настроения.

• Ежедневный буст энергии
• Комплименты от вселенной
• Гороскоп для ленивых
• Совместимость со звёздами
• И много весёлого

Нажми кнопку ниже, чтобы открыть приложение 👇`;

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: welcomeText,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            {
              text: '🚀 Открыть Cosmic Boost',
              web_app: { url: 'https://cosmic-boost.vercel.app/' }
            }
          ]]
        }
      })
    });
  }

  if (text.startsWith('/boost')) {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '✨ Лови космический буст!',
        reply_markup: {
          inline_keyboard: [[
            {
              text: '🚀 Открыть Cosmic Boost',
              web_app: { url: 'https://cosmic-boost.vercel.app/' }
            }
          ]]
        }
      })
    });
  }

  return res.status(200).json({ ok: true });
}
