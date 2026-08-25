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
    return { storage: 'redis' };
  }
  mem.set(id, JSON.parse(payload));
  return { storage: 'memory' };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { userId, lang, name } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const result = await touchUser(userId, { lang, name });
    return res.status(200).json({ ok: true, ...result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'track failed' });
  }
}
