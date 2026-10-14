/* booking.js — room data, room-details rendering, enquiry form and contact form validation (front-end only) */
(function () {
  'use strict';
  var RS = window.RoyalStay || {};

  var IMG = 'assets/images/';
  var ROOMS = {
    deluxe: {
      name: 'Deluxe Room', price: 240, size: '38 m²', guests: 2, bed: 'King bed or twin beds', category: 'rooms',
      image: IMG + 'deluxe-room.jpg',
      alt: 'Deluxe Room with a king bed, warm neutral tones and soft lighting',
      summary: 'A calm, light-filled room with a plush king bed and a quiet work corner.',
      description: 'The Deluxe Room is our signature everyday retreat: warm neutral tones, a king bed dressed in fine linens, a comfortable seating nook and a marble-finished bathroom with a rain shower. It suits solo travellers and couples who want comfort without fuss.',
      amenities: ['Complimentary high-speed Wi-Fi', 'Air conditioning', 'Rain shower and bath amenities', 'Smart TV', 'Mini bar and tea station', 'In-room safe', 'Work desk', 'Daily housekeeping'],
      gallery: ['deluxe-room.jpg', 'hotel-gallery-2.jpg', 'executive-suite.jpg', 'swimming-pool.jpg']
    },
    executive: {
      name: 'Executive Suite', price: 380, size: '62 m²', guests: 3, bed: 'King bed plus sofa bed', category: 'suites',
      image: IMG + 'executive-suite.jpg',
      alt: 'Executive Suite living area with designer sofa and a bedroom beyond',
      summary: 'A separate lounge, a generous bedroom and extra room to spread out.',
      description: 'The Executive Suite pairs a private living room with a spacious bedroom. A dedicated work table, lounge seating and a deep soaking tub make it equally good for longer business stays and relaxed weekends away.',
      amenities: ['Separate living room', 'Soaking tub and rain shower', 'Complimentary high-speed Wi-Fi', 'Nespresso-style coffee station', 'Dedicated work table', 'Smart TV in lounge and bedroom', 'In-room safe', 'Priority late check-out (subject to availability)'],
      gallery: ['executive-suite.jpg', 'deluxe-room.jpg', 'royal-suite.jpg', 'spa-wellness.jpg']
    },
    royal: {
      name: 'Royal Suite', price: 720, size: '110 m²', guests: 4, bed: 'Super-king bed plus twin sofa beds', category: 'suites',
      image: IMG + 'royal-suite.jpg',
      alt: 'Royal Suite bedroom with a canopy-style bed, gold accents and city views',
      summary: 'Our grandest address: panoramic views, a dining area and butler-style service.',
      description: 'The Royal Suite is the hotel’s most generous space, with a super-king bedroom, a separate lounge, a private dining table and floor-to-ceiling windows. A personal host arranges arrivals, dining and in-suite extras to your preferences.',
      amenities: ['Panoramic views', 'Private dining area', 'Dressing room', 'Marble bathroom with soaking tub', 'Dedicated personal host', 'Complimentary high-speed Wi-Fi', 'Premium minibar', 'Airport transfer on request'],
      gallery: ['royal-suite.jpg', 'executive-suite.jpg', 'hotel-gallery-1.jpg', 'restaurant.jpg']
    },
    family: {
      name: 'Family Suite', price: 330, size: '70 m²', guests: 5, bed: 'King bed plus two twin beds', category: 'suites',
      image: IMG + 'family-suite.jpg',
      alt: 'Family Suite with a king bed, twin beds and a bright seating area',
      summary: 'Two sleeping zones and a lounge, designed for families travelling together.',
      description: 'The Family Suite gives everyone their own space: a king bedroom, a second room with twin beds and a shared lounge. Soft furnishings, child-friendly touches on request and easy access to the pool make it a relaxed base for family stays.',
      amenities: ['Two sleeping areas', 'Shared lounge', 'Complimentary high-speed Wi-Fi', 'Cots and extra beds on request', 'Smart TV', 'Mini fridge', 'In-room safe', 'Close to the pool and breakfast room'],
      gallery: ['family-suite.jpg', 'deluxe-room.jpg', 'swimming-pool.jpg', 'restaurant.jpg']
    }
  };
  var DEFAULT_ROOM = 'deluxe';
  RS.rooms = ROOMS;

  /* ---------- Generic field validation ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validPhone(v) { return /^[+()\-\s\d.]{7,20}$/.test(v) && v.replace(/\D/g, '').length >= 7; }

  function fieldMessage(field) {
    var rules = (field.getAttribute('data-rules') || '').split(' ');
    var value = field.value.trim();
    var label = field.getAttribute('data-label') || 'This field';
    if (rules.indexOf('required') > -1 && !value) { return label + ' is required.'; }
    if (value && rules.indexOf('email') > -1 && !EMAIL_RE.test(value)) { return 'Enter a valid email address, for example name@example.com.'; }
    if (value && rules.indexOf('phone') > -1 && !validPhone(value)) { return 'Enter a valid phone number (7–15 digits; +, spaces and dashes allowed).'; }
    if (value && rules.indexOf('minlen') > -1 && value.length < 10) { return label + ' should be at least 10 characters.'; }
    return '';
  }

  function showFieldError(form, field, message) {
    var out = form.querySelector('[data-error-for="' + field.name + '"]');
    if (message) { field.setAttribute('aria-invalid', 'true'); if (out) { field.setAttribute('aria-describedby', out.id); } }
    else { field.removeAttribute('aria-invalid'); }
    if (out) { out.textContent = message; out.hidden = !message; }
  }

  function status(el, message, isError) {
    if (!el) { return; }
    el.hidden = false;
    el.textContent = message;
    el.classList.toggle('is-error', !!isError);
  }

  function attachLiveValidation(form) {
    form.querySelectorAll('[data-rules]').forEach(function (field) {
      field.addEventListener('blur', function () { showFieldError(form, field, fieldMessage(field)); });
      field.addEventListener('input', function () { if (field.getAttribute('aria-invalid') === 'true') { showFieldError(form, field, fieldMessage(field)); } });
    });
  }

  function validateAll(form) {
    var firstBad = null;
    form.querySelectorAll('[data-rules]').forEach(function (field) {
      var msg = fieldMessage(field);
      showFieldError(form, field, msg);
      if (msg && !firstBad) { firstBad = field; }
    });
    return firstBad;
  }

  /* ---------- Room details page ---------- */
  function renderRoomDetails() {
    var host = document.getElementById('room-detail');
    if (!host) { return null; }

    var key = new URLSearchParams(window.location.search).get('room');
    if (!ROOMS[key]) { key = DEFAULT_ROOM; }
    var room = ROOMS[key];

    function set(id, text) { var el = document.getElementById(id); if (el) { el.textContent = text; } }

    document.title = room.name + ' | The Royal Stay';
    var heroImg = document.getElementById('rd-hero-img');
    heroImg.src = room.image; heroImg.alt = room.alt;
    set('rd-crumb', room.name);
    set('rd-title', room.name);
    set('rd-summary', room.summary);
    set('rd-price', '$' + room.price);
    set('rd-desc', room.description);
    set('rd-bed', room.bed);
    set('rd-guests', 'Up to ' + room.guests + ' guests');
    set('rd-size', room.size);

    var list = document.getElementById('rd-amenities');
    list.innerHTML = '';
    room.amenities.forEach(function (a) {
      var li = document.createElement('li');
      li.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i><span></span>';
      li.querySelector('span').textContent = a;
      list.appendChild(li);
    });

    /* Gallery */
    var main = document.getElementById('rd-main-image');
    var thumbs = document.getElementById('rd-thumbs');
    main.src = IMG + room.gallery[0]; main.alt = room.name + ' — main photograph';
    thumbs.innerHTML = '';
    room.gallery.forEach(function (file, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'thumb' + (i === 0 ? ' is-active' : '');
      b.setAttribute('aria-label', 'Show photograph ' + (i + 1) + ' of ' + room.gallery.length);
      var img = document.createElement('img');
      img.src = IMG + file; img.alt = room.name + ' gallery photograph ' + (i + 1); img.loading = 'lazy';
      b.appendChild(img);
      b.addEventListener('click', function () {
        main.src = IMG + file; main.alt = img.alt;
        thumbs.querySelectorAll('.thumb').forEach(function (t) { t.classList.remove('is-active'); });
        b.classList.add('is-active');
      });
      thumbs.appendChild(b);
    });

    /* Related rooms */
    var related = document.getElementById('rd-related');
    related.innerHTML = '';
    Object.keys(ROOMS).filter(function (k) { return k !== key; }).slice(0, 3).forEach(function (k) {
      var r = ROOMS[k];
      var card = document.createElement('article');
      card.className = 'card reveal flex flex-col';
      card.innerHTML =
        '<a class="img-wrap ar-169" href="room-details.html?room=' + k + '"><img loading="lazy" src="' + r.image + '" alt="' + r.alt + '"></a>' +
        '<div class="card-body flex flex-col flex-1"><h3 class="t-sm"></h3>' +
        '<p class="text-sm text-muted-royal mt-1"></p>' +
        '<div class="mt-auto pt-3 flex items-center justify-between"><span class="font-semibold">$' + r.price + ' <small class="text-muted-royal">/ night (sample)</small></span>' +
        '<a class="text-link text-sm" href="room-details.html?room=' + k + '">View details <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div></div>';
      card.querySelector('h3').textContent = r.name;
      card.querySelector('p').textContent = r.summary;
      related.appendChild(card);
    });
    if (RS.observeReveal) { RS.observeReveal(related); }
    return key;
  }

  /* ---------- Enquiry form (room-details) ---------- */
  function initEnquiryForm(roomKey) {
    var form = document.getElementById('enquiry-form');
    if (!form) { return; }
    var out = document.getElementById('enquiry-status');
    var select = form.elements['room'];
    var checkIn = form.elements['checkin'];
    var checkOut = form.elements['checkout'];

    Object.keys(ROOMS).forEach(function (k) {
      var o = document.createElement('option');
      o.value = k; o.textContent = ROOMS[k].name + ' (sample $' + ROOMS[k].price + ' / night)';
      select.appendChild(o);
    });
    select.value = roomKey || DEFAULT_ROOM;

    if (RS.linkDateInputs) { RS.linkDateInputs(checkIn, checkOut); }
    attachLiveValidation(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = validateAll(form);
      var today = RS.todayISO();
      var dateBad = null;

      if (checkIn.value && checkIn.value < today) { showFieldError(form, checkIn, 'Check-in cannot be in the past.'); dateBad = checkIn; }
      if (checkIn.value && checkOut.value && checkOut.value <= checkIn.value) { showFieldError(form, checkOut, 'Check-out must be after check-in.'); dateBad = dateBad || checkOut; }

      var firstBad = bad || dateBad;
      if (firstBad) {
        status(out, 'Please fix the highlighted fields and send your enquiry again.', true);
        firstBad.focus();
        return;
      }
      var first = form.elements['name'].value.trim().split(' ')[0];
      status(out,
        'Thank you, ' + first + '. This is a front-end demonstration, so your enquiry for the ' + ROOMS[select.value].name +
        ' (' + RS.formatDate(checkIn.value) + ' to ' + RS.formatDate(checkOut.value) + ') was not sent and no reservation has been made. ' +
        'Connect a backend or booking service to receive real enquiries.', false);
      form.reset();
      select.value = roomKey || DEFAULT_ROOM;
      form.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
    });
  }

  /* ---------- Contact form (enquiry only: opens the visitor's email app, never books) ---------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) { return; }
    var out = document.getElementById('contact-status');
    attachLiveValidation(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = validateAll(form);
      if (firstBad) {
        status(out, 'Please fix the highlighted fields and try again.', true);
        firstBad.focus();
        return;
      }
      var data = new FormData(form);
      var subject = '[The Royal Stay Enquiry] ' + (data.get('subject') || 'General enquiry');
      var body = [
        'New enquiry for The Royal Stay',
        '',
        'Name: ' + (data.get('name') || ''),
        'Email: ' + (data.get('email') || ''),
        'Phone: ' + (data.get('phone') || 'Not provided'),
        'Enquiry about: ' + (data.get('subject') || 'General enquiry'),
        '',
        'Message:',
        data.get('message') || ''
      ].join('\n');
      status(out, 'Opening your email app with the enquiry details. Please send the email to complete your enquiry.', false);
      window.location.href = 'mailto:shelarjayshree635@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var key = renderRoomDetails();
    initEnquiryForm(key);
    initContactForm();
  });
})();


/* Room detail enquiry redirects to the shared contact form. */
document.addEventListener('DOMContentLoaded', function () {
  var link = document.getElementById('rd-contact-link');
  if (link) { var key = new URLSearchParams(window.location.search).get('room') || 'deluxe'; link.href = 'contact.html?room=' + encodeURIComponent(key) + '#contact-form'; }
});
