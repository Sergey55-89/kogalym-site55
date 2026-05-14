(function(){
  'use strict';

  const STORAGE_KEY = 'kogalym_ads';
  const fallbackImage = 'images/galaktika.jpg';

  const categoryMap = {
    'работа':'work', 'work':'work',
    'услуги':'service', 'service':'service',
    'аренда':'rent', 'rent':'rent',
    'продажа':'sale', 'sale':'sale',
    'находки':'lost', 'lost':'lost',
    'другое':'sale', 'other':'sale'
  };

  const categoryLabel = {
    work:'Работа',
    service:'Услуги',
    rent:'Аренда',
    sale:'Продажа',
    lost:'Находки'
  };

  const list = document.getElementById('annList');
  const empty = document.getElementById('empty');
  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categorySelect');
  const priceSelect = document.getElementById('priceSelect');
  const sortSelect = document.getElementById('sortSelect');
  const categoryButtons = document.querySelectorAll('.ann-cat');

  const modal = document.getElementById('adModal');
  const modalClose = document.getElementById('adClose');
  const modalImage = document.getElementById('adModalImage');
  const modalTitle = document.getElementById('adModalTitle');
  const modalDescription = document.getElementById('adModalDescription');
  const modalPrice = document.getElementById('adModalPrice');
  const modalLocation = document.getElementById('adModalLocation');
  const modalDate = document.getElementById('adModalDate');
  const modalCategory = document.getElementById('adModalCategory');
  const modalPhone = document.querySelector('.ad-modal-phone');

  if (!list) return;

  function escapeHtml(value){
    return String(value || '').replace(/[&<>'"]/g, char => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      "'":'&#39;',
      '"':'&quot;'
    }[char]));
  }

  function normalizeCategory(value){
    const key = String(value || '').trim().toLowerCase();
    return categoryMap[key] || 'sale';
  }

  function getStorageAds(){
    try {
      const ads = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(ads) ? ads : [];
    } catch (error) {
      return [];
    }
  }

  function extractNumber(value){
    const match = String(value || '').replace(/\s/g, '').match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  function renderStorageAds(){
    const ads = getStorageAds();
    if (!ads.length) return;

    const markup = ads.map((ad, index) => {
      const category = normalizeCategory(ad.category);
      const title = escapeHtml(ad.title || 'Объявление');
      const description = escapeHtml(ad.description || 'Описание не указано.');
      const price = escapeHtml(ad.price || 'Цена не указана');
      const phone = escapeHtml(ad.phone || '');
      const image = escapeHtml(ad.image || fallbackImage);
      const date = 'сегодня';
      const location = 'Когалым';
      const vip = Boolean(ad.vip);

      return `
        <article class="ann-item ${vip ? 'vip' : ''}" data-category="${category}" data-title="${title}" data-description="${description}" data-price="${price}" data-location="${location}" data-date="${date}" data-image="${image}" data-phone="${phone}" data-created="${index}">
          ${vip ? '<div class="vip-badge">VIP</div>' : ''}
          <div class="ann-thumb" style="background-image:url('${image}')"></div>
          <div class="ann-item-body">
            <h2>${title}</h2>
            <p>${description}</p>
            <div class="ann-meta"><span>${categoryLabel[category] || 'Объявление'}</span><span>${location}</span><span>${date}</span></div>
            
          </div>
          <div class="ann-price"><b>${price}</b><span>${phone ? 'контакт открыт' : 'контакт не указан'}</span></div>
        </article>`;
    }).join('');

    list.insertAdjacentHTML('afterbegin', markup);
  }

  function getItems(){
    return Array.from(list.querySelectorAll('.ann-item'));
  }

  function applyFilter(){
    const activeCategory = categorySelect ? categorySelect.value : 'all';
    const search = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const priceLimit = priceSelect && priceSelect.value !== 'all' ? Number(priceSelect.value) : null;
    let visible = 0;

    getItems().forEach(item => {
      const text = [item.dataset.title, item.dataset.description, item.dataset.price, item.dataset.location].join(' ').toLowerCase();
      const categoryOk = activeCategory === 'all' || item.dataset.category === activeCategory;
      const searchOk = !search || text.includes(search);
      const priceOk = !priceLimit || extractNumber(item.dataset.price) <= priceLimit;
      const shouldShow = categoryOk && searchOk && priceOk;

      item.classList.toggle('hidden', !shouldShow);
      if (shouldShow) visible += 1;
    });

    if (empty) empty.classList.toggle('show', visible === 0);
  }

  function applySort(){
    const mode = sortSelect ? sortSelect.value : 'new';
    const items = getItems();

    items.sort((a, b) => {
      if (mode === 'vip') return Number(b.classList.contains('vip')) - Number(a.classList.contains('vip'));
      if (mode === 'cheap') return extractNumber(a.dataset.price) - extractNumber(b.dataset.price);
      return Number(b.classList.contains('vip')) - Number(a.classList.contains('vip'));
    });

    items.forEach(item => list.appendChild(item));
    applyFilter();
  }

  function setActiveCategory(value){
    if (categorySelect) categorySelect.value = value;
    categoryButtons.forEach(button => button.classList.toggle('active', button.dataset.filter === value));
    applyFilter();
  }

  function revealPhone(button, phone){
    if(!button) return;
    button.innerHTML = '☎ ' + (phone && /\d/.test(phone) ? phone : 'Телефон не указан');
    button.classList.add('phone-revealed');
  }

  function openModal(card){
    if (!modal || !card) return;

    const phone = card.dataset.phone || '';

    modalImage.style.backgroundImage = `url('${card.dataset.image || fallbackImage}')`;
    modalTitle.textContent = card.dataset.title || '';
    modalDescription.textContent = card.dataset.description || '';
    modalPrice.textContent = card.dataset.price || 'Цена не указана';
    modalLocation.textContent = card.dataset.location || 'Когалым';
    modalDate.textContent = card.dataset.date || 'сегодня';
    modalCategory.textContent = categoryLabel[card.dataset.category] || 'Объявление';

    if(modalPhone){
      modalPhone.textContent = '☎ Показать телефон';
      modalPhone.dataset.phone = phone;
      modalPhone.style.display = phone ? 'block' : 'none';
    }

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal(){
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  renderStorageAds();
  applySort();
  applyFilter();

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => setActiveCategory(button.dataset.filter || 'all'));
  });

  categorySelect?.addEventListener('change', () => setActiveCategory(categorySelect.value));
  searchInput?.addEventListener('input', applyFilter);
  priceSelect?.addEventListener('change', applyFilter);
  sortSelect?.addEventListener('change', applySort);

  list.addEventListener('click', event => {
    const card = event.target.closest('.ann-item');
    if (card) openModal(card);
  });

  modalPhone?.addEventListener('click', () => revealPhone(modalPhone, modalPhone.dataset.phone || ''));
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
})();
