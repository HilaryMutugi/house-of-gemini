# House of Gemini website

Live site: https://houseofgemini.co.ke (GitHub Pages, deploys from `main`, custom domain in `CNAME`).
Static HTML, one shared `style.css`, `script.js`. No build step.

## The business
- House of Gemini is a founder-led Kenyan clothing studio. Founder: Anita Thuo.
- Two buyer types: (1) uniforms for schools, companies and institutions; (2) fashion and custom pieces (Ankara, kimono sets, occasion wear, resort wear).
- Locations: Nairobi base, Mariakani (Kilifi) for the coast.
- Orders start on WhatsApp: +254 726 411 745. Email: info@houseofgemini.co.ke.

## Brand
- Colours: "Coastal Atelier" palette (Oct 2026), CSS vars in `:root`: cream `#F6F6EF`, paper `#FFFEFA`, ink `#202720`, muted `#536158`, beige (sage tint) `#E9EEE7`, line `#CED8CE`, emerald `#17483D`, gold `#B88B45`, gold-light `#E2C48D`.
- Gold for small text on light backgrounds must use `--gold-text` (`#73501B`); on emerald use `#d8b273`. Plain `--gold` fails contrast as text. Text on gold buttons is `--ink`, never `--gold-text` (2.4:1 fails).
- Fonts: Cormorant Garamond (headings), Manrope (body).
- Copy style: no em dashes. Warm, confident, plain English.

## Rules for changes
- Images: ship WebP sized to display (max ~1400px, gallery tiles ~900px), with width/height and `loading="lazy"` below the fold. Keep original PNGs in `assets/`.
- Bump the `style.css?v=` query on every page when CSS changes.
- Keep `book-hunt.js` / `book-hunt.css` (a hidden gift). Do not remove.
- Test at 1366, 490 and 375px wide before pushing. No horizontal scroll.
- Don't link files that aren't in the repo (the Lizar brand book PDF is not here).

## Roadmap
Done (Oct 2026): image compression, mobile hero fix, contrast and text size, nav/footer consistency, Open Graph tags, LocalBusiness data, removed broken brand book PDF links.

Done (Round 2, Oct 2026): homepage buyer split (Uniforms vs Custom fashion, each with its own WhatsApp message), Lizar Schools featured case study, recent work uses real collection images, Anita named on the homepage, FAQ expanded to six questions, one positioning line across homepage, About, footers and meta.

Positioning line: "Uniforms for schools and organisations, and custom fashion for individuals. Designed and made in Kenya."

Order tools (Oct 2026): `order.html` with `tools.css` and `tools.js`. Uniform quote builder, group order invites, order tracker. Prices, lead times, discounts and fabrics live in `CONFIG` at the top of `tools.js`. Tracker reads `orders.json` (public repo, so no customer names or phone numbers). Page is `noindex` and not in the nav until Anita confirms prices; then set `pricesConfirmed: true`, remove the noindex meta and add a nav link.

Next (waiting on Anita):
1. FAQ facts: minimum order, typical lead times, deposit terms, delivery to the coast. Do not publish guesses.
2. Trust: 1 to 2 client quotes, client logos (only clients she confirms), Instagram/TikTok handles.
3. A real photo of Anita for the homepage story section (currently a studio image).
