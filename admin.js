const form = document.querySelector('#adForm');
const title = document.querySelector('#title');
const category = document.querySelector('#category');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const image = document.querySelector('#image');
const preview = document.querySelector('#preview');
const savedList = document.querySelector('#savedList');
const clearAll = document.querySelector('#clearAll');

const STORAGE_KEY = 'kogalym_ads';
let imageData = '';

function getAds() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function setAds(ads) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
}

function escapeHtml(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function updatePreview() {
  const imgStyle = imageData ? `style="background-image:url('${imageData}')"` : '';
  preview.innerHTML = `
    <div class="preview-img" ${imgStyle}>${imageData ? '' : 'Фото'}</div>
    <div class="preview-body">
      <span class="badge">${escapeHtml(category.value)}</span>
      <h3>${escapeHtml(title.value) || 'Заголовок объявления'}</h3>
      <p>${escapeHtml(description.value) || 'Описание появится здесь.'}</p>
      <strong>${escapeHtml(price.value) || 'Цена не указана'}</strong>
    </div>
  `;
}

function renderAds() {
  const ads = getAds();

  if (!ads.length) {
    savedList.innerHTML = '<p class="empty">Пока нет объявлений. Добавь первое.</p>';
    return;
  }

  savedList.innerHTML = ads.map((ad, index) => {
    const imgStyle = ad.image ? `style="background-image:url('${ad.image}')"` : '';
    return `
      <article class="saved-item">
        <div class="saved-img" ${imgStyle}>${ad.image ? '' : 'Фото'}</div>
        <div class="saved-body">
          <span class="badge">${escapeHtml(ad.category)}</span>
          <h3>${escapeHtml(ad.title)}</h3>
          <p>${escapeHtml(ad.description)}</p>
          <strong>${escapeHtml(ad.price) || 'Цена не указана'}</strong>
          <button type="button" onclick="deleteAd(${index})">Удалить</button>
        </div>
      </article>
    `;
  }).join('');
}

window.deleteAd = function(index) {
  const ads = getAds();
  ads.splice(index, 1);
  setAds(ads);
  renderAds();
};

image.addEventListener('change', () => {
  const file = image.files[0];
  if (!file) {
    imageData = '';
    updatePreview();
    return;
  }

  const reader = new FileReader();
  reader.onload = event => {
    imageData = event.target.result;
    updatePreview();
  };
  reader.readAsDataURL(file);
});

[title, category, price, description].forEach(el => {
  el.addEventListener('input', updatePreview);
});

form.addEventListener('submit', event => {
  event.preventDefault();

  const ad = {
    id: Date.now(),
    title: title.value.trim(),
    category: category.value,
    price: price.value.trim(),
    description: description.value.trim(),
    image: imageData,
    createdAt: new Date().toISOString()
  };

  const ads = [ad, ...getAds()];
  setAds(ads);
  form.reset();
  imageData = '';
  updatePreview();
  renderAds();
});

clearAll.addEventListener('click', () => {
  if (confirm('Удалить все сохранённые объявления?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderAds();
  }
});

updatePreview();
renderAds();
