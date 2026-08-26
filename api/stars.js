import { cors, userFromRequest } from '../lib/telegram.js';

const SKUS = {
  energy: {
    title: 'Дозаряд энергии',
    description: 'Вселенная заряжает тебя до 100% на сегодня',
    label: 'Energy refill',
    amount: 15,
  },
  cards: {
    title: '3 карты дня',
    description: 'Три дополнительные карты без траты энергии',
    label: '3 extra cards',
    amount: 29,
  },
  pass: {
    title: 'Безлимит на 24 часа',
    description: 'Спрашивай вселенную сколько хочешь — энергия не списывается',
    label: '24h unlimited',
    amount: 49,
  },
  synastry: {
    title: 'Полный разбор связи',
    description: 'Где вы срастаетесь, где срыв и что делать на этой неделе',
    label: 'Full bond reading',
    amount: 75,
  },
};

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const TOKEN = process.env.BOT_TOKEN;
  if (!TOKEN) return res.status(500).json({ error: 'BOT_TOKEN not set' });

  const { user, body } = userFromRequest(req);
  if (!user?.id) return res.status(401).json({ error: 'auth' });

  const sku = String(body?.sku || '');
  const item = SKUS[sku];
  if (!item) return res.status(400).json({ error: 'bad sku' });

  const payload = `cb|${sku}|${user.id}`.slice(0, 128);
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: item.title.slice(0, 32),
        description: item.description.slice(0, 255),
        payload,
        currency: 'XTR',
        prices: [{ label: item.label, amount: item.amount }],
      }),
    });
    const data = await tgRes.json();
    if (!data.ok) return res.status(502).json({ error: data.description || 'invoice failed' });
    return res.status(200).json({ ok: true, url: data.result, sku, stars: item.amount });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'fail' });
  }
}
