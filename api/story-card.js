import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

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

function wrapText(text, maxLen = 28) {
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
  return lines.slice(0, 10); // more lines
}

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    let text = fromBase64Url(searchParams.get('t') || '');
    if (!text) text = searchParams.get('text') || 'Cosmic Boost ✨';
    text = text.slice(0, 220);
    const lines = wrapText(text, 30);
    const fontSize = lines.length > 6 ? 26 : lines.length > 4 ? 28 : 32;

    return new ImageResponse(
      {
        type: 'div',
        props: {
          style: {
            width: '720px',
            height: '1280px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: '#0a0818',
            backgroundImage: 'url(https://cosmic-boost.vercel.app/story-bg.jpg)',
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
                  width: '640px',
                  maxHeight: '520px',
                  padding: '28px 26px',
                  backgroundColor: 'rgba(10, 8, 24, 0.88)',
                  borderRadius: '24px',
                  border: '2px solid rgba(196, 76, 255, 0.6)',
                },
                children: lines.map((line) => ({
                  type: 'div',
                  props: {
                    style: {
                      fontSize,
                      fontWeight: 700,
                      color: 'white',
                      textAlign: 'center',
                      lineHeight: 1.3,
                      fontFamily: 'sans-serif',
                      width: '100%',
                    },
                    children: line,
                  },
                })),
              },
            },
          ],
        },
      },
      {
        width: 720,
        height: 1280,
        headers: { 'Cache-Control': 'public, max-age=3600' },
      }
    );
  } catch (e) {
    return new Response('Failed: ' + (e?.message || 'error'), { status: 500 });
  }
}
