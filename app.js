
import { db, collection, onSnapshot, query, orderBy } from './firebase.js';

const lang = localStorage.getItem('kogalym_lang') || 'ru';
document.querySelectorAll('[data-lang-current]').forEach(x => x.textContent = lang.toUpperCase());

window.toggleLang = function(){
  localStorage.setItem('kogalym_lang', lang === 'ru' ? 'en' : 'ru');
  location.reload();
};

function pick(obj){
  if(!obj) return '';
  return obj[lang] || obj.ru || obj.en || '';
}

const categories = {
  announcements:['Все','Услуги','Работа','Недвижимость','Продажа','Туризм','Бизнес'],
  news:['Все','Город','История','Юбилей','Спорт','Культура'],
  events:['Все','Концерт','Спорт','Дети','Культура','Город'],
  places:['Все','Кафе','Гостиница','Достопримечательность','Услуги','Маршрут']
};

function fallbackImage(title){
  const first = (title || 'К').slice(0,1).toUpperCase();
  return `<div class="visual">${first}</div>`;
}

function cardHtml(id, col, x){
  const title = pick(x.title);
  const text = pick(x.text);
  const img = x.imageUrl ? `<img src="${x.imageUrl}" alt="">` : fallbackImage(title);
  return `<article class="card news-card">
    ${img}
    ${x.category ? `<span class="tag">${x.category}</span>` : ''}
    <h3>${title}</h3>
    <p>${text.length > 120 ? text.slice(0,120) + '...' : text}</p>
    ${x.phone ? `<p><b>Тел:</b> <a href="tel:${x.phone.replace(/\D/g,'')}">${x.phone}</a></p>` : ''}
    <a class="btn blue" href="item.html?type=${col}&id=${id}">${lang==='ru'?'Подробнее':'More'}</a>
  </article>`;
}

function renderFilters(col, targetId, setFilter){
  const box = document.getElementById(targetId);
  if(!box) return;
  box.innerHTML = (categories[col] || ['Все']).map((c,i)=>`<button class="filter ${i===0?'active':''}" data-filter="${c}">${c}</button>`).join('');
  box.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      box.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      setFilter(btn.dataset.filter);
    };
  });
}

function renderCollection(col, listId, filterId, emptyText){
  const el = document.getElementById(listId);
  if(!el) return;
  let currentFilter = 'Все';
  let docs = [];
  const draw = () => {
    const filtered = currentFilter === 'Все' ? docs : docs.filter(d => (d.data().category || '') === currentFilter);
    if(filtered.length === 0){ el.innerHTML = `<div class="card"><p>${emptyText}</p></div>`; return; }
    el.innerHTML = filtered.map(d => cardHtml(d.id, col, d.data())).join('');
  };
  renderFilters(col, filterId, f => { currentFilter = f; draw(); });
  onSnapshot(query(collection(db,col), orderBy('createdAt','desc')), snap => {
    docs = snap.docs;
    draw();
  }, err => {
    el.innerHTML = `<div class="card"><p>Ошибка Firebase: ${err.message}</p></div>`;
  });
}

renderCollection('announcements','announcementsList','annFilters','Пока объявлений нет.');
renderCollection('news','newsList','newsFilters','Пока новостей нет.');
renderCollection('events','eventsList','eventFilters','Пока событий нет.');
renderCollection('places','placesList','placeFilters','Пока мест нет.');
