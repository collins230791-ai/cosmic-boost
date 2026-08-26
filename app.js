const tg = window.Telegram?.WebApp;
const AI_URL = 'https://cosmic-boost.vercel.app/api/ai';
const REF_URL = 'https://cosmic-boost.vercel.app/api/ref';
const APP_LINK = 'https://t.me/CosmicBoostApp_bot/cosmicb';
const STORY_BG = 'https://cosmic-boost.vercel.app/story-bg.jpg';
const AI_TIMEOUT_MS = 10000;

let lang = localStorage.getItem('cb_lang') || 'ru';
let userSign = localStorage.getItem('cb_sign') || null;
let userName = localStorage.getItem('cb_name') || '';
let birthDate = localStorage.getItem('cb_birth') || '';
let streak = parseInt(localStorage.getItem('cb_streak') || '0', 10);

const i18n = {
  ru: {
    subtitle: "Твой ежедневный заряд от вселенной",
    titleCompliment: "Комплимент от вселенной",
    titleHoroscope: "Твой прогноз на сегодня",
    titleLazy: "Гороскоп для ленивых",
    titleStars: "Кто тебе важен",
    titleUniverse: "Спросить вселенную",
    titleProfile: "Профиль",
    titleCard: "Карта дня",
    titleStreak: "Серия дней",
    navBoost: "Буст", navLazy: "Ленивый", navStars: "Связь", navUniverse: "Вселенная", navProfile: "Профиль",
    btnLazy: "Получить разрешение", btnCard: "Открыть карту", btnAsk: "Спросить ✨", btnClose: "Закрыть", btnShare: "Поделиться", btnStory: "В Stories",
    chooseSign: "Твой знак зодиака:", signNotSelected: "Знак не выбран", guest: "Гость",
    starsHint: "Имя и дата — где срастаетесь и где трёт", cardPlaceholder: "Нажми, чтобы открыть",
    horoscopePlaceholder: "Выбери знак в Профиле ✨",
    aiPlaceholder: "Напиши что угодно вселенной...",
    loading: "Связываемся с космосом...",
    loadingShort: "Звёзды думают...",
    error: "Звёзды сейчас вне зоны доступа. Попробуй чуть позже ✨",
    streakDays: "дней подряд",
    shareText: "Смотри, что мне сказала вселенная ✨\n\nCosmic Boost — t.me/CosmicBoostApp_bot/cosmicb"
  },
  en: {
    subtitle: "Your daily charge from the universe",
    titleCompliment: "Compliment from the Universe",
    titleHoroscope: "Your forecast for today",
    titleLazy: "Lazy Horoscope",
    titleStars: "Who matters to you",
    titleUniverse: "Ask the Universe",
    titleProfile: "Profile",
    titleCard: "Card of the Day",
    titleStreak: "Day streak",
    navBoost: "Boost", navLazy: "Lazy", navStars: "Bond", navUniverse: "Universe", navProfile: "Profile",
    btnLazy: "Get permission", btnCard: "Draw a card", btnAsk: "Ask ✨", btnClose: "Close", btnShare: "Share", btnStory: "To Stories",
    chooseSign: "Your zodiac sign:", signNotSelected: "Sign not selected", guest: "Guest",
    starsHint: "Name and birth date — where you fuse and where it rubs", cardPlaceholder: "Press to open",
    horoscopePlaceholder: "Choose your sign in Profile ✨",
    aiPlaceholder: "Write anything to the universe...",
    loading: "Connecting to the cosmos...",
    loadingShort: "Stars are thinking...",
    error: "Stars are currently out of range. Try a bit later ✨",
    streakDays: "days in a row",
    shareText: "Look what the universe told me ✨\n\nCosmic Boost — t.me/CosmicBoostApp_bot/cosmicb"
  }
};

const ENERGY_COMMENTS = {
  ru: {
    low: [
      "Энергии хватит только лежать в направлении мечты 🛋️",
      "Сегодня ты — красивая батарея на {n}%. Зарядка рекомендована",
      "Космос шепчет: «Отдыхай. Мы прикроем»",
      "Уровень: овощ в хорошем смысле. Это тоже путь"
    ],
    mid: [
      "Нормальный человеческий уровень — {n}%. Можно даже что-то сделать",
      "Энергии хватит на дела и на мемасики",
      "Сегодня ты на {n}% космос. Остальное — диван. Баланс!",
      "Достаточно, чтобы улыбнуться незнакомцу и не пожалеть"
    ],
    high: [
      "Ты сегодня как маленькая сверхновая — {n}% 💥",
      "Космическая энергия на {n}%. Осторожно, можно зажечь всех",
      "Буст от самих звёзд. Используй по назначению",
      "Энергия главного героя ({n}%). Сюжет уже начался"
    ]
  },
  en: {
    low: [
      "Energy only enough to lie toward your dreams 🛋️",
      "Today you're a beautiful {n}% battery. Charging recommended",
      "The cosmos whispers: «Rest. We got this»",
      "Level: vegetable (in a good way). That's a path too"
    ],
    mid: [
      "Normal human level — {n}%. You can even do something",
      "Enough energy for tasks and memes",
      "Today you're {n}% cosmos. The rest is couch. Balance!",
      "Enough to smile at a stranger and not regret it"
    ],
    high: [
      "You're a tiny supernova — {n}% 💥",
      "Cosmic energy at {n}%. Careful — you might set everyone on fire",
      "Boost straight from the stars. Use it wisely",
      "Main character energy ({n}%). The plot has already started"
    ]
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

function toBase64Url(str) {
  try {
    const bytes = new TextEncoder().encode(String(str || ''));
    let binary = '';
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
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
  const [sign, savedLang, name, birth] = await Promise.all([
    cloudGet('cb_sign'),
    cloudGet('cb_lang'),
    cloudGet('cb_name'),
    cloudGet('cb_birth')
  ]);
  if (sign) userSign = sign;
  if (savedLang === 'ru' || savedLang === 'en') lang = savedLang;
  if (name) userName = name;
  if (birth) birthDate = birth;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function initDataPayload(extra) {
  return Object.assign({ initData: tg?.initData || '' }, extra || {});
}

// ===== AI with timeout =====
async function askAI(prompt, kind) {
  if (!tg?.initData) {
    console.warn('AI skipped: no initData');
    return null;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const res = await fetch(AI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initDataPayload({ message: prompt, lang, kind: kind || 'ai' })),
      signal: controller.signal
    });
    clearTimeout(timer);
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) return null;
    if (res.status === 402) return null;
    if (!res.ok) throw new Error(data.error || 'fail');
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

async function getCachedOrAI(name, prompt, fallbackArr, opts = {}) {
  const key = cacheKey(name);
  const cached = localStorage.getItem(key);
  if (cached) return cached;
  // New generation costs energy (unless free)
  if (!opts.free) {
    if (!spendEnergy(opts.cost || ENERGY_COST)) {
      if (fallbackArr?.length) return fallbackArr[Math.floor(Math.random() * fallbackArr.length)];
      return lang === 'ru'
        ? 'Не хватает энергии для связи с космосом. Завтра будет полный заряд ✨'
        : 'Not enough energy to reach the cosmos. Full charge tomorrow ✨';
    }
  }
  const reply = await askAI(prompt);
  if (reply) {
    localStorage.setItem(key, reply);
    return reply;
  }
  // refund half on failure? skip for simplicity
  if (fallbackArr?.length) {
    return fallbackArr[Math.floor(Math.random() * fallbackArr.length)];
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


const STREAK_MILESTONES = [3, 7, 14];
const COLLECTION_GOAL = 7;

function loadCollection() {
  try {
    return JSON.parse(localStorage.getItem('cb_collection') || '[]');
  } catch {
    return [];
  }
}

function saveCollection(arr) {
  localStorage.setItem('cb_collection', JSON.stringify(arr.slice(0, 30)));
}

function addToCollection(title, text) {
  const today = getToday();
  let col = loadCollection();
  // one card per day
  if (col.some(c => c.date === today)) {
    col = col.map(c => c.date === today ? { date: today, title, text } : c);
  } else {
    col.unshift({ date: today, title, text });
  }
  saveCollection(col);
  return col;
}

function loadBadges() {
  try {
    return JSON.parse(localStorage.getItem('cb_badges') || '[]');
  } catch {
    return [];
  }
}

function unlockBadge(id, label) {
  const badges = loadBadges();
  if (badges.some(b => b.id === id)) return false;
  badges.push({ id, label, at: getToday() });
  localStorage.setItem('cb_badges', JSON.stringify(badges));
  return true;
}

function checkStreakRewards(s) {
  const rewards = [];
  if (s >= 3 && unlockBadge('streak3', lang === 'ru' ? '🔥 3 дня' : '🔥 3 days')) {
    rewards.push(lang === 'ru' ? 'Бейдж «3 дня подряд»!' : 'Badge «3-day streak»!');
  }
  if (s >= 7 && unlockBadge('streak7', lang === 'ru' ? '⚡ 7 дней' : '⚡ 7 days')) {
    rewards.push(lang === 'ru' ? 'Бейдж «Неделя с вселенной»!' : 'Badge «Week with the universe»!');
  }
  if (s >= 14 && unlockBadge('streak14', lang === 'ru' ? '🌌 14 дней' : '🌌 14 days')) {
    rewards.push(lang === 'ru' ? 'Бейдж «Космический марафон»!' : 'Badge «Cosmic marathon»!');
  }
  return rewards;
}

function renderStreakUI(s) {
  const box = document.getElementById('streak-milestones');
  if (box) {
    box.innerHTML = STREAK_MILESTONES.map(m =>
      `<span class="milestone ${s >= m ? 'done' : ''}">${m}d</span>`
    ).join('');
  }
  const rewardEl = document.getElementById('streak-reward');
  if (rewardEl) {
    const rewards = checkStreakRewards(s);
    if (rewards.length) {
      rewardEl.style.display = 'block';
      rewardEl.textContent = rewards.join(' ');
    } else if (s > 0 && s < 3) {
      rewardEl.style.display = 'block';
      rewardEl.textContent = lang === 'ru'
        ? `Ещё ${3 - s} дн. до первого бейджа`
        : `${3 - s} day(s) to first badge`;
    } else if (s >= 3 && s < 7) {
      rewardEl.style.display = 'block';
      rewardEl.textContent = lang === 'ru'
        ? `Ещё ${7 - s} дн. до недельного бейджа`
        : `${7 - s} day(s) to weekly badge`;
    } else if (s >= 7 && s < 14) {
      rewardEl.style.display = 'block';
      rewardEl.textContent = lang === 'ru'
        ? `Ещё ${14 - s} дн. до космического марафона`
        : `${14 - s} day(s) to cosmic marathon`;
    } else {
      rewardEl.style.display = 'none';
    }
  }
}

function renderCollection() {
  const col = loadCollection();
  const countEl = document.getElementById('collection-count');
  const fillEl = document.getElementById('collection-fill');
  const grid = document.getElementById('collection-grid');
  const badgeRow = document.getElementById('badge-row');
  const n = col.length;
  const goal = COLLECTION_GOAL;
  if (countEl) countEl.textContent = `${Math.min(n, goal)} / ${goal}` + (n > goal ? ` (+${n - goal})` : '');
  if (fillEl) fillEl.style.width = Math.min(100, (n / goal) * 100) + '%';

  if (n >= goal) {
    unlockBadge('collector7', lang === 'ru' ? '🃏 Коллекционер' : '🃏 Collector');
  }

  if (grid) {
    if (!n) {
      grid.innerHTML = `<div class="collection-empty">${lang === 'ru' ? 'Пока пусто — открой карту дня' : 'Empty — draw a card of the day'}</div>`;
    } else {
      grid.innerHTML = col.slice(0, 14).map(c => `
        <div class="collection-item">
          <div class="ci-title">${c.title || 'Карта'}</div>
          <div>${(c.text || '').slice(0, 80)}${(c.text || '').length > 80 ? '…' : ''}</div>
          <div class="ci-date">${c.date || ''}</div>
        </div>
      `).join('');
    }
  }

  if (badgeRow) {
    const badges = loadBadges();
    badgeRow.innerHTML = badges.length
      ? badges.map(b => `<span class="badge">${b.label}</span>`).join('')
      : '';
  }
}


const ENERGY_COST = 18; // % per AI action
const ENERGY_MAX = 100;
const ENERGY_START = 100;

function energyStorageKey() {
  return 'cb_energy_' + getToday();
}

function getEnergy() {
  const key = energyStorageKey();
  const raw = localStorage.getItem(key);
  if (raw === null || raw === undefined) {
    // new day — full charge
    localStorage.setItem(key, String(ENERGY_START));
    return ENERGY_START;
  }
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? Math.max(0, Math.min(ENERGY_MAX, n)) : ENERGY_START;
}

function setEnergy(n) {
  const v = Math.max(0, Math.min(ENERGY_MAX, Math.round(n)));
  localStorage.setItem(energyStorageKey(), String(v));
  return v;
}

function energyComment(pct) {
  const bag = ENERGY_COMMENTS[lang] || ENERGY_COMMENTS.ru;
  const arr = pct < 35 ? bag.low : pct < 70 ? bag.mid : bag.high;
  const raw = arr[Math.floor((pct + getToday().length) % arr.length)];
  return String(raw).replace(/\{n\}/g, String(pct));
}

function refreshEnergyUI() {
  const energy = getEnergy();
  const val = document.getElementById('energy-value');
  const fill = document.getElementById('energy-fill');
  const label = document.getElementById('energy-label');
  if (val) val.textContent = energy + '%';
  if (fill) fill.style.width = energy + '%';
  if (label) label.textContent = energyComment(energy);
  return energy;
}

/** Returns true if spent successfully, false if not enough */
function hasUnlimitedPass() {
  return Date.now() < (Number(localStorage.getItem('cb_pass_until')) || 0);
}

function extraCardsLeft() {
  return Math.max(0, Number(localStorage.getItem('cb_extra_cards')) || 0);
}

function consumeExtraCard() {
  const n = extraCardsLeft();
  if (n < 1) return false;
  localStorage.setItem('cb_extra_cards', String(n - 1));
  return true;
}

function spendEnergy(cost = ENERGY_COST) {
  if (hasUnlimitedPass()) {
    refreshEnergyUI();
    return true;
  }
  const cur = getEnergy();
  if (cur < cost) {
    haptic('error');
    const msg = lang === 'ru'
      ? `Мало космической энергии (${cur}%). Завтра будет 100%, либо дозаряд за Stars в профиле ✨`
      : `Low cosmic energy (${cur}%). Full charge tomorrow, or refill with Stars in Profile ✨`;
    if (tg?.showPopup) {
      tg.showPopup({
        title: lang === 'ru' ? 'Энергия' : 'Energy',
        message: msg,
        buttons: [
          { id: 'shop', type: 'default', text: lang === 'ru' ? 'В магазин ⭐' : 'Shop ⭐' },
          { type: 'ok' }
        ]
      }, (id) => { if (id === 'shop') showScreen('profile'); });
    } else if (tg?.showAlert) tg.showAlert(msg);
    else alert(msg);
    return false;
  }
  setEnergy(cur - cost);
  refreshEnergyUI();
  renderRefLink();
  renderShopStatus();
  haptic('medium');
  return true;
}


const QUEST_TYPES = [
  { id: 'card', icon: '🃏', ru: 'Открой карту дня', en: 'Draw the card of the day', screen: 'profile', action: 'card' },
  { id: 'universe', icon: '🌌', ru: 'Спроси вселенную', en: 'Ask the universe', screen: 'universe', action: 'universe' },
  { id: 'lazy', icon: '😴', ru: 'Возьми разрешение ничего не делать', en: 'Get permission to do nothing', screen: 'lazy', action: 'lazy' },
  { id: 'stars', icon: '🌟', ru: 'Разбери связь с тем, кто важен', en: 'Read the bond with someone who matters', screen: 'stars', action: 'stars' },
];

function questKey() {
  return 'cb_quest_' + getToday();
}

function getTodayQuest() {
  const key = questKey();
  let raw = localStorage.getItem(key);
  if (raw) {
    try { return JSON.parse(raw); } catch (_) {}
  }
  // pick by day seed
  const seed = getToday().split('-').reduce((a, b) => a + parseInt(b, 10), 0);
  const q = QUEST_TYPES[seed % QUEST_TYPES.length];
  const data = { id: q.id, done: false };
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

function setQuestDone() {
  const data = getTodayQuest();
  if (data.done) return false;
  data.done = true;
  localStorage.setItem(questKey(), JSON.stringify(data));
  // reward: +12% energy (cap 100)
  const cur = getEnergy();
  setEnergy(Math.min(100, cur + 12));
  refreshEnergyUI();
  unlockBadge('quest_' + getToday().slice(5), lang === 'ru' ? '✅ Задание дня' : '✅ Daily quest');
  return true;
}

function renderDailyQuest() {
  const card = document.getElementById('daily-quest');
  if (!card) return;
  const data = getTodayQuest();
  const meta = QUEST_TYPES.find(q => q.id === data.id) || QUEST_TYPES[0];
  const icon = document.getElementById('quest-icon');
  const label = document.getElementById('quest-label');
  const title = document.getElementById('quest-title');
  const status = document.getElementById('quest-status');
  const btn = document.getElementById('quest-btn');

  if (icon) icon.textContent = meta.icon;
  if (label) label.textContent = lang === 'ru' ? 'Задание дня' : 'Daily quest';
  if (title) title.textContent = lang === 'ru' ? meta.ru : meta.en;

  if (data.done) {
    card.classList.add('done');
    if (status) status.textContent = lang === 'ru' ? 'Выполнено · +12% энергии' : 'Done · +12% energy';
    if (btn) {
      btn.textContent = lang === 'ru' ? 'Готово ✓' : 'Done ✓';
      btn.disabled = true;
      btn.style.opacity = '0.6';
    }
  } else {
    card.classList.remove('done');
    if (status) status.textContent = lang === 'ru' ? 'Награда: +12% энергии' : 'Reward: +12% energy';
    if (btn) {
      btn.textContent = lang === 'ru' ? 'Выполнить' : 'Do it';
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  }
}

function doDailyQuest() {
  const data = getTodayQuest();
  if (data.done) return;
  const meta = QUEST_TYPES.find(q => q.id === data.id) || QUEST_TYPES[0];
  haptic('medium');
  showScreen(meta.screen);
  // gentle hint
  if (meta.action === 'card') {
    setTimeout(() => {
      if (tg?.showPopup) tg.showPopup({ message: lang === 'ru' ? 'Открой карту дня ниже 🃏' : 'Draw the card below 🃏', buttons: [{ type: 'ok' }] });
    }, 400);
  } else if (meta.action === 'universe') {
    setTimeout(() => {
      if (tg?.showPopup) tg.showPopup({ message: lang === 'ru' ? 'Задай любой вопрос вселенной 🌌' : 'Ask the universe anything 🌌', buttons: [{ type: 'ok' }] });
    }, 400);
  } else if (meta.action === 'lazy') {
    setTimeout(() => {
      if (tg?.showPopup) tg.showPopup({ message: lang === 'ru' ? 'Нажми «Получить разрешение» 😴' : 'Tap “Get permission” 😴', buttons: [{ type: 'ok' }] });
    }, 400);
  } else if (meta.action === 'stars') {
    setTimeout(() => {
      if (tg?.showPopup) tg.showPopup({ message: lang === 'ru' ? 'Введи имя и дату того, кто важен 🌟' : 'Enter the name and date of someone who matters 🌟', buttons: [{ type: 'ok' }] });
    }, 400);
  }
}

function tryCompleteQuest(actionId) {
  const data = getTodayQuest();
  if (data.done || data.id !== actionId) return;
  if (setQuestDone()) {
    renderDailyQuest();
  renderSynastryYou();
  fetchDailyCount();
    haptic('success');
    if (tg?.showPopup) {
      tg.showPopup({
        title: lang === 'ru' ? 'Задание дня' : 'Daily quest',
        message: lang === 'ru' ? 'Готово! +12% космической энергии ✨' : 'Done! +12% cosmic energy ✨',
        buttons: [{ type: 'ok' }]
      });
    }
  }
}


function getDailyEnergy() {
  return getEnergy();
}

// ===== Share =====
function myRefLink() {
  const id = tg?.initDataUnsafe?.user?.id;
  if (!id) return APP_LINK;
  return APP_LINK + '?startapp=ref' + id;
}

async function cacheSharePayload(text, type) {
  try {
    const r = await fetch('https://cosmic-boost.vercel.app/api/share-cache', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        type: type || 'boost',
        name: userName || '',
        lang,
        fromId: tg?.initDataUnsafe?.user?.id || ''
      })
    });
    const data = await r.json();
    return data?.id || '';
  } catch {
    return '';
  }
}

function fallbackShareLink(text) {
  const link = myRefLink();
  if (tg?.openTelegramLink) {
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text + '\n\n' + t('shareText'))}`;
    tg.openTelegramLink(url);
  } else if (navigator.share) {
    navigator.share({ text: text + '\n\n' + t('shareText') + '\n' + link }).catch(() => {});
  }
}

async function shareResult(text, type) {
  haptic('medium');
  const id = await cacheSharePayload(text, type);
  const q = id ? ('cb' + id) : '';
  try {
    if (typeof tg?.switchInlineQueryChosenChat === 'function') {
      tg.switchInlineQueryChosenChat(q, {
        allow_user_chats: true,
        allow_bot_chats: true,
        allow_group_chats: true,
        allow_channel_chats: true
      });
      return;
    }
    if (typeof tg?.switchInlineQuery === 'function') {
      tg.switchInlineQuery(q);
      return;
    }
  } catch (e) {
    console.error('inline share', e);
  }
  fallbackShareLink(text);
}


function shareCardUrl(text, type) {
  const params = new URLSearchParams();
  params.set('t', toBase64Url(text));
  params.set('type', type || 'boost');
  params.set('lang', lang === 'en' ? 'en' : 'ru');
  if (userName) params.set('n', toBase64Url(userName));
  return 'https://cosmic-boost.vercel.app/story-card.png?' + params.toString();
}

function shareSmart(text, type) {
  haptic('medium');
  const body = cleanText(String(text || '')).trim();
  const kind = type || 'boost';
  if (!body || /Связываемся|Connecting|Загрузка|думают|Loading/i.test(body)) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Сначала дождись текста ✨' : 'Wait for the text first ✨');
    return;
  }

  // If Stories available — ask user
  if (typeof tg?.shareToStory === 'function' && tg?.showPopup) {
    tg.showPopup({
      title: lang === 'ru' ? 'Поделиться' : 'Share',
      message: lang === 'ru' ? 'Куда отправить?' : 'Where to share?',
      buttons: [
        { id: 'story', type: 'default', text: lang === 'ru' ? '📱 Stories' : '📱 Stories' },
        { id: 'chat', type: 'default', text: lang === 'ru' ? 'В чат' : 'To chat' },
        { type: 'cancel' }
      ]
    }, (id) => {
      if (id === 'story') shareToStory(body, kind);
      else if (id === 'chat') shareResult(body, kind);
    });
    return;
  }
  shareResult(body, kind);
}

function shareToStory(text, type) {
  haptic('medium');
  let caption = cleanText(String(text || '')).replace(/\s+/g, ' ').trim();
  if (caption.length > 200) caption = caption.slice(0, 197) + '...';

  if (!caption || /Связываемся|Connecting|Загрузка|думают|Loading/i.test(caption)) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Сначала дождись текста ✨' : 'Wait for the text first ✨');
    return;
  }

  const mediaUrl = shareCardUrl(caption, type);

  if (typeof tg?.shareToStory === 'function') {
    const opts = {};
    if (tg?.initDataUnsafe?.user?.is_premium) {
      opts.widget_link = { url: APP_LINK, name: 'Cosmic Boost' };
    }
    try {
      if (opts.widget_link) tg.shareToStory(mediaUrl, opts);
      else tg.shareToStory(mediaUrl);
      return;
    } catch (e1) {
      console.error('shareToStory failed', e1);
    }
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




function lifePathNumber(iso) {
  if (!iso) return null;
  const digits = iso.replace(/\D/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

async function getNumerology() {
  const el = document.getElementById('numerology-text');
  if (!birthDate) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Сначала сохрани дату рождения' : 'Save birth date first');
    return;
  }
  if (!spendEnergy()) return;
  setLoading(el, true);
  haptic('medium');
  const num = lifePathNumber(birthDate);
  const n = nameForAI();
  const prompt = lang === 'ru'
    ? `Человека зовут ${n}, дата рождения ${birthDate}, число судьбы (life path) = ${num}. Напиши короткое тёплое и слегка смешное описание этого числа судьбы лично для ${n}: сильные стороны, на что обратить внимание, один мини-совет на сегодня. 3-4 предложения. Эмодзи. Без markdown. Не будь эзотерическим гуру — вайб Cosmic Boost.`
    : `Person is named ${n}, birth date ${birthDate}, life path number = ${num}. Write a short warm slightly funny description of this life path for ${n}: strengths, what to watch, one mini tip for today. 3-4 sentences. Emoji. No markdown. Not guru-style — Cosmic Boost vibe.`;
  const reply = await askAI(prompt);
  const header = lang === 'ru' ? `Число судьбы: ${num}\n\n` : `Life path: ${num}\n\n`;
  el.textContent = reply ? (header + reply) : (lang === 'ru' ? `Число судьбы: ${num}. Звёзды пока молчат ✨` : `Life path: ${num}. Stars are quiet ✨`);
  document.getElementById('numerology-share')?.classList.remove('hidden');
  haptic(reply ? 'success' : 'error');
}

async function saveBirthDate() {
  const el = document.getElementById('birth-date');
  const v = el?.value || '';
  if (!v) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Выбери дату' : 'Pick a date');
    return;
  }
  birthDate = v;
  localStorage.setItem('cb_birth', birthDate);
  await cloudSet('cb_birth', birthDate);
  // auto-set zodiac from date if possible
  const sign = signFromDate(birthDate);
  if (sign) {
    userSign = sign;
    localStorage.setItem('cb_sign', sign);
    await cloudSet('cb_sign', sign);
    localStorage.removeItem(cacheKey('horoscope'));
  }
  haptic('success');
  updateUI();
  if (tg?.showPopup) tg.showPopup({ message: lang === 'ru' ? 'Дата сохранена ✨' : 'Date saved ✨', buttons: [{ type: 'ok' }] });
}

function signFromDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const md = m * 100 + d;
  if (md >= 321 && md <= 419) return 'aries';
  if (md >= 420 && md <= 520) return 'taurus';
  if (md >= 521 && md <= 620) return 'gemini';
  if (md >= 621 && md <= 722) return 'cancer';
  if (md >= 723 && md <= 822) return 'leo';
  if (md >= 823 && md <= 922) return 'virgo';
  if (md >= 923 && md <= 1022) return 'libra';
  if (md >= 1023 && md <= 1121) return 'scorpio';
  if (md >= 1122 && md <= 1221) return 'sagittarius';
  if (md >= 1222 || md <= 119) return 'capricorn';
  if (md >= 120 && md <= 218) return 'aquarius';
  if (md >= 219 && md <= 320) return 'pisces';
  return null;
}

async function getRelocate() {
  const el = document.getElementById('relocate-text');
  if (!spendEnergy()) return;
  setLoading(el, true);
  haptic('medium');
  const n = nameForAI();
  const signPart = userSign && ZODIAC[userSign] ? ZODIAC[userSign][lang] : '';
  const birthPart = birthDate || (lang === 'ru' ? 'дата неизвестна' : 'unknown date');
  const prompt = lang === 'ru'
    ? `Ты весёлый космический гид. Человека зовут ${n}, знак ${signPart || 'не указан'}, дата рождения ${birthPart}. Напиши шутливую но тёплую рекомендацию: в какую страну или город ему/ей «по звёздам» переехать и почему. 3-4 предложения. 1-2 варианта мест. С эмодзи. Без markdown. Не будь серьёзным астрологом — это для настроения.`
    : `You are a fun cosmic guide. Person is named ${n}, sign ${signPart || 'unknown'}, birth date ${birthPart}. Write a warm funny recommendation: which country or city they should "move to by the stars" and why. 3-4 sentences. 1-2 place options. Emoji. No markdown. Not serious astrology — for mood.`;
  const reply = await askAI(prompt);
  el.textContent = reply || (lang === 'ru' ? 'Звёзды пока молчат про переезд ✨' : 'Stars are silent about moving ✨');
  document.getElementById('relocate-share')?.classList.remove('hidden');
  haptic(reply ? 'success' : 'error');
}

function maybeOnboard() {
  if (!userName) openNameModal();
  else if (!birthDate) openBirthModal();
}

function openNameModal() {
  const modal = document.getElementById('name-modal');
  const input = document.getElementById('name-input');
  const title = document.getElementById('name-modal-title');
  const sub = document.getElementById('name-modal-sub');
  const btn = document.getElementById('name-save-btn');
  if (title) title.textContent = lang === 'ru' ? 'Как тебя зовут?' : 'What is your name?';
  if (sub) sub.textContent = lang === 'ru'
    ? 'Вселенная хочет обращаться к тебе по имени'
    : 'The universe wants to call you by name';
  if (btn) btn.textContent = lang === 'ru' ? 'Поехали 🚀' : "Let's go 🚀";
  if (input) {
    input.placeholder = lang === 'ru' ? 'Твоё имя' : 'Your name';
    input.value = userName || '';
  }
  modal?.classList.add('active');
  setTimeout(() => input?.focus(), 200);
}

async function saveName() {
  const input = document.getElementById('name-input');
  const raw = (input?.value || '').trim();
  if (raw.length < 1) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Введи имя ✨' : 'Enter a name ✨');
    return;
  }
  userName = raw.slice(0, 24);
  localStorage.setItem('cb_name', userName);
  await cloudSet('cb_name', userName);
  document.getElementById('name-modal')?.classList.remove('active');
  haptic('success');
  updateUI();
  trackVisit();
  // Next step: birth date
  if (!birthDate) {
    setTimeout(openBirthModal, 300);
  }
}

function openBirthModal() {
  const modal = document.getElementById('birth-modal');
  const input = document.getElementById('birth-modal-input');
  const title = document.getElementById('birth-modal-title');
  const sub = document.getElementById('birth-modal-sub');
  const btn = document.getElementById('birth-save-btn');
  if (title) title.textContent = lang === 'ru' ? 'Когда ты родился(ась)?' : 'When were you born?';
  if (sub) sub.textContent = lang === 'ru'
    ? 'Для знака, числа судьбы и космических советов'
    : 'For your sign, life path and cosmic tips';
  if (btn) btn.textContent = lang === 'ru' ? 'Дальше ✨' : 'Next ✨';
  if (input) input.value = birthDate || '';
  modal?.classList.add('active');
}

async function saveBirthFromModal() {
  const input = document.getElementById('birth-modal-input');
  const v = input?.value || '';
  if (!v) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Выбери дату' : 'Pick a date');
    return;
  }
  birthDate = v;
  localStorage.setItem('cb_birth', birthDate);
  await cloudSet('cb_birth', birthDate);
  const sign = signFromDate(birthDate);
  if (sign) {
    userSign = sign;
    localStorage.setItem('cb_sign', sign);
    await cloudSet('cb_sign', sign);
    localStorage.removeItem(cacheKey('horoscope'));
  }
  document.getElementById('birth-modal')?.classList.remove('active');
  haptic('success');
  updateUI();
  // Auto-load numerology text hint
  const numEl = document.getElementById('numerology-text');
  if (numEl && birthDate) {
    numEl.textContent = lang === 'ru'
      ? 'Дата сохранена. Нажми «Рассчитать» — или зайди в Профиль'
      : 'Date saved. Tap Calculate — or open Profile';
  }
}

function displayName() {
  return userName || (lang === 'ru' ? 'Гость' : 'Guest');
}

function nameForAI() {
  return userName ? userName : (lang === 'ru' ? 'друг' : 'friend');
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
  renderStreakUI(s);
  renderCollection();
  renderDailyQuest();
  renderSynastryYou();
  fetchDailyCount();

  const titleCol = document.getElementById('title-collection');
  if (titleCol) titleCol.textContent = lang === 'ru' ? 'Коллекция карт' : 'Card collection';
  const colHint = document.getElementById('collection-hint');
  if (colHint) colHint.textContent = lang === 'ru' ? 'Собери 7 карт — получи бейдж' : 'Collect 7 cards — get a badge';

  refreshEnergyUI();

  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.textContent = displayName();

  if (userSign && ZODIAC[userSign]) {
    document.getElementById('user-sign').textContent = ZODIAC[userSign].emoji + ' ' + ZODIAC[userSign][lang];
  } else {
    document.getElementById('user-sign').textContent = t('signNotSelected');
  }

  const birthEl = document.getElementById('birth-date');
  if (birthEl && birthDate) birthEl.value = birthDate;
  const birthLabel = document.getElementById('birth-label');
  if (birthLabel) birthLabel.textContent = lang === 'ru' ? 'Дата рождения:' : 'Birth date:';
  const btnBirth = document.getElementById('btn-save-birth');
  if (btnBirth) btnBirth.textContent = lang === 'ru' ? 'Сохранить дату' : 'Save date';
  const titleNum = document.getElementById('title-numerology');
  if (titleNum) titleNum.textContent = lang === 'ru' ? 'Число судьбы' : 'Life path number';
  const numHint = document.getElementById('numerology-hint');
  if (numHint) numHint.textContent = lang === 'ru' ? 'По дате рождения — коротко и с вайбом' : 'From birth date — short and fun';
  const btnNum = document.getElementById('btn-numerology');
  if (btnNum) btnNum.textContent = lang === 'ru' ? 'Рассчитать ✨' : 'Calculate ✨';
  const numText = document.getElementById('numerology-text');
  if (numText && !birthDate) numText.textContent = lang === 'ru' ? 'Сохрани дату рождения выше' : 'Save your birth date above';

  const titleRel = document.getElementById('title-relocate');
  if (titleRel) titleRel.textContent = lang === 'ru' ? 'Куда тебе переехать' : 'Where should you move';
  const relHint = document.getElementById('relocate-hint');
  if (relHint) relHint.textContent = lang === 'ru' ? 'По дате рождения и вайбу — с юмором' : 'By birth date and vibe — with humor';
  const btnRel = document.getElementById('btn-relocate');
  if (btnRel) btnRel.textContent = lang === 'ru' ? 'Узнать 🌍' : 'Find out 🌍';

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

  const n = nameForAI();
  const compKey = cacheKey('compliment');
  const horKey = cacheKey('horoscope');
  const hasComp = !!localStorage.getItem(compKey);
  const hasHor = !userSign || !!localStorage.getItem(horKey);

  // One energy charge for today's boost pack if anything needs AI
  if ((!hasComp || !hasHor) && !spendEnergy(20)) {
    compEl.textContent = hasComp
      ? localStorage.getItem(compKey)
      : (lang === 'ru' ? 'Не хватает энергии на комплимент. Завтра будет полный заряд ✨' : 'Not enough energy for a compliment. Full charge tomorrow ✨');
    if (userSign) {
      horEl.textContent = hasHor
        ? localStorage.getItem(horKey)
        : (lang === 'ru' ? 'Не хватает энергии на прогноз ✨' : 'Not enough energy for a forecast ✨');
    }
    return;
  }

  const compPrompt = lang === 'ru'
    ? `Напиши один короткий тёплый и смешной комплимент от вселенной для человека по имени ${n}. Обратись по имени. 1-2 предложения. С эмодзи. Без markdown.`
    : `Write one short warm funny compliment from the universe for a person named ${n}. Address them by name. 1-2 sentences. With emoji. No markdown.`;
  compEl.textContent = await getCachedOrAI('compliment', compPrompt, COMPLIMENTS[lang], { free: true });

  if (userSign) {
    const signName = ZODIAC[userSign][lang];
    const horPrompt = lang === 'ru'
      ? `Короткий весёлый гороскоп на сегодня для ${signName}, обратись к человеку по имени ${n}. 2-3 предложения, юмор и тепло. Эмодзи. Без markdown.`
      : `Short fun horoscope for today for ${signName}, address the person as ${n}. 2-3 sentences, humor and warmth. Emoji. No markdown.`;
    const fallback = (DAILY_HOROSCOPES[lang] && DAILY_HOROSCOPES[lang][userSign]) || [];
    horEl.textContent = await getCachedOrAI('horoscope', horPrompt, fallback, { free: true });
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
  if (!list || list.dataset.locked === '1') return;
}

async function searchFamous() {
  const q = (document.getElementById('celeb-query')?.value || '').trim();
  const list = document.getElementById('celeb-list');
  if (!list) return;
  if (q.length < 2) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Напиши имя или псевдоним' : 'Type a name or alias');
    return;
  }
  list.dataset.locked = '1';
  list.innerHTML = `<div class="text-soft" style="font-size:13px">${t('loadingShort')}</div>`;
  haptic('medium');
  try {
    const r = await fetch('https://cosmic-boost.vercel.app/api/person', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, lang })
    });
    const data = await r.json();
    const items = data.items || [];
    if (!items.length) {
      list.innerHTML = `<div class="text-soft" style="font-size:13px">${lang === 'ru' ? 'Не нашли дату рождения. Попробуй полное имя.' : 'No birth date found. Try the full name.'}</div>`;
      return;
    }
    list.innerHTML = '';
    items.forEach((person) => {
      const sign = signFromDate(person.birth);
      const signLabel = sign && ZODIAC[sign] ? (ZODIAC[sign].emoji + ' ' + ZODIAC[sign][lang]) : '';
      const item = document.createElement('div');
      item.className = 'celeb-item';
      item.innerHTML = `<div class="celeb-emoji">✦</div><div class="celeb-info"><div class="celeb-name"></div><div class="celeb-sign"></div></div>`;
      item.querySelector('.celeb-name').textContent = person.name;
      item.querySelector('.celeb-sign').textContent = `${person.birth}${signLabel ? ' · ' + signLabel : ''}${person.desc ? ' · ' + person.desc : ''}`;
      item.onclick = () => pickFamous(person);
      list.appendChild(item);
    });
  } catch (e) {
    console.error(e);
    list.innerHTML = `<div class="text-soft" style="font-size:13px">${t('error')}</div>`;
  }
}

function pickFamous(person) {
  const nameEl = document.getElementById('other-name');
  const birthEl = document.getElementById('other-birth');
  if (nameEl) nameEl.value = String(person.name || '').slice(0, 24);
  if (birthEl) birthEl.value = person.birth;
  const crush = document.querySelector('.rel-chip[data-rel="crush"]');
  if (crush) setRelType(crush);
  haptic('medium');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  runSynastry();
}


let relType = 'love';
let lastSynastry = null;

function setRelType(btn) {
  relType = btn?.dataset?.rel || 'love';
  document.querySelectorAll('.rel-chip').forEach(el => el.classList.toggle('active', el === btn));
}

function renderSynastryYou() {
  const el = document.getElementById('synastry-you');
  if (!el) return;
  const myDate = birthDate;
  const mySign = (myDate && signFromDate(myDate)) || userSign;
  if (!myDate && !mySign) {
    el.textContent = lang === 'ru'
      ? 'Сначала сохрани свою дату рождения в Профиле — иначе сравнение будет кривым'
      : 'Save your birth date in Profile first — otherwise the reading is crooked';
    return;
  }
  const lp = myDate ? lifePathNumber(myDate) : '—';
  const signLabel = mySign && ZODIAC[mySign] ? (ZODIAC[mySign].emoji + ' ' + ZODIAC[mySign][lang]) : '—';
  const nm = userName || (lang === 'ru' ? 'Ты' : 'You');
  el.textContent = lang === 'ru'
    ? `Ты: ${nm} · ${signLabel} · число судьбы ${lp}`
    : `You: ${nm} · ${signLabel} · life path ${lp}`;
}

function elementOfSign(sign) {
  return {
    aries:'fire', leo:'fire', sagittarius:'fire',
    taurus:'earth', virgo:'earth', capricorn:'earth',
    gemini:'air', libra:'air', aquarius:'air',
    cancer:'water', scorpio:'water', pisces:'water'
  }[sign] || null;
}


function synastryFallback(facts) {
  const a = facts.me.name;
  const b = facts.other.name;
  const pair = (facts.me.element || '?') + '-' + (facts.other.element || '?');
  const ru = {
    'fire-water': `${a} разжигает, ${b} держит берег. Вместе это не «не пара», это костёр у воды: тепло есть, но если не договориться о паузе — один выгорает, второй тушит всё подряд. На этой неделе не доказывай правоту вечером. Сядьте и назовите, чего каждому не хватило за день.`,
    'water-fire': `${b} разжигает, ${a} держит берег. Связь живая, но ритмы разные: одному нужно действие, другому — тишина после. Трение не в чувствах, а в темпе. На этой неделе один вечер без разбора отношений — просто рядом.`,
    'fire-fire': `Два огня. С ${b} тебе легко разогнаться и так же легко сжечь запас. Искра не проблема, проблема — кто тушит свет в комнате. На этой неделе один конкретный план на двоих, не три больших обещания.`,
    'water-water': `С ${b} легко утонуть в настроении друг друга. Это глубоко и липко: обида живёт дольше, чем событие. На этой неделе проговаривайте факт, не догадку. Одна фраза «мне сейчас тяжело», без суда.`,
    'earth-air': `${a} хочет опору, ${b} хочет воздух. Не враги — разный кислород. Ссора часто не про любовь, а про «ты не слышишь темп». На этой неделе один совместный бытовой жест и один разговор без телефона.`,
    'air-earth': `${b} заземляет, ${a} разгоняет мысль. Если не признать обе скорости, начнёте обвинять. На этой неделе пусть земля выберет место, воздух — тему разговора.`,
    'fire-earth': `Огонь и земля. С ${b} можно построить, если не требовать мгновенного жара взад. Трение в ожидании. На этой неделе одна понятная договорённость вместо намёка.`,
    'earth-fire': `Земля и огонь. ${b} вспыхивает, тебе нужна почва. Не гаси живое — направь. На этой неделе скажи, что уже работает, прежде чем чинить.`,
    'air-water': `Воздух и вода. Много слов или много чувств — редко в одном такте. С ${b} легко недопонять молчание. На этой неделе сначала спросите «ты рядом или тебе нужно побыть», потом делайте выводы.`,
    'water-air': `Вода и воздух. ${b} разберёт словами то, что ты ещё только чувствуешь. Это не холодность. На этой неделе не требуй мгновенного анализа вечером.`,
    'air-air': `Два воздуха. Легко и остроумно, пока не понадобится тело и быт. С ${b} идея живёт дольше, чем маршрут. На этой неделе одно простое совместное дело руками, не перепиской.`,
    'earth-earth': `Две земли. Надёжно до тяжести. С ${b} можно застрять в «правильно». На этой неделе разрешите одну глупость без пользы.`,
    'fire-air': `Огонь и воздух. Разгон без тормоза. С ${b} легко начать и забыть доесть. На этой неделе закройте одно начатое, не открывайте третье.`,
    'air-fire': `Воздух и огонь. Искра есть. Риск — вы оба убежите в следующее. На этой неделе 20 минут глаз в глаза без ленты.`,
    'water-earth': `Вода и земля. Можно вырастить, можно заболотить. С ${b} важны берега. На этой неделе назовите одну границу без вины.`,
    'earth-water': `Земля и вода. Плодородно, если не держать всё внутри. На этой неделе один раз скажи чувство целиком, не намёком.`
  };
  const en = {
    'fire-water': `${a} lights, ${b} keeps the shore. Not a mismatch — a fire by water. Agree on a pause this week before anyone douses everything.`,
    'water-fire': `${b} lights, ${a} keeps the shore. The rub is pace, not love. One evening together without analyzing the bond.`
  };
  const bag = lang === 'ru' ? ru : en;
  return bag[pair] || (lang === 'ru'
    ? `У ${a} и ${b} разные ритмы, и это не приговор. Трение будет там, где один хочет скорость, а второй — ясность. На этой неделе один честный разговор без суда: что каждому нужно, чтобы остаться рядом.`
    : `${a} and ${b} move at different speeds. That is not a verdict. Talk once this week about what each of you needs to stay close.`);
}

async function runSynastry() {
  const otherName = (document.getElementById('other-name')?.value || '').trim();
  const otherBirth = document.getElementById('other-birth')?.value || '';
  const textEl = document.getElementById('synastry-text');
  const factsEl = document.getElementById('synastry-facts');
  const shareBtn = document.getElementById('synastry-share');
  if (!otherName || otherName.length < 2) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Напиши, как человека зовут' : 'Write their name');
    return;
  }
  if (!otherBirth) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Нужна дата рождения' : 'Birth date is required');
    return;
  }
  const myDate = birthDate;
  const mySign = (myDate && signFromDate(myDate)) || userSign;
  if (!myDate && !mySign) {
    if (tg?.showPopup) {
      tg.showPopup({
        title: lang === 'ru' ? 'Сначала ты' : 'You first',
        message: lang === 'ru' ? 'Сохрани свою дату в Профиле — сравнение без неё пустое' : 'Save your date in Profile — without it the reading is empty',
        buttons: [
          { id: 'prof', type: 'default', text: lang === 'ru' ? 'В профиль' : 'Profile' },
          { type: 'ok' }
        ]
      }, (id) => { if (id === 'prof') showScreen('profile'); });
    }
    return;
  }
  const otherSign = signFromDate(otherBirth);
  const facts = {
    me: {
      name: nameForAI(),
      date: myDate || null,
      sign: mySign,
      lifePath: myDate ? lifePathNumber(myDate) : null,
      element: elementOfSign(mySign)
    },
    other: {
      name: otherName.slice(0, 24),
      date: otherBirth,
      sign: otherSign,
      lifePath: lifePathNumber(otherBirth),
      element: elementOfSign(otherSign)
    },
    bond: relType
  };

  const signA = facts.me.sign && ZODIAC[facts.me.sign] ? ZODIAC[facts.me.sign][lang] : 'неизвестен';
  const signB = facts.other.sign && ZODIAC[facts.other.sign] ? ZODIAC[facts.other.sign][lang] : 'неизвестен';
  if (factsEl) {
    factsEl.textContent = lang === 'ru'
      ? `${facts.me.name}: ${signA}, число ${facts.me.lifePath ?? '—'}  ·  ${facts.other.name}: ${signB}, число ${facts.other.lifePath}`
      : `${facts.me.name}: ${signA}, path ${facts.me.lifePath ?? '—'}  ·  ${facts.other.name}: ${signB}, path ${facts.other.lifePath}`;
  }

  setLoading(textEl, true);
  if (shareBtn) shareBtn.classList.add('hidden');
  haptic('medium');

  const bondWord = {
    love: lang === 'ru' ? 'пара / близкие отношения' : 'romantic bond',
    crush: lang === 'ru' ? 'влечение / ещё не случилось' : 'attraction / not yet a couple',
    friend: lang === 'ru' ? 'дружба' : 'friendship'
  }[relType];

  const prompt = lang === 'ru'
    ? `Это факты, не выдумывай другие знаки и числа. Тон тёплый, точный, без насмешки и без гуру.
Я: имя ${facts.me.name}, солнце ${signA}, стихия ${facts.me.element || 'неизвестно'}, число судьбы ${facts.me.lifePath ?? 'неизвестно'}.
Другой человек: имя ${facts.other.name}, солнце ${signB}, стихия ${facts.other.element || 'неизвестно'}, число судьбы ${facts.other.lifePath}, роль связи: ${bondWord}.
Напиши 4-5 предложений: 1) где вы срастаетесь, 2) где будет тереть, 3) как это ощущается в теле/дне, 4) один конкретный совет на эту неделю. Без процентов совместимости. Без markdown.`
    : `These are facts, do not invent other signs or numbers. Warm, precise tone, no mockery, no guru voice.
Me: name ${facts.me.name}, sun ${signA}, element ${facts.me.element || 'unknown'}, life path ${facts.me.lifePath ?? 'unknown'}.
Other: name ${facts.other.name}, sun ${signB}, element ${facts.other.element || 'unknown'}, life path ${facts.other.lifePath}, bond: ${bondWord}.
Write 4-5 sentences: 1) where you fuse, 2) where it will rub, 3) how it feels in the body/day, 4) one concrete tip for this week. No compatibility percent. No markdown.`;

  let reply = await askAI(prompt, 'stars');
  if (!reply) reply = synastryFallback(facts);
  lastSynastry = { facts, signA, signB, bondWord, short: reply };
  if (textEl) textEl.textContent = reply;
  if (shareBtn) shareBtn.classList.remove('hidden');
  const fullBtn = document.getElementById('btn-synastry-full');
  if (fullBtn) {
    fullBtn.classList.remove('hidden');
    fullBtn.textContent = lang === 'ru' ? 'Полный разбор — 75 ⭐' : 'Full reading — 75 ⭐';
  }
  const fullEl = document.getElementById('synastry-full');
  if (fullEl) fullEl.textContent = '';
  tryCompleteQuest('stars');
  haptic('success');
}

function fullSynastryPrompt(pack) {
  const f = pack.facts;
  if (lang === 'ru') {
    return `Это факты. Не выдумывай другие знаки, числа и события. Тон тёплый, взрослый, без насмешки и без эзотерического пафоса. Пиши как умный близкий человек.
Я: ${f.me.name}, солнце ${pack.signA}, стихия ${f.me.element}, число судьбы ${f.me.lifePath}.
Другой: ${f.other.name}, солнце ${pack.signB}, стихия ${f.other.element}, число судьбы ${f.other.lifePath}.
Тип связи: ${pack.bondWord}.
Короткий разбор уже был: ${pack.short}

Дай полный разбор в 3 абзацах с заголовками как обычный текст:
1) Где живёт тепло
2) Где будет срыв
3) Что делать на этой неделе — 3 конкретных шага
Каждый абзац 3-4 предложения. Без процентов, без markdown, без слова "натал".`;
  }
  return `Facts only. Do not invent other signs or events. Warm adult tone.
Me: ${f.me.name}, sun ${pack.signA}, element ${f.me.element}, life path ${f.me.lifePath}.
Other: ${f.other.name}, sun ${pack.signB}, element ${f.other.element}, life path ${f.other.lifePath}.
Bond: ${pack.bondWord}.
Short reading: ${pack.short}
Write 3 sections: Where the warmth lives; Where it breaks; What to do this week (3 concrete steps). No percent, no markdown.`;
}

async function writeFullSynastry() {
  if (!lastSynastry) return;
  const el = document.getElementById('synastry-full');
  if (el) setLoading(el, true);
  haptic('medium');
  let reply = await askAI(fullSynastryPrompt(lastSynastry), 'stars');
  if (!reply) {
    reply = lang === 'ru'
      ? 'Тепло у вас в дополнении ритмов: один зажигает, второй держит берег. Срыв — когда темп одного становится приговором другому. На этой неделе: одно маленькое обещание в день, один вечер без разбора «кто виноват», одна фраза «мне сейчас нужно вот это» без намёка.'
      : 'Warmth is in complementary pace. The break is when one tempo becomes a verdict. This week: one small kept promise a day, one evening without blame, one clear ask.';
  }
  lastSynastry.full = reply;
  if (el) el.textContent = reply;
  const shareBtn = document.getElementById('synastry-share');
  if (shareBtn) {
    shareBtn.classList.remove('hidden');
    shareBtn.onclick = () => shareSmart((lastSynastry.short || '') + '\n\n' + reply, 'stars');
  }
  haptic('success');
}

function buyFullSynastry() {
  if (!lastSynastry) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Сначала короткий разбор' : 'Do the short reading first');
    return;
  }
  if (lastSynastry.full) {
    writeFullSynastry();
    return;
  }
  buyStars('synastry');
}

async function showCelebAI(celeb) {
  if (!userSign) {
    showModal(`<div class="result-emoji">✨</div><div class="result-title">${lang==='ru'?'Сначала выбери знак в Профиле!':'Choose sign in Profile first!'}</div>`);
    return;
  }
  if (!spendEnergy()) return;
  showModal(`<div class="cosmo-loader"><div class="cosmo-orbit"></div><div class="cosmo-loader-text">${t('loading')}</div></div>`);
  haptic('medium');
  const mySign = ZODIAC[userSign][lang];
  const prompt = lang === 'ru'
    ? `Очень смешная тёплая совместимость: ${mySign} и ${celeb.name.ru}. 2-3 предложения + процент 55-98. Эмодзи. Без markdown.`
    : `Very funny warm compatibility: ${mySign} and ${celeb.name.en}. 2-3 sentences + percent 55-98. Emoji. No markdown.`;
  const reply = await askAI(prompt, 'stars') || (celeb.funny[lang][0] || t('error'));
  const safeReply = escapeHtml(reply);
  const safeName = escapeHtml(celeb.name[lang]);
  document.getElementById('modal-content').innerHTML = `
    <div class="result-emoji">${celeb.emoji}</div>
    <div class="result-title">${safeName}</div>
    <p style="font-size:15px;line-height:1.5;margin-top:12px">${safeReply}</p>
    <button class="btn btn-secondary mt-16" id="celeb-share-btn">${t('btnShare')}</button>`;
  document.getElementById('celeb-share-btn')?.addEventListener('click', () => shareSmart(celeb.name[lang] + ': ' + reply, 'stars'));
  tryCompleteQuest('stars');
  haptic('success');
}

async function getLazy() {
  const el = document.getElementById('lazy-text');
  setLoading(el, true);
  haptic('medium');
  const n = nameForAI();
  const prompt = lang === 'ru'
    ? `Смешной гороскоп для ленивых для ${n} — разрешение ничего не делать. Обратись по имени. 2 предложения. Тепло и юмор. Эмодзи. Без markdown.`
    : `Funny lazy horoscope for ${n} — permission to do nothing. Address by name. 2 sentences. Warmth and humor. Emoji. No markdown.`;
  el.textContent = await getCachedOrAI('lazy', prompt, LAZY_HOROSCOPES[lang], { cost: ENERGY_COST });
  document.getElementById('lazy-share')?.classList.remove('hidden');
  tryCompleteQuest('lazy');
  haptic('success');
}

async function drawCard() {
  const titleEl = document.getElementById('card-title');
  const textEl = document.getElementById('card-text');
  // already have card today in collection? free redraw same day from cache - still cost once
  if (!consumeExtraCard() && !spendEnergy()) {
    return;
  }
  titleEl.innerHTML = `<div class="cosmo-loader cosmo-loader-sm"><div class="cosmo-orbit"></div></div>`;
  textEl.textContent = t('loadingShort');
  haptic('heavy');
  const prompt = lang === 'ru'
    ? 'Придумай весёлую карту дня. Сначала короткое название (2-4 слова), с новой строки текст 1-2 предложения. Эмодзи. Без markdown.'
    : 'Invent a fun card of the day. First short title (2-4 words), then on new line text 1-2 sentences. Emoji. No markdown.';
  const reply = await askAI(prompt, 'card');
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
  const tTitle = titleEl.textContent || '';
  const tText = textEl.textContent || '';
  if (tTitle && tText && !/думает|thinking|Loading|Загрузка/i.test(tTitle)) {
    addToCollection(tTitle, tText);
    renderCollection();
    tryCompleteQuest('card');
  }
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
  if (!spendEnergy()) return;
  result.style.display = 'block';
  result.innerHTML = `<div class="cosmo-loader"><div class="cosmo-orbit"></div><div class="cosmo-loader-text">${t('loading')}</div></div>`;
  haptic('medium');
  const reply = await askAI(msg, 'universe');
  result.innerHTML = `<div class="ai-reply"></div>
    <button class="btn btn-secondary mt-12" id="universe-share-btn">${t('btnShare')}</button>`;
  const replyEl = result.querySelector('.ai-reply');
  if (replyEl) replyEl.textContent = reply || t('error');
  document.getElementById('universe-share-btn')?.addEventListener('click', () => shareSmart(reply || '', 'universe'));
  if (reply) tryCompleteQuest('universe');
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
    document.getElementById('user-avatar').textContent = (user.first_name?.[0] || '?').toUpperCase();
    // Suggest Telegram name if we don't have one yet
    if (!userName && user.first_name) {
      userName = user.first_name;
      // don't auto-save — user confirms in modal
    }
  }
  if (!localStorage.getItem('cb_lang') && user?.language_code) {
    lang = user.language_code.startsWith('ru') ? 'ru' : 'en';
  }
}



function currentStartParam() {
  const fromTg = tg?.initDataUnsafe?.start_param;
  if (fromTg) return String(fromTg);
  try {
    const q = new URLSearchParams(location.search);
    return q.get('tgWebAppStartParam') || q.get('startapp') || q.get('ref') || '';
  } catch {
    return '';
  }
}

function applyEnergyBonus(n) {
  const add = Math.max(0, Number(n) || 0);
  if (!add) return 0;
  const next = Math.min(ENERGY_MAX, getEnergy() + add);
  const gained = next - getEnergy();
  setEnergy(next);
  refreshEnergyUI();
  return gained;
}

async function processReferral() {
  const user = tg?.initDataUnsafe?.user;
  if (!user?.id) return;
  const startParam = currentStartParam();
  if (!/^ref[_-]?\d+$/i.test(startParam)) return;
  if (localStorage.getItem('cb_ref_claimed') === startParam) return;
  try {
    const r = await fetch(REF_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initDataPayload({ userId: user.id, startParam }))
    });
    const data = await r.json();
    if (data?.applied) {
      localStorage.setItem('cb_ref_claimed', startParam);
      const got = applyEnergyBonus(data.inviteeBonus || 15);
      if (got && tg?.showPopup) {
        tg.showPopup({
          title: lang === 'ru' ? 'Подарок от друга' : 'A gift from a friend',
          message: lang === 'ru' ? `+${got}% энергии за переход по ссылке ✨` : `+${got}% energy for joining via invite ✨`,
          buttons: [{ type: 'ok' }]
        });
      }
    }
  } catch (e) {
    console.error('ref claim', e);
  }
}

async function collectRefBonus() {
  const user = tg?.initDataUnsafe?.user;
  if (!user?.id) return;
  try {
    const r = await fetch(REF_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initDataPayload({ op: 'collect' }))
    });
    const data = await r.json();
    const countEl = document.getElementById('ref-count');
    if (countEl) {
      const n = Number(data?.count) || 0;
      countEl.textContent = lang === 'ru' ? `Пришло друзей: ${n}` : `Friends joined: ${n}`;
    }
    if (Number(data?.bonus) > 0) {
      const got = applyEnergyBonus(data.bonus);
      if (got >= 3 && unlockBadge('ref', lang === 'ru' ? '🤝 Зов вселенной' : '🤝 Cosmic invite')) {
        renderCollection();
      }
      if (got && tg?.showPopup) {
        tg.showPopup({
          title: lang === 'ru' ? 'Друг зашёл' : 'A friend joined',
          message: lang === 'ru' ? `+${got}% энергии за приглашение ✨` : `+${got}% energy for your invite ✨`,
          buttons: [{ type: 'ok' }]
        });
      }
    }
  } catch (e) {
    console.error('ref bonus', e);
  }
}

function renderRefLink() {
  const input = document.getElementById('ref-link');
  if (input) input.value = myRefLink();
  const title = document.getElementById('title-ref');
  if (title) title.textContent = lang === 'ru' ? 'Пригласи друга' : 'Invite a friend';
  const hint = document.getElementById('ref-hint');
  if (hint) hint.textContent = lang === 'ru'
    ? 'Друг открыл приложение по твоей ссылке — тебе +25% энергии, ему +15%'
    : 'A friend opens the app via your link — you get +25% energy, they get +15%';
  const btn = document.getElementById('btn-copy-ref');
  if (btn) btn.textContent = lang === 'ru' ? 'Скопировать ссылку' : 'Copy link';
}

function copyRefLink() {
  const link = myRefLink();
  const input = document.getElementById('ref-link');
  if (input) input.value = link;
  haptic('medium');
  const done = () => {
    if (tg?.showPopup) tg.showPopup({ message: lang === 'ru' ? 'Ссылка скопирована ✨' : 'Link copied ✨', buttons: [{ type: 'ok' }] });
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(link).then(done).catch(() => {
      input?.select();
      done();
    });
  } else {
    input?.select();
    done();
  }
}


function applyStarsPurchase(sku) {
  if (sku === 'energy') {
    setEnergy(ENERGY_MAX);
  } else if (sku === 'cards') {
    localStorage.setItem('cb_extra_cards', String(extraCardsLeft() + 3));
  } else if (sku === 'pass') {
    const until = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('cb_pass_until', String(until));
  } else if (sku === 'synastry') {
    writeFullSynastry();
  }
  refreshEnergyUI();
  renderShopStatus();
  haptic('success');
  if (sku !== 'synastry' && tg?.showPopup) {
    const msg = sku === 'energy'
      ? (lang === 'ru' ? 'Энергия снова 100% ⚡' : 'Energy is back to 100% ⚡')
      : sku === 'cards'
        ? (lang === 'ru' ? '+3 карты дня без энергии 🃏' : '+3 day cards without energy 🃏')
        : (lang === 'ru' ? 'Безлимит на 24 часа включён 🌌' : '24h unlimited is on 🌌');
    tg.showPopup({ title: 'Cosmic Boost', message: msg, buttons: [{ type: 'ok' }] });
  }
}

function renderShopStatus() {
  const el = document.getElementById('shop-status');
  if (!el) return;
  const bits = [];
  if (hasUnlimitedPass()) {
    const mins = Math.max(1, Math.round((Number(localStorage.getItem('cb_pass_until')) - Date.now()) / 60000));
    bits.push(lang === 'ru' ? `Безлимит ещё ~${mins} мин` : `Unlimited ~${mins} min left`);
  }
  const extra = extraCardsLeft();
  if (extra) bits.push(lang === 'ru' ? `Запас карт: ${extra}` : `Extra cards: ${extra}`);
  el.textContent = bits.join(' · ');
  const title = document.getElementById('title-shop');
  if (title) title.textContent = lang === 'ru' ? 'Магазин вселенной' : 'Universe shop';
  const hint = document.getElementById('shop-hint');
  if (hint) hint.textContent = lang === 'ru'
    ? 'Telegram Stars. Безлимит, карты и дозаряд энергии'
    : 'Telegram Stars. Unlimited, cards and energy refill';
}

async function buyStars(sku) {
  haptic('medium');
  const userId = tg?.initDataUnsafe?.user?.id;
  if (!userId) {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Открой приложение внутри Telegram' : 'Open the app inside Telegram');
    return;
  }
  if (typeof tg?.openInvoice !== 'function') {
    if (tg?.showAlert) tg.showAlert(lang === 'ru' ? 'Обнови Telegram, чтобы платить Stars' : 'Update Telegram to pay with Stars');
    return;
  }
  try {
    const r = await fetch('https://cosmic-boost.vercel.app/api/stars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initDataPayload({ sku, userId }))
    });
    const data = await r.json();
    if (!data?.url) {
      if (tg?.showAlert) tg.showAlert(data?.error || 'Stars error');
      return;
    }
    tg.openInvoice(data.url, (status) => {
      if (status === 'paid') applyStarsPurchase(sku);
      else if (status === 'failed' && tg.showAlert) tg.showAlert(lang === 'ru' ? 'Оплата не прошла' : 'Payment failed');
    });
  } catch (e) {
    console.error(e);
    if (tg?.showAlert) tg.showAlert('Stars error');
  }
}

function trackVisit() {
  try {
    const user = tg?.initDataUnsafe?.user;
    const doFetch = (payload) => {
      fetch('https://cosmic-boost.vercel.app/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(r => r.json())
        .then(data => {
          if (data && typeof data.dailyCount === 'number') {
            updateSocialProof(data.dailyCount);
          } else {
            fetchDailyCount();
          }
        })
        .catch(() => fetchDailyCount());
    };
    if (user?.id) {
      doFetch({
        initData: tg?.initData || '',
        userId: user.id,
        lang: lang || 'ru',
        name: userName || user.first_name || ''
      });
    } else {
      fetchDailyCount();
    }
  } catch (_) {
    fetchDailyCount();
  }
}

function fetchDailyCount() {
  fetch('https://cosmic-boost.vercel.app/api/track')
    .then(r => r.json())
    .then(data => {
      if (data && typeof data.dailyCount === 'number') updateSocialProof(data.dailyCount);
    })
    .catch(() => {});
}

function updateSocialProof(n) {
  const el = document.getElementById('social-proof-text');
  if (!el) return;
  const count = Math.max(1, Number(n) || 1);
  if (lang === 'ru') {
    el.innerHTML = `Сегодня уже <strong>${count}</strong> ${pluralRu(count, 'человек получил', 'человека получили', 'человек получили')} заряд ✨`;
  } else {
    el.innerHTML = `Already <strong>${count}</strong> ${count === 1 ? 'person has' : 'people have'} charged up today ✨`;
  }
}

function pluralRu(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
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
    const cloudPromise = loadProfileFromCloud();
    const timeout = new Promise(r => setTimeout(r, 600));
    await Promise.race([cloudPromise, timeout]);
    updateUI();
    trackVisit();
    renderRefLink();
    renderShopStatus();
    processReferral();
    collectRefBonus();
    hideSplash();
    cloudPromise.then(() => {
      if (userSign || userName || birthDate) updateUI();
      setTimeout(maybeOnboard, 400);
    }).catch(() => setTimeout(maybeOnboard, 400));
    setTimeout(maybeOnboard, 700);
  } catch (e) {
    console.error(e);
    try { updateUI(); } catch (_) {}
    hideSplash();
    if (!userName) setTimeout(openNameModal, 500);
  }
});
