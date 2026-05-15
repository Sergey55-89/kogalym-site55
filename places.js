(function(){
  'use strict';
  const grid=document.getElementById('placesGrid');
  const empty=document.getElementById('placesEmpty');
  const search=document.getElementById('placesSearch');
  const type=document.getElementById('placesType');
  const buttons=document.querySelectorAll('.place-filter');
  const modal=document.getElementById('placeModal');
  const close=document.getElementById('placeModalClose');
  const image=document.getElementById('placeModalImage');
  const title=document.getElementById('placeModalTitle');
  const description=document.getElementById('placeModalDescription');
  const rating=document.getElementById('placeModalRating');
  const modalType=document.getElementById('placeModalType');
  const hours=document.getElementById('placeModalHours');
  const favorite=document.getElementById('placeFavoriteBtn');
  if(!grid)return;
  function norm(v){return String(v||'').toLowerCase().trim()}
  function cards(){return Array.from(grid.querySelectorAll('.place-card'))}
  function applyFilter(){
    const q=norm(search?search.value:'');
    const active=type?type.value:'all';
    let visible=0;
    cards().forEach(card=>{
      const text=norm([card.dataset.placeTitle,card.dataset.placeDescription,card.textContent].join(' '));
      const ok=(active==='all'||card.dataset.placeType===active)&&(!q||text.includes(q));
      card.classList.toggle('hidden',!ok);
      card.style.display=ok?'':'none';
      if(ok)visible++;
    });
    if(empty)empty.classList.toggle('show',visible===0);
  }
  function setType(value){
    if(type)type.value=value;
    buttons.forEach(btn=>btn.classList.toggle('active',btn.dataset.placeFilter===value));
    applyFilter();
  }
  function openPlace(card){
    if(!modal||!card)return;
    image.style.backgroundImage=`url('${card.dataset.placeImage||'images/galaktika.jpg'}')`;
    title.textContent=card.dataset.placeTitle||'';
    description.textContent=card.dataset.placeDescription||'';
    rating.textContent='★ '+(card.dataset.placeRating||'4.5');
    modalType.textContent=card.querySelector('.place-top span')?.textContent||'Место';
    hours.textContent=card.dataset.placeHours||'Уточняется';
    const favKey='place_fav_'+norm(card.dataset.placeTitle).replace(/\s+/g,'_');
    const isFav=localStorage.getItem(favKey)==='1';
    favorite.textContent=isFav?'★ В избранном':'♡ В избранное';
    favorite.dataset.key=favKey;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  }
  function closePlace(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
  buttons.forEach(btn=>btn.addEventListener('click',()=>setType(btn.dataset.placeFilter||'all')));
  search?.addEventListener('input',applyFilter);
  type?.addEventListener('change',()=>setType(type.value));
  grid.addEventListener('click',e=>{const card=e.target.closest('.place-card');if(card)openPlace(card)});
  close?.addEventListener('click',closePlace);
  modal?.addEventListener('click',e=>{if(e.target===modal)closePlace()});
  favorite?.addEventListener('click',()=>{const key=favorite.dataset.key;if(!key)return;const active=localStorage.getItem(key)==='1';localStorage.setItem(key,active?'0':'1');favorite.textContent=active?'♡ В избранное':'★ В избранном'});
  document.addEventListener('keydown', function(event){ if(event.key === 'Escape') closePlace(); });
  applyFilter();
})();