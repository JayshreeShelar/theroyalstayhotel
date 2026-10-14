/* main.js — shared UI: navigation, active page, reveal animations, smooth scroll, filters, date helpers */
(function () {
  'use strict';

  var RS = (window.RoyalStay = window.RoyalStay || {});
  document.documentElement.classList.add('js-ready');

  /* ---------- Date helpers (shared by home.js and booking.js) ---------- */
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  RS.toISO = function (date) { return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()); };
  RS.todayISO = function () { return RS.toISO(new Date()); };
  RS.addDaysISO = function (iso, days) {
    var p = iso.split('-');
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    d.setDate(d.getDate() + days);
    return RS.toISO(d);
  };
  RS.formatDate = function (iso) {
    var p = iso.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]))
      .toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };
  /* Keeps a check-in/check-out pair valid: no past check-in, check-out always after check-in */
  RS.linkDateInputs = function (checkIn, checkOut) {
    if (!checkIn || !checkOut) { return; }
    var today = RS.todayISO();
    checkIn.min = today;
    checkOut.min = RS.addDaysISO(today, 1);
    checkIn.addEventListener('change', function () {
      if (!checkIn.value) { return; }
      var minOut = RS.addDaysISO(checkIn.value, 1);
      checkOut.min = minOut;
      if (checkOut.value && checkOut.value < minOut) { checkOut.value = minOut; }
    });
  };

  /* ---------- Navigation ---------- */
  function currentPage() {
    var file = window.location.pathname.split('/').pop().replace('.html', '');
    return file === '' ? 'index' : file;
  }

  function setActiveLinks() {
    var page = currentPage();
    if (page === 'room-details') { page = 'rooms'; }
    document.querySelectorAll('[data-page]').forEach(function (link) {
      if (link.getAttribute('data-page') === page) { link.setAttribute('aria-current', 'page'); }
      else { link.removeAttribute('aria-current'); }
    });
  }

  function initMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) { return; }
    var icon = toggle.querySelector('i');

    function setOpen(open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (icon) { icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'; }
    }

    toggle.addEventListener('click', function () { setOpen(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) { setOpen(false); } });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1024) { setOpen(false); } });
  }

  function initHeaderScroll() {
    var wrap = document.getElementById('header-placeholder');
    if (!wrap) { return; }
    function onScroll() { wrap.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  RS.initComponents = function () {
    setActiveLinks();
    initMobileMenu();
    initHeaderScroll();
    initYear();
  };

  /* ---------- Scroll reveal ---------- */
  var observer = null;
  RS.observeReveal = function (root) {
    var items = (root || document).querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    }
    items.forEach(function (el) { observer.observe(el); });
  };

  /* ---------- Smooth in-page anchors ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) { return; }
      var id = link.getAttribute('href');
      if (id.length < 2) { return; }
      var target = document.querySelector(id);
      if (!target) { return; }
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  }

  /* ---------- Rooms page category filter ---------- */
  function initRoomFilters() {
    var buttons = document.querySelectorAll('[data-room-filter]');
    var cards = document.querySelectorAll('[data-room-category]');
    if (!buttons.length || !cards.length) { return; }
    var empty = document.getElementById('room-empty');

    function apply(filter) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-room-category') === filter;
        card.hidden = !match;
        if (match) { shown += 1; card.classList.add('is-visible'); }
      });
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-room-filter') === filter)); });
      if (empty) { empty.hidden = shown !== 0; }
    }

    buttons.forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-room-filter')); }); });
    var wanted = new URLSearchParams(window.location.search).get('filter');
    apply(['rooms', 'suites'].indexOf(wanted) > -1 ? wanted : 'all');
  }

  /* ---------- Init ---------- */
  document.addEventListener('components:loaded', RS.initComponents);
  document.addEventListener('DOMContentLoaded', function () {
    initSmoothScroll();
    initRoomFilters();
    RS.observeReveal();
    if (RS.componentsReady) { RS.initComponents(); }
  });
})();

/* ---------- Premium polish: scroll progress, card spotlight, map shield ---------- */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Gold scroll-progress line at the very top of the page */
  function initProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* Soft gold spotlight that follows the pointer over cards (desktop/mouse only) */
  function initSpotlight() {
    if (reduce || !window.matchMedia('(hover: hover)').matches) { return; }
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.card, .contact-detail, .contact-form-panel');
      if (!card) { return; }
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* Map ignores the mouse wheel until clicked, so scrolling the page never gets "stuck" on the map */
  function initMapShield() {
    document.querySelectorAll('[data-map-shield]').forEach(function (box) {
      var frame = box.querySelector('iframe');
      if (!frame) { return; }
      function lock() { box.classList.remove('is-active'); }
      box.addEventListener('click', function () { box.classList.add('is-active'); });
      box.addEventListener('mouseleave', lock);
      window.addEventListener('scroll', lock, { passive: true });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initProgress();
    initSpotlight();
    initMapShield();
  });
})();
