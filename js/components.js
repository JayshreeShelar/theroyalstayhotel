/* components.js — loads the shared header and footer into their placeholders */
(function () {
  'use strict';

  var RS = (window.RoyalStay = window.RoyalStay || {});

  var FALLBACK_HEADER =
    '<div class="container-x site-header-inner">' +
    '<a href="index.html" class="logo-link"><img src="assets/images/royal-stay-logo.svg" alt="The Royal Stay" width="168" height="48"></a>' +
    '<nav class="flex gap-4 text-sm" aria-label="Primary navigation">' +
    '<a class="nav-link" data-page="index" href="index.html">Home</a>' +
    '<a class="nav-link" data-page="rooms" href="rooms.html">Rooms</a>' +
    '<a class="nav-link" data-page="contact" href="contact.html">Contact</a></nav></div>';

  var FALLBACK_FOOTER =
    '<footer class="site-footer"><div class="container-x footer-inner"><p>&copy; <span data-year></span> The Royal Stay. ' +
    'The shared footer could not be loaded. Please serve this site with a local web server (for example VS Code Live Server).</p></div></footer>';

  function loadComponent(placeholderId, url, fallback) {
    var target = document.getElementById(placeholderId);
    if (!target) { return Promise.resolve(); }

    return fetch(url, { cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) { throw new Error(url + ' returned HTTP ' + response.status); }
        return response.text();
      })
      .then(function (html) { target.innerHTML = html; })
      .catch(function (error) {
        console.error('[The Royal Stay] Component failed to load:', error);
        target.innerHTML = fallback;
      });
  }

  Promise.all([
    loadComponent('header-placeholder', 'components/header.html', FALLBACK_HEADER),
    loadComponent('footer-placeholder', 'components/footer.html', FALLBACK_FOOTER)
  ]).then(function () {
    RS.componentsReady = true;
    document.dispatchEvent(new CustomEvent('components:loaded'));
  });
})();
