import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const ORIGIN = 'https://cosmic-boost.vercel.app';

const TYPES = {
  boost: {
    bg: `${ORIGIN}/share-bg/boost.jpg`,
    color: '#2A2140',
    labelColor: '#6B4E8A',
    veil: 'rgba(255, 248, 242, 0.42)',
    shadow: '0 2px 12px rgba(255,255,255,0.35)',
    labels: { ru: 'Комплимент', en: 'Compliment' },
  },
  lazy: {
    bg: `${ORIGIN}/share-bg/lazy.jpg`,
    color: '#FFFFFF',
    labelColor: 'rgba(255,230,255,0.92)',
    veil: 'rgba(18, 8, 36, 0.28)',
    shadow: '0 2px 18px rgba(0,0,0,0.45)',
    labels: { ru: 'Ленивый', en: 'Lazy boost' },
  },
  card: {
    bg: `${ORIGIN}/share-bg/card.jpg`,
    color: '#FFF6E8',
    labelColor: 'rgba(255, 214, 160, 0.95)',
    veil: 'rgba(6, 12, 36, 0.22)',
    shadow: '0 2px 18px rgba(0,0,0,0.4)',
    labels: { ru: 'Карта дня', en: 'Card of the day' },
  },
  stars: {
    bg: `${ORIGIN}/share-bg/stars.jpg`,
    color: '#FFFFFF',
    labelColor: 'rgba(180, 240, 255, 0.95)',
    veil: 'rgba(6, 10, 40, 0.34)',
    shadow: '0 2px 18px rgba(0,0,0,0.45)',
    labels: { ru: 'Звёзды', en: 'Stars' },
  },
  number: {
    bg: `${ORIGIN}/share-bg/number.jpg`,
    color: '#FFE9B8',
    labelColor: 'rgba(255, 214, 140, 0.95)',
    veil: 'rgba(6, 10, 28, 0.18)',
    shadow: '0 2px 18px rgba(0,0,0,0.4)',
    labels: { ru: 'Число судьбы', en: 'Destiny number' },
  },
};
TYPES.horoscope = { ...TYPES.card, labels: { ru: 'Гороскоп', en: 'Horoscope' } };
TYPES.relocate = { ...TYPES.number, labels: { ru: 'Куда переехать', en: 'Where to move' } };
TYPES.universe = { ...TYPES.stars, labels: { ru: 'Вселенная', en: 'Universe' } };
TYPES.compliment = TYPES.boost;
TYPES.numerology = TYPES.number;

const TYPE_ALIAS = {
  boost: 'boost',
  compliment: 'boost',
  horoscope: 'horoscope',
  card: 'card',
  lazy: 'lazy',
  stars: 'stars',
  universe: 'universe',
  number: 'number',
  numerology: 'numerology',
  relocate: 'relocate',
};

function fromBase64Url(str) {
  try {
    let s = String(str || '').replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const binary = atob(s);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

function wrapText(text, maxLen = 38) {
  const words = String(text || '').replace(/\s+/g, ' ').trim().split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? line + ' ' + w : w;
    if (next.length > maxLen && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 10);
}

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    let text = fromBase64Url(searchParams.get('t') || '');
    if (!text) text = searchParams.get('text') || 'Cosmic Boost ✨';
    text = text.slice(0, 220);

    const rawType = String(searchParams.get('type') || 'boost').toLowerCase();
    const typeKey = TYPE_ALIAS[rawType] || 'boost';
    const theme = TYPES[typeKey];
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'ru';
    const name = fromBase64Url(searchParams.get('n') || '').slice(0, 24);
    const label = searchParams.get('label') || theme.labels[lang];

    const lines = wrapText(text, 36);
    const fontSize = lines.length > 7 ? 36 : lines.length > 5 ? 40 : lines.length > 3 ? 44 : 48;

    const lineNodes = lines.map((line) => ({
      type: 'div',
      props: {
        style: {
          fontSize,
          fontWeight: 700,
          color: theme.color,
          textAlign: 'center',
          lineHeight: 1.28,
          fontFamily: 'sans-serif',
          width: '100%',
          textShadow: theme.shadow,
        },
        children: line,
      },
    }));

    return new ImageResponse(
      {
        type: 'div',
        props: {
          style: {
            width: '1080px',
            height: '1920px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: '#0a0818',
            backgroundImage: `url(${theme.bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '940px',
                  maxHeight: '900px',
                  padding: '32px 36px',
                  backgroundColor: theme.veil,
                  borderRadius: '36px',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 26,
                        fontWeight: 600,
                        color: theme.labelColor,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: 14,
                        fontFamily: 'sans-serif',
                        textAlign: 'center',
                      },
                      children: label,
                    },
                  },
                  name
                    ? {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: 28,
                            fontWeight: 600,
                            color: theme.color,
                            opacity: 0.88,
                            marginBottom: 18,
                            fontFamily: 'sans-serif',
                            textAlign: 'center',
                          },
                          children: name,
                        },
                      }
                    : {
                        type: 'div',
                        props: { style: { height: 4, display: 'flex' }, children: '' },
                      },
                  ...lineNodes,
                  {
                    type: 'div',
                    props: {
                      style: {
                        marginTop: 28,
                        fontSize: 22,
                        fontWeight: 700,
                        color: theme.color,
                        opacity: 0.9,
                        fontFamily: 'sans-serif',
                        textAlign: 'center',
                        textShadow: theme.shadow,
                      },
                      children: 'Cosmic Boost',
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        marginTop: 6,
                        fontSize: 20,
                        fontWeight: 500,
                        color: theme.color,
                        opacity: 0.75,
                        fontFamily: 'sans-serif',
                        textAlign: 'center',
                        textShadow: theme.shadow,
                      },
                      children: 't.me/CosmicBoostApp_bot',
                    },
                  },
                ],
              },
            },

          ],
        },
      },
      {
        width: 1080,
        height: 1920,
        headers: { 'Cache-Control': 'public, max-age=3600' },
      }
    );
  } catch (e) {
    return new Response('Failed: ' + (e?.message || 'error'), { status: 500 });
  }
}
