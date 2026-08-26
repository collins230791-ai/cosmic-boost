import { applySku } from '../lib/telegram.js';
const mem = globalThis.__cbUsers || (globalThis.__cbUsers = new Map());
const APP = 'https://cosmic-boost.vercel.app';
const APP_LINK = 'https://t.me/CosmicBoostApp_bot/cosmicb';

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

function toBase64Url(str) {
  return Buffer.from(String(str || ''), 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function cardUrl(item) {
  const p = new URLSearchParams();
  p.set('t', toBase64Url(item.text || 'Cosmic Boost'));
  p.set('type', item.type || 'boost');
  p.set('lang', item.lang === 'en' ? 'en' : 'ru');
  if (item.name) p.set('n', toBase64Url(item.name));
  return `${APP}/story-card.png?` + p.toString();
}

function refLink(fromId) {
  if (!fromId) return APP_LINK;
  return APP_LINK + '?startapp=ref' + fromId;
}

async function answerInline(token, inlineQueryId, item) {
  const link = refLink(item?.fromId);
  const photo = item ? cardUrl(item) : `${APP}/share-bg/boost.jpg`;
  const caption = item
    ? `${item.text}\n\nCosmic Boost — ${link}`.slice(0, 1024)
    : 'Cosmic Boost — заряд от вселенной ✨';

  const results = [
    {
      type: 'photo',
      id: 'card1',
      photo_url: photo,
      thumbnail_url: photo,
      photo_width: 1080,
      photo_height: 1920,
      title: 'Cosmic Boost',
      caption,
      reply_markup: {
        inline_keyboard: [[
          { text: '🚀 Открыть Cosmic Boost', url: link }
        ]]
      }
    },
    {
      type: 'article',
      id: 'open1',
      title: 'Открыть Cosmic Boost',
      description: 'Комплимент, гороскоп и ленивый буст',
      thumb_url: `${APP}/icons/boost.png`,
      input_message_content: {
        message_text: `Смотри, что мне сказала вселенная ✨\n\n${link}`,
      },
      reply_markup: {
        inline_keyboard: [[
          { text: '🚀 Открыть Cosmic Boost', url: link }
        ]]
      }
    }
  ];

  await fetch(`https://api.telegram.org/bot${token}/answerInlineQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      inline_query_id: inlineQueryId,
      results,
      cache_time: 15,
      is_personal: true,
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Cosmic Boost Bot is running');
  }

  const TOKEN = process.env.BOT_TOKEN;
  if (!TOKEN) {
    return res.status(500).json({ error: 'BOT_TOKEN not set' });
  }

  const update = req.body || {};

  if (update.inline_query) {
    const iq = update.inline_query;
    const raw = String(iq.query || '').trim();
    const id = raw.replace(/^cb/i, '').replace(/[^a-f0-9]/gi, '');
    let item = null;
    if (id && hasRedis()) {
      try {
        const packed = await redis(['GET', 'cb:share:' + id]);
        if (packed) item = JSON.parse(packed);
      } catch (e) {
        console.error('inline cache', e);
      }
    }
    if (!item && iq.from) {
      item = {
        text: 'Заряд от вселенной ✨',
        type: 'boost',
        name: iq.from.first_name || '',
        lang: (iq.from.language_code || 'ru').startsWith('ru') ? 'ru' : 'en',
        fromId: String(iq.from.id),
      };
    }
    try {
      await answerInline(TOKEN, iq.id, item);
    } catch (e) {
      console.error('answerInline', e);
    }
    return res.status(200).json({ ok: true });
  }

  if (update.pre_checkout_query) {
    await fetch(`https://api.telegram.org/bot${TOKEN}/answerPreCheckoutQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pre_checkout_query_id: update.pre_checkout_query.id,
        ok: true,
      }),
    });
    return res.status(200).json({ ok: true });
  }

  if (update.message?.successful_payment) {
    const pay = update.message.successful_payment;
    try {
      const parts = String(pay.invoice_payload || '').split('|');
      const sku = parts[1];
      const uid = parts[2] || String(update.message.from?.id || '');
      if (sku && uid) await applySku(uid, sku);
      if (hasRedis()) {
        await redis(['LPUSH', 'cb:stars:paid', JSON.stringify({
          at: Date.now(),
          userId: uid,
          payload: pay.invoice_payload,
          stars: pay.total_amount,
        })]);
        await redis(['LTRIM', 'cb:stars:paid', 0, 199]);
      }
    } catch (e) {
      console.error('stars log', e);
    }
    return res.status(200).json({ ok: true });
  }

  const message = update.message;
  if (!message) {
    return res.status(200).json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text || '';
  const from = message.from || {};
  const lang = (from.language_code || 'ru').startsWith('ru') ? 'ru' : 'en';
  const name = from.first_name || '';

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
              web_app: { url: APP + '/' }
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
              web_app: { url: APP + '/' }
            }
          ]]
        }
      })
    });
  }

  return res.status(200).json({ ok: true });
}
