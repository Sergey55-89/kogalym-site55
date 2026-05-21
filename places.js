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
            "desc": "Городские часы и арт-объект, отражающий темп северного города и историю его развития.",
            "address": "территория перед офисом ЗАО «ЛУКОЙЛ-АИК» на ул. Мира",
            "mapQuery": "Архитектурная композиция Время Когалыма улица Мира",
            "coords": [
                  62.2642,
                  74.4829
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/03-arkhitekturnaya-kompozitsiya-vremya-kogalyma.jpg",
            "badge": "Арт-объект"
      },
      {
            "type": "landmark",
            "title": "Архитектурная форма к 25-летию ПАО «ЛУКОЙЛ»",
            "desc": "Композиция, установленная в честь юбилея компании. Связана с нефтяной историей города и его промышленным развитием.",
            "address": "Когалым, городская общественная зона",
            "mapQuery": "Архитектурная форма к 25-летию ЛУКОЙЛ Когалым",
            "coords": [
                  62.2638,
                  74.488
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/04-arkhitekturnaya-forma-k-25-letiyu-pao-lukoyl.jpg",
            "badge": "ЛУКОЙЛ"
      },
      {
            "type": "landmark",
            "title": "Бронзовая скульптура «Мальчик, играющий с собакой»",
            "desc": "Городская скульптура, которую часто называют памятником детству. Хорошая точка для спокойной прогулки и семейных фотографий.",
            "address": "городская площадь Когалыма",
            "mapQuery": "Мальчик играющий с собакой Когалым",
            "coords": [
                  62.2648,
                  74.479
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/05-bronzovaya-skulptura-malchik-igrayuschiy-s-sobakoy.jpg",
            "badge": "Скульптура"
      },
      {
            "type": "landmark",
            "title": "Бронзовая скульптура «После вахты»",
            "desc": "Скульптура нефтяника после трудовой смены. Один из самых человечных городских образов, посвящённых людям нефтяной профессии.",
            "address": "Когалым, городская общественная зона",
            "mapQuery": "После вахты Когалым скульптура",
            "coords": [
                  62.265,
                  74.481
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/06-bronzovaya-skulptura-posle-vakhty.jpg",
            "badge": "Скульптура"
      },
      {
            "type": "landmark",
            "title": "Бронзовая скульптурная композиция «Навстречу солнцу»",
            "desc": "Композиция с оленями — яркий северный образ Когалыма, связанный с природой Югры и открытым городским пространством.",
            "address": "городская прогулочная зона Когалыма",
            "mapQuery": "Навстречу солнцу Когалым скульптура",
            "coords": [
                  62.266,
                  74.486
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/07-bronzovaya-skulpturnaya-kompozitsiya-navstrechu-solntsu.jpg",
            "badge": "Скульптура"
      },
      {
            "type": "landmark",
            "title": "Бюст Виталию Шмидту",
            "desc": "Памятный бюст Виталию Шмидту, одному из людей, внёсших вклад в развитие нефтяной отрасли и города.",
            "address": "сквер на проспекте Шмидта",
            "mapQuery": "Бюст Виталию Шмидту Когалым проспект Шмидта",
            "coords": [
                  62.263,
                  74.472
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/08-byust-vitaliyu-shmidtu.jpg",
            "badge": "Бюст"
      },
      {
            "type": "landmark",
            "title": "Бюст Степану Повху",
            "desc": "Бюст в память о Степане Повхе, имя которого связано с историей нефтяного освоения региона.",
            "address": "сквер имени С. Повха на одноимённой улице",
            "mapQuery": "Бюст Степану Повху Когалым сквер Повха",
            "coords": [
                  62.2588,
                  74.4755
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/09-byust-stepanu-povkhu.jpg",
            "badge": "Бюст"
      },
      {
            "type": "landmark",
            "title": "Декоративный объект «Термометр»",
            "desc": "Новая 24-метровая стела-термометр на городской развязке. Объект с подсветкой показывает актуальную температуру воздуха и работает как современный въездной ориентир Когалыма.",
            "address": "новая кольцевая развязка на въездной зоне города",
            "mapQuery": "Декоративный объект Термометр Когалым новая кольцевая развязка",
            "coords": [
                  62.2448,
                  74.5065
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/12-dekorativnyy-obekt-termometr.jpg",
            "badge": "Стела"
      },
      {
            "type": "landmark",
            "title": "Памятник Валерию Грайферу",
            "desc": "Памятник выдающемуся нефтянику Валерию Исааковичу Грайферу, установленный в одноимённом сквере. Центральный объект пространства, посвящённого людям нефтегазовой отрасли.",
            "address": "сквер имени Валерия Грайфера",
            "mapQuery": "Памятник Валерию Грайферу Когалым сквер имени Валерия Грайфера",
            "coords": [
                  62.2589,
                  74.4756
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/27-pamyatnik-v-i-grayferu.jpg",
            "badge": "Памятник"
      },
      {
            "type": "landmark",
            "title": "Самолёт МиГ-21",
            "desc": "Памятный самолёт в городской среде Когалыма. Объект связан с темой авиации и северных маршрутов.",
            "address": "Когалым, городская зона",
            "mapQuery": "Самолет МиГ-21 Когалым",
            "coords": [
                  62.2515,
                  74.4945
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/34-samolet-mig-21.jpg",
            "badge": "Памятник"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Жемчужина Западной Сибири»",
            "desc": "Один из главных городских символов Когалыма. Композиция связывает образ северного города, нефтяной промышленности и современной городской архитектуры.",
            "address": "кольцевая развязка Молодёжная — Дружбы Народов — Югорская",
            "mapQuery": "Жемчужина Западной Сибири Когалым Молодежная Дружбы Народов Югорская",
            "coords": [
                  62.2673,
                  74.4767
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/13-zhemchuzhina.jpg",
            "badge": "Символ"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Капля жизни»",
            "desc": "Памятная городская композиция в форме нефтяной капли. Один из узнаваемых символов нефтяной истории Когалыма и популярная точка для прогулок и фото.",
            "address": "центр Рябинового бульвара, район пересечения улиц Мира и Прибалтийской",
            "mapQuery": "Скульптурная композиция Капля жизни Когалым Рябиновый бульвар",
            "coords": [
                  62.2637,
                  74.4844
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/14-kaplya.jpg",
            "badge": "Памятник"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Летописи России»",
            "desc": "Композиция с фолиантами, отсылающая к историческим текстам и культурной памяти. Расположена в центральной части города.",
            "address": "центральная площадь, пересечение улиц Молодёжной и Мира",
            "mapQuery": "Летописи России Когалым Молодежная Мира",
            "coords": [
                  62.2647,
                  74.4818
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/35-skulpturnaya-kompozitsiya-letopisi-rossii.jpg",
            "badge": "Культура"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Медведица с медвежатами»",
            "desc": "Скульптура с северным характером, подчёркивающая связь Когалыма с природой Югры. Подходит для семейного маршрута и городских фото.",
            "address": "район СКК «Галактика», ул. Дружбы Народов",
            "mapQuery": "Медведица с медвежатами Когалым",
            "coords": [
                  62.2679,
                  74.476
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/21-medveditsa-s-medvezhatami.jpg",
            "badge": "Скульптура"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Покорителям Западной Сибири»",
            "desc": "Монументальная композиция, посвящённая людям, осваивавшим северные территории и нефтяные месторождения Западной Сибири.",
            "address": "въездная зона города, район городской магистрали",
            "mapQuery": "Покорителям Западной Сибири Когалым",
            "coords": [
                  62.2445,
                  74.5058
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/31-pokoritelyam-zapadnoy-sibiri.jpg",
            "badge": "Стела"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Семья»",
            "desc": "Композиция о ценности семьи и преемственности поколений. Установлена как городской символ крепкой семьи.",
            "address": "район роддома по ул. Ленинградской",
            "mapQuery": "Скульптурная композиция Семья Когалым улица Ленинградская",
            "coords": [
                  62.2568,
                  74.4891
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/36-skulpturnaya-kompozitsiya-semya.jpg",
            "badge": "Семья"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция «Слава труду»",
            "desc": "Памятник первооткрывателям когалымской нефти и первопроходцам Тюменского Севера. Один из ключевых памятников трудовой истории города.",
            "address": "проспект Нефтяников — улица Авиаторов",
            "mapQuery": "Слава труду Когалым проспект Нефтяников улица Авиаторов",
            "coords": [
                  62.2556,
                  74.4934
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/37-skulpturnaya-kompozitsiya-slava-trudu.jpg",
            "badge": "Памятник"
      },
      {
            "type": "landmark",
            "title": "Скульптурная композиция в честь святых Петра и Февронии",
            "desc": "Композиция, посвящённая покровителям семьи, любви и верности. Подходит для прогулочного маршрута по семейным городским локациям.",
            "address": "Когалым, общественная зона отдыха",
            "mapQuery": "Петр и Феврония Когалым скульптурная композиция",
            "coords": [
                  62.2657,
                  74.482
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/38-skulpturnaya-kompozitsiya-v-chest-svyatykh-petra-i-fevronii.jpg",
            "badge": "Семья"
      },
      {
            "type": "landmark",
            "title": "Стела «Добрый рок-н-ролл»",
            "desc": "Необычная городская стела, подаренная жителям Когалыма. Объект связан с молодёжной культурой и музыкальной темой.",
            "address": "территория МЦ «Метро»",
            "mapQuery": "Стела Добрый рок-н-ролл Когалым МЦ Метро",
            "coords": [
                  62.2599,
                  74.4879
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/40-stela-dobryy-rok-n-roll.jpg",
            "badge": "Стела"
      },
      {
            "type": "landmark",
            "title": "Стела «Пламя»",
            "desc": "Современная стела на Рябиновом бульваре. Символ памяти, энергии и северного характера города.",
            "address": "Рябиновый бульвар",
            "mapQuery": "Стела Пламя Когалым Рябиновый бульвар",
            "coords": [
                  62.2639,
                  74.485
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/41-stela-plamya.jpg",
            "badge": "Стела"
      },
      {
            "type": "landmark",
            "title": "Цветочные часы",
            "desc": "Декоративный городской объект на улице Дружбы Народов. Летом это одна из заметных зелёных точек города.",
            "address": "улица Дружбы Народов",
            "mapQuery": "Цветочные часы Когалым улица Дружбы Народов",
            "coords": [
                  62.267,
                  74.4791
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/45-tsvetochnye-chasy.jpg",
            "badge": "Город"
      },
      {
            "type": "leisure",
            "title": "Литературный сквер",
            "desc": "Новая прогулочная зона на улице Дружбы Народов. В центре сквера установлена скульптурная композиция с Александром Пушкиным и героями поэмы «Руслан и Людмила».",
            "address": "улица Дружбы Народов, район ТЦ «Миснэ»",
            "mapQuery": "Литературный сквер Когалым улица Дружбы Народов Миснэ",
            "coords": [
                  62.2667,
                  74.4792
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/19-literaturnyy-skver.jpg",
            "badge": "Сквер"
      },
      {
            "type": "leisure",
            "title": "Набережная реки Ингу-Ягун",
            "desc": "Спокойная прогулочная зона у воды. Хороша для вечернего маршрута и фотографий северного города.",
            "address": "набережная реки Ингу-Ягун",
            "mapQuery": "Набережная реки Ингу-Ягун Когалым",
            "coords": [
                  62.258,
                  74.4762
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/23-naberezhnaya-reki-ingu-yagun.jpg",
            "badge": "Набережная"
      },
      {
            "type": "leisure",
            "title": "Парк Первопроходцев",
            "desc": "Городской парк, посвящённый первопроходцам. Подходит для прогулок, семейного отдыха и городских маршрутов.",
            "address": "Парк Первопроходцев",
            "mapQuery": "Парк Первопроходцев Когалым",
            "coords": [
                  62.272,
                  74.486
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/28-park-pervoprokhodtsev.jpg",
            "badge": "Парк"
      },
      {
            "type": "leisure",
            "title": "Парк Победы",
            "desc": "Мемориальный парк, посвящённый памяти защитников Отечества. Входит в основные прогулочные и памятные места Когалыма.",
            "address": "Парк Победы",
            "mapQuery": "Парк Победы Когалым",
            "coords": [
                  62.2659,
                  74.476
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/29-park-pobedy.jpg",
            "badge": "Парк"
      },
      {
            "type": "leisure",
            "title": "Рябиновый бульвар",
            "desc": "Одна из прогулочных линий города, где расположены городские арт-объекты и памятные точки.",
            "address": "Рябиновый бульвар",
            "mapQuery": "Рябиновый бульвар Когалым",
            "coords": [
                  62.2639,
                  74.4844
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/33-ryabinovyy-bulvar.jpg",
            "badge": "Бульвар"
      },
      {
            "type": "leisure",
            "title": "Этнодеревня",
            "desc": "Новое общественное пространство в этническом стиле. Территория задумана как место отдыха у воды с пирсом, прогулочными дорожками, беседками и элементами культуры коренных народов Севера.",
            "address": "район лодочной станции, направление на набережную Ингу-Ягун",
            "mapQuery": "Этнодеревня Когалым район лодочной станции Ингу-Ягун",
            "coords": [
                  62.2572,
                  74.4668
            ],
            "phone": "не требуется",
            "hours": "круглосуточно",
            "image": "images/places/46-etnoderevnya.jpg",
            "badge": "Этно"
      },
      {
            "type": "entertainment",
            "title": "Аквапарк «На гребне волны»",
            "desc": "Аквапарк в СКК «Галактика» с водными зонами для отдыха и оздоровительного плавания.",
            "address": "улица Дружбы Народов, 60, СКК «Галактика»",
            "mapQuery": "Аквапарк На гребне волны Когалым Галактика Дружбы Народов 60",
            "coords": [
                  62.2678,
                  74.4765
            ],
            "phone": "+7 (34667) 5-82-00",
            "hours": "ежедневно 10:00–22:00",
            "image": "images/places/01-akvapark.jpg",
            "badge": "Аквапарк"
      },
      {
            "type": "entertainment",
            "title": "Кинотеатр «Галактика»",
            "desc": "Четырёхзальный кинотеатр в СКК «Галактика» с современным оборудованием и показом премьер.",
            "address": "улица Дружбы Народов, 60, СКК «Галактика»",
            "mapQuery": "Кинотеатр Галактика Когалым Дружбы Народов 60",
            "coords": [
                  62.268,
                  74.4767
            ],
            "phone": "+7 992 356-11-44",
            "hours": "по расписанию сеансов",
            "image": "images/places/15-kinoteatr.jpg",
            "badge": "Кинотеатр"
      },
      {
            "type": "entertainment",
            "title": "Океанариум «Акватика»",
            "desc": "Океанариум в составе СКК «Галактика» с морскими и пресноводными обитателями. Подходит для семейного посещения и экскурсий.",
            "address": "улица Дружбы Народов, 60, СКК «Галактика»",
            "mapQuery": "Океанариум Акватика Когалым Галактика Дружбы Народов 60",
            "coords": [
                  62.2677,
                  74.4764
            ],
            "phone": "+7 (34667) 5-82-00",
            "hours": "ежедневно 10:00–22:00",
            "image": "images/places/25-okeanarium.jpg",
            "badge": "Океанариум"
      },
      {
            "type": "entertainment",
            "title": "Оранжерея «7 садов»",
            "desc": "Субтропическая оранжерея в СКК «Галактика». В каталоге отмечена как дендрарий/зелёная экскурсионная зона комплекса.",
            "address": "улица Дружбы Народов, 60, СКК «Галактика»",
            "mapQuery": "Оранжерея 7 садов Когалым Галактика Дружбы Народов 60",
            "coords": [
                  62.2679,
                  74.4766
            ],
            "phone": "+7 (34667) 5-82-00",
            "hours": "ежедневно 10:00–22:00",
            "image": "images/places/26-oranzhereya.jpg",
            "badge": "Дендрарий"
      },
      {
            "type": "entertainment",
            "title": "СКК «Галактика»",
            "desc": "Главная семейная точка притяжения Когалыма: океанариум, аквапарк, оранжерея, кинотеатр и зоны отдыха в одном комплексе.",
            "address": "улица Дружбы Народов, 60, СКК «Галактика»",
            "mapQuery": "СКК Галактика Когалым Дружбы Народов 60",
            "coords": [
                  62.2676,
                  74.4762
            ],
            "phone": "+7 (34667) 5-82-00",
            "hours": "ежедневно 10:00–22:00",
            "image": "images/places/10-galaktika.jpg",
            "badge": "Развлечения"
      },
      {
            "type": "culture",
            "title": "Культурно-досуговый комплекс «Метро»",
            "desc": "Городская культурная площадка для концертов, встреч, молодёжных программ и мероприятий.",
            "address": "Когалым, КДК «Метро»",
            "mapQuery": "Культурно-досуговый комплекс Метро Когалым",
            "coords": [
                  62.2602,
                  74.4882
            ],
            "phone": "уточнять перед визитом",
            "hours": "по афише мероприятий",
            "image": "images/places/17-kulturno-dosugovyy-kompleks-metro.jpg",
            "badge": "Культура"
      },
      {
            "type": "culture",
            "title": "Филиал Государственного академического Малого театра России",
            "desc": "Когалымская сцена Малого театра России. Один из ключевых культурных объектов города, где проходят спектакли и городские события.",
            "address": "Молодёжная улица, 16",
            "mapQuery": "Филиал Малого театра России Когалым Молодежная 16",
            "coords": [
                  62.2637,
                  74.4758
            ],
            "phone": "+7 (34667) 4-39-69",
            "hours": "по афише и режиму кассы",
            "image": "images/places/43-filial-gosudarstvennogo-akademicheskogo-malogo-teatra-rossii.jpg",
            "badge": "Театр"
      },
      {
            "type": "museum",
            "title": "Информационно-образовательный центр «Русский музей: виртуальный филиал»",
            "desc": "Виртуальный филиал Русского музея на базе Музейно-выставочного центра Когалыма. Формат позволяет знакомиться с коллекциями и образовательными программами Русского музея.",
            "address": "улица Дружбы Народов, 40, Музейно-выставочный центр",
            "mapQuery": "Русский музей виртуальный филиал Когалым Дружбы Народов 40",
            "coords": [
                  62.2663,
                  74.479
            ],
            "phone": "уточнять в Музейно-выставочном центре",
            "hours": "по расписанию музея",
            "image": "images/places/32-russkiy-muzey.jpg",
            "badge": "Музей"
      },
      {
            "type": "museum",
            "title": "Музейно-выставочный центр Когалыма",
            "desc": "Городской музей об истории Когалыма, нефтяной отрасли, культуре Югры и развитии северного города.",
            "address": "улица Дружбы Народов, 40",
            "mapQuery": "Музейно-выставочный центр Когалым Дружбы Народов 40",
            "coords": [
                  62.2663,
                  74.479
            ],
            "phone": "уточнять перед визитом",
            "hours": "график уточнять перед визитом",
            "image": "images/places/22-muzeyno-vystavochnyy-tsentr-kogalyma.jpg",
            "badge": "Музей"
      },
      {
            "type": "religion",
            "title": "Патриаршее подворье Пюхтицкого Успенского женского монастыря",
            "desc": "Православный монастырский комплекс в Когалыме. Один из значимых духовных объектов города.",
            "address": "Югорская улица, 3",
            "mapQuery": "Патриаршее подворье Пюхтицкого Успенского женского монастыря Когалым Югорская 3",
            "coords": [
                  62.2676,
                  74.4751
            ],
            "phone": "+7 (34667) 2-63-83",
            "hours": "по расписанию богослужений",
            "image": "images/places/30-patriarshee-podvore-pyukhtitskogo-uspenskogo-zhenskogo-monastyrya.jpg",
            "badge": "Монастырь"
      },
      {
            "type": "religion",
            "title": "Соборная мечеть Когалыма",
            "desc": "Действующая мечеть Когалыма, важный религиозный и общественный объект мусульманской общины города.",
            "address": "Янтарная улица, 10",
            "mapQuery": "Соборная мечеть Когалым Янтарная 10",
            "coords": [
                  62.2505,
                  74.492
            ],
            "phone": "+7 (34667) 5-18-44",
            "hours": "по расписанию молитв",
            "image": "images/places/39-sobornaya-mechet-kogalyma.jpg",
            "badge": "Мечеть"
      },
      {
            "type": "religion",
            "title": "Храм Святой Мученицы Татианы",
            "desc": "Православный храм Когалыма, связанный с духовной и общественной жизнью города.",
            "address": "Когалым, храм Святой Мученицы Татианы",
            "mapQuery": "Храм Святой Мученицы Татианы Когалым",
            "coords": [
                  62.2598,
                  74.4888
            ],
            "phone": "уточнять при храме",
            "hours": "по расписанию богослужений",
            "image": "images/places/44-khram-svyatoy-muchenitsy-tatiany.jpg",
            "badge": "Храм"
      },
      {
            "type": "sport",
            "title": "Арена «Когалым»",
            "desc": "Современная спортивная площадка для тренировок, соревнований и городских мероприятий.",
            "address": "Когалым, Арена Когалым",
            "mapQuery": "Арена Когалым",
            "coords": [
                  62.2629,
                  74.4884
            ],
            "phone": "уточнять перед визитом",
            "hours": "по расписанию",
            "image": "images/places/02-arena-kogalym.jpg",
            "badge": "Арена"
      },
      {
            "type": "sport",
            "title": "Дворец спорта «Юбилейный»",
            "desc": "Городская спортивная площадка для секций, тренировок и соревнований.",
            "address": "Когалым, дворец спорта «Юбилейный»",
            "mapQuery": "Дворец спорта Юбилейный Когалым",
            "coords": [
                  62.2632,
                  74.486
            ],
            "phone": "уточнять перед визитом",
            "hours": "по расписанию секций",
            "image": "images/places/11-dvorets-sporta-yubileynyy.jpg",
            "badge": "Спорт"
      },
      {
            "type": "sport",
            "title": "Ледовый дворец «Айсберг»",
            "desc": "Ледовая арена для хоккея, тренировок и массовых катаний.",
            "address": "Когалым, ледовый дворец «Айсберг»",
            "mapQuery": "Ледовый дворец Айсберг Когалым",
            "coords": [
                  62.2634,
                  74.487
            ],
            "phone": "уточнять перед визитом",
            "hours": "по расписанию",
            "image": "images/places/18-ledovyy-dvorets-aysberg.jpg",
            "badge": "Лёд"
      },
      {
            "type": "sport",
            "title": "Лыжная база «Снежинка»",
            "desc": "Спортивный объект для зимнего отдыха, тренировок и лыжных прогулок. В сезон работает подготовленная трасса.",
            "address": "Сибирская улица, 10",
            "mapQuery": "Лыжная база Снежинка Когалым Сибирская 10",
            "coords": [
                  62.2753,
                  74.4897
            ],
            "phone": "+7 (34667) 5-57-80",
            "hours": "по сезону и расписанию",
            "image": "images/places/20-lyzhnaya-baza-snezhinka.jpg",
            "badge": "Лыжи"
      },
      {
            "type": "sport",
            "title": "Теннисный центр",
            "desc": "Спортивная площадка для занятий теннисом и городских спортивных активностей.",
            "address": "Когалым, теннисный центр",
            "mapQuery": "Теннисный центр Когалым",
            "coords": [
                  62.262,
                  74.4867
            ],
            "phone": "уточнять перед визитом",
            "hours": "по расписанию",
            "image": "images/places/42-tennisnyy-tsentr.jpg",
            "badge": "Теннис"
      },
      {
            "type": "education",
            "title": "Когалымский политехнический колледж",
            "desc": "Городское образовательное учреждение среднего профессионального образования. Готовит специалистов для города и региона.",
            "address": "Когалымский политехнический колледж",
            "mapQuery": "Когалымский политехнический колледж",
            "coords": [
                  62.263,
                  74.476
            ],
            "phone": "уточнять на официальном сайте",
            "hours": "по графику колледжа",
            "image": "images/places/16-kogalymskiy-politekhnicheskiy-kolledzh.jpg",
            "badge": "Колледж"
      },
      {
            "type": "education",
            "title": "Образовательный центр ПНИПУ в Когалыме",
            "desc": "Образовательная площадка Пермского национального исследовательского политехнического университета в Когалыме.",
            "address": "Береговая улица, 100",
            "mapQuery": "ПНИПУ Когалым Береговая 100",
            "coords": [
                  62.259,
                  74.47
            ],
            "phone": "+7 (34667) 4-31-04",
            "hours": "пн–пт, рабочее время",
            "image": "images/places/24-obrazovatelnyy-tsentr-pnipu-v-kogalyme.jpg",
            "badge": "Вуз"
      }
];

  const grid = document.getElementById('placesGrid');
  const empty = document.getElementById('placesEmpty');
  const search = document.getElementById('placesSearch');
  const filters = document.getElementById('catalogFilters');
  const categoryList = document.getElementById('catalogCategoryList');
  const resultTitle = document.getElementById('catalogResultTitle');
  const resultCount = document.getElementById('catalogResultCount');
  const total = document.getElementById('catalogTotal');
  const reset = document.getElementById('catalogReset');
  const customSelect = document.getElementById('placesSelect');
  const customTrigger = document.getElementById('placesSelectTrigger');
  const customMenu = document.getElementById('placesSelectMenu');

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
  const mapTitle = document.getElementById('placeModalMapTitle');
  const routeBtn = document.getElementById('placeRouteBtn');
  const mapBtn = document.getElementById('placeMapBtn');
  const favorite = document.getElementById('placeFavoriteBtn');

  let currentType = 'all';

  if(!grid) return;

  function norm(value){
    return String(value || '').toLowerCase().replace(/ё/g, 'е').trim();
  }

  function esc(value){
    return String(value || '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  }

  function categoryName(type){
    return (categories.find(cat => cat[0] === type) || categories[0])[1];
  }

  function categoryFull(type){
    return (categories.find(cat => cat[0] === type) || categories[0])[2];
  }

  function makeMapUrl(place){
    if(place && Array.isArray(place.coords)){
      const lat = place.coords[0];
      const lon = place.coords[1];
      return 'https://yandex.ru/maps/?ll=' + encodeURIComponent(lon + ',' + lat) + '&z=17&pt=' + encodeURIComponent(lon + ',' + lat + ',pm2rdm');
    }
    const query = typeof place === 'string' ? place : (place && (place.mapQuery || place.address || place.title)) || 'Когалым';
    return 'https://yandex.ru/maps/?text=' + encodeURIComponent(query);
  }

  function makeRouteUrl(place){
    if(place && Array.isArray(place.coords)){
      const lat = place.coords[0];
      const lon = place.coords[1];
      return 'https://yandex.ru/maps/?rtext=~' + encodeURIComponent(lat + ',' + lon) + '&rtt=auto';
    }
    const query = typeof place === 'string' ? place : (place && (place.mapQuery || place.address || place.title)) || 'Когалым';
    return 'https://yandex.ru/maps/?rtext=~' + encodeURIComponent(query) + '&rtt=auto';
  }

  function cardTemplate(place, index){
    return `
      <article class="place-card catalog-card" data-index="${index}" data-place-type="${esc(place.type)}">
        <div class="place-image" style="background-image:url('${esc(place.image)}')"><span class="place-badge">${esc(place.badge)}</span></div>
        <div class="place-body">
          <div class="place-top"><span>${esc(categoryName(place.type))}</span><b>⌖</b></div>
          <h2>${esc(place.title)}</h2>
          <p>${esc(place.desc)}</p>
          <div class="place-meta"><span>${esc(place.hours)}</span><span>${esc(place.address)}</span></div>
          <button class="place-more" type="button">Открыть карточку</button>
        </div>
      </article>`;
  }

  function renderFilters(){
    const buttons = categories.map(cat => `<button class="place-filter${cat[0] === 'all' ? ' active' : ''}" type="button" data-place-filter="${cat[0]}">${esc(cat[1])}</button>`).join('');
    if(filters) filters.innerHTML = buttons;
    if(customMenu) customMenu.innerHTML = categories.map(cat => `<button type="button" data-value="${cat[0]}">${esc(cat[2])}</button>`).join('');

    if(categoryList){
      categoryList.innerHTML = categories.filter(cat => cat[0] !== 'all').map(cat => {
        const count = places.filter(place => place.type === cat[0]).length;
        return `<button type="button" data-place-filter="${cat[0]}"><span>${esc(cat[2])}</span><b>${count}</b></button>`;
      }).join('');
    }
  }

  function renderCards(){
    grid.innerHTML = places.map(cardTemplate).join('');
    if(total) total.textContent = places.length;
  }

  function visibleCards(){
    return Array.from(grid.querySelectorAll('.place-card'));
  }

  function applyFilter(){
    const q = norm(search ? search.value : '');
    let visible = 0;

    visibleCards().forEach(card => {
      const place = places[Number(card.dataset.index)];
      const text = norm([place.title, place.desc, place.address, place.phone, place.hours, categoryName(place.type), categoryFull(place.type)].join(' '));
      const typeOk = currentType === 'all' || place.type === currentType;
      const searchOk = !q || text.includes(q);
      const ok = typeOk && searchOk;

      card.classList.toggle('hidden', !ok);
      if(ok){
        card.style.removeProperty('display');
      }else{
        card.style.setProperty('display', 'none', 'important');
      }
      if(ok) visible++;
    });

    if(empty) empty.classList.toggle('show', visible === 0);
    if(resultTitle) resultTitle.textContent = categoryFull(currentType);
    if(resultCount) resultCount.textContent = ' · найдено: ' + visible;
  }

  function syncActive(){
    document.querySelectorAll('[data-place-filter]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.placeFilter === currentType);
    });
    if(customTrigger) customTrigger.textContent = categoryFull(currentType);
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
    const routeUrl = makeRouteUrl(place);

    image.style.backgroundImage = `url('${place.image || 'images/places/10-galaktika.jpg'}')`;
    title.textContent = place.title;
    description.textContent = place.desc;
    rating.textContent = categoryFull(place.type);
    modalType.textContent = categoryName(place.type);
    hours.textContent = place.hours;
    address.textContent = place.address;
    phone.textContent = place.phone;
    mapTitle.textContent = place.address;

    routeBtn.href = routeUrl;
    mapBtn.href = url;

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
      customSelect?.classList.remove('open');
      return;
    }

    const selectBtn = event.target.closest('#placesSelectMenu button');
    if(selectBtn){
      setType(selectBtn.dataset.value || 'all');
      customSelect?.classList.remove('open');
      return;
    }

    if(customSelect && !customSelect.contains(event.target)){
      customSelect.classList.remove('open');
    }
  });

  search?.addEventListener('input', applyFilter);

  customTrigger?.addEventListener('click', event => {
    event.stopPropagation();
    customSelect?.classList.toggle('open');
  });

  reset?.addEventListener('click', () => {
    currentType = 'all';
    if(search) search.value = '';
    syncActive();
    applyFilter();
  });

  grid.addEventListener('click', event => {
    const card = event.target.closest('.place-card');
    if(card) openPlace(card);
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
