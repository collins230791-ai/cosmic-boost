import { cors } from '../lib/telegram.js';

function pickLabel(entity, langs) {
  const labels = entity.labels || {};
  for (const lang of langs) {
    if (labels[lang]?.value) return labels[lang].value;
  }
  const first = Object.values(labels)[0];
  return first?.value || '';
}

function pickDesc(entity, langs) {
  const d = entity.descriptions || {};
  for (const lang of langs) {
    if (d[lang]?.value) return d[lang].value;
  }
  const first = Object.values(d)[0];
  return first?.value || '';
}

function birthFromEntity(entity) {
  const claim = entity.claims?.P569?.[0]?.mainsnak?.datavalue?.value;
  if (!claim?.time) return null;
  const m = String(claim.time).match(/^([+-]?)(\d{4})-(\d{2})-(\d{2})/);
  if (!m || m[3] === '00' || m[4] === '00') return null;
  return `${m[2]}-${m[3]}-${m[4]}`;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const q = String(req.body?.q || '').trim().slice(0, 80);
  const lang = req.body?.lang === 'en' ? 'en' : 'ru';
  if (q.length < 2) return res.status(400).json({ error: 'q' });

  try {
    const searchUrl = 'https://www.wikidata.org/w/api.php?action=wbsearchentities'
      + '&type=item&limit=8&format=json&origin=*'
      + `&language=${lang}&uselang=${lang}&search=${encodeURIComponent(q)}`;
    const sRes = await fetch(searchUrl, { headers: { 'User-Agent': 'CosmicBoost/1.0' } });
    const sData = await sRes.json();
    const ids = (sData.search || []).map((x) => x.id).filter(Boolean).slice(0, 8);
    if (!ids.length) return res.status(200).json({ ok: true, items: [] });

    const getUrl = 'https://www.wikidata.org/w/api.php?action=wbgetentities'
      + `&ids=${ids.join('|')}&props=labels|descriptions|claims&format=json&origin=*`;
    const eRes = await fetch(getUrl, { headers: { 'User-Agent': 'CosmicBoost/1.0' } });
    const eData = await eRes.json();

    const langs = lang === 'ru' ? ['ru', 'en'] : ['en', 'ru'];
    const items = [];
    for (const id of ids) {
      const ent = eData.entities?.[id];
      if (!ent) continue;
      const instance = (ent.claims?.P31 || []).map((c) => c.mainsnak?.datavalue?.value?.id);
      if (instance.length && !instance.includes('Q5')) continue;
      const birth = birthFromEntity(ent);
      if (!birth) continue;
      items.push({
        id,
        name: pickLabel(ent, langs) || q,
        desc: pickDesc(ent, langs),
        birth,
      });
    }
    return res.status(200).json({ ok: true, items: items.slice(0, 5) });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'fail' });
  }
}
