export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const TOKEN = process.env.BOT_TOKEN;
  if (!TOKEN) return res.status(500).json({ error: 'BOT_TOKEN not set' });

  const userId = Number(req.body?.userId);
  const photoUrl = String(req.body?.photo || '');
  const caption = String(req.body?.caption || 'Cosmic Boost').slice(0, 1024);
  if (!userId || !/^https:\/\/cosmic-boost\.vercel\.app\//.test(photoUrl)) {
    return res.status(400).json({ error: 'bad payload' });
  }

  try {
    const imgRes = await fetch(photoUrl);
    if (!imgRes.ok) throw new Error('image ' + imgRes.status);
    const buf = Buffer.from(await imgRes.arrayBuffer());

    const form = new FormData();
    form.append('chat_id', String(userId));
    form.append('caption', caption);
    form.append('photo', new Blob([buf], { type: 'image/png' }), 'cosmic-boost.png');

    const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
      method: 'POST',
      body: form,
    });
    const data = await tgRes.json();
    if (!data.ok) {
      return res.status(502).json({ error: data.description || 'sendPhoto failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'fail' });
  }
}
