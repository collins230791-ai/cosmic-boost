import { cors, userFromRequest, spendServerEnergy, hitAiLimit, consumeExtraCard } from '../lib/telegram.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

  let user, body;
  try {
    ({ user, body } = userFromRequest(req));
  } catch {
    return res.status(400).json({ error: 'bad json' });
  }
  if (!user?.id) return res.status(401).json({ error: 'auth' });

  const message = body?.message;
  const lang = body?.lang === 'en' ? 'en' : 'ru';
  const cost = Number(body?.cost) === 20 ? 20 : 18;
  const kind = String(body?.kind || 'ai');

  if (!message || typeof message !== 'string' || message.trim().length < 2) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const limit = await hitAiLimit(String(user.id), 40);
    if (!limit.ok) return res.status(429).json({ error: 'limit' });

    let spent = { ok: false };
    if (kind === 'card') {
      const extra = await consumeExtraCard(String(user.id));
      spent = extra ? { ok: true, extra: true } : await spendServerEnergy(String(user.id), cost);
    } else {
      spent = await spendServerEnergy(String(user.id), cost);
    }
    if (!spent.ok) return res.status(402).json({ error: 'energy', energy: spent.energy || 0 });

    const systemPrompt = lang === 'ru'
      ? `Ты — весёлая и добрая космическая сущность по имени Cosmic Boost. 
Отвечай коротко (2-4 предложения), с юмором, теплом и лёгкой космической магией. 
Используй эмодзи. Будь поддерживающим и поднимай настроение. 
Не будь слишком серьёзным. Говори на русском. НЕ используй markdown (никаких **, __, #). Только обычный текст и эмодзи.`
      : `You are a fun and kind cosmic entity named Cosmic Boost.
Reply short (2-4 sentences), with humor, warmth and light cosmic magic.
Use emojis. Be supportive and uplift the mood.
Don't be too serious. Speak in English. Do NOT use markdown (no **, __, #). Only plain text and emojis.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: message.trim().slice(0, 500) }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Claude error:', err);
      return res.status(500).json({ error: 'AI temporarily unavailable' });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || (lang === 'ru'
      ? 'Звёзды пока молчат... Попробуй ещё раз ✨'
      : 'The stars are silent... Try again ✨');

    return res.status(200).json({ reply, energy: spent.energy });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
