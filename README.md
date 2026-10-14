# The Royal Stay — Luxury Hotel Website

A multi-page, responsive hotel website (HTML5, Tailwind CSS CDN, vanilla JavaScript, separate CSS, Font Awesome, SVG logo/favicon).
All content, prices, offers, testimonials and team members are **fictional sample content**. Forms are **front-end only**: nothing is sent and no reservation is made.

## 1. Run it (required: use a local server)

The header and footer are loaded with `fetch()`, which browsers block on `file://`. Use VS Code Live Server:

1. Install **VS Code** and the **Live Server** extension (Ritwick Dey).
2. File ▸ Open Folder… ▸ choose `The-Royal-Stay`.
3. Right-click `index.html` ▸ **Open with Live Server** (or click **Go Live** in the status bar).
4. The site opens at `http://127.0.0.1:5500/`. An internet connection is needed for Tailwind CDN, Google Fonts and Font Awesome.

No VS Code? From the project folder run `python3 -m http.server 8000` and open `http://localhost:8000`.

## 2. Replace the placeholder photographs (important)

I could not download photographs in the environment where this was built (no network). Every image in `assets/images/` is a **generated placeholder** labelled "PLACEHOLDER IMAGE" so the layout, hover effects, slider and lightbox work immediately.
Replace each file with a licensed photo **using the exact same filename**. Unsplash and Pexels photos are free to use under their licences; check the licence on each photo page.

| File | What to look for | Suggested size | Search links |
|---|---|---|---|
| `hero-banner-1.jpg` | Luxury hotel exterior, resort pool or grand architecture (landscape, calm area on the left for text) | 1920×1080 | [Unsplash](https://unsplash.com/s/photos/luxury-hotel-pool) · [Pexels](https://www.pexels.com/search/luxury%20hotel%20exterior/) |
| `hero-banner-2.jpg` | Premium bedroom or royal suite | 1920×1080 | [Unsplash](https://unsplash.com/s/photos/luxury-hotel-suite) · [Pexels](https://www.pexels.com/search/luxury%20hotel%20suite/) |
| `hero-banner-3.jpg` | Fine dining, hotel restaurant, hospitality | 1920×1080 | [Unsplash](https://unsplash.com/s/photos/fine-dining-restaurant) · [Pexels](https://www.pexels.com/search/fine%20dining/) |
| `hotel-about.jpg` | Hotel façade or lobby detail | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/hotel-facade) |
| `deluxe-room.jpg` | Elegant standard hotel bedroom | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/hotel-bedroom) |
| `executive-suite.jpg` | Suite with living area | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/hotel-suite-living-room) |
| `royal-suite.jpg` | Grand suite bedroom with views | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/luxury-suite) |
| `family-suite.jpg` *(extra)* | Family hotel room with beds and seating | 1400×1050 | [Pexels](https://www.pexels.com/search/family%20hotel%20room/) |
| `swimming-pool.jpg` | Resort or hotel pool | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/hotel-pool) |
| `spa-wellness.jpg` | Spa treatment room | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/hotel-spa) |
| `hotel-gym.jpg` | Hotel fitness centre | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/hotel-gym) |
| `restaurant.jpg` | Restaurant interior | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/hotel-restaurant) |
| `signature-dish.jpg` | Plated seafood/risotto dish | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/plated-dish) |
| `signature-dish-2.jpg` *(extra)* | Plated lamb / main course | 1400×1050 | [Pexels](https://www.pexels.com/search/lamb%20dish%20plated/) |
| `signature-dish-3.jpg` *(extra)* | Chocolate dessert | 1400×1050 | [Pexels](https://www.pexels.com/search/chocolate%20dessert%20plated/) |
| `hotel-gallery-1.jpg` | Grand lobby / entrance / reception | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/hotel-lobby) |
| `hotel-gallery-2.jpg` | Conference / meeting room | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/hotel-conference-room) |
| `hotel-gallery-3.jpg` | Hotel lounge or bar | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/hotel-bar) |
| `hotel-gallery-4.jpg` | Rooftop terrace or gardens | 1400×1050 | [Unsplash](https://unsplash.com/s/photos/hotel-terrace) |

Tips: use landscape photos; keep JPGs under ~400 KB (e.g. squoosh.app); alt text in the HTML already describes the intended subject, so adjust it if your photo differs.

## 3. Logo files

- `royal-stay-logo.svg` — main logo (for light backgrounds, used in the header).
- `royal-stay-logo-light.svg` — the same logo with light lettering for the dark footer (extra file).
- `favicon.svg` — crowned RS monogram, linked in every page's `<head>`.

The SVG wordmark uses Cormorant Garamond with Georgia fallback. Browsers do not load web fonts inside an `<img>` SVG, so it normally renders in the Georgia fallback; for pixel-exact typography convert the text to outlines in Inkscape/Illustrator.

## 4. Where to edit things

- Brand colours/typography: `css/style.css` (`:root` variables; theme is now Royal Emerald + Gold, premium layer at the end of the file). Two darker tints (`--gold-deep`, `--text-muted`) are derived from the palette only for small text, to keep it readable.
- Room data and prices: `js/booking.js` (`ROOMS`) for room-details; cards are in `index.html` and `rooms.html`.
- Contact placeholders: `contact.html` and `components/footer.html`.
- Google Maps: replace the placeholder block in `contact.html` once a real address exists.

## 5. Connecting real forms later

The booking enquiry, contact form and search bar validate in the browser only. To go live, send the form data to a backend or form service from `js/booking.js`.
