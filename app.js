const tg = window.Telegram?.WebApp;
const AI_URL = 'https://cosmic-boost.vercel.app/api/ai';

let lang = localStorage.getItem('cb_lang') || 'ru';
let userSign = localStorage.getItem('cb_sign') || null;

const i18n = {
  ru: {
    subtitle: "Твой ежедневный заряд от вселенной",
    titleCompliment: "Комплимент от вселенной",
    titleHoroscope: "Твой прогноз на сегодня",
    titleLazy: "Гороскоп для ленивых",
    titleStars: "С кем из звёзд совместим(а)",
    titleUniverse: "Спросить вселенную",
    titleProfile: "Профиль",
    titleCard: "Карта дня",
    navBoost: "Буст", navLazy: "Ленивый", navStars: "Звёзды", navUniverse: "Вселенная", navProfile: "Профиль",
    btnLazy: "Получить разрешение", btnCard: "Открыть карту", btnAsk: "Спросить ✨", btnClose: "Закрыть",
    chooseSign: "Твой знак зодиака:", signNotSelected: "Знак не выбран", guest: "Гость",
    starsHint: "Выбери знаменитость", cardPlaceholder: "Нажми, чтобы открыть",
    horoscopePlaceholder: "Выбери знак в Профиле ✨",
    aiPlaceholder: "Напиши что угодно вселенной...",
    loading: "Вселенная думает...",
    error: "Звёзды пока молчат. Попробуй ещё раз ✨"
  },
  en: {
    subtitle: "Your daily charge from the universe",
    titleCompliment: "Compliment from the Universe",
    titleHoroscope: "Your forecast for today",
    titleLazy: "Lazy Horoscope",
    titleStars: "Celebrity Compatibility",
    titleUniverse: "Ask the Universe",
    titleProfile: "Profile",
    titleCard: "Card of the Day",
    navBoost: "Boost", navLazy: "Lazy", navStars: "Stars", navUniverse: "Universe", navProfile: "Profile",
    btnLazy: "Get permission", btnCard: "Draw a card", btnAsk: "Ask ✨", btnClose: "Close",
    chooseSign: "Your zodiac sign:", signNotSelected: "Sign not selected", guest: "Guest",
    starsHint: "Choose a celebrity", cardPlaceholder: "Press to open",
    horoscopePlaceholder: "Choose your sign in Profile ✨",
    aiPlaceholder: "Write anything to the universe...",
    loading: "The universe is thinking...",
    error: "The stars are silent. Try again ✨"
  }
};

function t(key) { return i18n[lang][key] || key; }
function getToday() { return new Date().toISOString().slice(0, 10); }

function haptic(type = 'light') {
  if (tg?.HapticFeedback) {
    if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
    else if (type === 'error') tg.HapticFeedback.notificationOccurred('error');
    else if (type === 'medium') tg.HapticFeedback.impactOccurred('medium');
    else tg.HapticFeedback.impactOccurred('light');
  }
}

// ===== AI =====
async function askAI(prompt) {
  try {
    const res = await fetch(AI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt, lang })
    });
    if (!res.ok) throw new Error('fail');
    const data = await res.json();
    return data.reply || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function cacheKey(name) {
  return `cb_ai_${name}_${lang}_${getToday()}_${userSign || 'none'}`;
}

async function getCachedOrAI(name, prompt, fallbackArr) {
  const key = cacheKey(name);
  const cached = localStorage.getItem(key);
  if (cached) return cached;

  const reply = await askAI(prompt);
  if (reply) {
    localStorage.setItem(key, reply);
    return reply;
  }
  // fallback
  if (fallbackArr && fallbackArr.length) {
    const idx = Math.floor(Math.random() * fallbackArr.length);
    return fallbackArr[idx];
  }
  return t('error');
}

// ===== UI =====
function updateUI() {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.getElementById('subtitle').textContent = t('subtitle');
  document.getElementById('title-compliment').textContent = t('titleCompliment');
  document.getElementById('title-horoscope').textContent = t('titleHoroscope');
  document.getElementById('title-lazy').textContent = t('titleLazy');
  document.getElementById('title-stars').textContent = t('titleStars');
  document.getElementById('title-universe').textContent = t('titleUniverse');
  document.getElementById('title-profile').textContent = t('titleProfile');
  document.getElementById('title-card').textContent = t('titleCard');
  document.getElementById('nav-boost').textContent = t('navBoost');
  document.getElementById('nav-lazy').textContent = t('navLazy');
  document.getElementById('nav-stars').textContent = t('navStars');
  document.getElementById('nav-universe').textContent = t('navUniverse');
  document.getElementById('nav-profile').textContent = t('navProfile');
  document.getElementById('btn-lazy').textContent = t('btnLazy');
  document.getElementById('btn-card').textContent = t('btnCard');
  document.getElementById('btn-ask').textContent = t('btnAsk');
  document.getElementById('modal-close-btn').textContent = t('btnClose');
  document.getElementById('choose-sign-label').textContent = t('chooseSign');
  document.getElementById('stars-hint').textContent = t('starsHint');
  document.getElementById('ai-input').placeholder = t('aiPlaceholder');

  // Energy (static, fast)
  const energy = 70 + Math.floor(Math.random() * 30);
  document.getElementById('energy-value').textContent = energy + '%';
  document.getElementById('energy-fill').style.width = energy + '%';
  const phrases = ENERGY_PHRASES[lang] || ENERGY_PHRASES.ru;
  document.getElementById('energy-label').textContent = phrases[Math.floor(Math.random() * phrases.length)];

  if (userSign && ZODIAC[userSign]) {
    document.getElementById('user-sign').textContent = ZODIAC[userSign].emoji + ' ' + ZODIAC[userSign][lang];
  } else {
    document.getElementById('user-sign').textContent = t('signNotSelected');
  }

  renderZodiac();
  renderCelebrities();
  renderQuickBtns();
  loadBoostContent();
}

async function loadBoostContent() {
  const compEl = document.getElementById('compliment-text');
  const horEl = document.getElementById('horoscope-text');

  compEl.textContent = t('loading');
  if (!userSign) {
    horEl.textContent = t('horoscopePlaceholder');
  } else {
    horEl.textContent = t('loading');
  }

  // Compliment
  const compPrompt = lang === 'ru'
    ? 'Напиши один короткий тёплый и смешной комплимент от вселенной человеку. 1-2 предложения. С эмодзи.'
    : 'Write one short warm and funny compliment from the universe to a person. 1-2 sentences. With emoji.';
  const compliment = await getCachedOrAI('compliment', compPrompt, COMPLIMENTS[lang]);
  compEl.textContent = compliment;

  // Horoscope
  if (userSign) {
    const signName = ZODIAC[userSign][lang];
    const horPrompt = lang === 'ru'
      ? `Напиши короткий весёлый гороскоп на сегодня для знака ${signName}. 2-3 предложения, с юмором и теплом. С эмодзи.`
      : `Write a short fun horoscope for today for ${signName}. 2-3 sentences, with humor and warmth. With emoji.`;
    const fallback = (DAILY_HOROSCOPES[lang] && DAILY_HOROSCOPES[lang][userSign]) || [];
    const horoscope = await getCachedOrAI('horoscope', horPrompt, fallback);
    horEl.textContent = horoscope;
  }
}

function setLang(l) {
  lang = l;
  localStorage.setItem('cb_lang', lang);
  updateUI();
  haptic();
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.screen === name));
  haptic('light');
}

function renderZodiac() {
  const grid = document.getElementById('profile-zodiac-grid');
  grid.innerHTML = '';
  Object.keys(ZODIAC).forEach(key => {
    const z = ZODIAC[key];
    const item = document.createElement('div');
    item.className = 'zodiac-item' + (userSign === key ? ' selected' : '');
    item.innerHTML = `<span class="zodiac-emoji">${z.emoji}</span><span class="zodiac-name">${z[lang]}</span>`;
    item.onclick = () => {
      userSign = key;
      localStorage.setItem('cb_sign', key);
      // clear cached horoscope so it regenerates
      localStorage.removeItem(cacheKey('horoscope'));
      updateUI();
      haptic('medium');
    };
    grid.appendChild(item);
  });
}

function renderCelebrities() {
  const list = document.getElementById('celeb-list');
  list.innerHTML = '';
  CELEBRITIES.forEach(celeb => {
    const item = document.createElement('div');
    item.className = 'celeb-item';
    item.innerHTML = `
      <div class="celeb-emoji">${celeb.emoji}</div>
      <div class="celeb-info">
        <div class="celeb-name">${celeb.name[lang]}</div>
        <div class="celeb-sign">${ZODIAC[celeb.sign].emoji} ${ZODIAC[celeb.sign][lang]}</div>
      </div>`;
    item.onclick = () => showCelebAI(celeb);
    list.appendChild(item);
  });
}

async function showCelebAI(celeb) {
  if (!userSign) {
    showModal(`<div class="result-emoji">✨</div><div class="result-title">${lang==='ru'?'Сначала выбери знак в Профиле!':'Choose your sign in Profile first!'}</div>`);
    return;
  }
  showModal(`<div class="result-emoji">${celeb.emoji}</div><div class="result-title">${t('loading')}</div>`);
  haptic('medium');

  const mySign = ZODIAC[userSign][lang];
  const prompt = lang === 'ru'
    ? `Напиши очень смешную и тёплую совместимость между человеком знака ${mySign} и знаменитостью ${celeb.name.ru}. 2-3 предложения. С эмодзи. В конце напиши процент совместимости от 55 до 98.`
    : `Write a very funny and warm compatibility between a ${mySign} person and celebrity ${celeb.name.en}. 2-3 sentences. With emoji. End with a compatibility percent from 55 to 98.`;

  const reply = await askAI(prompt);
  const text = reply || (celeb.funny[lang][0] || t('error'));
  document.getElementById('modal-content').innerHTML = `
    <div class="result-emoji">${celeb.emoji}</div>
    <div class="result-title">${celeb.name[lang]}</div>
    <p style="font-size:15px;line-height:1.5;margin-top:12px">${text}</p>`;
}

async function getLazy() {
  const el = document.getElementById('lazy-text');
  el.textContent = t('loading');
  haptic('medium');
  const prompt = lang === 'ru'
    ? 'Напиши короткий смешной «гороскоп для ленивых» — разрешение сегодня ничего не делать. 2 предложения. С теплом и юмором. С эмодзи.'
    : 'Write a short funny "lazy horoscope" — permission to do nothing today. 2 sentences. With warmth and humor. With emoji.';
  const reply = await getCachedOrAI('lazy', prompt, LAZY_HOROSCOPES[lang]);
  el.textContent = reply;
}

async function drawCard() {
  const titleEl = document.getElementById('card-title');
  const textEl = document.getElementById('card-text');
  titleEl.textContent = t('loading');
  textEl.textContent = '';
  haptic('medium');

  const prompt = lang === 'ru'
    ? 'Придумай название и текст одной весёлой «карты дня» в космическом стиле. Формат: сначала короткое название (2-4 слова), потом с новой строки текст на 1-2 предложения. С эмодзи.'
    : 'Invent a title and text for one fun "card of the day" in cosmic style. Format: first a short title (2-4 words), then on a new line the text in 1-2 sentences. With emoji.';

  const reply = await askAI(prompt);
  if (reply) {
    const parts = reply.split('\n').filter(Boolean);
    titleEl.textContent = parts[0] || 'Карта дня';
    textEl.textContent = parts.slice(1).join(' ') || reply;
  } else {
    const cards = CARDS[lang];
    const c = cards[Math.floor(Math.random() * cards.length)];
    titleEl.textContent = c.title;
    textEl.textContent = c.text;
  }
  haptic('success');
}

function renderQuickBtns() {
  const box = document.getElementById('quick-btns');
  const btns = lang === 'ru' ? [
    { t: '😢 Мне грустно', p: 'Мне грустно. Подбодри меня по-космически, тепло и с юмором.' },
    { t: '💪 Подбодри', p: 'Подбодри меня! Коротко, мощно, с юмором и эмодзи.' },
    { t: '🎯 Что делать?', p: 'Что мне сегодня делать? Дай один смешной и полезный космический совет.' },
    { t: '✨ Дай совет', p: 'Дай мне один короткий мудрый и смешной совет от вселенной.' }
  ] : [
    { t: '😢 I feel sad', p: 'I feel sad. Cheer me up in a cosmic, warm and funny way.' },
    { t: '💪 Cheer me up', p: 'Cheer me up! Short, powerful, with humor and emoji.' },
    { t: '🎯 What to do?', p: 'What should I do today? Give one funny and useful cosmic advice.' },
    { t: '✨ Give advice', p: 'Give me one short wise and funny piece of advice from the universe.' }
  ];
  box.innerHTML = '';
  btns.forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'quick-btn';
    btn.textContent = b.t;
    btn.onclick = () => {
      document.getElementById('ai-input').value = b.p;
      askUniverse();
    };
    box.appendChild(btn);
  });
}

async function askUniverse() {
  const input = document.getElementById('ai-input');
  const result = document.getElementById('ai-result');
  const msg = (input.value || '').trim();
  if (msg.length < 2) return;

  result.style.display = 'block';
  result.innerHTML = `<div class="ai-loading">${t('loading')}</div>`;
  haptic('medium');

  const reply = await askAI(msg);
  result.innerHTML = `<div class="ai-reply">${reply || t('error')}</div>`;
  haptic(reply ? 'success' : 'error');
}

function showModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('result-overlay').classList.add('active');
}
function closeModal(e) {
  if (e && e.target !== document.getElementById('result-overlay') && !e.target.classList.contains('modal-close') && e.target.id !== 'modal-close-btn') return;
  document.getElementById('result-overlay').classList.remove('active');
}

function createStars() {
  const c = document.getElementById('stars');
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*100+'%';
    s.style.width = s.style.height = (Math.random()*2+1)+'px';
    s.style.setProperty('--duration', (Math.random()*3+2)+'s');
    s.style.setProperty('--opacity', Math.random()*0.8+0.2);
    s.style.animationDelay = Math.random()*5+'s';
    c.appendChild(s);
  }
}

function initTelegram() {
  if (!tg) return;
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#0f0c29');
  tg.setBackgroundColor('#0f0c29');
  const user = tg.initDataUnsafe?.user;
  if (user) {
    document.getElementById('user-name').textContent = user.first_name + (user.last_name ? ' '+user.last_name : '');
    document.getElementById('user-avatar').textContent = (user.first_name?.[0] || '?').toUpperCase();
  }
  if (!localStorage.getItem('cb_lang') && user?.language_code) {
    lang = user.language_code.startsWith('ru') ? 'ru' : 'en';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTelegram();
  createStars();
  updateUI();
});
