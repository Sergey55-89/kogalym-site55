(function(){
  'use strict';

  const form=document.getElementById('adminForm');
  if(!form) return;

  const title=document.getElementById('adTitle');
  const category=document.getElementById('adCategory');
  const price=document.getElementById('adPrice');
  const description=document.getElementById('adDescription');
  const phone=document.getElementById('adPhone');
  const vip=document.getElementById('adVip');
  const photo=document.getElementById('adPhoto');

  const pTitle=document.getElementById('previewTitle');
  const pCategory=document.getElementById('previewCategory');
  const pPrice=document.getElementById('previewPrice');
  const pDescription=document.getElementById('previewDescription');
  const pImage=document.getElementById('previewImage');
  const saved=document.getElementById('savedAds');

  let imageData='';
  const key='kogalym_ads';

  function getAds(){
    try{return JSON.parse(localStorage.getItem(key)||'[]')}
    catch(e){return []}
  }

  function setAds(ads){
    localStorage.setItem(key,JSON.stringify(ads));
  }

  function escapeHtml(str){
    return String(str||'').replace(/[&<>'"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[s]));
  }

  function updatePreview(){
    if(pTitle) pTitle.textContent=title.value.trim()||'Заголовок объявления';
    if(pCategory) pCategory.textContent=category.value||'Работа';
    if(pPrice) pPrice.textContent=price.value.trim()||'Цена не указана';
    if(pDescription) pDescription.textContent=description.value.trim()||'Описание появится здесь.';

    const previewCard=document.querySelector('.preview-card');
    if(previewCard){
      previewCard.classList.toggle('vip', Boolean(vip && vip.checked));

      let badge=previewCard.querySelector('.vip-badge');
      if(vip && vip.checked){
        if(!badge){
          badge=document.createElement('div');
          badge.className='vip-badge';
          badge.textContent='VIP';
          previewCard.appendChild(badge);
        }
      }else if(badge){
        badge.remove();
      }
    }
  }

  function render(){
    const ads=getAds();

    if(!saved) return;

    if(!ads.length){
      saved.innerHTML='<p style="color:#cfd6e6;margin:0">Пока объявлений нет.</p>';
      return;
    }

    saved.innerHTML=ads.map((ad,i)=>`
      <div class="saved-item ${ad.vip?'vip':''}">
        <div class="saved-thumb" style="${ad.image?'background-image:url('+ad.image+')':''}"></div>
        <div>
          <h3>${escapeHtml(ad.title)}</h3>
          <p>${ad.vip?'<b style="color:#ffd54a">VIP</b> · ':''}${escapeHtml(ad.category)} · ${escapeHtml(ad.price||'Цена не указана')}</p>
          <p>${escapeHtml(ad.phone||'Телефон не указан')}</p>
        </div>
        <button class="delete-ad" data-i="${i}" type="button">Удалить</button>
      </div>
    `).join('');
  }

  [title,category,price,description,phone].filter(Boolean).forEach(el=>{
    el.addEventListener('input',updatePreview);
    el.addEventListener('change',updatePreview);
  });

  if(vip){
    vip.addEventListener('change',updatePreview);
  }

  if(photo){
    photo.addEventListener('change',()=>{
      const file=photo.files&&photo.files[0];

      if(!file){
        imageData='';
        if(pImage){
          pImage.removeAttribute('style');
          pImage.textContent='Фото';
        }
        return;
      }

      const reader=new FileReader();

      reader.onload=()=>{
        imageData=reader.result;
        if(pImage){
          pImage.style.backgroundImage=`url(${imageData})`;
          pImage.textContent='';
        }
      };

      reader.readAsDataURL(file);
    });
  }

  form.addEventListener('submit',e=>{
    e.preventDefault();

    const ad={
      title:title.value.trim(),
      category:category.value,
      price:price.value.trim(),
      description:description.value.trim(),
      phone:phone ? phone.value.trim() : '',
      vip:vip ? Boolean(vip.checked) : false,
      image:imageData,
      createdAt:new Date().toISOString()
    };

    if(!ad.title||!ad.description) return;

    const ads=getAds();
    ads.unshift(ad);
    setAds(ads);

    render();
    form.reset();
    imageData='';

    if(pImage){
      pImage.removeAttribute('style');
      pImage.textContent='Фото';
    }

    updatePreview();
  });

  saved?.addEventListener('click',e=>{
    const btn=e.target.closest('.delete-ad');
    if(!btn) return;

    const ads=getAds();
    ads.splice(Number(btn.dataset.i),1);
    setAds(ads);
    render();
  });

  updatePreview();
  render();
})();
