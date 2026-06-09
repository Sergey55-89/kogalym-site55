(function(){
  'use strict';

  const categories = [
      [
            "all",
            "Все",
            "Все места"
      ],
      [
            "landmark",
            "Памятники",
            "Памятники, стелы и арт-объекты"
      ],
      [
            "leisure",
            "Парки",
            "Парки и общественные пространства"
      ],
      [
            "entertainment",
            "Развлечения",
            "Галактика, аквапарк, океанариум, кино и семейный отдых"
      ],
      [
            "culture",
            "Культура",
            "Театры, музеи и культурные площадки"
      ],
      [
            "museum",
            "Музеи",
            "Музеи и музейные проекты"
      ],
      [
            "religion",
            "Храмы",
            "Храмы и религиозные объекты"
      ],
      [
            "sport",
            "Спорт",
            "Спортивные объекты"
      ],
      [
            "education",
            "Образование",
            "Образовательные объекты"
      ]
];

  const places = [
      {
            "type": "landmark",
            "title": "Архитектурная композиция «Время Когалыма»",
            "desc": "Городские часы и выразительный арт-объект в деловом центре. Хорошая точка для знакомства с городом: рядом офисные здания, прогулочные зоны и характерная северная городская архитектура.",
            "address": "ул. Мира, территория у офиса ЛУКОЙЛ-АИК",
            "mapQuery": "Архитектурная композиция Время Когалыма, улица Мира, Когалым",
            "coords": [
                  62.2642,
                  74.4829
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/01-03-arkhitekturnaya-kompozitsiya-vremya-kogalyma-3df47bdf-v7-4ce0f02be0.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/"
      },
      {
            "type": "landmark",
            "title": "Архитектурная форма к 25-летию ПАО «ЛУКОЙЛ»",
            "desc": "Юбилейная композиция, посвящённая 25-летию компании «ЛУКОЙЛ». Объект подчёркивает нефтяную историю Когалыма и роль города в развитии Западной Сибири.",
            "address": "городская общественная зона Когалыма",
            "mapQuery": "Архитектурная форма 25-летие ЛУКОЙЛ, Когалым",
            "coords": [
                  62.2638,
                  74.488
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/02-04-arkhitekturnaya-forma-k-25-letiyu-pao-lukoyl-35fb84c2-v7-9b42c359d7.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/"
      },
      {
            "type": "landmark",
            "title": "Бронзовая скульптура «Мальчик, играющий с собакой»",
            "desc": "Тёплая бронзовая жанровая скульптура о детстве, дружбе и городской повседневности. Небольшой, но очень живой объект для прогулки и семейных фото.",
            "address": "центральная городская площадь Когалыма",
            "mapQuery": "Мальчик играющий с собакой, центральная площадь, Когалым",
            "coords": [
                  62.2648,
                  74.479
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/03-05-bronzovaya-skulptura-malchik-igrayuschiy-s-sobakoy-7aec9bf9-v7-f026be654c.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/"
      },
      {
            "type": "landmark",
            "title": "Бронзовая скульптура «После вахты»",
            "desc": "Подарок к 25-летию Когалыма от НК «ЛУКОЙЛ». Скульптура изображает нефтяника после рабочей смены и напоминает, что город вырос благодаря людям тяжёлой северной профессии.",
            "address": "пересечение улиц Мира и Молодёжной, район здания ЕРИЦ",
            "mapQuery": "После вахты, Мира Молодежная ЕРИЦ, Когалым",
            "coords": [
                  62.265,
                  74.481
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/04-06-bronzovaya-skulptura-posle-vakhty-3bf98dba-v7-487d3af89c.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/malaya-skulpturnaya-forma-posle-vakhty.php"
      },
      {
            "type": "landmark",
            "title": "Бронзовая скульптурная композиция «Навстречу солнцу»",
            "desc": "Композиция с северными оленями — один из самых выразительных городских образов Когалыма. Объект хорошо работает как фототочка и символ связи города с природой Югры.",
            "address": "городская прогулочная зона Когалыма",
            "mapQuery": "Навстречу солнцу скульптура, Когалым",
            "coords": [
                  62.266,
                  74.486
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/05-07-bronzovaya-skulpturnaya-kompozitsiya-navstrechu-solntsu-1850ab15-v7-bb8fd010cf.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/"
      },
      {
            "type": "landmark",
            "title": "Бюст Виталию Шмидту",
            "desc": "Памятный бюст Виталию Гейнриховичу Шмидту, одному из идеологов создания первой в России вертикально интегрированной нефтяной компании. Установлен в сквере на одноимённом проспекте.",
            "address": "сквер на проспекте Шмидта",
            "mapQuery": "Бюст Виталию Шмидту, проспект Шмидта, Когалым",
            "coords": [
                  62.263,
                  74.472
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/06-08-byust-vitaliyu-shmidtu-9d5935b7-v7-16f02e6849.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/byust-vitaliyu-shmidtu.php"
      },
      {
            "type": "landmark",
            "title": "Бюст Степану Повху",
            "desc": "Памятный бюст знаменитому буровику Степану Повху, одному из первых участников освоения нефтяных богатств Западной Сибири. Объект расположен в сквере имени С. Повха.",
            "address": "сквер имени С. Повха, улица Степана Повха",
            "mapQuery": "Бюст Степану Повху, сквер Повха, Когалым",
            "coords": [
                  62.2588,
                  74.4755
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/07-09-byust-stepanu-povkhu-d5a6594d-v7-9f01fc19fd.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/byust-stepanu-povkhu.php"
      },
      {
            "type": "landmark",
            "title": "Декоративный объект «Термометр»",
            "desc": "Высокий городской термометр-стела на въездной зоне. Это заметный современный ориентир, который сразу задаёт северный характер города и показывает температуру воздуха.",
            "address": "въездная зона города, район новой кольцевой развязки",
            "mapQuery": "Декоративный объект Термометр, новая кольцевая развязка, Когалым",
            "coords": [
                  62.2448,
                  74.5065
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/08-12-dekorativnyy-obekt-termometr-8c80784c-v7-612a4e0428.jpg",
            "badge": "",
            "siteUrl": ""
      },
      {
            "type": "landmark",
            "title": "Памятник Валерию Грайферу",
            "desc": "Памятник Валерию Исааковичу Грайферу — выдающемуся нефтянику и руководителю, чьё имя связано с развитием нефтяной отрасли. Центральный объект одноимённого сквера.",
            "address": "сквер имени Валерия Грайфера",
            "mapQuery": "Памятник Валерию Грайферу, сквер имени Валерия Грайфера, Когалым",
            "coords": [
                  62.2589,
                  74.4756
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/09-27-pamyatnik-v-i-grayferu-9f0663cc-v7-1187630215.jpg",
            "badge": "",
            "siteUrl": ""
      },
      {
            "type": "landmark",
            "title": "Самолёт МиГ-21",
            "desc": "Памятный самолёт МиГ-21 в городской среде. Объект выделяется среди городских локаций и хорошо подходит для короткой остановки в маршруте по памятным местам.",
            "address": "Когалым, городская зона",
            "mapQuery": "Самолёт МиГ-21, Когалым",
            "coords": [
                  62.2515,
                  74.4945
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/10-34-samolet-mig-21-74c178e3-v7-f4e1cf4a85.jpg",
            "badge": "",
            "siteUrl": ""
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Жемчужина Западной Сибири»",
            "desc": "Один из главных символов Когалыма. Композиция подчёркивает образ города как «Жемчужины Западной Сибири» и установлена на заметной кольцевой развязке.",
            "address": "кольцевая развязка улиц Молодёжная — Дружбы Народов — Югорская",
            "mapQuery": "Жемчужина Западной Сибири, Молодежная Дружбы Народов Югорская, Когалым",
            "coords": [
                  62.2673,
                  74.4767
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/11-13-zhemchuzhina-8979945e-v7-815487b745.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/skulpturnaya-kompozitsiya-zhemchuzhina-zapadnoy-sibiri.php"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Капля жизни»",
            "desc": "Бронзовая композиция в форме нефтяной капли — подарок жителям Когалыма к 10-летию «ЛУКОЙЛ». На гранях показаны сюжеты из жизни таёжного города, нефтяников, семей и природы.",
            "address": "Рябиновый бульвар",
            "mapQuery": "Скульптурная композиция Капля жизни, Рябиновый бульвар, Когалым",
            "coords": [
                  62.2637,
                  74.4844
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/12-14-kaplya-ee68275c-v7-f32aa62b2c.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/skulpturnaya-kompozitsiya-kaplya-zhizni.php"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Летописи России»",
            "desc": "Монументальная бронзовая композиция Зураба Церетели: фолианты и свитки, связанные с важными страницами истории России. Один из сильных культурных акцентов центральной части города.",
            "address": "центральная площадь на улице Мира",
            "mapQuery": "Летопись России, центральная площадь, улица Мира, Когалым",
            "coords": [
                  62.2647,
                  74.4818
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/13-35-skulpturnaya-kompozitsiya-letopisi-rossii-79a56942-v7-a77f06b57e.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/skulptura-letopis-rossii.php"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Медведица с медвежатами»",
            "desc": "Семейная скульптурная композиция с медведицей и медвежатами. Северный образ отсылает к природе Югры и гербу города, а сама локация удобна для прогулки рядом с «Галактикой».",
            "address": "район СКК «Галактика», ул. Дружбы Народов",
            "mapQuery": "Медведица с медвежатами, СКК Галактика, Когалым",
            "coords": [
                  62.2679,
                  74.476
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/14-21-medveditsa-s-medvezhatami-ca46b3a9-v7-0b431951e0.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Покорителям Западной Сибири»",
            "desc": "Монументальная композиция, посвящённая первопроходцам и людям, осваивавшим северные территории и нефтяные месторождения Западной Сибири.",
            "address": "въездная зона города",
            "mapQuery": "Покорителям Западной Сибири, Когалым",
            "coords": [
                  62.2445,
                  74.5058
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/15-31-pokoritelyam-zapadnoy-sibiri-0088b2a4-v7-7f79ff9af4.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Семья»",
            "desc": "Городская композиция о любви, семье и преемственности поколений. Хорошо подходит для спокойного маршрута по семейным и социальным объектам города.",
            "address": "район родильного дома, ул. Ленинградская",
            "mapQuery": "Скульптурная композиция Семья, Ленинградская улица, Когалым",
            "coords": [
                  62.2568,
                  74.4891
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/16-36-skulpturnaya-kompozitsiya-semya-aa506a47-v7-ea32f7b236.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Слава труду»",
            "desc": "Памятник первооткрывателям когалымской нефти и первопроходцам Тюменского Севера. Один из ключевых объектов трудовой истории Когалыма.",
            "address": "проспект Нефтяников — улица Авиаторов",
            "mapQuery": "Слава труду, проспект Нефтяников улица Авиаторов, Когалым",
            "coords": [
                  62.2556,
                  74.4934
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/17-37-skulpturnaya-kompozitsiya-slava-trudu-cae36c5d-v7-bd9c5172b2.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/skulpturnaya-kompozitsiya-slava-trudu.php"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция в честь святых Петра и Февронии",
            "desc": "Скульптурная композиция, посвящённая покровителям семьи, любви и верности. Объект органично дополняет маршрут по семейным городским локациям.",
            "address": "общественная зона отдыха Когалыма",
            "mapQuery": "Петр и Феврония скульптура, Когалым",
            "coords": [
                  62.2657,
                  74.482
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/18-38-skulpturnaya-kompozitsiya-v-chest-svyatykh-petra-i-fevronii-74e940de-v7-e33298f156.jpg",
            "badge": "",
            "siteUrl": ""
      },
      {
            "type": "landmark",
            "title": "Стела «Добрый рок-н-ролл»",
            "desc": "Необычная стела о движении, молодости и музыкальной культуре. Установлена на территории молодёжного центра «Метро» и хорошо смотрится в маршруте по объектам культуры.",
            "address": "территория МЦ «Метро»",
            "mapQuery": "Стела Добрый рок-н-ролл, МЦ Метро, Когалым",
            "coords": [
                  62.2599,
                  74.4879
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/19-40-stela-dobryy-rok-n-roll-d7add071-v7-a286a9ee6d.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/stela-dobryy-rok-n-roll.php"
      },
      {
            "type": "landmark",
            "title": "Стела «Пламя»",
            "desc": "30-метровая стела в честь 35-летия города и 30-летия «ЛУКОЙЛ». Объект показывает, как из капли нефти рождается большое дело, и стал сильным акцентом Рябинового бульвара.",
            "address": "Рябиновый бульвар",
            "mapQuery": "Стела Пламя, Рябиновый бульвар, Когалым",
            "coords": [
                  62.2639,
                  74.485
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/20-41-stela-plamya-195d4781-v7-7255bd0312.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/stela-plamya.php"
      },
      {
            "type": "landmark",
            "title": "Цветочные часы",
            "desc": "Подарок нефтяников к 20-летию Когалыма: цветочная композиция с часовым механизмом и надписью «Когалым». Летом объект превращается в яркую городскую клумбу.",
            "address": "улица Дружбы Народов",
            "mapQuery": "Цветочные часы, улица Дружбы Народов, Когалым",
            "coords": [
                  62.267,
                  74.4791
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/21-45-tsvetochnye-chasy-132f6ce5-v7-40f7eccd0a.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/tsvetochnye-chasy.php"
      },
      {
            "type": "leisure",
            "title": "Литературный сквер",
            "desc": "Современная прогулочная зона рядом с ТЦ «Миснэ». В центре установлен памятник Александру Пушкину, вокруг — дорожки, скамейки, освещение, малые архитектурные формы и комфортное пространство для отдыха.",
            "address": "ул. Дружбы Народов, район ТЦ «Миснэ»",
            "mapQuery": "Литературный сквер, ТЦ Миснэ, улица Дружбы Народов, Когалым",
            "coords": [
                  62.2667,
                  74.4792
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/22-19-literaturnyy-skver-2650b27c-v7-96518e55aa.jpg",
            "badge": "",
            "siteUrl": ""
      },
      {
            "type": "leisure",
            "title": "Набережная реки Ингу-Ягун",
            "desc": "Спокойная прогулочная зона у воды. Здесь хорошо идти вечером: вид на северный город, свежий воздух, фотографии у реки и удобная связка с другими локациями маршрута.",
            "address": "набережная реки Ингу-Ягун",
            "mapQuery": "Набережная реки Ингу-Ягун, Когалым",
            "coords": [
                  62.258,
                  74.4762
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/23-23-naberezhnaya-reki-ingu-yagun-6c998331-v7-8d6ebba43d.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/"
      },
      {
            "type": "leisure",
            "title": "Парк Первопроходцев",
            "desc": "Городской парк, посвящённый первопроходцам. Место для прогулок, семейного отдыха и тихого маршрута без суеты.",
            "address": "Парк Первопроходцев",
            "mapQuery": "Парк Первопроходцев, Когалым",
            "coords": [
                  62.272,
                  74.486
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/24-28-park-pervoprokhodtsev-7599f17d-v7-9a46019c2e.jpg",
            "badge": "",
            "siteUrl": ""
      },
      {
            "type": "leisure",
            "title": "Парк Победы",
            "desc": "Мемориальный парк, посвящённый памяти защитников Отечества. Это одна из важных прогулочных и памятных локаций города.",
            "address": "Парк Победы",
            "mapQuery": "Парк Победы, Когалым",
            "coords": [
                  62.2659,
                  74.476
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/25-29-park-pobedy-b1130a2f-v7-13200ce5c9.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/"
      },
      {
            "type": "leisure",
            "title": "Рябиновый бульвар",
            "desc": "Одна из главных прогулочных линий Когалыма. Здесь расположены «Капля жизни», стела «Пламя» и другие узнаваемые городские объекты.",
            "address": "Рябиновый бульвар",
            "mapQuery": "Рябиновый бульвар, Когалым",
            "coords": [
                  62.2639,
                  74.4844
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/26-33-ryabinovyy-bulvar-a3d7d6b7-v7-75adfebd09.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/city/dostoprimechatelnosti-kogalyma/"
      },
      {
            "type": "leisure",
            "title": "Этнодеревня",
            "desc": "Общественное пространство в этническом стиле у воды: прогулочные дорожки, беседки, пирс и элементы культуры коренных народов Севера.",
            "address": "район лодочной станции, направление к набережной Ингу-Ягун",
            "mapQuery": "Этнодеревня, лодочная станция, Ингу-Ягун, Когалым",
            "coords": [
                  62.2572,
                  74.4668
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places-v7/27-46-etnoderevnya-89e18ced-v7-6fb9cccefa.jpg",
            "badge": "",
            "siteUrl": ""
      },
      {
            "type": "entertainment",
            "title": "Аквапарк «На гребне волны»",
            "desc": "Аквапарк в СКК «Галактика» с водными зонами для отдыха и плавания. Отдельный входной режим, поэтому время посещения лучше сверять перед поездкой.",
            "address": "ул. Дружбы Народов, 60, 2 этаж, СКК «Галактика»",
            "mapQuery": "Аквапарк На гребне волны, Дружбы Народов 60, Когалым",
            "coords": [
                  62.2678,
                  74.4765
            ],
            "phone": "+7 (34667) 5-82-19",
            "hours": "пн — санитарный день; вт–пт 10:00–21:00 (вход до 18:00); сб–вс 10:00–22:00 (вход до 19:00)",
            "image": "images/places-v7/28-01-akvapark-dcf30837-v7-7b94fdf37b.jpg",
            "badge": "",
            "siteUrl": "https://skk-galaxy.ru/aquapark/"
      },
      {
            "type": "entertainment",
            "title": "Кинотеатр «Галактика»",
            "desc": "Кинотеатр в СКК «Галактика» с сеансами для семейного отдыха и премьерными показами. Время работы зависит от расписания фильмов.",
            "address": "ул. Дружбы Народов, 60, СКК «Галактика»",
            "mapQuery": "Кинотеатр Галактика, Дружбы Народов 60, Когалым",
            "coords": [
                  62.268,
                  74.4767
            ],
            "phone": "+7 992 356-11-44",
            "hours": "по расписанию сеансов",
            "image": "images/places-v7/29-15-kinoteatr-aaac9143-v7-be29656937.jpg",
            "badge": "",
            "siteUrl": "https://skk-galaxy.ru/"
      },
      {
            "type": "entertainment",
            "title": "Океанариум «Акватика»",
            "desc": "Океанариум в СКК «Галактика» с морскими и пресноводными обитателями. Сильная семейная точка: детям интересно, взрослым тоже не скучно.",
            "address": "ул. Дружбы Народов, 60, СКК «Галактика»",
            "mapQuery": "Океанариум Акватика, Дружбы Народов 60, Когалым",
            "coords": [
                  62.2677,
                  74.4764
            ],
            "phone": "+7 (34667) 5-82-34",
            "hours": "пн 12:00–21:00 (каждый 3-й пн санитарный день); вт–пт 10:00–21:00; сб–вс 10:00–22:00",
            "image": "images/places-v7/30-25-okeanarium-14369988-v7-e241de6c8d.jpg",
            "badge": "",
            "siteUrl": "https://skk-galaxy.ru/oceanarium/"
      },
      {
            "type": "entertainment",
            "title": "Оранжерея «7 садов»",
            "desc": "Субтропическая оранжерея в «Галактике»: зелёная экскурсионная зона с растениями и атмосферой тёплого сада внутри северного города.",
            "address": "ул. Дружбы Народов, 60, СКК «Галактика»",
            "mapQuery": "Оранжерея 7 садов, Дружбы Народов 60, Когалым",
            "coords": [
                  62.2679,
                  74.4766
            ],
            "phone": "+7 (34667) 5-82-00",
            "hours": "пн 10:00–21:00 (каждый 3-й пн с 14:00); вт–пт 10:00–21:00; сб–вс 10:00–22:00",
            "image": "images/places-v7/31-26-oranzhereya-98f29074-v7-7f75d74e50.jpg",
            "badge": "",
            "siteUrl": "https://skk-galaxy.ru/greenhouse/"
      },
      {
            "type": "entertainment",
            "title": "СКК «Галактика»",
            "desc": "Главная семейная точка притяжения Когалыма: аквапарк, океанариум, оранжерея, кинотеатр и зоны отдыха в одном комплексе.",
            "address": "ул. Дружбы Народов, 60",
            "mapQuery": "СКК Галактика, Дружбы Народов 60, Когалым",
            "coords": [
                  62.2676,
                  74.4762
            ],
            "phone": "+7 (34667) 5-82-00, +7 (912) 080-15-17",
            "hours": "ежедневно 10:00–22:00",
            "image": "images/places-v7/32-10-galaktika-7d0f47f0-v7-7323927a6f.jpg",
            "badge": "",
            "siteUrl": "https://skk-galaxy.ru/contacts.html"
      },
      {
            "type": "culture",
            "title": "Культурно-досуговый комплекс «Метро»",
            "desc": "Молодёжный центр и культурная площадка для концертов, встреч, кинопоказов, творческих программ и городских мероприятий.",
            "address": "Северная улица, 1А",
            "mapQuery": "Культурно-досуговый комплекс Метро, Северная улица 1А, Когалым",
            "coords": [
                  62.2602,
                  74.4882
            ],
            "phone": "+7 (34667) 4-30-22",
            "hours": "пн, ср, пт 08:30–22:00; вт, чт 08:30–21:00; сб 17:00–02:00; вс 13:00–23:00; перерыв 12:30–14:00",
            "image": "images/places-v7/33-17-kulturno-dosugovyy-kompleks-metro-bae9c6f4-v7-b4786055a7.jpg",
            "badge": "",
            "siteUrl": "https://admkogalym.ru/administration/structure/kultura/podvedomstvennye-uchrezhdeniya/mau-kulturno-dosugovyy-kompleks-art-prazdnik-/index.php"
      },
      {
            "type": "culture",
            "title": "Филиал Государственного академического Малого театра России",
            "desc": "Когалымская сцена Государственного академического Малого театра России. Театральный объект федерального уровня с афишей спектаклей и кассой на Молодёжной улице.",
            "address": "Молодёжная улица, 16",
            "mapQuery": "Филиал Малого театра России, Молодёжная улица 16, Когалым",
            "coords": [
                  62.2637,
                  74.4758
            ],
            "phone": "+7 (34667) 4-39-69, +7 (982) 884-52-15",
            "hours": "касса: вт–пт 11:00–19:00, сб 10:00–18:00; перерыв 14:00–15:00; вс–пн выходные",
            "image": "images/places-v7/34-43-filial-gosudarstvennogo-akademicheskogo-malogo-teatra-rossii-fbce84fa-v7-d4aa869cb1.jpg",
            "badge": "",
            "siteUrl": "https://www.maly.ru/kogalym/contacts"
      },
      {
            "type": "museum",
            "title": "Информационно-образовательный центр «Русский музей: виртуальный филиал»",
            "desc": "Виртуальный филиал Русского музея на базе Музейно-выставочного центра. Формат даёт доступ к коллекциям, лекциям и образовательным программам крупнейшего музея русского искусства.",
            "address": "ул. Дружбы Народов, 40, Музейно-выставочный центр",
            "mapQuery": "Русский музей виртуальный филиал, Дружбы Народов 40, Когалым",
            "coords": [
                  62.2663,
                  74.479
            ],
            "phone": "+7 (34667) 2-88-58",
            "hours": "по расписанию Музейно-выставочного центра",
            "image": "images/places-v7/35-32-russkiy-muzey-9e4059cf-v7-f06a79c8c5.jpg",
            "badge": "",
            "siteUrl": "https://virtualrm.spb.ru/ru/virtual/kogalym"
      },
      {
            "type": "museum",
            "title": "Музейно-выставочный центр Когалыма",
            "desc": "Ключевой музейный центр города: история Когалыма, нефтяная отрасль, культура Югры, временные выставки и образовательные программы.",
            "address": "ул. Дружбы Народов, 40",
            "mapQuery": "Музейно-выставочный центр, Дружбы Народов 40, Когалым",
            "coords": [
                  62.2663,
                  74.479
            ],
            "phone": "+7 (34667) 2-88-58",
            "hours": "по текущему графику музея; перед визитом лучше уточнить",
            "image": "images/places-v7/36-22-muzeyno-vystavochnyy-tsentr-kogalyma-c33bd5bd-v7-bb88a093c1.jpg",
            "badge": "",
            "siteUrl": "https://museumkogalym.ru/"
      },
      {
            "type": "religion",
            "title": "Патриаршее подворье Пюхтицкого Успенского женского монастыря",
            "desc": "Православный храмовый комплекс на Югорской улице. Значимая духовная локация города с выразительной архитектурой и регулярными богослужениями.",
            "address": "Югорская улица, 3",
            "mapQuery": "Патриаршее подворье Пюхтицкого Успенского женского монастыря, Югорская 3, Когалым",
            "coords": [
                  62.2676,
                  74.4751
            ],
            "phone": "+7 (34667) 2-63-83",
            "hours": "ежедневно 06:30–19:00; богослужения — по расписанию",
            "image": "images/places-v7/37-30-patriarshee-podvore-pyukhtitskogo-uspenskogo-zhenskogo-monastyrya-74bbda10-v7-dc41d6c34f.jpg",
            "badge": "",
            "siteUrl": "https://www.patriarchia.ru/"
      },
      {
            "type": "religion",
            "title": "Соборная мечеть Когалыма",
            "desc": "Действующая соборная мечеть на Янтарной улице. Важный религиозный и общественный объект мусульманской общины города.",
            "address": "Янтарная улица, 10",
            "mapQuery": "Соборная мечеть, Янтарная 10, Когалым",
            "coords": [
                  62.2505,
                  74.492
            ],
            "phone": "+7 (34667) 5-18-44",
            "hours": "ежедневно 08:00–22:00; молитвы — по расписанию",
            "image": "images/places-v7/38-39-sobornaya-mechet-kogalyma-b4db27a1-v7-536d5ef087.jpg",
            "badge": "",
            "siteUrl": ""
      },
      {
            "type": "religion",
            "title": "Храм Святой Мученицы Татианы",
            "desc": "Православный храм в честь святой мученицы Татианы. В расписании прихода — вечернее богослужение по субботам и Божественная литургия по воскресеньям.",
            "address": "улица Комсомольская, 12",
            "mapQuery": "Храм Святой мученицы Татианы, Комсомольская 12, Когалым",
            "coords": [
                  62.2598,
                  74.4888
            ],
            "phone": "не указан",
            "hours": "ежедневно 06:00–18:00; богослужения — по расписанию храма",
            "image": "images/places-v7/39-44-khram-svyatoy-muchenitsy-tatiany-276b874d-v7-0107fa8e5c.jpg",
            "badge": "",
            "siteUrl": "https://ugraeparhia.ru/hram-v-chest-mts-tatianyi-g-kogalyim/"
      },
      {
            "type": "sport",
            "title": "Арена «Когалым»",
            "desc": "Новый современный спортивный объект для тренировок, ледовых занятий, фитнеса и соревнований. Подходит как для спорта, так и для городских мероприятий.",
            "address": "ул. Дружбы Народов, 66",
            "mapQuery": "Когалым-Арена, Дружбы Народов 66, Когалым",
            "coords": [
                  62.2629,
                  74.4884
            ],
            "phone": "+7 (922) 418-71-63",
            "hours": "ежедневно 08:00–22:00",
            "image": "images/places-v7/40-02-arena-kogalym-daedeb58-v7-d59282fa3b.jpg",
            "badge": "",
            "siteUrl": "https://ugramegasport.ru/object/rcsp/"
      },
      {
            "type": "sport",
            "title": "Дворец спорта «Юбилейный»",
            "desc": "Спортивный центр для секций, тренировок и соревнований. Работает ежедневно, есть администраторы и расписание занятий.",
            "address": "проезд Сопочинского, 10",
            "mapQuery": "СЦ Юбилейный, проезд Сопочинского 10, Когалым",
            "coords": [
                  62.2632,
                  74.486
            ],
            "phone": "+7 (34667) 4-08-77, +7 (34667) 4-19-10",
            "hours": "ежедневно 08:00–22:00",
            "image": "images/places-v7/41-11-dvorets-sporta-yubileynyy-5facf5ba-v7-4fc39bd5ea.jpg",
            "badge": "",
            "siteUrl": "https://dvorec86.ru/sportobjects/3"
      },
      {
            "type": "sport",
            "title": "Ледовый дворец «Айсберг»",
            "desc": "Ледовая арена для хоккея, фигурного катания, тренировок и массовых катаний. Один из основных спортивных объектов города.",
            "address": "ул. Дружбы Народов, 32",
            "mapQuery": "Ледовый дворец Айсберг, Дружбы Народов 32, Когалым",
            "coords": [
                  62.2634,
                  74.487
            ],
            "phone": "+7 (34667) 2-69-66",
            "hours": "ежедневно 08:00–22:00",
            "image": "images/places-v7/42-18-ledovyy-dvorets-aysberg-929eb6eb-v7-54997bcf84.jpg",
            "badge": "",
            "siteUrl": "https://dvorec86.ru/sportobjects/2"
      },
      {
            "type": "sport",
            "title": "Лыжная база «Снежинка»",
            "desc": "Зимняя спортивная база для лыжных прогулок, тренировок и активного отдыха. В сезон работает трасса и касса проката.",
            "address": "улица Сибирская, 10",
            "mapQuery": "Лыжная база Снежинка, Сибирская 10, Когалым",
            "coords": [
                  62.2753,
                  74.4897
            ],
            "phone": "+7 (34667) 5-57-80",
            "hours": "ежедневно 08:00–22:00; работа кассы — по расписанию базы",
            "image": "images/places-v7/43-20-lyzhnaya-baza-snezhinka-b7f0b628-v7-83c09d826b.jpg",
            "badge": "",
            "siteUrl": "https://dvorec86.ru/sportobjects/4"
      },
      {
            "type": "sport",
            "title": "Теннисный центр",
            "desc": "Спортивная площадка для занятий теннисом и тренировок. Перед визитом лучше уточнить расписание, свободные корты и формат занятий.",
            "address": "Когалым, теннисный центр",
            "mapQuery": "Теннисный центр, Когалым",
            "coords": [
                  62.262,
                  74.4867
            ],
            "phone": "уточнять перед визитом",
            "hours": "по расписанию",
            "image": "images/places-v7/44-42-tennisnyy-tsentr-77a866fc-v7-55277ad2b7.jpg",
            "badge": "",
            "siteUrl": ""
      },
      {
            "type": "education",
            "title": "Когалымский политехнический колледж",
            "desc": "Учреждение среднего профессионального образования. Готовит специалистов для нефтегазовой отрасли, сервиса и городского хозяйства.",
            "address": "улица Прибалтийская, 22",
            "mapQuery": "Когалымский политехнический колледж, Прибалтийская 22, Когалым",
            "coords": [
                  62.263,
                  74.476
            ],
            "phone": "+7 (34667) 2-17-37",
            "hours": "по графику работы колледжа",
            "image": "images/places-v7/45-16-kogalymskiy-politekhnicheskiy-kolledzh-15415dad-v7-6605f8c9f4.jpg",
            "badge": "",
            "siteUrl": "https://kogpk.ru/"
      },
      {
            "type": "education",
            "title": "Образовательный центр ПНИПУ в Когалыме",
            "desc": "Филиал Пермского национального исследовательского политехнического университета в Когалыме. Современная образовательная площадка для подготовки инженерных кадров.",
            "address": "улица Береговая, 100",
            "mapQuery": "Образовательный центр ПНИПУ, Береговая 100, Когалым",
            "coords": [
                  62.259,
                  74.47
            ],
            "phone": "+7 (34667) 4-31-04",
            "hours": "по графику работы филиала; перед визитом лучше уточнить",
            "image": "images/places-v7/46-24-obrazovatelnyy-tsentr-pnipu-v-kogalyme-6b50bf1e-v7-34880fd8af.jpg",
            "badge": "",
            "siteUrl": "https://pstu.ru/about-the-university/structure-and-governing-bodies/divisions/obrazovatelnyy-tsentr-g-kogalyma1/"
      }
];

  const grid = document.getElementById('placesGrid');
  const empty = document.getElementById('placesEmpty');
  const filters = document.getElementById('catalogFilters');

  const modal = document.getElementById('placeModal');
  const close = document.getElementById('placeModalClose');
  const image = document.getElementById('placeModalImage');
  const title = document.getElementById('placeModalTitle');
  const description = document.getElementById('placeModalDescription');
  const rating = document.getElementById('placeModalRating');
  const modalType = document.getElementById('placeModalType');
  const hours = document.getElementById('placeModalHours');
  const address = document.getElementById('placeModalAddress');
  const phone = document.getElementById('placeModalPhone');
  const mapBtn = document.getElementById('placeMapBtn');
  const siteBtn = document.getElementById('placeSiteBtn');
  const favorite = document.getElementById('placeFavoriteBtn');

  let currentType = 'all';

  if(!grid) return;

  function norm(value){
    return String(value || '').toLowerCase().replace(/ё/g, 'е').trim();
  }

  function esc(value){
    return String(value || '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  }

  function capFirst(value){
    const text = String(value || '').trim();
    if(!text) return '';
    return text.charAt(0).toLocaleUpperCase('ru-RU') + text.slice(1);
  }

  const ASSET_VERSION = 'v7_20260522_nocrop';

  function imageUrl(path){
    const value = String(path || '');
    return value + (value.includes('?') ? '&' : '?') + 'v=' + ASSET_VERSION;
  }

  function categoryName(type){
    return (categories.find(cat => cat[0] === type) || categories[0])[1];
  }

  function categoryFull(type){
    return (categories.find(cat => cat[0] === type) || categories[0])[2];
  }

  function makeMapUrl(place){
    const query = typeof place === 'string' ? place : (place && (place.mapQuery || [place.title, place.address, 'Когалым'].filter(Boolean).join(', '))) || 'Когалым';
    return 'https://yandex.ru/maps/?mode=search&text=' + encodeURIComponent(query);
  }

  function phoneHref(value){
    const raw = String(value || '');
    if(!raw || /не требуется|уточнять/i.test(raw)) return '';
    const first = raw.split(/[,;]/)[0].trim();
    let normalized = first.replace(/[^0-9+]/g, '');
    if(/^8\d{10}$/.test(normalized)) normalized = '+7' + normalized.slice(1);
    if(/^7\d{10}$/.test(normalized)) normalized = '+' + normalized;
    return normalized.length >= 11 ? 'tel:' + normalized : '';
  }

  function renderPhone(value){
    const href = phoneHref(value);
    return href ? '<a href="' + esc(href) + '">' + esc(value) + '</a>' : esc(capFirst(value || 'не указан'));
  }

  function cardTemplate(place, index){
    return `
      <article class="place-card catalog-card" role="button" tabindex="0" aria-label="Открыть карточку: ${esc(place.title)}" data-index="${index}" data-place-type="${esc(place.type)}">
        <div class="place-image"><img src="${esc(imageUrl(place.image))}" alt="${esc(place.title)}" loading="lazy"></div>
        <div class="place-body">
          <div class="place-top"><span>${esc(categoryName(place.type))}</span><b>⌖</b></div>
          <h2>${esc(place.title)}</h2>
          <p>${esc(place.desc)}</p>
          <div class="place-meta"><span>${esc(capFirst(place.hours))}</span><span>${esc(capFirst(place.address))}</span></div>
          <button class="card-info-btn place-info-btn" type="button">Информация</button>
        </div>
      </article>`;
  }

  function renderFilters(){
    if(!filters) return;
    filters.innerHTML = categories.map(cat => `<button class="place-filter${cat[0] === 'all' ? ' active' : ''}" type="button" data-place-filter="${cat[0]}">${esc(cat[1])}</button>`).join('');
  }

  function renderCards(){
    grid.innerHTML = places.map(cardTemplate).join('');
  }

  function visibleCards(){
    return Array.from(grid.querySelectorAll('.place-card'));
  }

  function applyFilter(){
    let visible = 0;

    visibleCards().forEach(card => {
      const place = places[Number(card.dataset.index)];
      const ok = currentType === 'all' || place.type === currentType;

      card.classList.toggle('hidden', !ok);
      if(ok){
        card.style.removeProperty('display');
      }else{
        card.style.setProperty('display', 'none', 'important');
      }
      if(ok) visible++;
    });

    if(empty) empty.classList.toggle('show', visible === 0);
  }

  function syncActive(){
    document.querySelectorAll('[data-place-filter]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.placeFilter === currentType);
    });
  }

  function setType(value){
    currentType = value || 'all';
    syncActive();
    applyFilter();
  }

  function openPlace(card){
    const place = places[Number(card.dataset.index)];
    if(!modal || !place) return;

    const url = makeMapUrl(place);
    image.innerHTML = '<img src="' + imageUrl(place.image || 'images/places-v7/32-10-galaktika-7d0f47f0-v7-7323927a6f.jpg') + '" alt="' + esc(place.title) + '">';
    title.textContent = place.title;
    description.textContent = place.desc;
    rating.textContent = categoryFull(place.type);
    modalType.textContent = categoryName(place.type);
    hours.textContent = capFirst(place.hours);
    address.textContent = capFirst(place.address);
    phone.innerHTML = renderPhone(place.phone);
    mapBtn.href = url;
    if(siteBtn){
      if(place.siteUrl){
        siteBtn.href = place.siteUrl;
        siteBtn.style.display = 'flex';
      }else{
        siteBtn.removeAttribute('href');
        siteBtn.style.display = 'none';
      }
    }


    const favKey = 'catalog_fav_' + norm(place.title).replace(/\s+/g, '_');
    const isFav = localStorage.getItem(favKey) === '1';
    favorite.textContent = isFav ? '★ В избранном' : '♡ В избранное';
    favorite.dataset.key = favKey;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closePlace(){
    if(!modal) return;
    if(image) image.innerHTML = '';
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  renderFilters();
  renderCards();
  applyFilter();

  document.addEventListener('click', event => {
    const filterBtn = event.target.closest('[data-place-filter]');
    if(filterBtn){
      setType(filterBtn.dataset.placeFilter || 'all');
    }
  });

  grid.addEventListener('click', event => {
    const infoButton = event.target.closest('.place-info-btn');
    if(infoButton){
      event.preventDefault();
      const card = infoButton.closest('.place-card');
      if(card) openPlace(card);
      return;
    }
    if(event.target.closest('a, button')) return;
    const card = event.target.closest('.place-card');
    if(card) openPlace(card);
  });

  grid.addEventListener('keydown', event => {
    if(event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.place-card');
    if(!card) return;
    event.preventDefault();
    openPlace(card);
  });

  close?.addEventListener('click', closePlace);
  modal?.addEventListener('click', event => { if(event.target === modal) closePlace(); });

  favorite?.addEventListener('click', () => {
    const key = favorite.dataset.key;
    if(!key) return;
    const active = localStorage.getItem(key) === '1';
    localStorage.setItem(key, active ? '0' : '1');
    favorite.textContent = active ? '♡ В избранное' : '★ В избранном';
  });

  document.addEventListener('keydown', event => {
    if(event.key === 'Escape') closePlace();
  });
})();
