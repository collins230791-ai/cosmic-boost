const tg = window.Telegram?.WebApp;
const AI_URL = 'https://cosmic-boost.vercel.app/api/ai';
const APP_LINK = 'https://t.me/CosmicBoostApp_bot/cosmicb';
const STORY_BG = 'https://cosmic-boost.vercel.app/story-bg.jpg';
const AI_TIMEOUT_MS = 4500;

let lang = localStorage.getItem('cb_lang') || 'ru';
let userSign = localStorage.getItem('cb_sign') || null;
let streak = parseInt(localStorage.getItem('cb_streak') || '0', 10);

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
    titleStreak: "Серия дней",
    navBoost: "Буст", navLazy: "Ленивый", navStars: "Звёзды", navUniverse: "Вселенная", navProfile: "Профиль",
    btnLazy: "Получить разрешение", btnCard: "Открыть карту", btnAsk: "Спросить ✨", btnClose: "Закрыть", btnShare: "Поделиться", btnStory: "В Stories",
    chooseSign: "Твой знак зодиака:", signNotSelected: "Знак не выбран", guest: "Гость",
    starsHint: "Выбери знаменитость", cardPlaceholder: "Нажми, чтобы открыть",
    horoscopePlaceholder: "Выбери знак в Профиле ✨",
    aiPlaceholder: "Напиши что угодно вселенной...",
    loading: "Связываемся с космосом...",
    loadingShort: "Звёзды думают...",
    error: "Звёзды сейчас вне зоны доступа. Попробуй чуть позже ✨",
    streakDays: "дней подряд",
    shareText: "Смотри, что мне сказала вселенная в Cosmic Boost ✨"
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
    titleStreak: "Day streak",
    navBoost: "Boost", navLazy: "Lazy", navStars: "Stars", navUniverse: "Universe", navProfile: "Profile",
    btnLazy: "Get permission", btnCard: "Draw a card", btnAsk: "Ask ✨", btnClose: "Close", btnShare: "Share", btnStory: "To Stories",
    chooseSign: "Your zodiac sign:", signNotSelected: "Sign not selected", guest: "Guest",
    starsHint: "Choose a celebrity", cardPlaceholder: "Press to open",
    horoscopePlaceholder: "Choose your sign in Profile ✨",
    aiPlaceholder: "Write anything to the universe...",
    loading: "Connecting to the cosmos...",
    loadingShort: "Stars are thinking...",
    error: "Stars are currently out of range. Try a bit later ✨",
    streakDays: "days in a row",
    shareText: "Look what the universe told me in Cosmic Boost ✨"
  }
};

const ENERGY_COMMENTS = {
  ru: {
    low: ["Энергии хватит только лежать в направлении мечты 🛋️","Сегодня ты — красивая батарея на 15%. Зарядка рекомендована","Космос шепчет: «Отдыхай. Мы прикроем»","Уровень: овощ в хорошем смысле. Это тоже путь"],
    mid: ["Нормальный человеческий уровень. Можно даже что-то сделать","Энергии хватит на дела и на мемасики","Сегодня ты на 60% космос и на 40% диван. Баланс!","Достаточно, чтобы улыбнуться незнакомцу и не пожалеть"],
    high: ["Ты сегодня как маленькая сверхновая 💥","Космическая энергия на максимуме. Осторожно, можно зажечь всех","Буст от самих звёзд. Используй по назначению","Энергия главного героя. Сюжет уже начался"]
  },
  en: {
    low: ["Energy only enough to lie toward your dreams 🛋️","Today you're a beautiful 15% battery. Charging recommended","The cosmos whispers: «Rest. We got this»","Level: vegetable (in a good way). That's a path too"],
    mid: ["Normal human level. You can even do something","Enough energy for tasks and memes","Today you're 60% cosmos and 40% couch. Balance!","Enough to smile at a stranger and not regret it"],
    high: ["You're a tiny supernova today 💥","Cosmic energy at maximum. Careful — you might set everyone on fire","Boost straight from the stars. Use it wisely","Main character energy. The plot has already started"]
  }
};

function t(key) { return i18n[lang][key] || key; }
function getToday() { return new Date().toISOString().slice(0, 10); }

function haptic(type = 'light') {
  try {
    if (!tg?.HapticFeedback) return;
    const map = { success: () => tg.HapticFeedback.notificationOccurred('success'), error: () => tg.HapticFeedback.notificationOccurred('error'), warning: () => tg.HapticFeedback.notificationOccurred('warning'), heavy: () => tg.HapticFeedback.impactOccurred('heavy'), medium: () => tg.HapticFeedback.impactOccurred('medium'), rigid: () => tg.HapticFeedback.impactOccurred('rigid'), soft: () => tg.HapticFeedback.impactOccurred('soft'), light: () => tg.HapticFeedback.impactOccurred('light') };
    (map[type] || map.light)();
  } catch (_) {}
}

function cleanText(s) {
  if (!s) return s;
  return String(s).replace(/\*\*/g, '').replace(/__/g, '').replace(/^#+\s*/gm, '').replace(/\n{3,}/g, '\n\n').trim();
}

// ===== CloudStorage (Telegram) with localStorage fallback =====
function cloudGet(key) {
  return new Promise((resolve) => {
    if (!tg?.CloudStorage?.getItem) {
      resolve(localStorage.getItem(key));
      return;
    }
    let done = false;
    const finish = (v) => { if (!done) { done = true; resolve(v); } };
    setTimeout(() => finish(localStorage.getItem(key)), 800);
    try {
      tg.CloudStorage.getItem(key, (err, value) => finish(err ? localStorage.getItem(key) : (value ?? localStorage.getItem(key))));
    } catch (_) {
      finish(localStorage.getItem(key));
    }
  });
}
function cloudSet(key, value) {
  return new Promise((resolve) => {
    localStorage.setItem(key, value);
    if (!tg?.CloudStorage?.setItem) { resolve(); return; }
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    setTimeout(finish, 800);
    try {
      tg.CloudStorage.setItem(key, value, () => finish());
    } catch (_) { finish(); }
  });
}

async function loadProfileFromCloud() {
  const [sign, savedLang] = await Promise.all([cloudGet('cb_sign'), cloudGet('cb_lang')]);
  if (sign) userSign = sign;
  if (savedLang === 'ru' || savedLang === 'en') lang = savedLang;
}

// ===== AI with timeout =====
async function askAI(prompt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const res = await fetch(AI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt, lang }),
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error('fail');
    const data = await res.json();
    return cleanText(data.reply) || null;
  } catch (e) {
    clearTimeout(timer);
    console.error('AI error/timeout', e);
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
  if (fallbackArr?.length) {
    const fb = fallbackArr[Math.floor(Math.random() * fallbackArr.length)];
    return fb;
  }
  return t('error');
}

function setLoading(el, on = true) {
  if (!el) return;
  if (on) {
    el.innerHTML = `<div class="cosmo-loader"><div class="cosmo-orbit"></div><div class="cosmo-loader-text">${t('loading')}</div></div>`;
  }
}

// ===== Streak / Energy =====
function updateStreak() {
  const today = getToday();
  const last = localStorage.getItem('cb_last_visit');
  if (last === today) return streak;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);
  if (last === yStr) streak += 1;
  else streak = 1;
  localStorage.setItem('cb_streak', String(streak));
  localStorage.setItem('cb_last_visit', today);
  return streak;
}

function getDailyEnergy() {
  const seed = getToday().split('-').reduce((a, b) => a + parseInt(b, 10), 0);
  const n = Math.abs(Math.sin(seed * 999)) * 10000;
  return 15 + Math.floor(n % 84);
}

function energyComment(pct) {
  const bag = ENERGY_COMMENTS[lang] || ENERGY_COMMENTS.ru;
  const arr = pct < 35 ? bag.low : pct < 70 ? bag.mid : bag.high;
  return arr[Math.floor((pct + getToday().length) % arr.length)];
}

// ===== Share =====
function shareResult(text) {
  haptic('medium');
  if (tg?.openTelegramLink) {
    const url = `https://t.me/share/url?url=${encodeURIComponent(APP_LINK)}&text=${encodeURIComponent(text + '\n\n' + t('shareText'))}`;
    tg.openTelegramLink(url);
  } else if (navigator.share) {
    navigator.share({ text: text + '\n\n' + t('shareText') + '\n' + APP_LINK }).catch(() => {});
  }
}

function shareToStory(text) {
  haptic('medium');
  // Short clean caption — Telegram limit ~200, and short text is more readable
  let caption = cleanText(String(text || ''))
    .replace(/\s+/g, ' ')
    .trim();
  if (caption.length > 160) {
    caption = caption.slice(0, 157) + '...';
  }
  // Avoid empty / loading states
  if (!caption || caption.includes('Связываемся') || caption.includes('Connecting') || caption.includes('Загрузка') || caption.includes('думают')) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Сначала дождись текста ✨' : 'Wait for the text first ✨');
    return;
  }

  if (typeof tg?.shareToStory === 'function') {
    try {
      // First try with widget link
      tg.shareToStory(STORY_BG, {
        text: caption,
        widget_link: { url: APP_LINK, name: 'Cosmic Boost' }
      });
      return;
    } catch (e1) {
      console.error('shareToStory+widget failed', e1);
      try {
        // Fallback without widget
        tg.shareToStory(STORY_BG, { text: caption });
        return;
      } catch (e2) {
        console.error('shareToStory failed', e2);
      }
    }
  }

  // Not supported — explain + share to chat
  if (tg?.showPopup) {
    tg.showPopup({
      title: 'Stories',
      message: lang === 'ru'
        ? 'Stories доступны в актуальной версии Telegram. Отправляю в чат.'
        : 'Stories need a recent Telegram version. Sharing to chat instead.',
      buttons: [{ type: 'ok' }]
    });
  }
  shareResult(caption);
}

// ===== Theme =====
function applyTelegramTheme() {
  if (!tg?.themeParams) return;
  const p = tg.themeParams;
  const root = document.documentElement;
  if (p.bg_color) root.style.setProperty('--tg-bg', p.bg_color);
  if (p.text_color) root.style.setProperty('--tg-text', p.text_color);
  if (p.button_color) root.style.setProperty('--tg-button', p.button_color);
  if (p.secondary_bg_color) root.style.setProperty('--tg-secondary', p.secondary_bg_color);
  // Keep cosmic dark aesthetic as base, but soften if light theme
  const isLight = p.bg_color && parseInt(p.bg_color.replace('#','').slice(0,2), 16) > 180;
  document.body.classList.toggle('tg-light', !!isLight);
}

// ===== UI =====
function updateUI() {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  const map = {
    subtitle: 'subtitle', 'title-compliment': 'titleCompliment', 'title-horoscope': 'titleHoroscope',
    'title-lazy': 'titleLazy', 'title-stars': 'titleStars', 'title-universe': 'titleUniverse',
    'title-profile': 'titleProfile', 'title-card': 'titleCard',
    'nav-boost': 'navBoost', 'nav-lazy': 'navLazy', 'nav-stars': 'navStars',
    'nav-universe': 'navUniverse', 'nav-profile': 'navProfile',
    'btn-lazy': 'btnLazy', 'btn-card': 'btnCard', 'btn-ask': 'btnAsk',
    'modal-close-btn': 'btnClose', 'choose-sign-label': 'chooseSign', 'stars-hint': 'starsHint'
  };
  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  });
  const aiInput = document.getElementById('ai-input');
  if (aiInput) aiInput.placeholder = t('aiPlaceholder');

  const s = updateStreak();
  const streakEl = document.getElementById('streak-value');
  if (streakEl) streakEl.textContent = `${s} ${t('streakDays')}`;

  const energy = getDailyEnergy();
  document.getElementById('energy-value').textContent = energy + '%';
  document.getElementById('energy-fill').style.width = energy + '%';
  document.getElementById('energy-label').textContent = energyComment(energy);

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
  setLoading(compEl, true);
  if (!userSign) horEl.textContent = t('horoscopePlaceholder');
  else setLoading(horEl, true);

  const compPrompt = lang === 'ru'
    ? 'Напиши один короткий тёплый и смешной комплимент от вселенной. 1-2 предложения. С эмодзи. Без markdown.'
    : 'Write one short warm funny compliment from the universe. 1-2 sentences. With emoji. No markdown.';
  compEl.textContent = await getCachedOrAI('compliment', compPrompt, COMPLIMENTS[lang]);

  if (userSign) {
    const signName = ZODIAC[userSign][lang];
    const horPrompt = lang === 'ru'
      ? `Короткий весёлый гороскоп на сегодня для ${signName}. 2-3 предложения, юмор и тепло. Эмодзи. Без markdown.`
      : `Short fun horoscope for today for ${signName}. 2-3 sentences, humor and warmth. Emoji. No markdown.`;
    const fallback = (DAILY_HOROSCOPES[lang] && DAILY_HOROSCOPES[lang][userSign]) || [];
    horEl.textContent = await getCachedOrAI('horoscope', horPrompt, fallback);
  }
}

function setLang(l) {
  lang = l;
  localStorage.setItem('cb_lang', lang);
  cloudSet('cb_lang', lang);
  updateUI();
  haptic('light');
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.screen === name));
  haptic('soft');
}

function renderZodiac() {
  const grid = document.getElementById('profile-zodiac-grid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.keys(ZODIAC).forEach(key => {
    const z = ZODIAC[key];
    const item = document.createElement('div');
    item.className = 'zodiac-item' + (userSign === key ? ' selected' : '');
    item.innerHTML = `<span class="zodiac-emoji">${z.emoji}</span><span class="zodiac-name">${z[lang]}</span>`;
    item.onclick = async () => {
      userSign = key;
      localStorage.setItem('cb_sign', key);
      await cloudSet('cb_sign', key);
      localStorage.removeItem(cacheKey('horoscope'));
      haptic('medium');
      updateUI();
    };
    grid.appendChild(item);
  });
}

function renderCelebrities() {
  const list = document.getElementById('celeb-list');
  if (!list) return;
  list.innerHTML = '';
  CELEBRITIES.forEach(celeb => {
    const item = document.createElement('div');
    item.className = 'celeb-item';
    item.innerHTML = `<div class="celeb-emoji">${celeb.emoji}</div><div class="celeb-info"><div class="celeb-name">${celeb.name[lang]}</div><div class="celeb-sign">${ZODIAC[celeb.sign].emoji} ${ZODIAC[celeb.sign][lang]}</div></div>`;
    item.onclick = () => showCelebAI(celeb);
    list.appendChild(item);
  });
}

async function showCelebAI(celeb) {
  if (!userSign) {
    showModal(`<div class="result-emoji">✨</div><div class="result-title">${lang==='ru'?'Сначала выбери знак в Профиле!':'Choose sign in Profile first!'}</div>`);
    return;
  }
  showModal(`<div class="cosmo-loader"><div class="cosmo-orbit"></div><div class="cosmo-loader-text">${t('loading')}</div></div>`);
  haptic('medium');
  const mySign = ZODIAC[userSign][lang];
  const prompt = lang === 'ru'
    ? `Очень смешная тёплая совместимость: ${mySign} и ${celeb.name.ru}. 2-3 предложения + процент 55-98. Эмодзи. Без markdown.`
    : `Very funny warm compatibility: ${mySign} and ${celeb.name.en}. 2-3 sentences + percent 55-98. Emoji. No markdown.`;
  const reply = await askAI(prompt) || (celeb.funny[lang][0] || t('error'));
  document.getElementById('modal-content').innerHTML = `
    <div class="result-emoji">${celeb.emoji}</div>
    <div class="result-title">${celeb.name[lang]}</div>
    <p style="font-size:15px;line-height:1.5;margin-top:12px">${reply}</p>
    <div class="share-row mt-16">
      <button class="btn btn-secondary" onclick="shareResult(\`${String(celeb.name[lang]+': '+reply).replace(/`/g,'')}\`)">${t('btnShare')}</button>
      <button class="btn btn-story" onclick="shareToStory(\`${String(celeb.name[lang]+': '+reply).replace(/`/g,'')}\`)">📱 Stories</button>
    </div>`;
  haptic('success');
}

async function getLazy() {
  const el = document.getElementById('lazy-text');
  setLoading(el, true);
  haptic('medium');
  const prompt = lang === 'ru'
    ? 'Смешной гороскоп для ленивых — разрешение ничего не делать. 2 предложения. Тепло и юмор. Эмодзи. Без markdown.'
    : 'Funny lazy horoscope — permission to do nothing. 2 sentences. Warmth and humor. Emoji. No markdown.';
  el.textContent = await getCachedOrAI('lazy', prompt, LAZY_HOROSCOPES[lang]);
  document.getElementById('lazy-share')?.classList.remove('hidden');
  haptic('success');
}

async function drawCard() {
  const titleEl = document.getElementById('card-title');
  const textEl = document.getElementById('card-text');
  titleEl.innerHTML = `<div class="cosmo-loader cosmo-loader-sm"><div class="cosmo-orbit"></div></div>`;
  textEl.textContent = t('loadingShort');
  haptic('heavy');
  const prompt = lang === 'ru'
    ? 'Придумай весёлую карту дня. Сначала короткое название (2-4 слова), с новой строки текст 1-2 предложения. Эмодзи. Без markdown.'
    : 'Invent a fun card of the day. First short title (2-4 words), then on new line text 1-2 sentences. Emoji. No markdown.';
  const reply = await askAI(prompt);
  if (reply) {
    const parts = reply.split('\n').filter(Boolean);
    titleEl.textContent = parts[0] || 'Карта дня';
    textEl.textContent = parts.slice(1).join(' ') || reply;
  } else {
    const c = CARDS[lang][Math.floor(Math.random() * CARDS[lang].length)];
    titleEl.textContent = c.title;
    textEl.textContent = c.text;
  }
  document.getElementById('card-share')?.classList.remove('hidden');
  haptic('success');
}

function renderQuickBtns() {
  const box = document.getElementById('quick-btns');
  if (!box) return;
  const btns = lang === 'ru' ? [
    { t: '😢 Мне грустно', p: 'Мне грустно. Подбодри меня по-космически, тепло и с юмором. Без markdown.' },
    { t: '💪 Подбодри', p: 'Подбодри меня! Коротко, мощно, с юмором и эмодзи. Без markdown.' },
    { t: '🎯 Что делать?', p: 'Что мне сегодня делать? Один смешной полезный космический совет. Без markdown.' },
    { t: '✨ Дай совет', p: 'Один короткий мудрый и смешной совет от вселенной. Без markdown.' }
  ] : [
    { t: '😢 I feel sad', p: 'I feel sad. Cheer me up cosmically, warm and funny. No markdown.' },
    { t: '💪 Cheer me up', p: 'Cheer me up! Short, powerful, humor and emoji. No markdown.' },
    { t: '🎯 What to do?', p: 'What should I do today? One funny useful cosmic advice. No markdown.' },
    { t: '✨ Give advice', p: 'One short wise funny advice from the universe. No markdown.' }
  ];
  box.innerHTML = '';
  btns.forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'quick-btn';
    btn.textContent = b.t;
    btn.onclick = () => { document.getElementById('ai-input').value = b.p; askUniverse(); };
    box.appendChild(btn);
  });
}

async function askUniverse() {
  const input = document.getElementById('ai-input');
  const result = document.getElementById('ai-result');
  const msg = (input.value || '').trim();
  if (msg.length < 2) return;
  result.style.display = 'block';
  result.innerHTML = `<div class="cosmo-loader"><div class="cosmo-orbit"></div><div class="cosmo-loader-text">${t('loading')}</div></div>`;
  haptic('medium');
  const reply = await askAI(msg);
  result.innerHTML = `<div class="ai-reply">${reply || t('error')}</div>
    <div class="share-row mt-12">
      <button class="btn btn-secondary" onclick="shareResult(\`${String(reply||'').replace(/`/g,'')}\`)">${t('btnShare')}</button>
      <button class="btn btn-story" onclick="shareToStory(\`${String(reply||'').replace(/`/g,'')}\`)">📱 Stories</button>
    </div>`;
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
  try {
    tg.setHeaderColor('#0f0c29');
    tg.setBackgroundColor('#0f0c29');
  } catch (_) {}
  applyTelegramTheme();
  tg.onEvent?.('themeChanged', applyTelegramTheme);

  const user = tg.initDataUnsafe?.user;
  if (user) {
    document.getElementById('user-name').textContent = user.first_name + (user.last_name ? ' '+user.last_name : '');
    document.getElementById('user-avatar').textContent = (user.first_name?.[0] || '?').toUpperCase();
  }
  if (!localStorage.getItem('cb_lang') && user?.language_code) {
    lang = user.language_code.startsWith('ru') ? 'ru' : 'en';
  }
}

function hideSplash() {
  const s = document.getElementById('splash');
  if (!s) return;
  s.classList.add('hide');
  setTimeout(() => s.remove(), 600);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    initTelegram();
    createStars();
    // Don't block UI if cloud is slow
    const cloudPromise = loadProfileFromCloud();
    const timeout = new Promise(r => setTimeout(r, 600));
    await Promise.race([cloudPromise, timeout]);
    updateUI();
    hideSplash();
    // If cloud finishes later with a sign, refresh once
    cloudPromise.then(() => {
      if (userSign) updateUI();
    }).catch(() => {});
  } catch (e) {
    console.error(e);
    try { updateUI(); } catch (_) {}
    hideSplash();
  }
});
