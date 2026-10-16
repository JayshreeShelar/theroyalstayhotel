/* components.js — loads the shared header and footer into their placeholders */
(function () {
  'use strict';

  var RS = (window.RoyalStay = window.RoyalStay || {});

  // Full copies of components/header.html and components/footer.html. They are used only when the files
  // cannot be fetched (for example when index.html is opened by double-click instead of a local server),
  // so the real header and footer always appear. Keep them in sync if you edit the component files.
  var FALLBACK_HEADER = "<div class=\"container-x site-header-inner\">\n  <a href=\"index.html\" class=\"logo-link\" aria-label=\"The Royal Stay — home\">\n    <img src=\"assets/images/royal-stay-logo.svg\" alt=\"The Royal Stay — Where Luxury Feels Like Home\" width=\"168\" height=\"48\">\n  </a>\n\n  <nav class=\"hidden lg:flex items-center gap-5 xl:gap-7\" aria-label=\"Primary navigation\">\n    <a class=\"nav-link\" data-page=\"index\" href=\"index.html\">Home</a>\n    <a class=\"nav-link\" data-page=\"rooms\" href=\"rooms.html\">Rooms &amp; Suites</a>\n    <a class=\"nav-link\" data-page=\"amenities\" href=\"amenities.html\">Amenities</a>\n    <a class=\"nav-link\" data-page=\"dining\" href=\"dining.html\">Dining</a>\n    <a class=\"nav-link\" data-page=\"gallery\" href=\"gallery.html\">Gallery</a>\n    <a class=\"nav-link\" data-page=\"about\" href=\"about.html\">About Us</a>\n    <a class=\"nav-link\" data-page=\"contact\" href=\"contact.html\">Contact</a>\n  </nav>\n\n  <div class=\"flex items-center gap-3 header-actions\">\n    <a href=\"contact.html\" class=\"btn btn-gold btn-sm hidden sm:inline-flex lg:hidden xl:inline-flex\">Make an Enquiry</a>\n    <button type=\"button\" id=\"menu-toggle\" class=\"menu-toggle lg:hidden\" aria-expanded=\"false\" aria-controls=\"mobile-menu\" aria-label=\"Open menu\">\n      <i class=\"fa-solid fa-bars\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n</div>\n\n<div id=\"mobile-menu\" class=\"mobile-menu lg:hidden\">\n  <nav aria-label=\"Mobile navigation\">\n    <a class=\"mobile-link\" data-page=\"index\" href=\"index.html\">Home</a>\n    <a class=\"mobile-link\" data-page=\"rooms\" href=\"rooms.html\">Rooms &amp; Suites</a>\n    <a class=\"mobile-link\" data-page=\"amenities\" href=\"amenities.html\">Amenities</a>\n    <a class=\"mobile-link\" data-page=\"dining\" href=\"dining.html\">Dining</a>\n    <a class=\"mobile-link\" data-page=\"gallery\" href=\"gallery.html\">Gallery</a>\n    <a class=\"mobile-link\" data-page=\"about\" href=\"about.html\">About Us</a>\n    <a class=\"mobile-link\" data-page=\"contact\" href=\"contact.html\">Contact</a>\n  </nav>\n  <a href=\"contact.html\" class=\"btn btn-gold w-full mt-3\">Book Your Stay</a>\n</div>";

  var FALLBACK_FOOTER = "<footer class=\"site-footer\">\n  <div class=\"container-x footer-inner\">\n    <div class=\"grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-8 lg:grid-cols-4\">\n      <div class=\"col-span-2 sm:col-span-1\">\n        <a href=\"index.html\" class=\"logo-link\" aria-label=\"The Royal Stay — home\">\n          <img src=\"assets/images/royal-stay-logo-light.svg\" alt=\"The Royal Stay — Where Luxury Feels Like Home\" width=\"190\" height=\"54\" class=\"footer-logo\">\n        </a>\n        <p class=\"mt-3 text-sm footer-blurb\">A luxury hospitality showcase inspired by timeless elegance, thoughtful design and memorable experiences.</p>\n        <div class=\"flex gap-2 mt-4\">\n          <a class=\"social-link\" href=\"#\" aria-label=\"Facebook (placeholder link)\"><i class=\"fa-brands fa-facebook-f\" aria-hidden=\"true\"></i></a>\n          <a class=\"social-link\" href=\"#\" aria-label=\"Instagram (placeholder link)\"><i class=\"fa-brands fa-instagram\" aria-hidden=\"true\"></i></a>\n          <a class=\"social-link\" href=\"#\" aria-label=\"X (placeholder link)\"><i class=\"fa-brands fa-x-twitter\" aria-hidden=\"true\"></i></a>\n          <a class=\"social-link\" href=\"#\" aria-label=\"LinkedIn (placeholder link)\"><i class=\"fa-brands fa-linkedin-in\" aria-hidden=\"true\"></i></a>\n        </div>\n      </div>\n\n      <div class=\"lg:mx-auto lg:w-fit\">\n        <h3>Quick Links</h3>\n        <ul>\n          <li><a class=\"footer-link\" href=\"index.html\">Home</a></li>\n          <li><a class=\"footer-link\" href=\"rooms.html\">Rooms &amp; Suites</a></li>\n          <li><a class=\"footer-link\" href=\"amenities.html\">Amenities</a></li>\n          <li><a class=\"footer-link\" href=\"dining.html\">Dining</a></li>\n          <li><a class=\"footer-link\" href=\"gallery.html\">Gallery</a></li>\n          <li><a class=\"footer-link\" href=\"about.html\">About Us</a></li>\n          <li><a class=\"footer-link\" href=\"contact.html\">Contact</a></li>\n        </ul>\n      </div>\n\n      <div>\n        <h3>Stay &amp; Enjoy</h3>\n        <ul>\n          <li><a class=\"footer-link\" href=\"room-details.html?room=deluxe\">Deluxe Room</a></li>\n          <li><a class=\"footer-link\" href=\"room-details.html?room=executive\">Executive Suite</a></li>\n          <li><a class=\"footer-link\" href=\"room-details.html?room=royal\">Royal Suite</a></li>\n          <li><a class=\"footer-link\" href=\"amenities.html#pool\">Swimming Pool</a></li>\n          <li><a class=\"footer-link\" href=\"amenities.html#spa\">Spa &amp; Wellness</a></li>\n          <li><a class=\"footer-link\" href=\"amenities.html#fitness\">Fitness Centre</a></li>\n        </ul>\n      </div>\n\n      <div class=\"col-span-2 sm:col-span-1\">\n        <h3>Contact</h3>\n        <ul class=\"text-sm footer-contact\">\n          <li class=\"contact-line\"><i class=\"fa-solid fa-location-dot\" aria-hidden=\"true\"></i>Pune – Lonavala, Maharashtra, India</li>\n          <li class=\"contact-line\"><i class=\"fa-solid fa-phone\" aria-hidden=\"true\"></i>88305 32500</li>\n          <li class=\"contact-line\"><i class=\"fa-solid fa-envelope\" aria-hidden=\"true\"></i>shelarjayshree635@gmail.com</li>\n          <li class=\"contact-line\"><i class=\"fa-regular fa-clock\" aria-hidden=\"true\"></i>Reception: 24 hours (sample)</li>\n        </ul>\n      </div>\n    </div>\n\n    <div class=\"footer-bottom mt-8 pt-4 flex flex-col sm:flex-row gap-2 justify-between\">\n      <p>&copy; <span data-year>2026</span> The Royal Stay. Demonstration website with sample content.</p>\n      <p>Prices, offers and testimonials shown are illustrative only.</p>\n    </div>\n  </div>\n</footer>";

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
