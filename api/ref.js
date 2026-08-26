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

function parseRef(raw) {
  const m = String(raw || '').trim().match(/^ref[_-]?(\d{3,15})$/i);
  return m ? m[1] : null;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!hasRedis()) {
    return res.status(200).json({ ok: false, storage: 'none' });
  }

  try {
    if (req.method === 'GET') {
      const userId = String(req.query?.userId || '').replace(/\D/g, '');
      if (!userId) return res.status(400).json({ error: 'userId' });
      const bonus = Number(await redis(['HGET', 'cb:ref:bonus', userId])) || 0;
      const count = Number(await redis(['HGET', 'cb:ref:count', userId])) || 0;
      if (bonus > 0) await redis(['HSET', 'cb:ref:bonus', userId, '0']);
      return res.status(200).json({ ok: true, bonus, count });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

    const userId = String(req.body?.userId || '').replace(/\D/g, '');
    const inviterId = parseRef(req.body?.startParam || req.body?.ref || '');
    if (!userId) return res.status(400).json({ error: 'userId' });
    if (!inviterId || inviterId === userId) {
      return res.status(200).json({ ok: true, applied: false, reason: 'self_or_empty' });
    }

    const first = await redis(['SET', `cb:ref:attr:${userId}`, inviterId, 'NX']);
    if (first !== 'OK' && first !== true) {
      return res.status(200).json({ ok: true, applied: false, reason: 'already' });
    }

    await redis(['HINCRBY', 'cb:ref:count', inviterId, 1]);
    await redis(['HINCRBY', 'cb:ref:bonus', inviterId, 25]);

    return res.status(200).json({ ok: true, applied: true, inviteeBonus: 15 });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'fail' });
  }
}
