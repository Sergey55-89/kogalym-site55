(function(){
  'use strict';

  const categories = [
    ['all', 'Все', 'Все организации'],
    ['medicine', 'Медицина', 'Больницы, аптеки, клиники'],
    ['education', 'Школы', 'Образование'],
    ['kids', 'Детсады', 'Дошкольное'],
    ['shops', 'Магазины', 'Покупки'],
    ['food', 'Кафе', 'Еда и кофе'],
    ['sport', 'Спорт', 'Спорт и активность'],
    ['gov', 'Госслужбы', 'Документы и службы'],
    ['transport', 'Транспорт', 'АЗС, вокзал, такси'],
    ['finance', 'Банки', 'Финансы'],
    ['leisure', 'Отдых', 'Парки и досуг']
  ];

  const places = [
    {type:'gov', title:'Администрация города Когалыма', desc:'Муниципальные вопросы, обращения граждан, городские службы.', address:'Когалым, улица Дружбы Народов, 7', phone:'+7 (34667) 93-594', hours:'пн–пт, рабочее время', image:'images/hero.jpg', badge:'Город'},
    {type:'gov', title:'МФЦ «Мои документы»', desc:'Государственные и муниципальные услуги, документы, заявления.', address:'Когалым, улица Мира, 15', phone:'122 доб. 4', hours:'по графику МФЦ', image:'images/galaktika.jpg', badge:'МФЦ'},
    {type:'gov', title:'Почта России', desc:'Почтовые отправления, посылки, платежи и услуги связи.', address:'Когалым, отделения Почты России', phone:'8-800-100-00-00', hours:'по графику отделения', image:'images/night.jpg', badge:'Почта'},

    {type:'medicine', title:'Когалымская городская больница', desc:'Медицинская помощь, поликлиника, стационарные направления.', address:'Когалым, Молодёжная улица, 19', phone:'+7 (34667) 4-30-44', hours:'по графику отделений', image:'images/embankment.jpg', badge:'Медицина'},
    {type:'medicine', title:'Взрослая поликлиника', desc:'Приём взрослого населения, регистратура, вызов врача.', address:'Когалым, Молодёжная улица, 19', phone:'+7 (34667) 2-10-45', hours:'пн–пт 07:30–20:00', image:'images/embankment.jpg', badge:'Поликлиника'},
    {type:'medicine', title:'Детская поликлиника', desc:'Приём детей, профилактика, справки, направления.', address:'Когалым, детская поликлиника', phone:'+7 (34667) 2-01-45', hours:'пн–пт 07:30–20:00', image:'images/park.jpg', badge:'Дети'},
    {type:'medicine', title:'Аптеки Когалыма', desc:'Лекарства, витамины и медицинские товары рядом с домом.', address:'Когалым, аптеки', phone:'актуальный телефон — на карте', hours:'по графику филиалов', image:'images/galaktika.jpg', badge:'Аптеки'},

    {type:'education', title:'Средняя школа №1', desc:'Среднее общее образование.', address:'Когалым, школа №1', phone:'официальный сайт школы', hours:'пн–сб, учебное время', image:'images/park.jpg', badge:'Школа'},
    {type:'education', title:'Средняя школа №2', desc:'Среднее общее образование и внеурочная деятельность.', address:'Когалым, школа №2', phone:'официальный сайт школы', hours:'пн–сб, учебное время', image:'images/park.jpg', badge:'Школа'},
    {type:'education', title:'Средняя школа №3', desc:'Образовательная организация города.', address:'Когалым, школа №3', phone:'официальный сайт школы', hours:'пн–сб, учебное время', image:'images/park.jpg', badge:'Школа'},
    {type:'education', title:'Средняя школа №5', desc:'Обучение, секции и мероприятия для школьников.', address:'Когалым, школа №5', phone:'официальный сайт школы', hours:'пн–сб, учебное время', image:'images/park.jpg', badge:'Школа'},
    {type:'education', title:'Средняя школа №6', desc:'Среднее образование и городские образовательные проекты.', address:'Когалым, школа №6', phone:'официальный сайт школы', hours:'пн–сб, учебное время', image:'images/park.jpg', badge:'Школа'},
    {type:'education', title:'Средняя школа №8', desc:'Среднее общее образование.', address:'Когалым, улица Янтарная, 11', phone:'+7 (34667) 2-74-03', hours:'пн–пт 08:00–16:30; сб 09:00–13:00', image:'images/park.jpg', badge:'Школа'},
    {type:'education', title:'Центр дополнительного образования', desc:'Кружки, секции и развитие детей.', address:'Когалым, центр дополнительного образования', phone:'актуальный телефон — на карте', hours:'по расписанию', image:'images/galaktika.jpg', badge:'Развитие'},

    {type:'kids', title:'Детские сады Когалыма', desc:'Дошкольное образование, присмотр и развитие детей.', address:'Когалым, детские сады', phone:'актуальный телефон — на карте', hours:'пн–пт, по графику учреждения', image:'images/park.jpg', badge:'Детсады'},
    {type:'kids', title:'Детский сад «Берёзка»', desc:'Дошкольное образование и присмотр за детьми.', address:'Когалым, Ленинградская улица, 55', phone:'+7 (34667) 4-73-23', hours:'пн–пт 07:00–19:00', image:'images/park.jpg', badge:'Сад'},
    {type:'kids', title:'Детский сад «Сказка»', desc:'Дошкольное образование и развитие.', address:'Когалым, детский сад Сказка', phone:'актуальный телефон — на карте', hours:'пн–пт, по графику учреждения', image:'images/park.jpg', badge:'Сад'},
    {type:'kids', title:'Детский сад «Ромашка»', desc:'Дошкольные группы, воспитание, развитие.', address:'Когалым, детский сад Ромашка', phone:'актуальный телефон — на карте', hours:'пн–пт, по графику учреждения', image:'images/park.jpg', badge:'Сад'},

    {type:'shops', title:'ТРЦ «Галактика»', desc:'Магазины, кафе, досуг и городские встречи.', address:'Когалым, улица Дружбы Народов, 60', phone:'+7 (34667) 5-82-00', hours:'10:00–22:00', image:'images/galaktika.jpg', badge:'ТРЦ'},
    {type:'shops', title:'Пятёрочка', desc:'Продукты и товары повседневного спроса.', address:'Когалым, магазин Пятёрочка', phone:'8-800-555-55-05', hours:'по графику магазина', image:'images/galaktika.jpg', badge:'Продукты'},
    {type:'shops', title:'Магнит', desc:'Продуктовый магазин рядом с домом.', address:'Когалым, магазин Магнит', phone:'8-800-200-90-02', hours:'по графику магазина', image:'images/galaktika.jpg', badge:'Продукты'},
    {type:'shops', title:'DNS', desc:'Электроника, техника, аксессуары.', address:'Когалым, DNS', phone:'8-800-770-79-99', hours:'по графику магазина', image:'images/galaktika.jpg', badge:'Техника'},
    {type:'shops', title:'Wildberries', desc:'Пункты выдачи заказов.', address:'Когалым, Wildberries', phone:'через приложение/пункт выдачи', hours:'по графику пункта', image:'images/galaktika.jpg', badge:'ПВЗ'},
    {type:'shops', title:'Ozon', desc:'Пункты выдачи заказов.', address:'Когалым, Ozon', phone:'через приложение/пункт выдачи', hours:'по графику пункта', image:'images/galaktika.jpg', badge:'ПВЗ'},

    {type:'food', title:'Кафе и рестораны', desc:'Городские кафе, рестораны, доставка и семейные заведения.', address:'Когалым, кафе и рестораны', phone:'актуальный телефон — на карте', hours:'по графику заведения', image:'images/galaktika.jpg', badge:'Еда'},
    {type:'food', title:'Кофейни', desc:'Кофе, десерты и быстрые встречи.', address:'Когалым, кофейни', phone:'актуальный телефон — на карте', hours:'по графику заведения', image:'images/galaktika.jpg', badge:'Кофе'},
    {type:'food', title:'Пиццерии', desc:'Пицца, доставка, быстрый перекус.', address:'Когалым, пиццерии', phone:'актуальный телефон — на карте', hours:'по графику заведения', image:'images/galaktika.jpg', badge:'Пицца'},

    {type:'sport', title:'Спортивные комплексы', desc:'Тренировки, секции, занятия для взрослых и детей.', address:'Когалым, спортивные комплексы', phone:'актуальный телефон — на карте', hours:'по расписанию', image:'images/galaktika.jpg', badge:'Спорт'},
    {type:'sport', title:'Ледовый дворец', desc:'Каток, хоккей, массовое катание.', address:'Когалым, ледовый дворец', phone:'актуальный телефон — на карте', hours:'по расписанию', image:'images/galaktika.jpg', badge:'Каток'},
    {type:'sport', title:'Бассейны', desc:'Плавание, секции, оздоровительные занятия.', address:'Когалым, бассейн', phone:'актуальный телефон — на карте', hours:'по расписанию', image:'images/galaktika.jpg', badge:'Плавание'},
    {type:'sport', title:'Фитнес-клубы', desc:'Тренажёрные залы и групповые программы.', address:'Когалым, фитнес-клубы', phone:'актуальный телефон — на карте', hours:'по графику клуба', image:'images/galaktika.jpg', badge:'Фитнес'},

    {type:'transport', title:'Железнодорожный вокзал', desc:'Поезда, расписание, отправление и прибытие.', address:'Когалым, железнодорожный вокзал', phone:'8-800-775-00-00', hours:'по расписанию поездов', image:'images/night.jpg', badge:'Вокзал'},
    {type:'transport', title:'Автостанция', desc:'Междугородние и пригородные направления.', address:'Когалым, автостанция', phone:'актуальный телефон — на карте', hours:'по расписанию рейсов', image:'images/night.jpg', badge:'Автобусы'},
    {type:'transport', title:'АЗС ЛУКОЙЛ', desc:'Топливо, магазин, сервис для автомобилистов.', address:'Когалым, АЗС ЛУКОЙЛ', phone:'8-800-100-09-11', hours:'обычно круглосуточно, сверить на карте', image:'images/lukoil.webp', badge:'АЗС'},
    {type:'transport', title:'Такси и трансфер', desc:'Городские поездки и трансфер.', address:'Когалым, такси', phone:'в сервисе такси', hours:'круглосуточно или по сервису', image:'images/night.jpg', badge:'Такси'},

    {type:'finance', title:'СберБанк', desc:'Банковские услуги, банкоматы, платежи.', address:'Когалым, СберБанк', phone:'900', hours:'по графику офиса', image:'images/galaktika.jpg', badge:'Банк'},
    {type:'finance', title:'ВТБ', desc:'Банковские услуги для физических и юридических лиц.', address:'Когалым, ВТБ', phone:'1000', hours:'по графику офиса', image:'images/galaktika.jpg', badge:'Банк'},
    {type:'finance', title:'Почта Банк', desc:'Финансовые услуги и платежи.', address:'Когалым, Почта Банк', phone:'8-800-550-07-70', hours:'по графику офиса', image:'images/galaktika.jpg', badge:'Банк'},
    {type:'finance', title:'Банкоматы', desc:'Снятие наличных, платежи, переводы.', address:'Когалым, банкоматы', phone:'не требуется', hours:'по графику точки', image:'images/galaktika.jpg', badge:'24/7'},

    {type:'leisure', title:'Парк Победы', desc:'Прогулки, семейный отдых, городские мероприятия.', address:'Когалым, Парк Победы', phone:'не требуется', hours:'круглосуточно', image:'images/park.jpg', badge:'Парк'},
    {type:'leisure', title:'Набережная', desc:'Прогулочная зона, фото, вечерний маршрут.', address:'Когалым, набережная', phone:'не требуется', hours:'круглосуточно', image:'images/embankment.jpg', badge:'Прогулка'},
    {type:'leisure', title:'Культурно-досуговые центры', desc:'Концерты, мероприятия, городские события.', address:'Когалым, культурно-досуговый центр', phone:'актуальный телефон — на карте', hours:'по афише', image:'images/galaktika.jpg', badge:'Афиша'},
    {type:'leisure', title:'Ночной Когалым', desc:'Городские виды, прогулки, северная атмосфера.', address:'Когалым, вечерние прогулки', phone:'не требуется', hours:'круглосуточно', image:'images/night.jpg', badge:'Вечер'}
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

    const mapQuery = place.address || place.title || 'Когалым';
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
