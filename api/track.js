const mem = globalThis.__cbUsers || (globalThis.__cbUsers = new Map());
const memDaily = globalThis.__cbDaily || (globalThis.__cbDaily = new Map());

function hasRedis() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
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
  const day = todayKey();
  const payload = JSON.stringify({
    id,
    lastSeen: now,
    lang: meta.lang || 'ru',
    name: meta.name || '',
  });

  let dailyCount = 1;

  if (hasRedis()) {
    await redis(['HSET', 'cb:users', id, payload]);
    await redis(['SADD', 'cb:user_ids', id]);
    // unique visitors today
    const added = await redis(['SADD', `cb:daily:${day}`, id]);
    dailyCount = Number(await redis(['SCARD', `cb:daily:${day}`])) || 1;
    // expire daily set in 48h
    await redis(['EXPIRE', `cb:daily:${day}`, 172800]);
    return { storage: 'redis', dailyCount, isNewToday: added === 1 };
  }

  mem.set(id, JSON.parse(payload));
  const set = memDaily.get(day) || new Set();
  const isNew = !set.has(id);
  set.add(id);
  memDaily.set(day, set);
  return { storage: 'memory', dailyCount: set.size, isNewToday: isNew };
}

async function getDailyCount() {
  const day = todayKey();
  if (hasRedis()) {
    const n = Number(await redis(['SCARD', `cb:daily:${day}`])) || 0;
    return n;
  }
  return (memDaily.get(day) || new Set()).size;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const dailyCount = await getDailyCount();
      const url = (process.env.UPSTASH_REDIS_REST_URL || '').trim();
      const token = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
      return res.status(200).json({
        ok: true,
        dailyCount,
        redisConfigured: !!(url && token),
      });
    } catch (e) {
      return res.status(200).json({ ok: false, dailyCount: 0, detail: String(e.message || e).slice(0, 150) });
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
