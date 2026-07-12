# House of Gemini Website

A complete, mobile-friendly small business website built with plain HTML, CSS and JavaScript. No framework, subscription or build step is required.

## Open the website

Double-click `index.html`. For the most accurate preview, open the folder in VS Code and use the free **Live Server** extension.

## Important edits before publishing

Use Find and Replace across all files:

1. Phone and WhatsApp: `0726 411 745` (`+254 726 411 745` internationally).
2. Email: `info@houseofgemini.co.ke`.
3. Public locations: `Pearl Crescent Drive, Kamulu, Nairobi` and `Mariakani, Kilifi` for the coastal region.
4. In `about.html`, personalize the founder quote and add the founder's name if desired.

## Publishing permissions and image labels

- Lizar Schools has approved the public display of its name, branding and project work.
- Afrifama Feeds has approved the public display of its name, branding and project work.
- Digitally generated garment images must remain labelled as **collection previews** or **collection concepts** on the public website.

## Replace gallery images

The real portfolio images currently in the `assets` folder are named clearly, including:

- `lizar-brand-book-cover.jpg`
- `lizar-formal-blazer.jpg`
- `lizar-games-shirts.jpg`
- `lizar-tracksuit.jpg`
- `work-house-jerseys.jpg`
- `ankara-editorial.webp` — an optimized generated collection-direction image; replace with a real House of Gemini Ankara photograph when available
- `coastal-editorial.png` — generated beach/resort collection direction
- `casual-editorial.png` — generated elevated-casual collection direction
- `ankara-shorts.png` — generated tailored Ankara summer-set direction
- `ankara-kimono.png` — generated African-print kimono collection direction
- `ankara-shorts-kimono.png` — generated coordinated matching shorts-and-kimono set
- `house-of-gemini-logo.png` — transparent website logo made from the supplied official artwork
- `favicon.png` — browser-tab icon derived from the official emblem
- `afrifama-polo.jpg` — supplied branded polo mockup
- `afrifama-logo.png` — official supplied Afrifama logo prepared for transparent use
- `afrifama-work-coat-final.jpg` — corrected catalogue presentation based on delivered work
- `afrifama-field-shirt-final.jpg` — corrected field-shirt presentation
- `afrifama-bucket-hat.jpg` — official-logo bucket-hat presentation
- `afrifama-industrial-concept-final2.jpg` — corrected expansion concept, clearly labelled as conceptual

The original decorative placeholders (`gallery-1.svg` through `gallery-6.svg`) are retained as spare assets but are no longer shown in the portfolio.

To replace one, add a real photo to `assets` (for example `gallery-1.jpg`) and update the matching HTML line:

```html
<img src="assets/gallery-1.jpg" alt="Describe the garment and client type">
```

Landscape and portrait photos both work, but clear high-resolution portrait images are best. Do not upload client photos without permission.

## Change colours

Open `style.css`. The first section contains clearly named colour variables such as `--cream`, `--gold`, and `--emerald`. Change those values once and the colour updates across the site.

## Inquiry form

The inquiry form now creates a structured WhatsApp message using the visitor's answers and opens it ready to review and send to House of Gemini.

The form does not store customer data on the website.

## Publish free with GitHub Pages

Recommended live domain: `houseofgemini.co.ke`

Recommended GitHub repository:

`https://github.com/HilaryMutugi/house-of-gemini`

1. Create a new public GitHub repository named `house-of-gemini` under the `HilaryMutugi` account.
2. Upload every file and the entire `assets` folder to the repository.
3. Open the repository's **Settings**.
4. Select **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/ (root)`, then save.
7. In **Custom domain**, enter `houseofgemini.co.ke`, save, then enable **Enforce HTTPS** after DNS finishes updating.

Temporary GitHub Pages address before the domain connects:

`https://HilaryMutugi.github.io/house-of-gemini/`

## Truehost Kenya DNS records

Inside Truehost DNS Zone Editor, point the domain to GitHub Pages:

| Type | Name / Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `HilaryMutugi.github.io` |

The `CNAME` file in this project already contains `houseofgemini.co.ke`, so GitHub Pages can remember the custom domain.

## Files

- `index.html` — home
- `about.html` — story, founder, mission and values
- `services.html` — all service categories
- `portfolio.html` — filterable gallery
- `process.html` — customer journey
- `contact.html` — contact details and inquiry form
- `style.css` — all layout, colours and responsive styling
- `script.js` — mobile menu, gallery filters and subtle animations
- `assets/` — images

## Birthday detail

The footer contains the requested founder gift message. It is elegant and subtle enough to remain on the live business website.

---

Built with love for the founder of House of Gemini.
