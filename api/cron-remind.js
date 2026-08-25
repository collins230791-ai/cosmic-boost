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

async function listInactive(days = 2) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const dayMs = 24 * 60 * 60 * 1000;
  const inactive = [];

  if (hasRedis()) {
    const ids = (await redis(['SMEMBERS', 'cb:user_ids'])) || [];
    for (const id of ids) {
      const raw = await redis(['HGET', 'cb:users', id]);
      if (!raw) continue;
      try {
        const u = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!u.lastSeen || u.lastSeen >= cutoff) continue;
        // don't remind more than once per 2 days
        if (u.lastRemind && Date.now() - u.lastRemind < dayMs * 2) continue;
        inactive.push(u);
      } catch (_) {}
    }
    return inactive;
  }

  for (const u of mem.values()) {
    if (u.lastSeen < cutoff) {
      if (u.lastRemind && Date.now() - u.lastRemind < dayMs * 2) continue;
      inactive.push(u);
    }
  }
  return inactive;
}

async function markReminded(id) {
  if (hasRedis()) {
    const raw = await redis(['HGET', 'cb:users', String(id)]);
    if (!raw) return;
    try {
      const u = typeof raw === 'string' ? JSON.parse(raw) : raw;
      u.lastRemind = Date.now();
      await redis(['HSET', 'cb:users', String(id), JSON.stringify(u)]);
    } catch (_) {}
    return;
  }
  const u = mem.get(String(id));
  if (u) {
    u.lastRemind = Date.now();
    mem.set(String(id), u);
  }
}

export default async function handler(req, res) {
  // Protect cron: Vercel Cron sends Authorization: Bearer CRON_SECRET
  // Also allow ?secret= for manual test
  const secret = process.env.CRON_SECRET || '';
  const auth = req.headers['authorization'] || '';
  const q = req.query?.secret || '';
  const ok =
    (secret && auth === `Bearer ${secret}`) ||
    (secret && q === secret) ||
    (!secret && process.env.NODE_ENV !== 'production');

  if (secret && !ok) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const TOKEN = process.env.BOT_TOKEN;
  if (!TOKEN) return res.status(500).json({ error: 'BOT_TOKEN missing' });

  if (!hasRedis()) {
    return res.status(200).json({
      ok: false,
      message: 'Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for persistent reminders',
      sent: 0,
    });
  }

  try {
    const users = await listInactive(2);
    let sent = 0;
    const APP = 'https://t.me/CosmicBoostApp_bot/cosmicb';

    for (const u of users.slice(0, 50)) {
      // max 50 per run to be safe
      const name = u.name ? `, ${u.name}` : '';
      const isRu = (u.lang || 'ru') !== 'en';
      const text = isRu
        ? `✨ Эй${name}!\n\nТвоя карта дня перевернулась, пока тебя не было.\nЗагляни — вселенная уже что-то приготовила 🔮\n\n${APP}`
        : `✨ Hey${name}!\n\nYour card of the day flipped while you were away.\nCome see what the universe prepared 🔮\n\n${APP}`;

      const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: u.id,
          text,
          reply_markup: {
            inline_keyboard: [[
              { text: isRu ? '🚀 Открыть Cosmic Boost' : '🚀 Open Cosmic Boost', web_app: { url: 'https://cosmic-boost.vercel.app/' } }
            ]]
          },
        }),
      });
      if (r.ok) {
        sent++;
        await markReminded(u.id);
      }
      // small delay
      await new Promise((r) => setTimeout(r, 50));
    }

    return res.status(200).json({ ok: true, candidates: users.length, sent });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e.message || e) });
  }
}
