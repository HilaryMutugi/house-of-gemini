# House of Gemini website

Live site: https://houseofgemini.co.ke (GitHub Pages, deploys from `main`, custom domain in `CNAME`).
Static HTML, one shared `style.css`, `script.js`. No build step.

## The business
- House of Gemini is a founder-led Kenyan clothing studio. Founder: Anita Thuo.
- Two buyer types: (1) uniforms for schools, companies and institutions; (2) fashion and custom pieces (Ankara, kimono sets, occasion wear, resort wear).
- Locations: Nairobi base, Mariakani (Kilifi) for the coast.
- Orders start on WhatsApp: +254 726 411 745. Email: info@houseofgemini.co.ke.

## Brand
- Colours (CSS vars in `:root`): cream `#f8f4ec`, paper `#fffdf8`, ink `#171916`, emerald `#173f36`, gold `#b88b45`.
- Gold for small text on light backgrounds must use `--gold-text` (`#7d5b26`); on emerald use `#d8b273`. Plain `--gold` fails contrast as text.
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

Next:
1. Homepage shows real work (Kimono, Savannah Bloom, Afrifama uniforms, Lizar) instead of generic studio images.
2. Early split: "Uniforms for schools and organisations" vs "Fashion and custom pieces".
3. Lizar Schools as a featured case study.
4. Trust: client logos, 1 to 2 client quotes, Anita on the homepage, Instagram/TikTok links.
5. Stronger FAQ: minimum order, lead times, coast delivery, deposits.
6. One consistent positioning line across homepage, About and footer.
