(function(){
  'use strict';

  const modal = document.getElementById('submitContactModal');
  const closeBtn = document.getElementById('submitContactClose');

  if(!modal) return;

  function openModal(){
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('submit-contact-open');
  }

  function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('submit-contact-open');
  }

  document.addEventListener('click', function(event){
    const link = event.target.closest('a');

    if(!link) return;

    const text = (link.textContent || '').toLowerCase().trim();
    const href = (link.getAttribute('href') || '').toLowerCase();

    const isSubmitButton =
      link.classList.contains('ann-add-btn') ||
      text.includes('подать объявление') ||
      text.includes('разместить объявление') ||
      text.includes('перейти в админку');

    if(isSubmitButton && href.includes('admin.html')){
      event.preventDefault();
      openModal();
    }
  });

  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', function(event){
    if(event.target === modal) closeModal();
  });

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape') closeModal();
  });
})();
