(function(){
  const form=document.getElementById('adminForm');
  if(!form) return;
  const title=document.getElementById('adTitle');
  const category=document.getElementById('adCategory');
  const price=document.getElementById('adPrice');
  const description=document.getElementById('adDescription');
  const photo=document.getElementById('adPhoto');
  const pTitle=document.getElementById('previewTitle');
  const pCategory=document.getElementById('previewCategory');
  const pPrice=document.getElementById('previewPrice');
  const pDescription=document.getElementById('previewDescription');
  const pImage=document.getElementById('previewImage');
  const saved=document.getElementById('savedAds');
  let imageData='';
  const key='kogalym_ads';

  function getAds(){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return []}}
  function setAds(ads){localStorage.setItem(key,JSON.stringify(ads))}
  function updatePreview(){
    pTitle.textContent=title.value.trim()||'Заголовок объявления';
    pCategory.textContent=category.value||'Работа';
    pPrice.textContent=price.value.trim()||'Цена не указана';
    pDescription.textContent=description.value.trim()||'Описание появится здесь.';
  }
  function render(){
    const ads=getAds();
    if(!ads.length){saved.innerHTML='<p style="color:#cfd6e6;margin:0">Пока объявлений нет.</p>';return}
    saved.innerHTML=ads.map((ad,i)=>`<div class="saved-item"><div class="saved-thumb" style="${ad.image?'background-image:url('+ad.image+')':''}"></div><div><h3>${escapeHtml(ad.title)}</h3><p>${escapeHtml(ad.category)} · ${escapeHtml(ad.price||'Цена не указана')}</p></div><button class="delete-ad" data-i="${i}" type="button">Удалить</button></div>`).join('');
  }
  function escapeHtml(str){return String(str).replace(/[&<>'"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[s]))}

  [title,category,price,description].forEach(el=>el.addEventListener('input',updatePreview));
  photo.addEventListener('change',()=>{
    const file=photo.files&&photo.files[0];
    if(!file){imageData='';pImage.removeAttribute('style');pImage.textContent='Фото';return}
    const reader=new FileReader();
    reader.onload=()=>{imageData=reader.result;pImage.style.backgroundImage=`url(${imageData})`;pImage.textContent=''};
    reader.readAsDataURL(file);
  });
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const ad={title:title.value.trim(),category:category.value,price:price.value.trim(),description:description.value.trim(),image:imageData,createdAt:new Date().toISOString()};
    if(!ad.title||!ad.description) return;
    const ads=getAds();ads.unshift(ad);setAds(ads);render();form.reset();imageData='';pImage.removeAttribute('style');pImage.textContent='Фото';updatePreview();
  });
  saved.addEventListener('click',e=>{
    const btn=e.target.closest('.delete-ad'); if(!btn) return;
    const ads=getAds(); ads.splice(Number(btn.dataset.i),1); setAds(ads); render();
  });
  updatePreview(); render();
})();
