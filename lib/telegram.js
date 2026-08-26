import crypto from 'crypto';

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export function hasRedis() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export async function redis(command) {
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

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function verifyInitData(initData) {
  const token = process.env.BOT_TOKEN;
  if (!token || !initData || typeof initData !== 'string') return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  const secret = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
  const calc = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
  if (calc !== hash) return null;
  const authDate = Number(params.get('auth_date') || 0);
  if (authDate && Date.now() / 1000 - authDate > 86400 * 2) return null;
  try {
    return JSON.parse(params.get('user') || 'null');
  } catch {
    return null;
  }
}

export function userFromRequest(req) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const q = req.query || {};
  const initData = body.initData || q.initData || '';
  return { user: verifyInitData(initData), body };
}

export async function getEnergy(userId) {
  if (!hasRedis()) return 100;
  const raw = await redis(['GET', `cb:en:${userId}:${todayKey()}`]);
  if (raw === null || raw === undefined) return 100;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 100;
}

export async function setEnergy(userId, value) {
  if (!hasRedis()) return value;
  const v = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  await redis(['SET', `cb:en:${userId}:${todayKey()}`, String(v), 'EX', 172800]);
  return v;
}

export async function hasPass(userId) {
  if (!hasRedis()) return false;
  const until = Number(await redis(['GET', `cb:pass:${userId}`])) || 0;
  return Date.now() < until;
}

export async function grantPass(userId, hours = 24) {
  if (!hasRedis()) return;
  const until = Date.now() + hours * 3600 * 1000;
  await redis(['SET', `cb:pass:${userId}`, String(until), 'EX', hours * 3600 + 3600]);
}

export async function addExtraCards(userId, n) {
  if (!hasRedis()) return 0;
  return Number(await redis(['INCRBY', `cb:xcards:${userId}`, n])) || 0;
}

export async function consumeExtraCard(userId) {
  if (!hasRedis()) return false;
  const left = Number(await redis(['GET', `cb:xcards:${userId}`])) || 0;
  if (left < 1) return false;
  await redis(['DECR', `cb:xcards:${userId}`]);
  return true;
}

export async function spendServerEnergy(userId, cost = 18) {
  if (await hasPass(userId)) return { ok: true, energy: await getEnergy(userId), pass: true };
  const cur = await getEnergy(userId);
  if (cur < cost) return { ok: false, energy: cur };
  const next = await setEnergy(userId, cur - cost);
  return { ok: true, energy: next };
}

export async function hitAiLimit(userId, max = 40) {
  if (!hasRedis()) return { ok: true, used: 0 };
  const key = `cb:ai:${userId}:${todayKey()}`;
  const used = Number(await redis(['INCR', key])) || 1;
  if (used === 1) await redis(['EXPIRE', key, 172800]);
  return { ok: used <= max, used };
}

export async function applySku(userId, sku) {
  if (sku === 'energy') {
    await setEnergy(userId, 100);
  } else if (sku === 'cards') {
    await addExtraCards(userId, 3);
  } else if (sku === 'pass') {
    await grantPass(userId, 24);
  }
}
