(function(){
  'use strict';

  const form = document.getElementById('adminForm');
  if (!form) return;

  const title = document.getElementById('adTitle');
  const category = document.getElementById('adCategory');
  const price = document.getElementById('adPrice');
  const description = document.getElementById('adDescription');
  const phone = document.getElementById('adPhone');
  const vip = document.getElementById('adVip');
  const photo = document.getElementById('adPhoto');

  const pTitle = document.getElementById('previewTitle');
  const pCategory = document.getElementById('previewCategory');
  const pPrice = document.getElementById('previewPrice');
  const pDescription = document.getElementById('previewDescription');
  const pImage = document.getElementById('previewImage');
  const saved = document.getElementById('savedAds');

  const submitBtn = form.querySelector('.admin-submit') || form.querySelector('button[type="submit"]');

  const key = 'kogalym_ads';
  let imageData = '';
  let editIndex = null;

  function getAds(){
    try{
      const ads = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(ads) ? ads : [];
    }catch(e){
      return [];
    }
  }

  function setAds(ads){
    localStorage.setItem(key, JSON.stringify(ads));
  }

  function escapeHtml(str){
    return String(str || '').replace(/[&<>'"]/g, s => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      "'":'&#39;',
      '"':'&quot;'
    }[s]));
  }

  function resetEditMode(){
    editIndex = null;
    if(submitBtn) submitBtn.textContent = 'Опубликовать';
    form.classList.remove('is-editing');
  }

  function resetForm(){
    form.reset();
    imageData = '';
    resetEditMode();

    if(pImage){
      pImage.removeAttribute('style');
      pImage.textContent = 'Фото';
    }

    updatePreview();
  }

  function updatePreview(){
    if(pTitle) pTitle.textContent = title.value.trim() || 'Заголовок объявления';
    if(pCategory) pCategory.textContent = category.value || 'Работа';
    if(pPrice) pPrice.textContent = price.value.trim() || 'Цена не указана';
    if(pDescription) pDescription.textContent = description.value.trim() || 'Описание появится здесь.';

    const previewCard = document.querySelector('.preview-card');
    if(previewCard){
      previewCard.classList.toggle('vip', Boolean(vip && vip.checked));

      let badge = previewCard.querySelector('.vip-badge');

      if(vip && vip.checked){
        if(!badge){
          badge = document.createElement('div');
          badge.className = 'vip-badge';
          badge.textContent = 'VIP';
          previewCard.appendChild(badge);
        }
      }else if(badge){
        badge.remove();
      }
    }
  }

  function render(){
    const ads = getAds();

    if(!saved) return;

    if(!ads.length){
      saved.innerHTML = '<p class="admin-empty">Пока объявлений нет.</p>';
      return;
    }

    saved.innerHTML = ads.map((ad, i) => `
      <div class="saved-item ${ad.vip ? 'vip' : ''}">
        <div class="saved-thumb" style="${ad.image ? 'background-image:url(' + ad.image + ')' : ''}"></div>

        <div class="saved-info">
          <h3>${escapeHtml(ad.title || 'Без названия')}</h3>
          <p>${ad.vip ? '<b class="saved-vip">VIP</b> · ' : ''}${escapeHtml(ad.category || 'Другое')} · ${escapeHtml(ad.price || 'Цена не указана')}</p>
          <p>${escapeHtml(ad.phone || 'Телефон не указан')}</p>
        </div>

        <div class="saved-actions">
          <button class="edit-ad" data-i="${i}" type="button">Редактировать</button>
          <button class="delete-ad" data-i="${i}" type="button">Удалить</button>
        </div>
      </div>
    `).join('');
  }

  function fillForm(ad, index){
    editIndex = index;

    title.value = ad.title || '';
    category.value = ad.category || 'Работа';
    price.value = ad.price || '';
    description.value = ad.description || '';
    if(phone) phone.value = ad.phone || '';
    if(vip) vip.checked = Boolean(ad.vip);

    imageData = ad.image || '';

    if(pImage){
      if(imageData){
        pImage.style.backgroundImage = `url(${imageData})`;
        pImage.textContent = '';
      }else{
        pImage.removeAttribute('style');
        pImage.textContent = 'Фото';
      }
    }

    if(submitBtn) submitBtn.textContent = 'Сохранить изменения';
    form.classList.add('is-editing');
    updatePreview();

    form.scrollIntoView({behavior:'smooth', block:'start'});
  }

  [title, category, price, description, phone].filter(Boolean).forEach(el => {
    el.addEventListener('input', updatePreview);
    el.addEventListener('change', updatePreview);
  });

  if(vip){
    vip.addEventListener('change', updatePreview);
  }

  if(photo){
    photo.addEventListener('change', () => {
      const file = photo.files && photo.files[0];

      if(!file){
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        imageData = reader.result;

        if(pImage){
          pImage.style.backgroundImage = `url(${imageData})`;
          pImage.textContent = '';
        }
      };

      reader.readAsDataURL(file);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const ad = {
      title: title.value.trim(),
      category: category.value,
      price: price.value.trim(),
      description: description.value.trim(),
      phone: phone ? phone.value.trim() : '',
      vip: vip ? Boolean(vip.checked) : false,
      image: imageData,
      createdAt: editIndex === null ? new Date().toISOString() : (getAds()[editIndex]?.createdAt || new Date().toISOString()),
      updatedAt: new Date().toISOString()
    };

    if(!ad.title || !ad.description) return;

    const ads = getAds();

    if(editIndex !== null && ads[editIndex]){
      ads[editIndex] = ad;
    }else{
      ads.unshift(ad);
    }

    setAds(ads);
    render();
    resetForm();
  });

  saved?.addEventListener('click', e => {
    const editBtn = e.target.closest('.edit-ad');
    const deleteBtn = e.target.closest('.delete-ad');

    if(editBtn){
      const ads = getAds();
      const index = Number(editBtn.dataset.i);

      if(ads[index]){
        fillForm(ads[index], index);
      }

      return;
    }

    if(deleteBtn){
      const index = Number(deleteBtn.dataset.i);
      const ads = getAds();

      ads.splice(index, 1);
      setAds(ads);
      render();

      if(editIndex === index){
        resetForm();
      }

      return;
    }
  });

  updatePreview();
  render();
})();
