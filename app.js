
import { db, collection, onSnapshot, query, orderBy } from './firebase.js';
function show(col,id,empty){
 const el=document.getElementById(id); if(!el)return;
 onSnapshot(query(collection(db,col),orderBy('createdAt','desc')),snap=>{
  if(snap.empty){el.innerHTML=`<div class="card"><p>${empty}</p></div>`;return}
  el.innerHTML=snap.docs.map(d=>{const x=d.data(); const img=x.imageUrl?`<img src="${x.imageUrl}">`:`<div class="visual">${(x.title?.ru||'К')[0]}</div>`;
   return `<article class="card news-card">${img}<h3>${x.title?.ru||''}</h3><p>${x.text?.ru||''}</p>${x.phone?`<p><b>Тел:</b> ${x.phone}</p>`:''}${x.category?`<span class="tag">${x.category}</span>`:''}</article>`}).join('');
 },err=>{el.innerHTML=`<div class="card"><p>Ошибка Firebase: ${err.message}</p></div>`})
}
show('announcements','announcementsList','Пока объявлений нет.');
show('news','newsList','Пока новостей нет.');
show('events','eventsList','Пока событий нет.');
show('places','placesList','Пока мест нет.');
