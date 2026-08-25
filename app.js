// Cosmic Boost - Main App Logic

const tg = window.Telegram?.WebApp;

// State
let lang = localStorage.getItem('cb_lang') || 'ru';
let userSign = localStorage.getItem('cb_sign') || null;
let cardDrawnToday = localStorage.getItem('cb_card_date') === getToday();

// i18n
const i18n = {
  ru: {
    subtitle: "Твой ежедневный заряд от вселенной",
    titleCompliment: "Комплимент от вселенной",
    titleHoroscope: "Твой прогноз на сегодня",
    titleLazy: "Гороскоп для ленивых",
    titleStars: "С кем из звёзд ты совместим(а)",
    titleMatch: "Совместимость",
    titleCard: "Карта дня",
    titleFortune: "Случайное предсказание",
    titleProfile: "Профиль",
    navBoost: "Буст",
    navLazy: "Ленивый",
    navStars: "Звёзды",
    navMatch: "Матч",
    navMore: "Ещё",
    btnLazy: "Получить разрешение",
    btnCard: "Открыть карту",
    btnFortune: "Узнать судьбу",
    btnClose: "Закрыть",
    chooseSign: "Выбери свой знак зодиака:",
    signNotSelected: "Знак не выбран",
    guest: "Гость",
    starsHint: "Выбери знаменитость",
    matchHint: "Выбери знак друга / подруги",
    lazyPlaceholder: "Нажми кнопку, чтобы получить разрешение ничего не делать",
    fortunePlaceholder: "Жми, если нужно немного магии",
    cardPlaceholder: "Нажми, чтобы открыть",
    horoscopePlaceholder: "Выбери свой знак зодиака в профиле ✨",
    compatibility: "Совместимость",
    with: "с",
    share: "Поделиться",
    tryAgain: "Ещё раз"
  },
  en: {
    subtitle: "Your daily charge from the universe",
    titleCompliment: "Compliment from the Universe",
    titleHoroscope: "Your forecast for today",
    titleLazy: "Lazy Horoscope",
    titleStars: "Celebrity Compatibility",
    titleMatch: "Compatibility",
    titleCard: "Card of the Day",
    titleFortune: "Random Fortune",
    titleProfile: "Profile",
    navBoost: "Boost",
    navLazy: "Lazy",
    navStars: "Stars",
    navMatch: "Match",
    navMore: "More",
    btnLazy: "Get permission",
    btnCard: "Draw a card",
    btnFortune: "Reveal destiny",
    btnClose: "Close",
    chooseSign: "Choose your zodiac sign:",
    signNotSelected: "Sign not selected",
    guest: "Guest",
    starsHint: "Choose a celebrity",
    matchHint: "Choose a friend's sign",
    lazyPlaceholder: "Press the button to get permission to do nothing",
    fortunePlaceholder: "Press if you need a little magic",
    cardPlaceholder: "Press to open",
    horoscopePlaceholder: "Choose your zodiac sign in Profile ✨",
    compatibility: "Compatibility",
    with: "with",
    share: "Share",
    tryAgain: "Try again"
  }
};

function t(key) {
  return i18n[lang][key] || key;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDailyIndex(arrLength, extra = 0) {
  const today = getToday();
  const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0) + extra;
  return Math.floor(seededRandom(seed) * arrLength);
}

// ===== Telegram Integration =====
function initTelegram() {
  if (!tg) return;

  tg.ready();
  tg.expand();
  tg.setHeaderColor('#0f0c29');
  tg.setBackgroundColor('#0f0c29');

  // Theme
  document.documentElement.style.setProperty('--tg-theme-bg', tg.themeParams.bg_color || '#0f0c29');

  // User info
  const user = tg.initDataUnsafe?.user;
  if (user) {
    const name = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    document.getElementById('user-name').textContent = name;
    document.getElementById('user-avatar').textContent = (user.first_name?.[0] || '?').toUpperCase();
  }

  // Language from Telegram
  if (!localStorage.getItem('cb_lang') && user?.language_code) {
    lang = user.language_code.startsWith('ru') ? 'ru' : 'en';
  }
}

// ===== UI Updates =====
function updateUI() {
  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Texts
  document.getElementById('subtitle').textContent = t('subtitle');
  document.getElementById('title-compliment').textContent = t('titleCompliment');
  document.getElementById('title-horoscope').textContent = t('titleHoroscope');
  document.getElementById('title-lazy').textContent = t('titleLazy');
  document.getElementById('title-stars').textContent = t('titleStars');
  document.getElementById('title-match').textContent = t('titleMatch');
  document.getElementById('title-card').textContent = t('titleCard');
  document.getElementById('title-fortune').textContent = t('titleFortune');
  document.getElementById('title-profile').textContent = t('titleProfile');

  document.getElementById('nav-boost').textContent = t('navBoost');
  document.getElementById('nav-lazy').textContent = t('navLazy');
  document.getElementById('nav-stars').textContent = t('navStars');
  document.getElementById('nav-match').textContent = t('navMatch');
  document.getElementById('nav-more').textContent = t('navMore');

  document.getElementById('btn-lazy').textContent = t('btnLazy');
  document.getElementById('btn-card').textContent = cardDrawnToday ? (lang === 'ru' ? 'Карта уже открыта' : 'Card already drawn') : t('btnCard');
  document.getElementById('btn-fortune').textContent = t('btnFortune');
  document.getElementById('modal-close-btn').textContent = t('btnClose');

  document.getElementById('choose-sign-label').textContent = t('chooseSign');
  document.getElementById('stars-hint').textContent = t('starsHint');
  document.getElementById('match-hint').textContent = t('matchHint');

  // Energy
  const energy = 70 + Math.floor(seededRandom(parseInt(getToday().replace(/-/g, ''))) * 30);
  document.getElementById('energy-value').textContent = energy + '%';
  document.getElementById('energy-fill').style.width = energy + '%';
  const energyPhrase = ENERGY_PHRASES[lang][getDailyIndex(ENERGY_PHRASES[lang].length, 1)];
  document.getElementById('energy-label').textContent = energyPhrase;

  // Compliment
  const compliment = COMPLIMENTS[lang][getDailyIndex(COMPLIMENTS[lang].length, 2)];
  document.getElementById('compliment-text').textContent = compliment;

  // Horoscope
  if (userSign && DAILY_HOROSCOPES[lang][userSign]) {
    const idx = getDailyIndex(DAILY_HOROSCOPES[lang][userSign].length, 3);
    document.getElementById('horoscope-text').textContent = DAILY_HOROSCOPES[lang][userSign][idx];
  } else {
    document.getElementById('horoscope-text').textContent = t('horoscopePlaceholder');
  }

  // Profile sign
  if (userSign && ZODIAC[userSign]) {
    document.getElementById('user-sign').textContent = ZODIAC[userSign].emoji + ' ' + ZODIAC[userSign][lang];
  } else {
    document.getElementById('user-sign').textContent = t('signNotSelected');
  }

  // Lazy placeholder
  if (!document.getElementById('lazy-text').dataset.filled) {
    document.getElementById('lazy-text').textContent = t('lazyPlaceholder');
  }

  // Fortune placeholder
  if (!document.getElementById('fortune-text').dataset.filled) {
    document.getElementById('fortune-text').textContent = t('fortunePlaceholder');
  }

  // Card
  if (!cardDrawnToday) {
    document.getElementById('card-title').textContent = t('cardPlaceholder');
    document.getElementById('card-text').textContent = '';
  }

  renderZodiacGrids();
  renderCelebrities();
}

function setLang(newLang) {
  lang = newLang;
  localStorage.setItem('cb_lang', lang);
  updateUI();
  haptic();
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.screen === name);
  });

  haptic('light');
}

// ===== Zodiac =====
function renderZodiacGrids() {
  const grids = ['profile-zodiac-grid', 'match-zodiac-grid'];
  grids.forEach(gridId => {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    Object.keys(ZODIAC).forEach(key => {
      const z = ZODIAC[key];
      const item = document.createElement('div');
      item.className = 'zodiac-item' + (userSign === key && gridId === 'profile-zodiac-grid' ? ' selected' : '');
      item.innerHTML = `<span class="zodiac-emoji">${z.emoji}</span><span class="zodiac-name">${z[lang]}</span>`;
      item.onclick = () => {
        if (gridId === 'profile-zodiac-grid') {
          setUserSign(key);
        } else {
          showCompatibility(key);
        }
      };
      grid.appendChild(item);
    });
  });
}

function setUserSign(sign) {
  userSign = sign;
  localStorage.setItem('cb_sign', sign);
  updateUI();
  haptic('medium');
}

// ===== Celebrities =====
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
      </div>
    `;
    item.onclick = () => showCelebCompatibility(celeb);
    list.appendChild(item);
  });
}

function showCelebCompatibility(celeb) {
  if (!userSign) {
    showModal(`
      <div class="result-emoji">✨</div>
      <div class="result-title">${lang === 'ru' ? 'Сначала выбери свой знак!' : 'Choose your sign first!'}</div>
      <p class="text-soft">${lang === 'ru' ? 'Зайди во вкладку «Ещё» → Профиль' : 'Go to More → Profile'}</p>
    `);
    return;
  }

  const percent = 55 + Math.floor(seededRandom(userSign.length * celeb.id.length + parseInt(getToday().slice(-2))) * 40);
  const text = celeb.funny[lang][getDailyIndex(celeb.funny[lang].length, celeb.id.length)];

  showModal(`
    <div class="result-emoji">${celeb.emoji}</div>
    <div class="result-percent">${percent}%</div>
    <div class="result-title">${t('compatibility')} ${t('with')} ${celeb.name[lang]}</div>
    <p style="font-size:15px;line-height:1.5;margin-top:8px">${text}</p>
  `);
  haptic('medium');
}

// ===== Compatibility with friend =====
function showCompatibility(friendSign) {
  if (!userSign) {
    showModal(`
      <div class="result-emoji">✨</div>
      <div class="result-title">${lang === 'ru' ? 'Сначала выбери свой знак!' : 'Choose your sign first!'}</div>
      <p class="text-soft">${lang === 'ru' ? 'Зайди во вкладку «Ещё» → Профиль' : 'Go to More → Profile'}</p>
    `);
    return;
  }

  // Simple fun compatibility algorithm
  const signs = Object.keys(ZODIAC);
  const myIdx = signs.indexOf(userSign);
  const friendIdx = signs.indexOf(friendSign);
  const diff = Math.abs(myIdx - friendIdx);
  let percent = 100 - diff * 6;
  percent = Math.max(42, Math.min(98, percent + Math.floor(seededRandom(myIdx + friendIdx) * 20 - 10)));

  const texts = {
    ru: [
      "Вы как два пазла, которые идеально щёлкают.",
      "Вместе вы — ходячий источник хорошего настроения.",
      "Звёзды одобряют этот тандем. И мы тоже.",
      "Может быть немного хаоса, но какого приятного!",
      "Вы дополняете друг друга лучше, чем Wi-Fi и пароль."
    ],
    en: [
      "You're like two puzzle pieces that click perfectly.",
      "Together you're a walking source of good mood.",
      "The stars approve this duo. So do we.",
      "There might be a little chaos, but the fun kind!",
      "You complete each other better than Wi-Fi and password."
    ]
  };

  const text = texts[lang][getDailyIndex(texts[lang].length, myIdx + friendIdx)];

  showModal(`
    <div class="result-emoji">${ZODIAC[userSign].emoji} + ${ZODIAC[friendSign].emoji}</div>
    <div class="result-percent">${percent}%</div>
    <div class="result-title">${ZODIAC[userSign][lang]} + ${ZODIAC[friendSign][lang]}</div>
    <p style="font-size:15px;line-height:1.5;margin-top:8px">${text}</p>
  `);
  haptic('medium');
}

// ===== Lazy Horoscope =====
function getLazyHoroscope() {
  const text = LAZY_HOROSCOPES[lang][getDailyIndex(LAZY_HOROSCOPES[lang].length, 7)];
  document.getElementById('lazy-text').textContent = text;
  document.getElementById('lazy-text').dataset.filled = '1';
  haptic('medium');
}

// ===== Card of the Day =====
function drawCard() {
  if (cardDrawnToday) {
    haptic('error');
    return;
  }

  const card = CARDS[lang][getDailyIndex(CARDS[lang].length, 5)];
  document.getElementById('card-title').textContent = card.title;
  document.getElementById('card-text').textContent = card.text;
  document.getElementById('btn-card').textContent = lang === 'ru' ? 'Карта уже открыта' : 'Card already drawn';

  localStorage.setItem('cb_card_date', getToday());
  cardDrawnToday = true;
  haptic('success');
}

// ===== Random Fortune =====
function getRandomFortune() {
  const text = RANDOM_FORTUNES[lang][Math.floor(Math.random() * RANDOM_FORTUNES[lang].length)];
  document.getElementById('fortune-text').textContent = text;
  document.getElementById('fortune-text').dataset.filled = '1';
  haptic('medium');
}

// ===== Modal =====
function showModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('result-overlay').classList.add('active');
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('result-overlay') && !e.target.classList.contains('modal-close') && e.target.id !== 'modal-close-btn') return;
  document.getElementById('result-overlay').classList.remove('active');
}

// ===== Haptic =====
function haptic(type = 'light') {
  if (tg?.HapticFeedback) {
    if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
    else if (type === 'error') tg.HapticFeedback.notificationOccurred('error');
    else if (type === 'medium') tg.HapticFeedback.impactOccurred('medium');
    else tg.HapticFeedback.impactOccurred('light');
  }
}

// ===== Stars background =====
function createStars() {
  const container = document.getElementById('stars');
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
    star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
    star.style.setProperty('--opacity', Math.random() * 0.8 + 0.2);
    star.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(star);
  }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initTelegram();
  createStars();
  updateUI();
});
