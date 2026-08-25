export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Cosmic Boost Bot is running');
  }

  const TOKEN = process.env.BOT_TOKEN;
  if (!TOKEN) {
    return res.status(500).json({ error: 'BOT_TOKEN not set' });
  }

  const update = req.body;
  const message = update?.message;

  if (!message) {
    return res.status(200).json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text || '';

  if (text.startsWith('/start')) {
    const welcomeText = 
`🚀 *Добро пожаловать в Cosmic Boost!*

Твой личный источник космического настроения.

• Ежедневный буст энергии
• Комплименты от вселенной
• Гороскоп для ленивых
• Совместимость со звёздами
• И много весёлого

Нажми кнопку ниже, чтобы открыть приложение 👇`;

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: welcomeText,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            {
              text: '🚀 Открыть Cosmic Boost',
              web_app: { url: 'https://cosmic-boost.vercel.app/' }
            }
          ]]
        }
      })
    });
  }

  if (text.startsWith('/boost')) {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '✨ Лови космический буст!',
        reply_markup: {
          inline_keyboard: [[
            {
              text: '🚀 Открыть Cosmic Boost',
              web_app: { url: 'https://cosmic-boost.vercel.app/' }
            }
          ]]
        }
      })
    });
  }

  return res.status(200).json({ ok: true });
}
