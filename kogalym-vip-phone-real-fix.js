/* KOGALYM VIP + PHONE FINAL ONE-CHANCE FIX */
(function(){
  'use strict';

  const STORAGE_CANDIDATES = [
    'kogalym_ads','ads','announcements','site_ads','customAds','adminAds',
    'marketAds','kogalym_announcements','postedAds','userAds','allAds'
  ];
  const PENDING_KEY = 'kogalym_pending_vip_phone';

  function ready(fn){
    if(document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function parse(value, fallback){
    try{
      const data = JSON.parse(value);
      return data == null ? fallback : data;
    }catch(e){
      return fallback;
    }
  }

  function write(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){}
  }

  function norm(v){
    return String(v || '').toLowerCase().trim();
  }

  function pending(){
    return parse(localStorage.getItem(PENDING_KEY), {});
  }

  function savePending(data){
    write(PENDING_KEY, data || {});
  }

  function phoneInput(){
    return document.querySelector(
      '#adPhone,[name="phone"],[name="tel"],[name="contact"],[name="contactPhone"],[name="phoneNumber"],input[type="tel"]'
    );
  }

  function vipInput(){
    return document.querySelector(
      '#adVip,[name="vip"],[name="isVip"],[name="premium"],[name="top"],[name="is_vip"]'
    );
  }

  function collect(){
    const p = phoneInput();
    const v = vipInput();
    return {
      phone: p ? String(p.value || '').trim() : '',
      tel: p ? String(p.value || '').trim() : '',
      contactPhone: p ? String(p.value || '').trim() : '',
      vip: v ? Boolean(v.checked) : false,
      isVip: v ? Boolean(v.checked) : false,
      premium: v ? Boolean(v.checked) : false,
      top: v ? Boolean(v.checked) : false,
      updatedAt: Date.now()
    };
  }

  function enhance(ad, data){
    if(!ad || typeof ad !== 'object') return ad;
    const next = Object.assign({}, ad);

    const phone = data.phone || data.tel || data.contactPhone;
    if(phone){
      next.phone = phone;
      next.tel = next.tel || phone;
      next.contact = next.contact || phone;
      next.contactPhone = next.contactPhone || phone;
      next.phoneNumber = next.phoneNumber || phone;
    }

    const isVip = Boolean(data.vip || data.isVip || data.premium || data.top);
    if(isVip){
      next.vip = true;
      next.isVip = true;
      next.premium = true;
      next.top = true;
      next.is_vip = true;
    }else{
      const oldVip = Boolean(next.vip || next.isVip || next.premium || next.top || next.is_vip);
      next.vip = oldVip;
      next.isVip = oldVip;
    }

    return next;
  }

  function patchArray(arr, data){
    if(!Array.isArray(arr) || !arr.length) return arr;
    const next = arr.slice();

    // Cover both common storage orders.
    const indexes = Array.from(new Set([next.length - 1, 0]));
    indexes.forEach((idx) => {
      next[idx] = enhance(next[idx], data);
    });

    return next;
  }

  function patchExisting(){
    const data = pending();
    if(!(data.phone || data.vip || data.isVip || data.premium || data.top)) return;

    STORAGE_CANDIDATES.forEach((key)=>{
      const raw = localStorage.getItem(key);
      if(!raw) return;

      const parsed = parse(raw, null);
      if(Array.isArray(parsed)){
        write(key, patchArray(parsed, data));
      }else if(parsed && typeof parsed === 'object'){
        write(key, enhance(parsed, data));
      }
    });
  }

  function interceptStorage(){
    if(window.__kogalymOneChanceStorageFix) return;
    window.__kogalymOneChanceStorageFix = true;

    const original = localStorage.setItem.bind(localStorage);

    localStorage.setItem = function(key, value){
      try{
        if(key !== PENDING_KEY && typeof value === 'string'){
          const data = pending();
          if(data.phone || data.vip || data.isVip || data.premium || data.top){
            const parsed = parse(value, null);
            if(Array.isArray(parsed)){
              value = JSON.stringify(patchArray(parsed, data));
            }else if(parsed && typeof parsed === 'object'){
              value = JSON.stringify(enhance(parsed, data));
            }
          }
        }
      }catch(e){}
      return original(key, value);
    };
  }

  function injectAdminFields(){
    const form = document.querySelector('#adForm,.admin-form,form');
    if(!form) return;

    if(!phoneInput()){
      const label = document.createElement('label');
      label.className = 'vip-phone-label';
      label.innerHTML = 'Телефон для связи <input type="tel" id="adPhone" name="phone" placeholder="+7 (___) ___-__-__" autocomplete="tel">';
      form.appendChild(label);
    }

    if(!vipInput()){
      const label = document.createElement('label');
      label.className = 'vip-checkbox-label';
      label.innerHTML = '<input type="checkbox" id="adVip" name="vip"> VIP объявление';
      form.appendChild(label);
    }

    const update = () => savePending(collect());

    ['input','change','keyup'].forEach((eventName)=>{
      form.addEventListener(eventName, update, true);
    });

    form.addEventListener('submit', ()=>{
      update();
      [50,150,400,900,1600].forEach((t)=>setTimeout(patchExisting, t));
    }, true);

    form.querySelectorAll('button,input[type="submit"],input[type="button"]').forEach((btn)=>{
      btn.addEventListener('click', ()=>{
        update();
        [50,150,400,900,1600].forEach((t)=>setTimeout(patchExisting, t));
      }, true);
    });

    update();
  }

  function readAds(){
    let best = [];
    STORAGE_CANDIDATES.forEach((key)=>{
      const data = parse(localStorage.getItem(key), []);
      if(Array.isArray(data) && data.length >= best.length) best = data;
    });
    return best;
  }

  function adTitle(ad){
    return norm(ad && (ad.title || ad.name || ad.heading || ad.caption || ad.label || ad.description));
  }

  function cardTitle(card){
    return norm(card.querySelector('h3,h2,.ad-title,.ann-title,.card-title,.title')?.textContent || card.textContent.slice(0,80));
  }

  function matchAd(card, index, ads){
    if(!ads.length) return null;

    const ct = cardTitle(card);
    if(ct){
      const byTitle = ads.find((ad)=>{
        const at = adTitle(ad);
        return at && (at.includes(ct) || ct.includes(at));
      });
      if(byTitle) return byTitle;
    }

    return ads[index] || ads[ads.length - 1] || null;
  }

  function isVip(ad){
    return Boolean(ad && (ad.vip || ad.isVip || ad.premium || ad.top || ad.is_vip));
  }

  function getPhone(ad){
    return String(ad && (ad.phone || ad.tel || ad.contact || ad.contactPhone || ad.mobile || ad.phoneNumber) || '').trim();
  }

  function findList(){
    return (
      document.querySelector('#adsList') ||
      document.querySelector('#announcementsList') ||
      document.querySelector('#announcements-list') ||
      document.querySelector('#cardsList') ||
      document.querySelector('.ads-list') ||
      document.querySelector('.announcements-list') ||
      document.querySelector('.announcements-grid') ||
      document.querySelector('.cards-grid') ||
      document.querySelector('.cards') ||
      document.querySelector('.grid') ||
      document.querySelector('main')
    );
  }

  function findCards(scope){
    const root = scope || document;
    let cards = Array.from(root.querySelectorAll('.ad-card,.announcement-card,.ann-card,.listing-card,.card'));

    // Filter generic .card to avoid nav/service junk as much as possible.
    cards = cards.filter((card)=>{
      const text = norm(card.textContent);
      return text.length > 10 && (
        card.querySelector('h3,h2,.title,.price,.ad-price,button') ||
        /₽|руб|телефон|показать|vip|объяв/i.test(card.textContent)
      );
    });

    return cards;
  }

  function ensureVip(card){
    card.classList.add('vip');

    if(getComputedStyle(card).position === 'static'){
      card.style.position = 'relative';
    }

    if(!card.querySelector('.vip-badge,.ad-vip,.top-badge')){
      const badge = document.createElement('div');
      badge.className = 'vip-badge';
      badge.textContent = 'VIP';
      card.appendChild(badge);
    }
  }

  function ensurePhone(card, phone){
    let btn = card.querySelector('.show-phone-btn,.phone-btn,.ad-phone-btn,[data-phone]');

    if(!btn){
      const body = card.querySelector('.ad-card-content,.announcement-card-content,.ann-card-body,.ad-content,.card-body') || card;
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'show-phone-btn';
      btn.textContent = 'Показать телефон';
      body.appendChild(btn);
    }

    btn.dataset.phone = phone || '';

    if(btn.dataset.kogalymFinalPhoneReady !== '1'){
      btn.dataset.kogalymFinalPhoneReady = '1';
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        const value = String(btn.dataset.phone || '').trim();
        btn.textContent = value && /\d/.test(value) ? value : 'Телефон не указан';
        btn.classList.add('phone-revealed');
      });
    }
  }

  function applyFront(){
    const list = findList();
    const scope = list || document;
    const cards = findCards(scope);
    if(!cards.length) return;

    const ads = readAds();

    cards.forEach((card,index)=>{
      const ad = matchAd(card, index, ads);
      if(!ad) return;

      if(isVip(ad)) ensureVip(card);
      ensurePhone(card, getPhone(ad));
    });

    if(list){
      Array.from(list.querySelectorAll('.vip')).reverse().forEach((card)=>list.prepend(card));
    }
  }

  function boot(){
    interceptStorage();
    injectAdminFields();
    patchExisting();
    applyFront();

    ['click','input','change'].forEach((eventName)=>{
      document.addEventListener(eventName, ()=>setTimeout(applyFront, 80), true);
    });

    const list = findList();
    if(list){
      const observer = new MutationObserver(()=>window.requestAnimationFrame(applyFront));
      observer.observe(list, {childList:true, subtree:true});
    }

    setTimeout(applyFront, 300);
    setTimeout(applyFront, 1000);
  }

  ready(boot);
})();
