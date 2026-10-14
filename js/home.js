/* home.js — hero carousel (3 slides) and booking search bar validation */
(function () {
  'use strict';
  var RS = window.RoyalStay || {};

  /* ---------- Hero slider ---------- */
  function initHero() {
    var hero = document.getElementById('hero');
    if (!hero) { return; }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var pauseBtn = hero.querySelector('[data-hero-pause]');
    var live = hero.querySelector('[data-hero-live]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var INTERVAL = reduceMotion ? 8000 : 6000;
    var index = 0, timer = null, hoverPause = false, userPaused = false;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        var active = n === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.querySelectorAll('a, button').forEach(function (el) { el.tabIndex = active ? 0 : -1; });
      });
      dots.forEach(function (dot, n) {
        dot.classList.toggle('is-active', n === index);
        dot.setAttribute('aria-current', n === index ? 'true' : 'false');
      });
      if (live) { live.textContent = 'Slide ' + (index + 1) + ' of ' + slides.length; }
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (userPaused || hoverPause || document.hidden) { return; }
      timer = setInterval(function () { show(index + 1); }, INTERVAL);
    }
    function go(i) { show(i); start(); }

    if (prev) { prev.addEventListener('click', function () { go(index - 1); }); }
    if (next) { next.addEventListener('click', function () { go(index + 1); }); }
    dots.forEach(function (dot, n) { dot.addEventListener('click', function () { go(n); }); });

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        userPaused = !userPaused;
        pauseBtn.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
        pauseBtn.innerHTML = userPaused ? '<i class="fa-solid fa-play" aria-hidden="true"></i>' : '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
        if (live) { live.setAttribute('aria-live', userPaused ? 'polite' : 'off'); }
        start();
      });
    }

    hero.addEventListener('mouseenter', function () { hoverPause = true; stop(); });
    hero.addEventListener('mouseleave', function () { hoverPause = false; start(); });
    hero.addEventListener('focusin', function () { hoverPause = true; stop(); });
    hero.addEventListener('focusout', function () { hoverPause = false; start(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) { stop(); } else { start(); } });

    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(index - 1); }
      if (e.key === 'ArrowRight') { go(index + 1); }
    });

    show(0);
    start();
  }

  /* ---------- Booking search bar ---------- */
  function initBookingBar() {
    var form = document.getElementById('booking-bar-form');
    if (!form) { return; }
    var checkIn = form.elements['checkin'];
    var checkOut = form.elements['checkout'];
    var guests = form.elements['guests'];
    var rooms = form.elements['rooms'];
    var status = document.getElementById('booking-bar-status');

    if (RS.linkDateInputs) { RS.linkDateInputs(checkIn, checkOut); }

    function setError(field, message) {
      var el = form.querySelector('[data-error-for="' + field.name + '"]');
      if (message) { field.setAttribute('aria-invalid', 'true'); } else { field.removeAttribute('aria-invalid'); }
      if (el) { el.textContent = message || ''; el.hidden = !message; }
    }
    function showStatus(message, isError) {
      status.hidden = false;
      status.textContent = message;
      status.classList.toggle('is-error', !!isError);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var today = RS.todayISO();
      var ok = true;
      setError(checkIn, ''); setError(checkOut, '');

      if (!checkIn.value) { setError(checkIn, 'Choose a check-in date.'); ok = false; }
      else if (checkIn.value < today) { setError(checkIn, 'Check-in cannot be in the past.'); ok = false; }

      if (!checkOut.value) { setError(checkOut, 'Choose a check-out date.'); ok = false; }
      else if (checkIn.value && checkOut.value <= checkIn.value) { setError(checkOut, 'Check-out must be after check-in.'); ok = false; }

      if (!ok) { showStatus('Please correct the highlighted dates and try again.', true); return; }

      var nights = Math.round((new Date(checkOut.value) - new Date(checkIn.value)) / 86400000);
      showStatus(
        'Demo search for ' + RS.formatDate(checkIn.value) + ' to ' + RS.formatDate(checkOut.value) + ' (' + nights +
        (nights === 1 ? ' night' : ' nights') + '), ' + guests.value + ' guest(s), ' + rooms.value + ' room(s). ' +
        'This is a front-end demonstration; live availability is not connected. Browse the sample rooms below.', false
      );
      var roomsSection = document.getElementById('rooms');
      if (roomsSection) { roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  }

  document.addEventListener('DOMContentLoaded', function () { initHero(); initBookingBar(); });
})();
