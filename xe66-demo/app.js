(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const grid = $('#gamesGrid');
  const cards = $$('.game-card');
  const overlay = $('#overlay');
  const drawer = $('#sideDrawer');
  const toast = $('#toast');
  let currentFilter = 'all';
  let currentProvider = 'all';
  let currentLanguage = 'bn';
  let authMode = 'login';
  let toastTimer;
  let activeGame = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }
  function openLayer(target) {
    overlay.hidden = false;
    target.hidden = false;
    if (target === drawer) requestAnimationFrame(() => drawer.classList.add('open'));
  }
  function closeLayers() {
    drawer.classList.remove('open');
    overlay.hidden = true;
    $$('.modal').forEach(m => m.hidden = true);
    setTimeout(() => { if (!drawer.classList.contains('open')) drawer.style.visibility = ''; }, 250);
  }
  function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    $$('[data-bn][data-en]').forEach(el => { el.textContent = el.dataset[lang]; });
    $('#languageToggle').textContent = lang === 'bn' ? '◎' : 'বাং';
  }
  function applyFilters() {
    let visible = 0;
    cards.forEach(card => {
      const providerMatch = currentProvider === 'all' || card.dataset.provider === currentProvider;
      const categoryMatch = currentFilter === 'all' || card.dataset.category === currentFilter;
      const queryMatch = card.dataset.name.toLowerCase().includes($('#gameSearch').value.trim().toLowerCase());
      const show = providerMatch && categoryMatch && queryMatch;
      card.hidden = !show;
      if (show) visible++;
    });
    $('#gameCount').textContent = visible;
    $('#emptyState').hidden = visible !== 0;
  }
  function openGame(card) {
    activeGame = card;
    $('#gameModalTitle').textContent = card.dataset.name;
    $('#modalGameArt').className = `modal-game-art ${[...card.classList].find(c => c.startsWith('art-')) || ''}`;
    $('#modalGameArt').innerHTML = `<span>${$('.art-emoji', card).textContent}</span>`;
    $('#previewEmoji').textContent = $('.art-emoji', card).textContent;
    $('#previewStatus').textContent = currentLanguage === 'bn' ? 'খেলার নমুনা' : 'Game sample';
    $('#previewHint').textContent = currentLanguage === 'bn' ? 'শুধু দেখার জন্য' : 'Preview only';
    $('#previewPlay').textContent = currentLanguage === 'bn' ? 'প্রিভিউ দেখুন' : 'View preview';
    openLayer($('#gameModal'));
  }

  $('#menuOpen').addEventListener('click', () => openLayer(drawer));
  $('#searchOpen').addEventListener('click', () => { openLayer($('#searchModal')); setTimeout(() => $('#gameSearch').focus(), 80); });
  $('#languageToggle').addEventListener('click', () => setLanguage(currentLanguage === 'bn' ? 'en' : 'bn'));
  $('#noticeClose').addEventListener('click', () => $('.announcement').remove());
  overlay.addEventListener('click', closeLayers);
  $$('[data-close]').forEach(btn => btn.addEventListener('click', closeLayers));
  cards.forEach(card => {
    card.addEventListener('click', event => {
      if (event.target.classList.contains('fav')) return;
      openGame(card);
    });
    $('.fav', card).addEventListener('click', event => {
      event.stopPropagation();
      const fav = event.currentTarget;
      fav.classList.toggle('selected');
      fav.textContent = fav.classList.contains('selected') ? '★' : '☆';
      showToast(fav.classList.contains('selected') ? 'Added to favorites' : 'Removed from favorites');
    });
  });
  $$('.provider').forEach(btn => btn.addEventListener('click', () => {
    $$('.provider').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentProvider = btn.dataset.provider;
    applyFilters();
  }));
  $$('.chip').forEach(btn => btn.addEventListener('click', () => {
    $$('.chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    applyFilters();
  }));
  $('#gameSearch').addEventListener('input', applyFilters);
  $('#scrollLeft').addEventListener('click', () => grid.scrollBy({ left: -230, behavior: 'smooth' }));
  $('#scrollRight').addEventListener('click', () => grid.scrollBy({ left: 230, behavior: 'smooth' }));
  $('#previewPlay').addEventListener('click', () => {
    if (!activeGame) return;
    $('#previewStatus').textContent = currentLanguage === 'bn' ? 'ডেমো প্রিভিউ প্রস্তুত' : 'Demo preview ready';
    $('#previewHint').textContent = currentLanguage === 'bn' ? 'এখানে আসল গেম যুক্ত করা হয়নি' : 'No live game is connected here';
    showToast(currentLanguage === 'bn' ? 'এটি শুধু UI প্রিভিউ — কোনো বাজি নেই' : 'UI preview only — no wagering');
  });

  $('#authForm').addEventListener('submit', event => {
    event.preventDefault();
    showToast('Demo only — account service is not connected');
    closeLayers();
  });
  $$('[data-auth]').forEach(btn => btn.addEventListener('click', () => {
    authMode = btn.dataset.auth;
    $$('[data-auth]').forEach(b => b.classList.toggle('active', b === btn));
    $('#authTitle').textContent = authMode === 'login' ? 'Login' : 'Register';
    $('#authSubmit').textContent = authMode === 'login' ? 'Continue' : 'Create demo account';
    $('#passwordLabel').hidden = false;
  }));
  function showAuth(mode = 'login') {
    authMode = mode;
    $$('[data-auth]').forEach(b => b.classList.toggle('active', b.dataset.auth === mode));
    $('#authTitle').textContent = mode === 'login' ? 'Login' : 'Register';
    $('#authSubmit').textContent = mode === 'login' ? 'Continue' : 'Create demo account';
    openLayer($('#authModal'));
  }
  $('#headerLogin').addEventListener('click', () => showAuth('login'));
  $('#headerRegister').addEventListener('click', () => showAuth('register')); 
  $$('.nav-item').forEach(btn => btn.addEventListener('click', () => {
    $$('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const action = btn.dataset.nav;
    if (action === 'favorites') {
      currentProvider = 'all'; currentFilter = 'all';
      $$('.provider').forEach(b => b.classList.toggle('active', b.dataset.provider === 'all'));
      $$('.chip').forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
      cards.forEach(card => card.hidden = !$('.fav', card).classList.contains('selected'));
      $('#gameCount').textContent = cards.filter(card => !card.hidden).length;
      $('#emptyState').hidden = cards.some(card => !card.hidden);
      showToast('Favorite games');
    } else if (action === 'profile') showAuth();
    else if (action === 'points') showToast('Demo points: 0 — no cash value');
    else if (action === 'messages') showToast('No new demo messages');
    else { applyFilters(); $('#top').scrollIntoView({ behavior: 'smooth' }); }
  }));
  $$('.drawer-link').forEach(btn => btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    closeLayers();
    if (action === 'favorites') $('.nav-item[data-nav="favorites"]').click();
    else if (action === 'points') showToast('Demo points: 0 — no cash value');
    else { $('.nav-item[data-nav="home"]').click(); }
  }));
  setLanguage('bn');
  applyFilters();
})();
