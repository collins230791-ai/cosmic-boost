// Cosmic Boost - Expanded content database (UTF-8)

const ZODIAC = {
  aries:       { ru: "Овен",      en: "Aries",       emoji: "♈", dates: "21.03 – 19.04" },
  taurus:      { ru: "Телец",     en: "Taurus",      emoji: "♉", dates: "20.04 – 20.05" },
  gemini:      { ru: "Близнецы",  en: "Gemini",      emoji: "♊", dates: "21.05 – 20.06" },
  cancer:      { ru: "Рак",       en: "Cancer",      emoji: "♋", dates: "21.06 – 22.07" },
  leo:         { ru: "Лев",       en: "Leo",         emoji: "♌", dates: "23.07 – 22.08" },
  virgo:       { ru: "Дева",      en: "Virgo",       emoji: "♍", dates: "23.08 – 22.09" },
  libra:       { ru: "Весы",      en: "Libra",       emoji: "♎", dates: "23.09 – 22.10" },
  scorpio:     { ru: "Скорпион",  en: "Scorpio",     emoji: "♏", dates: "23.10 – 21.11" },
  sagittarius: { ru: "Стрелец",   en: "Sagittarius", emoji: "♐", dates: "22.11 – 21.12" },
  capricorn:   { ru: "Козерог",   en: "Capricorn",   emoji: "♑", dates: "22.12 – 19.01" },
  aquarius:    { ru: "Водолей",   en: "Aquarius",    emoji: "♒", dates: "20.01 – 18.02" },
  pisces:      { ru: "Рыбы",      en: "Pisces",      emoji: "♓", dates: "19.02 – 20.03" }
};

const COMPLIMENTS = {
  ru: [
    "Вселенная сегодня особенно тобой гордится. Серьёзно.",
    "Ты сегодня светишься ярче, чем все созвездия вместе взятые.",
    "Космос шепчет: «Этот человек — огонь». Это про тебя.",
    "Твоя энергия сегодня на уровне сверхновой. Осторожно, можно зажечь кого угодно.",
    "Ты — тот самый глитч в матрице, который делает мир лучше.",
    "Звёзды договорились: сегодня тебе можно всё. Абсолютно всё.",
    "Ты выглядишь так, будто только что победил(а) в космической лотерее.",
    "Вселенная отправила тебе воздушный поцелуй. Лови.",
    "Ты сегодня главный протагонист. Остальные — массовка.",
    "Твоя улыбка сейчас имеет силу маленькой чёрной дыры — притягивает всех.",
    "Сегодня ты официально в списке «люди, от которых становится теплее».",
    "Космос сегодня на твоей стороне. И немного завидует твоему вайбу.",
    "Ты — ходячий источник серотонина. Спасибо, что существуешь.",
    "Звёзды сегодня шепчут твоё имя с уважением.",
    "Ты сегодня выглядишь как человек, у которого всё под контролем (даже если нет).",
    "Вселенная решила: ты заслужил(а) хороший день. Получай.",
    "Твоя энергия сегодня заразительна в самом лучшем смысле.",
    "Ты — причина, почему кто-то сегодня улыбнётся.",
    "Космос ставит тебе лайк. Двойной.",
    "Сегодня ты — главная причина хорошего настроения в радиусе 5 км."
  ],
  en: [
    "The Universe is especially proud of you today. Seriously.",
    "You're glowing brighter than all the constellations combined.",
    "The cosmos just whispered: 'This human is fire.' That's you.",
    "Your energy is at supernova level today. Handle with care.",
    "You're the glitch in the matrix that makes the world better.",
    "The stars held a meeting: today you can do literally anything.",
    "You look like you just won the cosmic lottery.",
    "The Universe just sent you an air kiss. Catch it.",
    "You're the main character today. Everyone else is NPC.",
    "Your smile currently has the power of a small black hole — it attracts everyone.",
    "Today you're officially on the list of 'people who make things warmer'.",
    "The cosmos is on your side today. And a little jealous of your vibe.",
    "You're a walking source of serotonin. Thanks for existing.",
    "The stars are whispering your name with respect today.",
    "You look like someone who has everything under control (even if you don't).",
    "The Universe decided: you deserve a good day. Here it is.",
    "Your energy is contagious in the best possible way today.",
    "You're the reason someone will smile today.",
    "The cosmos just gave you a double like.",
    "Today you're the main reason for good mood within a 5 km radius."
  ]
};

const LAZY_HOROSCOPES = {
  ru: [
    "Сегодня можно ничего не делать. Вселенная уже всё сделала за тебя. Отдыхай, чемпион.",
    "Твой план на день: существовать красиво. Всё остальное — опционально.",
    "Звёзды говорят: «Лежи. Мы гордимся тобой даже в горизонтальном положении».",
    "Сегодня идеальный день, чтобы ничего не планировать и всё равно быть молодец.",
    "Космос разрешает тебе пропустить все дела. Серьёзно. Вот прям все.",
    "Ты уже достаточно постарался(ась) в этой жизни. Сегодня — бонусный уровень «ничегонеделание».",
    "Гороскоп для ленивых: встань, попей воды, ляг обратно. Ты справился.",
    "Вселенная сегодня работает за тебя. Твоя задача — просто выглядеть хорошо.",
    "Сегодня можно игнорировать все уведомления. Звёзды тебя прикроют.",
    "Твой единственный план: быть в хорошем настроении. Выполнено заранее.",
    "Сегодня официально разрешено ничего не решать. Решения подождут.",
    "Космос сегодня берёт больничный за тебя. Отдыхай.",
    "Лучший план на сегодня — отсутствие плана. Звёзды одобряют.",
    "Ты имеешь полное право сегодня просто быть. Без достижений.",
    "Сегодня можно не отвечать на сообщения. Вселенная поймёт."
  ],
  en: [
    "Today you can do nothing. The Universe already handled everything. Rest, champion.",
    "Your plan for the day: exist beautifully. Everything else is optional.",
    "The stars say: 'Lie down. We're proud of you even horizontally.'",
    "Perfect day to plan nothing and still be a legend.",
    "The cosmos officially allows you to skip all tasks. All of them.",
    "You've already tried hard enough in this life. Today is a bonus 'do nothing' level.",
    "Lazy horoscope: get up, drink water, lie back down. You did great.",
    "The Universe is working overtime for you. Your only job is to look good.",
    "You may ignore all notifications today. The stars have your back.",
    "Your only mission: be in a good mood. Already completed.",
    "Today it's officially allowed to decide nothing. Decisions can wait.",
    "The cosmos is taking a sick day for you. Rest.",
    "Best plan for today — no plan. The stars approve.",
    "You have every right to just be today. No achievements required.",
    "You can leave messages unanswered today. The Universe understands."
  ]
};

const DAILY_HOROSCOPES = {
  ru: {
    aries: [
      "Овен, сегодня твоя энергия через край. Можно свернуть горы… или хотя бы горизонт.",
      "Звёзды дали тебе зелёный свет на все безумные идеи. Одна из них сегодня выстрелит.",
      "Сегодня ты — ходячий источник драйва. Только не поджигай случайно мебель."
    ],
    taurus: [
      "Телец, сегодня вселенная подкидывает тебе комфорт и маленькие радости. Не отказывайся.",
      "День создан для того, чтобы наслаждаться. Едой, музыкой, людьми.",
      "Сегодня можно чуть медленнее. Красота в деталях, а ты их мастер."
    ],
    gemini: [
      "Близнецы, сегодня твой язык — твоё супероружие. Можно очаровать кого угодно.",
      "Идей будет слишком много. Записывай. Одна из них — реально золотая.",
      "Сегодня ты особенно обаятелен(на). Используй это во благо (или для мемов)."
    ],
    cancer: [
      "Рак, сегодня эмоции на высоте. Это хорошо. Просто не строй из них сериал.",
      "Вселенная сегодня особенно нежная к тебе. Прими эту заботу.",
      "Сегодня можно позволить себе быть мягким. Это сила, а не слабость."
    ],
    leo: [
      "Лев, сегодня сцена принадлежит тебе. Даже если это сцена в маршрутке. Сияй.",
      "Комплименты сегодня будут лететь в тебя, как метеоритный дождь.",
      "Ты сегодня главный герой. Остальные просто счастливы, что попали в твой кадр."
    ],
    virgo: [
      "Дева, сегодня можно немного отпустить контроль. Хаос сегодня — твой друг.",
      "Твоя способность замечать детали сегодня на максимуме. Используй во благо.",
      "Сегодня идеальный день, чтобы навести порядок… или наоборот, разрешить беспорядок."
    ],
    libra: [
      "Весы, сегодня баланс будет найден почти сам собой. Наслаждайся.",
      "Красота и гармония сегодня на твоей стороне. Можно даже не стараться.",
      "Сегодня всё будет красиво. Даже если ты ничего для этого не сделаешь."
    ],
    scorpio: [
      "Скорпион, сегодня твоя интенсивность — это суперсила. Только не пугай прохожих.",
      "Глубина сегодня — твой стиль. Можно погрузиться во что угодно.",
      "Сегодня ты видишь то, что другие не замечают. Это твоё преимущество."
    ],
    sagittarius: [
      "Стрелец, сегодня хочется свободы и приключений. Даже поход в магазин — квест.",
      "Оптимизм сегодня бьёт ключом. Заражай им всех вокруг.",
      "Сегодня вселенная открывает перед тобой двери. Заходи смело."
    ],
    capricorn: [
      "Козерог, сегодня можно немного расслабить галстук. Ты и так всё контролируешь.",
      "Твои усилия замечают. Даже если кажется, что нет. Вселенная ведёт учёт.",
      "Сегодня можно позволить себе маленькую победу без большого плана."
    ],
    aquarius: [
      "Водолей, сегодня твои странные идеи — самые правильные. Не пытайся быть нормальным.",
      "Оригинальность сегодня на максимуме. Используй, пока звёзды дают буст.",
      "Сегодня ты — глоток свежего воздуха для всех вокруг."
    ],
    pisces: [
      "Рыбы, сегодня фантазия работает на полную. Можно придумать целый мир.",
      "Интуиция сегодня — твой лучший навигатор. Доверяй странным ощущениям.",
      "Сегодня можно просто плыть по течению. Течение сегодня доброе."
    ]
  },
  en: {
    aries: [
      "Aries, your energy is off the charts today. You could move mountains… or at least the horizon.",
      "The stars gave you a green light for all crazy ideas. One of them will hit today.",
      "Today you're a walking source of drive. Just try not to accidentally set the furniture on fire."
    ],
    taurus: [
      "Taurus, the Universe is serving you comfort and small joys today. Don't refuse.",
      "This day was made for enjoying things. Food, music, people.",
      "You can go a little slower today. Beauty is in the details, and you're a master of them."
    ],
    gemini: [
      "Gemini, your words are a superpower today. You can charm anyone.",
      "Too many ideas incoming. Write them down. One of them is pure gold.",
      "You're especially charming today. Use it for good (or for memes)."
    ],
    cancer: [
      "Cancer, emotions are running high today. That's good. Just don't turn them into a series.",
      "The Universe is being extra soft with you today. Accept the care.",
      "You can allow yourself to be soft today. It's strength, not weakness."
    ],
    leo: [
      "Leo, the stage is yours today. Even if it's the stage of a public bus. Shine.",
      "Compliments will rain on you like a meteor shower.",
      "You're the main character today. Everyone else is just happy to be in your frame."
    ],
    virgo: [
      "Virgo, you can loosen the grip on control a little today. Chaos is actually your friend.",
      "Your eye for detail is maxed out. Use it for good.",
      "Perfect day to organize everything… or to finally allow some mess."
    ],
    libra: [
      "Libra, balance will almost find itself today. Enjoy it.",
      "Beauty and harmony are on your side. You don't even have to try.",
      "Everything will look beautiful today. Even if you do nothing for it."
    ],
    scorpio: [
      "Scorpio, your intensity is a superpower today. Just try not to scare strangers.",
      "Depth is your style today. Dive into anything you want.",
      "You see what others miss today. That's your advantage."
    ],
    sagittarius: [
      "Sagittarius, you're craving freedom and adventure. Even a trip to the store is a quest.",
      "Optimism is overflowing. Infect everyone around you.",
      "The Universe is opening doors for you today. Walk in boldly."
    ],
    capricorn: [
      "Capricorn, you can loosen the metaphorical tie a little today. You're already in control.",
      "Your efforts are being noticed. Even if it doesn't feel like it.",
      "You can allow yourself a small win without a big plan today."
    ],
    aquarius: [
      "Aquarius, your weird ideas are the correct ones today. Don't try to be normal.",
      "Originality is at maximum. Use it while the stars are giving you a boost.",
      "You're a breath of fresh air for everyone around you today."
    ],
    pisces: [
      "Pisces, your imagination is running at full power. You could invent a whole world.",
      "Intuition is your best navigator today. Trust the weird feelings.",
      "You can just go with the flow today. The flow is kind."
    ]
  }
};

const CELEBRITIES = [
  {
    id: "taylor",
    name: { ru: "Тейлор Свифт", en: "Taylor Swift" },
    emoji: "🎤",
    sign: "sagittarius",
    funny: {
      ru: [
        "Вы оба умеете превращать боль в хиты. Совместимость опасная, но очень продуктивная.",
        "Она напишет о вас альбом. Вы будете в титрах как «вдохновение».",
        "Ваша совместимость звучит как новый трек из Folklore — красиво и гениально."
      ],
      en: [
        "You both turn pain into hits. Dangerous but extremely productive compatibility.",
        "She'll write an album about you. You'll be credited as 'inspiration'.",
        "Your compatibility sounds like a new Folklore track — beautiful and genius."
      ]
    }
  },
  {
    id: "zendaya",
    name: { ru: "Зендая", en: "Zendaya" },
    emoji: "✨",
    sign: "virgo",
    funny: {
      ru: [
        "Вы оба слишком стильные для этого мира. Вместе вы — ходячий Pinterest.",
        "Она посмотрит на вас и скажет «cute». Это уже победа.",
        "Ваша совместимость выглядит как обложка Vogue."
      ],
      en: [
        "You're both too stylish for this world. Together you're a walking Pinterest board.",
        "She'll look at you and say 'cute'. That's already a win.",
        "Your compatibility looks like a Vogue cover."
      ]
    }
  },
  {
    id: "timati",
    name: { ru: "Тимати", en: "Timati" },
    emoji: "🖤",
    sign: "gemini",
    funny: {
      ru: [
        "Вы оба любите, когда всё блестит. Вместе откроете самый дорогой ларёк во вселенной.",
        "Совместимость на уровне «давай купим ещё один бренд».",
        "Звёзды шепчут: вы бы отлично смотрелись на фоне чёрных джипов."
      ],
      en: [
        "You both love when everything shines. Together you'd open the most expensive stall in the universe.",
        "Compatibility level: 'let's buy another brand'.",
        "The stars whisper: you'd look great against a backdrop of black SUVs."
      ]
    }
  },
  {
    id: "morgenshtern",
    name: { ru: "Моргенштерн", en: "Morgenstern" },
    emoji: "🦷",
    sign: "scorpio",
    funny: {
      ru: [
        "Хаос встретил хаос. Вместе вы можете случайно создать новый жанр музыки.",
        "Совместимость взрывная. В прямом и переносном смысле.",
        "Звёзды в шоке, но им нравится ваш вайб."
      ],
      en: [
        "Chaos met chaos. Together you might accidentally invent a new music genre.",
        "Explosive compatibility. Literally and figuratively.",
        "The stars are in shock, but they like your vibe."
      ]
    }
  },
  {
    id: "dud",
    name: { ru: "Юрий Дудь", en: "Yuri Dud" },
    emoji: "🎙️",
    sign: "scorpio",
    funny: {
      ru: [
        "Он задаст вам неудобный вопрос. Вы ответите ещё более неудобным. Идеальный подкаст.",
        "Совместимость на уровне глубокого интервью в 3 часа ночи.",
        "Вместе вы можете раскрыть тайну вселенной… или хотя бы почему все носят шапки."
      ],
      en: [
        "He'll ask you an uncomfortable question. You'll answer with an even more uncomfortable one. Perfect podcast.",
        "Compatibility level: deep interview at 3 a.m.",
        "Together you could uncover the secret of the universe… or at least why everyone wears beanies."
      ]
    }
  },
  {
    id: "rihanna",
    name: { ru: "Рианна", en: "Rihanna" },
    emoji: "👑",
    sign: "pisces",
    funny: {
      ru: [
        "Вы оба умеете появиться, всех очаровать и исчезнуть в закате. Легендарно.",
        "Совместимость уровня «мы просто лучше всех, и нам это не надо доказывать».",
        "Вместе вы — это когда бизнес, музыка и вайб сходятся в одной точке."
      ],
      en: [
        "You both know how to show up, charm everyone, and disappear into the sunset. Legendary.",
        "Compatibility level: 'we're just better and we don't need to prove it'.",
        "Together you're the moment when business, music and vibe become one."
      ]
    }
  },
  {
    id: "elon",
    name: { ru: "Илон Маск", en: "Elon Musk" },
    emoji: "🚀",
    sign: "cancer",
    funny: {
      ru: [
        "Вы оба думаете, что можете колонизировать Марс до обеда. И кто-то из вас почти прав.",
        "Совместимость опасная: вместе вы можете случайно запустить что-то в космос.",
        "Звёзды советуют: сначала договоритесь, кто главный инженер отношений."
      ],
      en: [
        "You both think you can colonize Mars before lunch. And one of you is almost right.",
        "Dangerous compatibility: together you might accidentally launch something into space.",
        "The stars advise: first agree who is the chief engineer of this relationship."
      ]
    }
  },
  {
    id: "biden",
    name: { ru: "Джо Байден", en: "Joe Biden" },
    emoji: "🍦",
    sign: "scorpio",
    funny: {
      ru: [
        "Вы оба любите мороженое и длинные паузы. Понимаете друг друга без слов.",
        "Совместимость спокойная, как воскресный день. Иногда это именно то, что нужно.",
        "Звёзды говорят: вы бы отлично смотрелись на одной скамейке."
      ],
      en: [
        "You both love ice cream and long pauses. You understand each other without words.",
        "Calm compatibility, like a Sunday afternoon. Sometimes that's exactly what you need.",
        "The stars say: you'd look great sitting on the same bench."
      ]
    }
  },
  {
    id: "gaga",
    name: { ru: "Леди Гага", en: "Lady Gaga" },
    emoji: "🎭",
    sign: "aries",
    funny: {
      ru: [
        "Вы оба умеете быть лишними в лучшем смысле этого слова. Вместе — взрыв.",
        "Совместимость уровня «мы родились, чтобы устраивать шоу».",
        "Звёзды говорят: вам нельзя давать микрофон одновременно. Или можно."
      ],
      en: [
        "You both know how to be extra in the best way. Together — explosion.",
        "Compatibility level: 'we were born to put on a show'.",
        "The stars say: you shouldn't be given a microphone at the same time. Or maybe you should."
      ]
    }
  },
  {
    id: "drake",
    name: { ru: "Дрейк", en: "Drake" },
    emoji: "🦉",
    sign: "scorpio",
    funny: {
      ru: [
        "Вы оба умеете быть чувствительными и успешными одновременно. Редкое сочетание.",
        "Совместимость звучит как грустный, но очень дорогой трек.",
        "Звёзды шепчут: вы бы отлично смотрелись в одном клипе."
      ],
      en: [
        "You both know how to be sensitive and successful at the same time. Rare combo.",
        "Compatibility sounds like a sad but very expensive track.",
        "The stars whisper: you'd look great in the same music video."
      ]
    }
  },
  {
    id: "mask",
    name: { ru: "Марк Цукерберг", en: "Mark Zuckerberg" },
    emoji: "🤖",
    sign: "taurus",
    funny: {
      ru: [
        "Вы оба немного инопланетяне. Вместе можете создать новую социальную сеть.",
        "Совместимость странная, но работает. Как и большинство его продуктов.",
        "Звёзды говорят: вам стоит чаще моргать. Обоим."
      ],
      en: [
        "You're both a bit alien. Together you could create a new social network.",
        "Weird compatibility, but it works. Like most of his products.",
        "The stars say: you should blink more often. Both of you."
      ]
    }
  }
];

const CARDS = {
  ru: [
    { title: "Карта Большого Вайба", text: "Сегодня тебе разрешено быть главным источником хорошего настроения. Раздавай вайб бесплатно." },
    { title: "Карта Ленивого Героя", text: "Ты уже победил, просто лёжа на диване. Осталось только принять поздравления." },
    { title: "Карта Случайной Удачи", text: "Сегодня удача придёт через самую неожиданную дверь. Даже через холодильник." },
    { title: "Карта Главного Героя", text: "Сюжет сегодня крутится вокруг тебя. Наслаждайся и не забывай про саундтрек." },
    { title: "Карта Космического Комплимента", text: "Вселенная сегодня лично одобрила твой плейлист, твой стиль и твоё существование." },
    { title: "Карта Мягкого Хаоса", text: "Сегодня можно немного нарушить планы. Хаос будет милым и в твою пользу." },
    { title: "Карта Внутреннего Солнца", text: "Ты сам(а) себе источник света. Можно не ждать хорошей погоды — ты уже она." },
    { title: "Карта Неожиданного Поворота", text: "День сделает сюрприз. Скорее всего приятный. Будь готов(а) улыбнуться." },
    { title: "Карта Тихой Силы", text: "Сегодня твоя сила — в спокойствии. Не нужно никому ничего доказывать." },
    { title: "Карта Хорошего Люда", text: "Сегодня вокруг тебя соберутся правильные люди. Или хотя бы один очень правильный." },
    { title: "Карта Маленькой Победы", text: "Сегодня будет маленькая, но очень приятная победа. Заметь её." },
    { title: "Карта Космического Отпуска", text: "Вселенная сегодня даёт тебе выходной. Можно ничего не достигать." }
  ],
  en: [
    { title: "Card of Big Vibe", text: "Today you're officially allowed to be the main source of good mood. Distribute the vibe for free." },
    { title: "Card of Lazy Hero", text: "You already won just by lying on the couch. Now just accept the congratulations." },
    { title: "Card of Random Luck", text: "Luck will come through the most unexpected door today. Even through the fridge." },
    { title: "Card of Main Character", text: "The plot revolves around you today. Enjoy it and don't forget the soundtrack." },
    { title: "Card of Cosmic Compliment", text: "The Universe personally approved your playlist, your style, and your existence today." },
    { title: "Card of Soft Chaos", text: "You can slightly ruin the plans today. The chaos will be cute and in your favor." },
    { title: "Card of Inner Sun", text: "You are your own source of light. No need to wait for good weather — you already are it." },
    { title: "Card of Unexpected Turn", text: "The day will throw a plot twist. Most likely a nice one. Be ready to smile." },
    { title: "Card of Quiet Strength", text: "Your strength today is in calmness. No need to prove anything to anyone." },
    { title: "Card of Good People", text: "The right people will gather around you today. Or at least one very right person." },
    { title: "Card of Small Victory", text: "There will be a small but very pleasant victory today. Notice it." },
    { title: "Card of Cosmic Day Off", text: "The Universe is giving you a day off today. You can achieve nothing." }
  ]
};

const RANDOM_FORTUNES = {
  ru: [
    "Сегодня ты найдёшь что-то, что искал(а) очень давно. Возможно, это будет зарядка от телефона.",
    "Вселенная готовит тебе маленький, но очень приятный сюрприз. Не моргай.",
    "Кто-то сегодня подумает о тебе хорошо. Очень хорошо. И улыбнётся.",
    "Ты случайно скажешь фразу, которая станет чьим-то девизом на весь год.",
    "Сегодня будет момент, когда ты поймёшь: «А я ведь реально крутой(ая)».",
    "Звёзды советуют купить себе что-то вкусное. Это официальная рекомендация.",
    "Твоя melкость сегодня — это суперсильность. Используй её, чтобы всех рассмешить.",
    "Сегодня можно загадать желание. Вселенная сегодня в хорошем настроении и слушает.",
    "Кто-то сегодня скажет тебе именно то, что нужно было услышать.",
    "Сегодня удача будет выглядеть как обычный день. Не пропусти её.",
    "Ты сегодня кому-то очень сильно понравишься. Даже если не заметишь.",
    "Вселенная сегодня ставит тебе +10 к харизме. Пользуйся.",
    "Сегодня будет смешной момент. Запомни его — он пригодится.",
    "Кто-то из прошлого сегодня мелькнёт в мыслях. Это нормально.",
    "Сегодня можно рискнуть чуть больше обычного. Звёзды не против."
  ],
  en: [
    "Today you'll find something you've been looking for for a long time. Possibly a phone charger.",
    "The Universe is preparing a small but very pleasant surprise for you. Don't blink.",
    "Someone will think very good thoughts about you today. And smile.",
    "You'll accidentally say a phrase that becomes someone's motto for the whole year.",
    "There will be a moment today when you realize: 'Damn, I really am cool'.",
    "The stars officially recommend buying yourself something tasty.",
    "Your silliness is a superpower today. Use it to make everyone laugh.",
    "You can make a wish today. The Universe is in a good mood and listening.",
    "Someone will say exactly what you needed to hear today.",
    "Luck today will look like an ordinary day. Don't miss it.",
    "Someone will really like you today. Even if you don't notice.",
    "The Universe is giving you +10 to charisma today. Use it.",
    "There will be a funny moment today. Remember it — it will come in handy.",
    "Someone from the past will flash through your mind today. That's normal.",
    "You can take a slightly bigger risk than usual today. The stars don't mind."
  ]
};

const ENERGY_PHRASES = {
  ru: [
    "Космическая энергия на максимуме",
    "Ты сегодня как маленькая сверхновая",
    "Заряд вселенского вайба",
    "Энергия главного героя",
    "Буст от самих звёзд",
    "Полный бак космического топлива",
    "Сегодня ты — ходячий источник света",
    "Энергия на уровне «можно свернуть горы»"
  ],
  en: [
    "Cosmic energy at maximum",
    "You're a tiny supernova today",
    "Universal vibe charge",
    "Main character energy",
    "Boost straight from the stars",
    "Full tank of cosmic fuel",
    "Today you're a walking source of light",
    "Energy level: 'can move mountains'"
  ]
};
