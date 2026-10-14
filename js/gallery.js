/* gallery.js — category filters and accessible lightbox */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid) { return; }

    var items = Array.prototype.slice.call(grid.querySelectorAll('.gallery-item'));
    var buttons = document.querySelectorAll('[data-gallery-filter]');
    var lightbox = document.getElementById('lightbox');
    var lbImg = document.getElementById('lightbox-img');
    var lbCaption = document.getElementById('lightbox-caption');
    var btnClose = document.getElementById('lightbox-close');
    var btnPrev = document.getElementById('lightbox-prev');
    var btnNext = document.getElementById('lightbox-next');
    var current = 0, lastFocus = null;

    function visibleItems() { return items.filter(function (el) { return !el.hidden; }); }

    /* Filters */
    function applyFilter(filter) {
      items.forEach(function (el) { el.hidden = !(filter === 'all' || el.getAttribute('data-category') === filter); });
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-gallery-filter') === filter)); });
    }
    buttons.forEach(function (b) { b.addEventListener('click', function () { applyFilter(b.getAttribute('data-gallery-filter')); }); });
    applyFilter('all');

    /* Lightbox */
    function render() {
      var list = visibleItems();
      var el = list[current];
      if (!el) { return; }
      var img = el.querySelector('img');
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.getAttribute('alt');
      lbCaption.textContent = el.getAttribute('data-caption') + ' (' + (current + 1) + ' / ' + list.length + ')';
    }
    function open(el) {
      lastFocus = document.activeElement;
      current = visibleItems().indexOf(el);
      render();
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      btnClose.focus();
    }
    function close() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) { lastFocus.focus(); }
    }
    function step(delta) {
      var n = visibleItems().length;
      current = (current + delta + n) % n;
      render();
    }

    items.forEach(function (el) { el.addEventListener('click', function () { open(el); }); });
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function () { step(-1); });
    btnNext.addEventListener('click', function () { step(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) { close(); } });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) { return; }
      if (e.key === 'Escape') { close(); }
      else if (e.key === 'ArrowLeft') { step(-1); }
      else if (e.key === 'ArrowRight') { step(1); }
      else if (e.key === 'Tab') {
        var f = [btnClose, btnPrev, btnNext];
        var i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
  });
})();
