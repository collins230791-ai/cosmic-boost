import { cors, hasRedis, redis, userFromRequest } from '../lib/telegram.js';

function parseRef(raw) {
  const m = String(raw || '').trim().match(/^ref[_-]?(\d{3,15})$/i);
  return m ? m[1] : null;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!hasRedis()) return res.status(200).json({ ok: false, storage: 'none' });

  const { user, body } = userFromRequest(req);
  if (!user?.id) return res.status(401).json({ error: 'auth' });
  const userId = String(user.id);

  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

    if (body?.op === 'collect') {
      const bonus = Number(await redis(['HGET', 'cb:ref:bonus', userId])) || 0;
      const count = Number(await redis(['HGET', 'cb:ref:count', userId])) || 0;
      if (bonus > 0) await redis(['HSET', 'cb:ref:bonus', userId, '0']);
      return res.status(200).json({ ok: true, bonus, count });
    }

    const inviterId = parseRef(body?.startParam || body?.ref || '');
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
