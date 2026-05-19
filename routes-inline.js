
(function(){
  const routes = {
    galaktika: {
      title: 'Центр и СКК «Галактика»',
      meta: ['1–1.5 часа', 'семейный отдых', 'вечерний маршрут'],
      steps: [
        ['Старт', 'СКК «Галактика» — удобная точка начала, фото у фасада и прогулка вокруг комплекса.'],
        ['Дальше', 'Центральные улицы — подсветка, городские витрины, спокойная пешая часть маршрута.'],
        ['Финиш', 'Кафе или зона отдыха рядом с центром — нормальная точка завершить прогулку без лишней беготни.']
      ],
      note: 'Лучше идти вечером: подсветка делает маршрут заметно атмосфернее.',
      map: {
        // Координаты заданы для видимой Яндекс.Карты маршрута по Когалыму.
        rtext: '62.262850,74.486300~62.264050,74.475900~62.266300,74.468600',
        center: '74.477300,62.264600',
        z: 14
      }
    },
    park: {
      title: 'Парк 50-летия и набережная',
      meta: ['1 час', 'спокойная прогулка', 'фото-точки'],
      steps: [
        ['Старт', 'Парк 50-летия — спокойная прогулка по зелёной зоне.'],
        ['Дальше', 'Выход к набережной — виды, открытое пространство и хорошие точки для фото.'],
        ['Финиш', 'Прогулка обратно через тихие городские улицы без резкого темпа.']
      ],
      note: 'Маршрут лучше для дневной или ранней вечерней прогулки.',
      map: {
        rtext: '62.266500,74.482500~62.269100,74.474800~62.263500,74.470600',
        center: '74.476900,62.266600',
        z: 14
      }
    },
    night: {
      title: 'Ночной Когалым',
      meta: ['1.5–2 часа', 'ночной город', 'лучшие виды'],
      steps: [
        ['Старт', 'Центральная часть города — включённая подсветка и основные городские огни.'],
        ['Дальше', 'Улицы с яркой вечерней архитектурой и открытыми видами.'],
        ['Финиш', 'Точка с панорамным видом или освещённая городская зона для финальных фото.']
      ],
      note: 'Одевайся теплее: маршрут красивый, но вечером быстро становится прохладно.',
      map: {
        rtext: '62.260900,74.485900~62.264300,74.475300~62.268100,74.466600',
        center: '74.476200,62.264900',
        z: 13
      }
    }
  };
  const modal = document.getElementById('routeModal');
  const title = document.getElementById('routeModalTitle');
  const meta = document.getElementById('routeModalMeta');
  const list = document.getElementById('routeModalList');
  const note = document.getElementById('routeModalNote');
  const map = document.getElementById('routeModalMap');
  const closeBtn = modal.querySelector('.routes-modal__close');

  function getYandexRouteUrl(route){
    const params = new URLSearchParams({
      mode: 'routes',
      rtext: route.rtext,
      rtt: 'pd',
      ll: route.center || '74.482761,62.263891',
      z: String(route.z || 14)
    });
    return `https://yandex.ru/map-widget/v1/?${params.toString()}`;
  }

  function renderMap(route){
    const url = getYandexRouteUrl(route);
    map.innerHTML = `
      <iframe src="${url}" loading="lazy" allowfullscreen="true" referrerpolicy="no-referrer-when-downgrade" title="Яндекс Карта маршрута"></iframe>
      <a class="routes-modal__map-fallback" href="${url}" target="_blank" rel="noopener">Открыть в Яндекс Картах</a>
    `;
  }

  function openRoute(key){
    const data = routes[key];
    if(!data) return;
    title.textContent = data.title;
    meta.innerHTML = data.meta.map(item => `<span>${item}</span>`).join('');
    list.innerHTML = data.steps.map(([name, text]) => `<li><b>${name}:</b> ${text}</li>`).join('');
    note.textContent = data.note;
    renderMap(data.map);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeRoute(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-route]').forEach(btn => btn.addEventListener('click', () => openRoute(btn.dataset.route)));
  closeBtn.addEventListener('click', closeRoute);
  modal.addEventListener('click', e => { if(e.target === modal) closeRoute(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && modal.classList.contains('is-open')) closeRoute(); });
})();
