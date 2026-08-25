// Cosmic Boost - Fun content database

const ZODIAC = {
  aries: { ru: "25=", en: "Aries", emoji: "H", dates: "21.03  19.04" },
  taurus: { ru: ""5;5F", en: "Taurus", emoji: "I", dates: "20.04  20.05" },
  gemini: { ru: ";87=5FK", en: "Gemini", emoji: "J", dates: "21.05  20.06" },
  cancer: { ru: " 0:", en: "Cancer", emoji: "K", dates: "21.06  22.07" },
  leo: { ru: "52", en: "Leo", emoji: "L", dates: "23.07  22.08" },
  virgo: { ru: "520", en: "Virgo", emoji: "M", dates: "23.08  22.09" },
  libra: { ru: "5AK", en: "Libra", emoji: "N", dates: "23.09  22.10" },
  scorpio: { ru: "!:>@?8>=", en: "Scorpio", emoji: "O", dates: "23.10  21.11" },
  sagittarius: { ru: "!B@5;5F", en: "Sagittarius", emoji: "P", dates: "22.11  21.12" },
  capricorn: { ru: ">75@>3", en: "Capricorn", emoji: "Q", dates: "22.12  19.01" },
  aquarius: { ru: ">4>;59", en: "Aquarius", emoji: "R", dates: "20.01  18.02" },
  pisces: { ru: " K1K", en: "Pisces", emoji: "S", dates: "19.02  20.03" }
};

const COMPLIMENTS = {
  ru: [
    "A5;5==0O A53>4=O >A>15==> B>1>9 3>@48BAO. !5@LQ7=>.",
    ""K A53>4=O A25B8HLAO O@G5, G5< 2A5 A>725748O 2<5AB5 27OBK5.",
    ">A<>A H5?G5B: «-B>B G5;>25:  >3>=L». -B> ?@> B51O.",
    ""2>O M=5@38O A53>4=O =0 C@>2=5 A25@E=>2>9. AB>@>6=>, <>6=> 7065GL :>3> C3>4=>.",
    ""K  B>B A0<K9 3;8BG 2 <0B@8F5, :>B>@K9 45;05B <8@ ;CGH5.",
    "2Q74K 4>3>2>@8;8AL: A53>4=O B515 <>6=> 2AQ. 1A>;NB=> 2AQ.",
    ""K 2K3;O48HL B0:, 1C4B> B>;L:> GB> ?>1548;(0) 2 :>A<8G5A:>9 ;>B5@55.",
    "A5;5==0O >B?@028;0 B515 2>74CH=K9 ?>F5;C9. >28.",
    ""K A53>4=O 3;02=K9 ?@>B03>=8AB. AB0;L=K5  <0AA>2:0.",
    ""2>O C;K1:0 A59G0A 8<55B A8;C <0;5=L:>9 GQ@=>9 4K@K  ?@8BO38205B 2A5E."
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
    "Your smile currently has the power of a small black hole  it attracts everyone."
  ]
};

const LAZY_HOROSCOPES = {
  ru: [
    "!53>4=O <>6=> =8G53> =5 45;0BL. A5;5==0O C65 2AQ A45;0;0 70 B51O. B4KE09, G5<?8>=.",
    ""2>9 ?;0= =0 45=L: ACI5AB2>20BL :@0A82>. AQ >AB0;L=>5  >?F8>=0;L=>.",
    "2Q74K 3>2>@OB: «568. K 3>@48<AO B>1>9 4065 2 3>@87>=B0;L=>< ?>;>65=88».",
    "!53>4=O 8450;L=K9 45=L, GB>1K =8G53> =5 ?;0=8@>20BL 8 2AQ @02=> 1KBL <>;>45F.",
    ">A<>A @07@5H05B B515 ?@>?CAB8BL 2A5 45;0. !5@LQ7=>. >B ?@O< 2A5.",
    ""K C65 4>AB0B>G=> ?>AB0@0;AO(0AL) 2 MB>9 687=8. !53>4=O  1>=CA=K9 C@>25=L «=8G53>=545;0=85».",
    ">@>A:>? 4;O ;5=82KE: 2AB0=L, ?>?59 2>4K, ;O3 >1@0B=>. "K A?@028;AO.",
    "A5;5==0O A53>4=O @01>B05B 70 B51O. "2>O 7040G0  ?@>AB> 2K3;O45BL E>@>H>.",
    "!53>4=O <>6=> 83=>@8@>20BL 2A5 C254><;5=8O. 2Q74K B51O ?@8:@>NB.",
    ""2>9 548=AB25==K9 ?;0=: 1KBL 2 E>@>H5< =0AB@>5=88. K?>;=5=> 70@0=55."
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
    "Your only mission: be in a good mood. Already completed."
  ]
};

const DAILY_HOROSCOPES = {
  ru: {
    aries: [
      "25=, A53>4=O B2>O M=5@38O G5@57 :@09. >6=> A25@=CBL 3>@K& 8;8 E>BO 1K 3>@87>=B. ;02=>5  =5 A65GL 2A5E 2>:@C3 A2>8< M=BC7807<><.",
      "2Q74K 40;8 B515 75;Q=K9 A25B =0 2A5 157C<=K5 8458. 4=0 87 =8E A53>4=O 2KAB@5;8B. 0:0O  C7=05HL ?> E>4C."
    ],
    taurus: [
      ""5;5F, A53>4=O 2A5;5==0O ?>4:84K205B B515 :><D>@B 8 <0;5=L:85 @04>AB8. 5 >B:07K209AO. "K MB> 70A;C68;(0).",
      "5=L A>740= 4;O B>3>, GB>1K =0A;0640BLAO. 4>9, <C7K:>9, ;N4L<8. AQ >AB0;L=>5 <>65B ?>4>640BL."
    ],
    gemini: [
      ";87=5FK, A53>4=O B2>9 O7K:  B2>Q AC?5@>@C685. >6=> >G0@>20BL :>3> C3>4=>. ;8 A;CG09=> 70B@>;;8BL. K1>@ 70 B>1>9.",
      "459 1C45B A;8H:>< <=>3>. 0?8AK209. 4=0 87 =8E  @50;L=> 7>;>B0O."
    ],
    cancer: [
      " 0:, A53>4=O M<>F88 =0 2KA>B5. -B> E>@>H>. @>AB> =5 AB@>9 87 =8E F5;K9 A5@80; A 8 A57>=0<8.",
      "A5;5==0O A53>4=O >A>15==> =56=0O : B515. @8<8 MBC 701>BC 8 ?5@540209 40;LH5."
    ],
    leo: [
      "52, A53>4=O AF5=0 ?@8=04;568B B515. 065 5A;8 MB> AF5=0 2 <0@H@CB:5. !8O9, :>@>;L/:>@>;520.",
      "><?;8<5=BK A53>4=O 1C4CB ;5B5BL 2 B51O, :0: <5B5>@8B=K9 4>64L. @8=8<09 A 4>AB>8=AB2><."
    ],
    virgo: [
      "520, A53>4=O <>6=> =5<=>3> >B?CAB8BL :>=B@>;L. %0>A A53>4=O  B2>9 4@C3. @0240-?@0240.",
      ""2>O A?>A>1=>ABL 70<5G0BL 45B0;8 A53>4=O =0 <0:A8<C<5. A?>;L7C9 2> 1;03> (8;8 GB>1K =09B8 8450;L=K9 <5<)."
    ],
    libra: [
      "5AK, A53>4=O 10;0=A 1C45B =0945= ?>GB8 A0< A>1>9. 0A;06409AO @54:8< <><5=B><, :>340 2AQ AE>48BAO.",
      "@0A>B0 8 30@<>=8O A53>4=O =0 B2>59 AB>@>=5. >6=> 4065 =5 AB0@0BLAO  BK 8 B0: ?@5:@0A5=(=0)."
    ],
    scorpio: [
      "!:>@?8>=, A53>4=O B2>O 8=B5=A82=>ABL  MB> AC?5@A8;0. ">;L:> =5 ?C309 A;CG09=KE ?@>E>68E 273;O4><.",
      ";C18=0 A53>4=O  B2>9 AB8;L. >6=> ?>3@C78BLAO 2 8=B5@5A=>5 45;> 8;8 2 GC685 B09=K (A @07@5H5=8O)."
    ],
    sagittarius: [
      "!B@5;5F, A53>4=O E>G5BAO A2>1>4K 8 ?@8:;NG5=89. 065 ?>E>4 2 A>A54=89 <03078= <>65B AB0BL :25AB><.",
      "?B8<87< A53>4=O 1LQB :;NG><. 0@0609 8< 2A5E 2>:@C3. < MB> =C6=>."
    ],
    capricorn: [
      ">75@>3, A53>4=O <>6=> =5<=>3> @0AA;018BL 30;ABC: (2 <5B0D>@8G5A:>< A<KA;5). "K 8 B0: 2AQ :>=B@>;8@C5HL.",
      ""2>8 CA8;8O 70<5G0NB. 065 5A;8 :065BAO, GB> =5B. A5;5==0O 254QB CGQB."
    ],
    aquarius: [
      ">4>;59, A53>4=O B2>8 AB@0==K5 8458  A0<K5 ?@028;L=K5. 5 ?KB09AO 1KBL =>@<0;L=K<. -B> A:CG=>.",
      "@838=0;L=>ABL A53>4=O =0 <0:A8<C<5. A?>;L7C9, ?>:0 72Q74K 40NB 1CAB."
    ],
    pisces: [
      " K1K, A53>4=O D0=B078O @01>B05B =0 ?>;=CN. >6=> ?@84C<0BL F5;K9 <8@& 8;8 ?@>AB> :@0A82K9 ?;59;8AB.",
      "=BC8F8O A53>4=O  B2>9 ;CGH89 =02830B>@. >25@O9 AB@0==K< >ICI5=8O<."
    ]
  },
  en: {
    aries: [
      "Aries, your energy is off the charts today. You could move mountains& or at least the horizon. Just try not to set everyone on fire with your enthusiasm.",
      "The stars gave you a green light for all crazy ideas. One of them will hit today. You'll know which one when it happens."
    ],
    taurus: [
      "Taurus, the Universe is serving you comfort and small joys today. Don't refuse. You earned this.",
      "This day was made for enjoying things. Food, music, people. Everything else can wait."
    ],
    gemini: [
      "Gemini, your words are a superpower today. You can charm anyone. Or accidentally troll them. Your choice.",
      "Too many ideas incoming. Write them down. One of them is pure gold."
    ],
    cancer: [
      "Cancer, emotions are running high today. That's good. Just don't turn them into an 8-season drama series.",
      "The Universe is being extra soft with you today. Accept the care and pass it on."
    ],
    leo: [
      "Leo, the stage is yours today. Even if it's the stage of a public bus. Shine, royalty.",
      "Compliments will rain on you like a meteor shower. Accept them with grace."
    ],
    virgo: [
      "Virgo, you can loosen the grip on control a little today. Chaos is actually your friend right now. Promise.",
      "Your eye for detail is maxed out. Use it for good (or to find the perfect meme)."
    ],
    libra: [
      "Libra, balance will almost find itself today. Enjoy this rare moment when everything just clicks.",
      "Beauty and harmony are on your side. You don't even have to try  you're already stunning."
    ],
    scorpio: [
      "Scorpio, your intensity is a superpower today. Just try not to scare random strangers with your gaze.",
      "Depth is your style today. Dive into something interesting or into someone's secrets (with permission)."
    ],
    sagittarius: [
      "Sagittarius, you're craving freedom and adventure. Even a trip to the corner store can become a quest.",
      "Optimism is overflowing. Infect everyone around you. They need it."
    ],
    capricorn: [
      "Capricorn, you can loosen the metaphorical tie a little today. You're already in control.",
      "Your efforts are being noticed. Even if it doesn't feel like it. The Universe keeps score."
    ],
    aquarius: [
      "Aquarius, your weird ideas are the correct ones today. Don't try to be normal. It's boring.",
      "Originality is at maximum. Use it while the stars are giving you a boost."
    ],
    pisces: [
      "Pisces, your imagination is running at full power. You could invent a whole world& or just a great playlist.",
      "Intuition is your best navigator today. Trust the weird feelings."
    ]
  }
};

const CELEBRITIES = [
  {
    id: "taylor",
    name: { ru: ""59;>@ !28DB", en: "Taylor Swift" },
    emoji: "<¤",
    sign: "sagittarius",
    funny: {
      ru: [
        "K >10 C<55B5 ?@52@0I0BL 1>;L 2 E8BK. !>2<5AB8<>ABL >?0A=0O, => >G5=L ?@>4C:B82=0O.",
        "=0 =0?8H5B > 20A 0;L1><. K 1C45B5 2 B8B@0E :0: «24>E=>25=85».",
        "0H0 A>2<5AB8<>ABL 72CG8B :0: =>2K9 B@5: 87 Folklore  :@0A82>, 3@CAB=> 8 35=80;L=>."
      ],
      en: [
        "You both turn pain into hits. Dangerous but extremely productive compatibility.",
        "She'll write an album about you. You'll be credited as 'inspiration'.",
        "Your compatibility sounds like a new Folklore track  beautiful, sad, and genius."
      ]
    }
  },
  {
    id: "zendaya",
    name: { ru: "5=40O", en: "Zendaya" },
    emoji: "(",
    sign: "virgo",
    funny: {
      ru: [
        "K >10 A;8H:>< AB8;L=K5 4;O MB>3> <8@0. <5AB5 2K  E>4OG89 Pinterest.",
        "=0 ?>A<>B@8B =0 20A 8 A:065B «cute». -B> C65 ?>1540.",
        "0H0 A>2<5AB8<>ABL 2K3;O48B :0: >1;>6:0 Vogue. >@>3>, G8AB>, <>I=>."
      ],
      en: [
        "You're both too stylish for this world. Together you're a walking Pinterest board.",
        "She'll look at you and say 'cute'. That's already a win.",
        "Your compatibility looks like a Vogue cover. Expensive, clean, powerful."
      ]
    }
  },
  {
    id: "timati",
    name: { ru: ""8<0B8", en: "Timati" },
    emoji: "=¤",
    sign: "gemini",
    funny: {
      ru: [
        "K >10 ;N18B5, :>340 2AQ 1;5AB8B. <5AB5 >B:@>5B5 A0<K9 4>@>3>9 ;0@Q: 2> 2A5;5==>9.",
        "!>2<5AB8<>ABL =0 C@>2=5 «40209 :C?8< 5IQ >48= 1@5=4».",
        "2Q74K H5?GCB: 2K 1K >B;8G=> A<>B@5;8AL =0 D>=5 GQ@=KE 468?>2."
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
    name: { ru: ">@35=HB5@=", en: "Morgenstern" },
    emoji: ">·",
    sign: "scorpio",
    funny: {
      ru: [
        "%0>A 2AB@5B8; E0>A. <5AB5 2K <>65B5 A;CG09=> A>740BL =>2K9 60=@ <C7K:8.",
        "!>2<5AB8<>ABL 27@K2=0O.  ?@O<>< 8 ?5@5=>A=>< A<KA;5.",
        "2Q74K 2 H>:5, => 8< =@028BAO 20H 2091."
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
    name: { ru: ".@89 C4L", en: "Yuri Dud" },
    emoji: "<™",
    sign: "scorpio",
    funny: {
      ru: [
        "= 7040AB 20< =5C4>1=K9 2>?@>A. K >B25B8B5 5IQ 1>;55 =5C4>1=K<. 450;L=K9 ?>4:0AB.",
        "!>2<5AB8<>ABL =0 C@>2=5 3;C1>:>3> 8=B5@2LN 2 3 G0A0 =>G8.",
        "<5AB5 2K <>65B5 @0A:@KBL B09=C 2A5;5==>9& 8;8 E>BO 1K ?>G5<C 2A5 =>AOB H0?:8."
      ],
      en: [
        "He'll ask you an uncomfortable question. You'll answer with an even more uncomfortable one. Perfect podcast.",
        "Compatibility level: deep interview at 3 a.m.",
        "Together you could uncover the secret of the universe& or at least why everyone wears beanies."
      ]
    }
  },
  {
    id: "rihanna",
    name: { ru: " 80==0", en: "Rihanna" },
    emoji: "=Q",
    sign: "pisces",
    funny: {
      ru: [
        "K >10 C<55B5 ?>O28BLAO, 2A5E >G0@>20BL 8 8AG57=CBL 2 70:0B5. 535=40@=>.",
        "!>2<5AB8<>ABL C@>2=O «<K ?@>AB> ;CGH5 2A5E, 8 =0< MB> =5 =04> 4>:07K20BL».",
        "<5AB5 2K  MB> :>340 187=5A, <C7K:0 8 2091 AE>4OBAO 2 >4=>9 B>G:5."
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
    name: { ru: ";>= 0A:", en: "Elon Musk" },
    emoji: "=€",
    sign: "cancer",
    funny: {
      ru: [
        "K >10 4C<05B5, GB> <>65B5 :>;>=878@>20BL 0@A 4> >1540.  :B>-B> 87 20A ?>GB8 ?@02.",
        "!>2<5AB8<>ABL >?0A=0O: 2<5AB5 2K <>65B5 A;CG09=> 70?CAB8BL GB>-B> 2 :>A<>A.",
        "2Q74K A>25BCNB: A=0G0;0 4>3>2>@8B5AL, :B> 3;02=K9 8=65=5@ >B=>H5=89."
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
    name: { ru: "6> 0945=", en: "Joe Biden" },
    emoji: "<f",
    sign: "scorpio",
    funny: {
      ru: [
        "K >10 ;N18B5 <>@>65=>5 8 4;8==K5 ?0C7K. >=8<05B5 4@C3 4@C30 157 A;>2.",
        "!>2<5AB8<>ABL A?>:>9=0O, :0: 2>A:@5A=K9 45=L. =>340 MB> 8<5==> B>, GB> =C6=>.",
        "2Q74K 3>2>@OB: 2K 1K >B;8G=> A<>B@5;8AL =0 >4=>9 A:0<59:5."
      ],
      en: [
        "You both love ice cream and long pauses. You understand each other without words.",
        "Calm compatibility, like a Sunday afternoon. Sometimes that's exactly what you need.",
        "The stars say: you'd look great sitting on the same bench."
      ]
    }
  }
];

const CARDS = {
  ru: [
    { title: "0@B0 >;LH>3> 0910", text: "!53>4=O B515 @07@5H5=> 1KBL 3;02=K< 8AB>G=8:>< E>@>H53> =0AB@>5=8O.  0740209 2091 15A?;0B=>." },
    { title: "0@B0 5=82>3> 5@>O", text: ""K C65 ?>1548;, ?@>AB> ;Q60 =0 4820=5. AB0;>AL B>;L:> ?@8=OBL ?>74@02;5=8O." },
    { title: "0@B0 !;CG09=>9 #40G8", text: "!53>4=O C40G0 ?@84QB G5@57 A0<CN =5>6840==CN 425@L. 065 G5@57 E>;>48;L=8:." },
    { title: "0@B0 ;02=>3> 5@>O", text: "!N65B A53>4=O :@CB8BAO 2>:@C3 B51O. 0A;06409AO 8 =5 701K209 ?@> A0C=4B@5:." },
    { title: "0@B0 >A<8G5A:>3> ><?;8<5=B0", text: "A5;5==0O A53>4=O ;8G=> >4>1@8;0 B2>9 ?;59;8AB, B2>9 AB8;L 8 B2>Q ACI5AB2>20=85." },
    { title: "0@B0 O3:>3> %0>A0", text: "!53>4=O <>6=> =5<=>3> =0@CH8BL ?;0=K. %0>A 1C45B <8;K< 8 2 B2>N ?>;L7C." },
    { title: "0@B0 =CB@5==53> !>;=F0", text: ""K A0<(0) A515 8AB>G=8: A25B0. >6=> =5 640BL E>@>H59 ?>3>4K  BK C65 >=0." },
    { title: "0@B0 5>6840==>3> >2>@>B0", text: "5=L A45;05B AN@?@87. !:>@55 2A53> ?@8OB=K9. C4L 3>B>2(0) C;K1=CBLAO." }
  ],
  en: [
    { title: "Card of Big Vibe", text: "Today you're officially allowed to be the main source of good mood. Distribute the vibe for free." },
    { title: "Card of Lazy Hero", text: "You already won just by lying on the couch. Now just accept the congratulations." },
    { title: "Card of Random Luck", text: "Luck will come through the most unexpected door today. Even through the fridge." },
    { title: "Card of Main Character", text: "The plot revolves around you today. Enjoy it and don't forget the soundtrack." },
    { title: "Card of Cosmic Compliment", text: "The Universe personally approved your playlist, your style, and your existence today." },
    { title: "Card of Soft Chaos", text: "You can slightly ruin the plans today. The chaos will be cute and in your favor." },
    { title: "Card of Inner Sun", text: "You are your own source of light. No need to wait for good weather  you already are it." },
    { title: "Card of Unexpected Turn", text: "The day will throw a plot twist. Most likely a nice one. Be ready to smile." }
  ]
};

const RANDOM_FORTUNES = {
  ru: [
    "!53>4=O BK =094QHL GB>-B>, GB> 8A:0;(0) >G5=L 402=>. >7<>6=>, MB> 1C45B 70@O4:0 >B B5;5D>=0.",
    "A5;5==0O 3>B>28B B515 <0;5=L:89, => >G5=L ?@8OB=K9 AN@?@87. 5 <>@309.",
    "B>-B> A53>4=O ?>4C<05B > B515 E>@>H>. G5=L E>@>H>.  C;K1=QBAO.",
    ""K A;CG09=> A:065HL D@07C, :>B>@0O AB0=5B GL8<-B> 45287>< =0 25AL 3>4.",
    "!53>4=O 1C45B <><5=B, :>340 BK ?>9<QHL: « O 254L @50;L=> :@CB>9(0O)».",
    "2Q74K A>25BCNB :C?8BL A515 GB>-B> 2:CA=>5. -B> >D8F80;L=0O @5:><5=40F8O.",
    ""2>O mel:>ABL A53>4=O  MB> AC?5@A8;L=>ABL. A?>;L7C9 5Q, GB>1K 2A5E @0AA<5H8BL.",
    "!53>4=O <>6=> 703040BL 65;0=85. A5;5==0O A53>4=O 2 E>@>H5< =0AB@>5=88 8 A;CH05B."
  ],
  en: [
    "Today you'll find something you've been looking for for a long time. Possibly a phone charger.",
    "The Universe is preparing a small but very pleasant surprise for you. Don't blink.",
    "Someone will think very good thoughts about you today. And smile.",
    "You'll accidentally say a phrase that becomes someone's motto for the whole year.",
    "There will be a moment today when you realize: 'Damn, I really am cool'.",
    "The stars officially recommend buying yourself something tasty.",
    "Your silliness is a superpower today. Use it to make everyone laugh.",
    "You can make a wish today. The Universe is in a good mood and listening."
  ]
};

const ENERGY_PHRASES = {
  ru: [
    ">A<8G5A:0O M=5@38O =0 <0:A8<C<5",
    ""K A53>4=O :0: <0;5=L:0O A25@E=>20O",
    "0@O4 2A5;5=A:>3> 20910",
    "-=5@38O 3;02=>3> 35@>O",
    "CAB >B A0<8E 72Q74"
  ],
  en: [
    "Cosmic energy at maximum",
    "You're a tiny supernova today",
    "Universal vibe charge",
    "Main character energy",
    "Boost straight from the stars"
  ]
};
