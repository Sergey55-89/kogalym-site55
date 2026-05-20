(function(){
  'use strict';

  const categories = [
    ['all', 'Все', 'Все места'],
    ['landmark', 'Памятники', 'Памятники и достопримечательности'],
    ['culture', 'Культура', 'Театры, музеи, выставки'],
    ['religion', 'Храмы', 'Храмы и религиозные объекты'],
    ['leisure', 'Парки', 'Парки и прогулки'],
    ['sport', 'Спорт', 'Спорт и активный отдых'],
    ['family', 'Семья', 'Семейный отдых'],
    ['education', 'Образование', 'Образование'],
    ['shops', 'Магазины', 'Торговля'],
    ['food', 'Кафе', 'Кафе и рестораны'],
    ['transport', 'Транспорт', 'Транспорт'],
    ['gov', 'Службы', 'Городские службы']
  ];

  const places = [
    {type:'family', title:'СКК «Галактика»', desc:'Главный спортивно-культурный комплекс Когалыма: океанариум, аквапарк, кинотеатр, каток, боулинг, кафе и торговая галерея.', address:'улица Дружбы Народов, 60', mapQuery:'СКК Галактика Когалым улица Дружбы Народов 60', phone:'+7 (34667) 5-82-00', hours:'ежедневно, режим зон уточнять отдельно', image:'images/galaktika.jpg', badge:'Топ'},
    {type:'family', title:'Океанариум «Акватика»', desc:'Океанариум в составе СКК «Галактика». Один из самых узнаваемых семейных объектов города.', address:'улица Дружбы Народов, 60', mapQuery:'Океанариум Акватика Когалым', phone:'+7 (34667) 5-82-00', hours:'по режиму СКК «Галактика»', image:'images/galaktika.jpg', badge:'Океанариум'},
    {type:'family', title:'Аквапарк СКК «Галактика»', desc:'Водная зона комплекса для семейного отдыха: бассейны, горки и развлечения круглый год.', address:'улица Дружбы Народов, 60', mapQuery:'Аквапарк Галактика Когалым', phone:'+7 (34667) 5-82-00', hours:'по расписанию комплекса', image:'images/galaktika.jpg', badge:'Аквапарк'},

    {type:'culture', title:'Филиал Государственного академического Малого театра России', desc:'Когалымская сцена Малого театра России. Спектакли, гастроли, культурные программы и городская афиша.', address:'Молодёжная улица, 16', mapQuery:'Филиал Малого театра России Когалым Молодёжная 16', phone:'+7 (34667) 4-39-69', hours:'касса: вт–пт 11:00–19:00, сб 10:00–18:00, перерыв 14:00–15:00', image:'images/hero.jpg', badge:'Театр'},
    {type:'culture', title:'Музейно-выставочный центр Когалыма', desc:'Городской музей об истории Когалыма, нефтяной отрасли, культуре Югры и развитии города.', address:'улица Дружбы Народов, 40', mapQuery:'Музейно-выставочный центр Когалым улица Дружбы Народов 40', phone:'уточнять на сайте музея', hours:'график уточнять перед визитом', image:'images/night.jpg', badge:'Музей'},
    {type:'culture', title:'Культурно-выставочный центр Русского музея', desc:'Выставочная площадка с культурными программами и проектами Русского музея в Когалыме.', address:'Югорская улица, 30', mapQuery:'Культурно-выставочный центр Русского музея Когалым Югорская 30', phone:'уточнять на сайте музея', hours:'график уточнять перед визитом', image:'images/hero.jpg', badge:'Выставки'},
    {type:'culture', title:'Культурно-досуговый центр «Октябрь»', desc:'Городская площадка для концертов, фестивалей, творческих встреч и официальных мероприятий.', address:'улица Дзержинского, 7', mapQuery:'КДЦ Октябрь Когалым улица Дзержинского 7', phone:'уточнять перед визитом', hours:'по афише мероприятий', image:'images/night.jpg', badge:'Афиша'},

    {type:'religion', title:'Храмовый комплекс Патриаршего подворья Пюхтицкого Успенского женского монастыря', desc:'Православный храмовый комплекс и подворье Пюхтицкого Успенского женского монастыря в Когалыме.', address:'Югорская улица, 3', mapQuery:'Патриаршее подворье Пюхтицкого Успенского женского монастыря Когалым Югорская 3', phone:'+7 (34667) 2-63-83', hours:'ежедневно, ориентировочно 06:30–19:00', image:'images/hero.jpg', badge:'Монастырь'},
    {type:'religion', title:'Храм Успения Пресвятой Богородицы', desc:'Храм на территории Патриаршего подворья. Один из заметных православных объектов города.', address:'Югорская улица, 3', mapQuery:'Храм Успения Пресвятой Богородицы Когалым Югорская 3', phone:'+7 (34667) 2-63-83', hours:'по расписанию богослужений', image:'images/hero.jpg', badge:'Храм'},
    {type:'religion', title:'Соборная мечеть Когалыма', desc:'Действующая мусульманская мечеть города.', address:'Янтарная улица, 10', mapQuery:'Соборная мечеть Когалым Янтарная 10', phone:'+7 (34667) 5-18-44', hours:'ежедневно, ориентировочно 09:00–19:00', image:'images/night.jpg', badge:'Мечеть'},

    {type:'leisure', title:'Парк Победы', desc:'Мемориальный парк с военной техникой, прогулочными зонами и местами для семейного отдыха.', address:'Парк Победы', mapQuery:'Парк Победы Когалым', phone:'не требуется', hours:'круглосуточно', image:'images/park.jpg', badge:'Парк'},
    {type:'leisure', title:'Парк Первопроходцев', desc:'Новая городская прогулочная территория в районе посёлка Первопроходцев: зоны отдыха, прогулки и активный досуг.', address:'парк Первопроходцев', mapQuery:'Парк Первопроходцев Когалым', phone:'не требуется', hours:'круглосуточно', image:'images/park.jpg', badge:'Парк'},
    {type:'leisure', title:'Набережная реки Ингу-Ягун', desc:'Прогулочная зона у воды, хороший вариант для вечернего маршрута и фото.', address:'набережная реки Ингу-Ягун', mapQuery:'Набережная реки Ингу-Ягун Когалым', phone:'не требуется', hours:'круглосуточно', image:'images/embankment.jpg', badge:'Набережная'},
    {type:'leisure', title:'Рябиновый бульвар', desc:'Городская прогулочная зона для спокойного маршрута по Когалыму.', address:'Рябиновый бульвар', mapQuery:'Рябиновый бульвар Когалым', phone:'не требуется', hours:'круглосуточно', image:'images/park.jpg', badge:'Бульвар'},

    {type:'sport', title:'Лыжная база «Снежинка»', desc:'Лыжная база для зимних тренировок и прогулок. Работает прокат и подготовленная лыжня.', address:'Сибирская улица, 10', mapQuery:'Лыжная база Снежинка Когалым Сибирская 10', phone:'+7 (34667) 5-57-80', hours:'касса: вт–вс 13:00–19:30; пн выходной', image:'images/park.jpg', badge:'Лыжи'},
    {type:'sport', title:'Ледовый дворец «Айсберг»', desc:'Ледовая арена для хоккея, тренировок и массовых катаний. Расписание лучше сверять заранее.', address:'Ледовый дворец Айсберг', mapQuery:'Ледовый дворец Айсберг Когалым', phone:'уточнять на карте', hours:'по расписанию', image:'images/galaktika.jpg', badge:'Лёд'},
    {type:'sport', title:'Спортивный комплекс «Юбилейный»', desc:'Городская спортивная площадка для тренировок, секций и соревнований.', address:'СК Юбилейный', mapQuery:'Спортивный комплекс Юбилейный Когалым', phone:'уточнять на карте', hours:'по расписанию секций', image:'images/galaktika.jpg', badge:'Спорт'},

    {type:'education', title:'Образовательный центр в г. Когалыме — филиал ПНИПУ', desc:'Когалымский филиал Пермского национального исследовательского политехнического университета — образовательный центр для подготовки инженерных кадров нефтегазовой отрасли.', address:'Береговая улица, 100', mapQuery:'Образовательный центр Когалым Береговая 100 ПНИПУ', phone:'+7 (34667) 4-31-04', hours:'пн–пт, рабочее время', image:'images/hero.jpg', badge:'Вуз'},
    {type:'education', title:'Когалымский политехнический колледж', desc:'Профессиональное образование и подготовка специалистов для города и региона.', address:'Когалымский политехнический колледж', mapQuery:'Когалымский политехнический колледж', phone:'уточнять на карте', hours:'по графику колледжа', image:'images/hero.jpg', badge:'Колледж'},

    {type:'landmark', title:'Скульптурная композиция «Жемчужина Западной Сибири»', desc:'Один из символов Когалыма, установленный в честь развития города.', address:'пересечение улиц Дружбы Народов и Молодёжной', mapQuery:'Жемчужина Западной Сибири Когалым Дружбы Народов Молодёжная', phone:'не требуется', hours:'круглосуточно', image:'images/night.jpg', badge:'Памятник'},
    {type:'landmark', title:'Скульптурная композиция «Покорителям Западной Сибири»', desc:'Памятная композиция, посвящённая освоителям Западной Сибири и нефтегазовой истории региона.', address:'Когалым', mapQuery:'Покорителям Западной Сибири Когалым', phone:'не требуется', hours:'круглосуточно', image:'images/night.jpg', badge:'Памятник'},
    {type:'landmark', title:'Скульптурная композиция «Капля жизни»', desc:'Городская скульптура, связанная с нефтяной темой и историей развития Когалыма.', address:'Когалым', mapQuery:'Капля жизни Когалым', phone:'не требуется', hours:'круглосуточно', image:'images/hero.jpg', badge:'Скульптура'},
    {type:'landmark', title:'Скульптура «Летопись России»', desc:'Памятная композиция, установленная в центральной части города.', address:'район перекрёстка улиц Мира и Молодёжной', mapQuery:'Летопись России Когалым Мира Молодёжная', phone:'не требуется', hours:'круглосуточно', image:'images/park.jpg', badge:'Скульптура'},
    {type:'landmark', title:'Скульптурная композиция «Медведи»', desc:'Городская скульптурная композиция и точка для прогулки и фото.', address:'Когалым', mapQuery:'Скульптурная композиция Медведи Когалым', phone:'не требуется', hours:'круглосуточно', image:'images/park.jpg', badge:'Фото'},
    {type:'landmark', title:'Цветочные часы', desc:'Декоративная городская точка, которую можно включить в короткий прогулочный маршрут.', address:'Когалым', mapQuery:'Цветочные часы Когалым', phone:'не требуется', hours:'круглосуточно', image:'images/park.jpg', badge:'Город'},
    {type:'landmark', title:'Стела «Пламя»', desc:'Памятная городская стела, связанная с символикой нефтяного города.', address:'Когалым', mapQuery:'Стела Пламя Когалым', phone:'не требуется', hours:'круглосуточно', image:'images/night.jpg', badge:'Стела'},

    {type:'shops', title:'Торговая галерея СКК «Галактика»', desc:'Магазины, сервисы и кафе внутри главного городского комплекса.', address:'улица Дружбы Народов, 60', mapQuery:'Торговая галерея Галактика Когалым Дружбы Народов 60', phone:'+7 (34667) 5-82-00', hours:'10:00–22:00', image:'images/galaktika.jpg', badge:'ТЦ'},
    {type:'shops', title:'DNS', desc:'Магазин электроники, бытовой техники и аксессуаров. Наличие товара лучше проверять заранее.', address:'Когалым, DNS', mapQuery:'DNS Когалым', phone:'8-800-770-79-99', hours:'по графику магазина', image:'images/galaktika.jpg', badge:'Техника'},
    {type:'food', title:'Кафе и рестораны СКК «Галактика»', desc:'Кафе и точки питания внутри комплекса — удобно после океанариума, кино или прогулки.', address:'улица Дружбы Народов, 60', mapQuery:'Кафе Галактика Когалым Дружбы Народов 60', phone:'+7 (34667) 5-82-00', hours:'по графику заведений', image:'images/galaktika.jpg', badge:'Еда'},

    {type:'transport', title:'Железнодорожный вокзал Когалым', desc:'Вокзал для поездов дальнего следования. Расписание проверять через сервисы РЖД.', address:'железнодорожный вокзал', mapQuery:'Железнодорожный вокзал Когалым', phone:'8-800-775-00-00', hours:'по расписанию поездов', image:'images/night.jpg', badge:'Вокзал'},
    {type:'transport', title:'АЗС ЛУКОЙЛ', desc:'Заправочные станции ЛУКОЙЛ, магазин и сервис для автомобилистов.', address:'Когалым, АЗС ЛУКОЙЛ', mapQuery:'АЗС ЛУКОЙЛ Когалым', phone:'8-800-100-09-11', hours:'часть АЗС работает круглосуточно; сверить на карте', image:'images/lukoil.webp', badge:'АЗС'},

    {type:'gov', title:'Администрация города Когалыма', desc:'Официальные муниципальные вопросы, обращения граждан и городские службы.', address:'улица Дружбы Народов, 7', mapQuery:'Администрация города Когалыма Дружбы Народов 7', phone:'+7 (34667) 93-594', hours:'пн–пт, рабочее время', image:'images/hero.jpg', badge:'Город'},
    {type:'gov', title:'МФЦ «Мои документы»', desc:'Государственные и муниципальные услуги, заявления, справки и оформление документов.', address:'Когалым, МФЦ Мои документы', mapQuery:'МФЦ Мои документы Когалым', phone:'122 доб. 4', hours:'по графику МФЦ', image:'images/night.jpg', badge:'МФЦ'}
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

  function makeMapUrl(query){
    return 'https://yandex.ru/maps/?text=' + encodeURIComponent(query || 'Когалым');
  }

  function makeRouteUrl(query){
    return 'https://yandex.ru/maps/?rtext=~' + encodeURIComponent(query || 'Когалым') + '&rtt=auto';
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

    const mapQuery = place.mapQuery || place.address || place.title || 'Когалым';
    const url = makeMapUrl(mapQuery);
    const routeUrl = makeRouteUrl(mapQuery);

    image.style.backgroundImage = `url('${place.image || 'images/galaktika.jpg'}')`;
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
