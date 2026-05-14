/* Announcements Stage 3: safe search, sort, favorites, phone reveal */
(function () {
  'use strict';

  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  ready(() => {
    const list =
      document.querySelector('#adsList') ||
      document.querySelector('.ads-list') ||
      document.querySelector('.announcements-list');

    if (!list) return;

    let isRunning = false;
    const cardSelector = '.ad-card, .announcement-card, .ann-card';

    function getCards() {
      return Array.from(list.querySelectorAll(cardSelector));
    }

    function normalize(text) {
      return String(text || '').toLowerCase().trim();
    }

    function extractPrice(card) {
      const priceNode = card.querySelector('.ad-price, .price, [data-price]');
      const source = priceNode ? (priceNode.dataset.price || priceNode.textContent) : card.textContent;
      const clean = String(source || '').replace(/\s/g, '').replace(/[^\d]/g, '');
      return clean ? Number(clean) : 0;
    }

    function getTitle(card) {
      return card.querySelector('h3, .ad-title, .ann-title')?.textContent || '';
    }

    function ensureStats() {
      let stats = document.querySelector('.ads-stats');
      if (stats) return stats;

      stats = document.createElement('div');
      stats.className = 'ads-stats';
      stats.innerHTML =
        '<div class="ads-count">Объявлений: <b>0</b></div>' +
        '<label class="ads-sort">Сортировка ' +
        '<select id="adsSort">' +
        '<option value="default">По умолчанию</option>' +
        '<option value="priceDesc">Сначала дорогие</option>' +
        '<option value="priceAsc">Сначала дешёвые</option>' +
        '<option value="titleAsc">По названию</option>' +
        '</select>' +
        '</label>';

      list.parentNode.insertBefore(stats, list);
      return stats;
    }

    function ensureEmptyState() {
      let empty = document.querySelector('.empty-state.no-ads');
      if (empty) return empty;

      empty = document.createElement('div');
      empty.className = 'empty-state no-ads';
      empty.style.display = 'none';
      empty.textContent = 'Объявлений по этому запросу пока нет.';
      list.parentNode.insertBefore(empty, list.nextSibling);
      return empty;
    }

    function enhanceCard(card, index) {
      if (!card || card.dataset.stage3Ready === '1') return;

      card.dataset.stage3Ready = '1';
      if (!card.dataset.originalIndex) card.dataset.originalIndex = String(index);

      if (getComputedStyle(card).position === 'static') {
        card.style.position = 'relative';
      }

      const keyBase = normalize(getTitle(card) || card.textContent)
        .replace(/[^a-zа-яё0-9]+/gi, '_')
        .slice(0, 60);

      const key = 'kogalym_fav_ad_' + keyBase + '_' + card.dataset.originalIndex;

      if (!card.querySelector('.favorite-btn')) {
        const fav = document.createElement('button');
        fav.className = 'favorite-btn';
        fav.type = 'button';
        fav.innerHTML = localStorage.getItem(key) === '1' ? '★' : '♡';
        fav.setAttribute('aria-label', 'Добавить в избранное');

        if (localStorage.getItem(key) === '1') {
          fav.classList.add('active');
        }

        fav.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const active = fav.classList.toggle('active');
          fav.innerHTML = active ? '★' : '♡';
          localStorage.setItem(key, active ? '1' : '0');
        });

        card.appendChild(fav);
      }

      const phoneBtn = card.querySelector('.show-phone-btn, .ad-phone-btn, .phone-btn');
      if (phoneBtn && phoneBtn.dataset.stage3Phone !== '1') {
        phoneBtn.dataset.stage3Phone = '1';
        const originalText = phoneBtn.textContent.trim();
        const phone = phoneBtn.dataset.phone || phoneBtn.getAttribute('data-phone') || originalText;

        phoneBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (phone && /\d/.test(phone)) {
            phoneBtn.textContent = phone;
          } else {
            phoneBtn.textContent = '+7 (___) ___-__-__';
          }
        });
      }
    }

    function updateCount() {
      const cards = getCards();
      const visible = cards.filter((card) => !card.classList.contains('is-hidden'));
      const stats = ensureStats();
      const count = stats.querySelector('.ads-count b');
      if (count) count.textContent = String(visible.length);
      ensureEmptyState().style.display = visible.length ? 'none' : 'block';
    }

    function applySearch(query) {
      const q = normalize(query);
      getCards().forEach((card) => {
        const ok = !q || normalize(card.textContent).includes(q);
        card.classList.toggle('is-hidden', !ok);
      });
      updateCount();
    }

    function attachSearch() {
      const search =
        document.querySelector('.ann-toolbar input') ||
        document.querySelector('.ads-toolbar input') ||
        document.querySelector('.filters input') ||
        document.querySelector('.filter-bar input') ||
        document.querySelector('.search-filters input') ||
        document.querySelector('input[type="search"]');

      if (!search || search.dataset.stage3Search === '1') return;
      search.dataset.stage3Search = '1';
      search.addEventListener('input', () => applySearch(search.value));
    }

    function attachSort() {
      const stats = ensureStats();
      const sort = stats.querySelector('#adsSort');
      if (!sort || sort.dataset.stage3Sort === '1') return;

      sort.dataset.stage3Sort = '1';
      sort.addEventListener('change', () => {
        const cards = getCards();
        const sorted = cards.slice();

        if (sort.value === 'priceDesc') {
          sorted.sort((a, b) => extractPrice(b) - extractPrice(a));
        } else if (sort.value === 'priceAsc') {
          sorted.sort((a, b) => extractPrice(a) - extractPrice(b));
        } else if (sort.value === 'titleAsc') {
          sorted.sort((a, b) => normalize(getTitle(a)).localeCompare(normalize(getTitle(b)), 'ru'));
        } else {
          sorted.sort((a, b) => Number(a.dataset.originalIndex || 0) - Number(b.dataset.originalIndex || 0));
        }

        sorted.forEach((card) => list.appendChild(card));
      });
    }

    function run() {
      if (isRunning) return;
      isRunning = true;

      try {
        getCards().forEach((card, index) => enhanceCard(card, index));
        ensureStats();
        ensureEmptyState();
        attachSearch();
        attachSort();
        updateCount();
      } finally {
        isRunning = false;
      }
    }

    run();

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(run);
    });

    observer.observe(list, { childList: true });
  });
})();
