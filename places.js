(function(){
  'use strict';

  const grid = document.getElementById('placesGrid');
  const empty = document.getElementById('placesEmpty');
  const search = document.getElementById('placesSearch');
  const buttons = document.querySelectorAll('.place-filter');

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
    return String(value || '').toLowerCase().trim();
  }

  function cards(){
    return Array.from(grid.querySelectorAll('.place-card'));
  }

  function makeMapUrl(query){
    return 'https://yandex.ru/maps/?text=' + encodeURIComponent(query || 'Когалым');
  }

  function applyFilter(){
    const q = norm(search ? search.value : '');
    let visible = 0;

    cards().forEach(card => {
      const text = norm([
        card.dataset.placeTitle,
        card.dataset.placeDescription,
        card.dataset.placeAddress,
        card.dataset.placePhone,
        card.textContent
      ].join(' '));

      const typeOk = currentType === 'all' || card.dataset.placeType === currentType;
      const searchOk = !q || text.includes(q);
      const ok = typeOk && searchOk;

      card.classList.toggle('hidden', !ok);
      card.style.display = ok ? '' : 'none';

      if(ok) visible++;
    });

    if(empty) empty.classList.toggle('show', visible === 0);
  }

  function setType(value, label){
    currentType = value || 'all';

    if(customTrigger){
      customTrigger.textContent = label || 'Все места';
    }

    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.placeFilter === currentType);
    });

    applyFilter();
  }

  function openPlace(card){
    if(!modal || !card) return;

    const placeTitle = card.dataset.placeTitle || '';
    const placeAddress = card.dataset.placeAddress || 'Когалым';
    const placePhone = card.dataset.placePhone || 'Телефон не указан';
    const mapQuery = card.dataset.placeMap || placeAddress || placeTitle || 'Когалым';
    const url = makeMapUrl(mapQuery);

    image.style.backgroundImage = `url('${card.dataset.placeImage || 'images/galaktika.jpg'}')`;
    title.textContent = placeTitle;
    description.textContent = card.dataset.placeDescription || '';
    rating.textContent = '★ ' + (card.dataset.placeRating || '4.5');
    modalType.textContent = card.querySelector('.place-top span')?.textContent || 'Место';
    hours.textContent = card.dataset.placeHours || 'Уточняется';
    address.textContent = placeAddress;
    phone.textContent = placePhone;
    mapTitle.textContent = placeAddress;

    if(routeBtn) routeBtn.href = url;
    if(mapBtn) mapBtn.href = url;

    const favKey = 'place_fav_' + norm(placeTitle).replace(/\s+/g, '_');
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

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.placeFilter || 'all';
      setType(value, btn.textContent.trim());
    });
  });

  search?.addEventListener('input', applyFilter);

  customTrigger?.addEventListener('click', function(event){
    event.stopPropagation();
    customSelect.classList.toggle('open');
  });

  customMenu?.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function(event){
      event.stopPropagation();
      setType(btn.dataset.value || 'all', btn.textContent.trim());
      customSelect.classList.remove('open');
    });
  });

  document.addEventListener('click', function(event){
    if(customSelect && !customSelect.contains(event.target)){
      customSelect.classList.remove('open');
    }
  });

  grid.addEventListener('click', event => {
    const card = event.target.closest('.place-card');
    if(card) openPlace(card);
  });

  close?.addEventListener('click', closePlace);

  modal?.addEventListener('click', event => {
    if(event.target === modal) closePlace();
  });

  favorite?.addEventListener('click', () => {
    const key = favorite.dataset.key;
    if(!key) return;

    const active = localStorage.getItem(key) === '1';
    localStorage.setItem(key, active ? '0' : '1');
    favorite.textContent = active ? '♡ В избранное' : '★ В избранном';
  });

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape') closePlace();
  });

  applyFilter();
})();
