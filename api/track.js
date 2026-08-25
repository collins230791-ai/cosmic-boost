const mem = globalThis.__cbUsers || (globalThis.__cbUsers = new Map());

function hasRedis() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
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
  if (!res.ok) {
    throw new Error('redis ' + res.status + ': ' + text.slice(0, 200));
  }
  try {
    return JSON.parse(text).result;
  } catch {
    return text;
  }
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Diagnostic: GET /api/track
  if (req.method === 'GET') {
    const url = (process.env.UPSTASH_REDIS_REST_URL || '').trim().replace(/^"|"$/g, '');
    const token = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim().replace(/^"|"$/g, '');
    const info = {
      redisUrlSet: !!url,
      redisTokenSet: !!token,
      urlHost: url ? url.replace(/^https?:\/\//, '').split('/')[0] : null,
      tokenLen: token ? token.length : 0,
    };
    if (!url || !token) {
      return res.status(200).json({ ok: false, step: 'env', ...info });
    }
    try {
      const pong = await redis(['PING']);
      try {
        await redis(['SET', 'cb:diag', '1']);
        await redis(['DEL', 'cb:diag']);
        return res.status(200).json({ ok: true, step: 'write_ok', pong, ...info });
      } catch (e) {
        return res.status(200).json({ ok: false, step: 'write_fail', pong, detail: String(e.message || e).slice(0, 200), ...info });
      }
    } catch (e) {
      return res.status(200).json({ ok: false, step: 'ping_fail', detail: String(e.message || e).slice(0, 200), ...info });
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { userId, lang, name } = body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const result = await touchUser(userId, { lang, name });
    return res.status(200).json({ ok: true, ...result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: 'track failed',
      detail: String(e.message || e).slice(0, 300),
    });
  }
}
