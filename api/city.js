import { cors } from '../lib/telegram.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const q = String(req.body?.q || '').trim().slice(0, 80);
  const lang = req.body?.lang === 'en' ? 'en' : 'ru';
  if (q.length < 2) return res.status(400).json({ error: 'q' });

  try {
    const url = 'https://nominatim.openstreetmap.org/search'
      + `?format=jsonv2&limit=5&addressdetails=1&accept-language=${lang}`
      + `&q=${encodeURIComponent(q)}`;
    const r = await fetch(url, {
      headers: { 'User-Agent': 'CosmicBoost/1.0 (telegram mini app)' }
    });
    const data = await r.json();
    const items = (Array.isArray(data) ? data : []).map((row) => {
      const a = row.address || {};
      const city = a.city || a.town || a.village || a.hamlet || row.name || q;
      const region = a.state || a.region || '';
      const country = a.country || '';
      const label = [city, region, country].filter(Boolean).join(', ');
      return {
        label,
        lat: Number(row.lat),
        lon: Number(row.lon)
      };
    }).filter((x) => x.label && Number.isFinite(x.lat) && Number.isFinite(x.lon));
    return res.status(200).json({ ok: true, items: items.slice(0, 3) });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'fail' });
  }
}
