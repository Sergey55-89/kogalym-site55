
import { db, doc, getDoc } from './firebase.js';

const lang = localStorage.getItem('kogalym_lang') || 'ru';
window.toggleLang = function(){
  localStorage.setItem('kogalym_lang', lang === 'ru' ? 'en' : 'ru');
  location.reload();
};

function pick(obj){
  if(!obj) return '';
  return obj[lang] || obj.ru || obj.en || '';
}

const params = new URLSearchParams(location.search);
const type = params.get('type') || 'announcements';
const id = params.get('id');
const box = document.getElementById('detailBox');

async function load(){
  if(!id){ box.innerHTML = '<div class="card"><p>Запись не найдена.</p></div>'; return; }
  try{
    const snap = await getDoc(doc(db,type,id));
    if(!snap.exists()){ box.innerHTML = '<div class="card"><p>Запись не найдена.</p></div>'; return; }
    const x = snap.data();
    const title = pick(x.title);
    const text = pick(x.text);
    box.innerHTML = `<article class="card detail-card">
      ${x.imageUrl ? `<img src="${x.imageUrl}" alt="">` : ''}
      ${x.category ? `<span class="tag">${x.category}</span>` : ''}
      <h1 style="color:#0b1b2b">${title}</h1>
      <p style="font-size:20px;line-height:1.7">${text}</p>
      ${x.phone ? `<p><b>Телефон:</b> <a href="tel:${x.phone.replace(/\D/g,'')}">${x.phone}</a></p>` : ''}
      <a class="btn ghost" href="javascript:history.back()">Назад</a>
    </article>`;
  }catch(err){
    box.innerHTML = `<div class="card"><p>Ошибка: ${err.message}</p></div>`;
  }
}
load();
