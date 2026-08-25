import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

function fromBase64Url(str) {
  try {
    let s = String(str || '').replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    // decode base64 to bytes then UTF-8
    const binary = atob(s);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

function wrapText(text, maxLen = 28) {
  const words = String(text || '').replace(/\s+/g, ' ').trim().split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? line + ' ' + w : w;
    if (next.length > maxLen && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 7).join('\n');
}

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    // Prefer base64 param "t" (safe from double-encoding by Telegram)
    let text = fromBase64Url(searchParams.get('t') || '');
    if (!text) {
      // fallback for plain text param
      text = searchParams.get('text') || 'Cosmic Boost ✨';
    }
    text = text.slice(0, 180);
    const lines = wrapText(text, 26);

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
          },
          children: [
            {
              type: 'img',
              props: {
                src: 'https://cosmic-boost.vercel.app/story-bg.jpg',
                width: 1080,
                height: 1920,
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '1080px',
                  height: '1920px',
                  objectFit: 'cover',
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '860px',
                  padding: '36px 40px',
                  backgroundColor: 'rgba(10, 8, 24, 0.82)',
                  borderRadius: '28px',
                  border: '2px solid rgba(196, 76, 255, 0.55)',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 40,
                        fontWeight: 700,
                        color: 'white',
                        textAlign: 'center',
                        lineHeight: 1.35,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'sans-serif',
                      },
                      children: lines,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      { width: 1080, height: 1920 }
    );
  } catch (e) {
    return new Response('Failed: ' + (e?.message || 'error'), { status: 500 });
  }
}
