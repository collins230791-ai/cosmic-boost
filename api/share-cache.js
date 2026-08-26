function hasRedis() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function redis(command) {
  const url = (process.env.UPSTASH_REDIS_REST_URL || '').trim().replace(/^"|"$/g, '');
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim().replace(/^"|"$/g, '');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  const text = await res.text();
  if (!res.ok) throw new Error('redis ' + res.status + ': ' + text.slice(0, 180));
  try { return JSON.parse(text).result; } catch { return text; }
}

function makeId() {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!hasRedis()) return res.status(200).json({ ok: false, storage: 'none' });

  try {
    if (req.method === 'GET') {
      const id = String(req.query?.id || '').replace(/[^a-f0-9]/gi, '').slice(0, 16);
      if (!id) return res.status(400).json({ error: 'id' });
      const raw = await redis(['GET', 'cb:share:' + id]);
      if (!raw) return res.status(404).json({ ok: false });
      return res.status(200).json({ ok: true, item: JSON.parse(raw) });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
    const text = String(req.body?.text || '').slice(0, 220);
    if (!text) return res.status(400).json({ error: 'text' });
    const item = {
      text,
      type: String(req.body?.type || 'boost').slice(0, 20),
      name: String(req.body?.name || '').slice(0, 24),
      lang: req.body?.lang === 'en' ? 'en' : 'ru',
      fromId: String(req.body?.fromId || '').replace(/\D/g, ''),
    };
    const id = makeId();
    await redis(['SET', 'cb:share:' + id, JSON.stringify(item), 'EX', 172800]);
    return res.status(200).json({ ok: true, id });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'fail' });
  }
}
