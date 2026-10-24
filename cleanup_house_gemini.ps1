$ErrorActionPreference = "Stop"

$base = "D:\Hilary\House of Gemini Website - GitHub Upload"
if (!(Test-Path -LiteralPath $base)) {
  throw "Could not find the clean upload folder: $base"
}

$htmlFiles = Get-ChildItem -LiteralPath $base -Filter "*.html" -File
$stylePath = Join-Path $base "style.css"
$portfolioPath = Join-Path $base "portfolio.html"
$collectionsPath = Join-Path $base "collections.html"
$assetsPath = Join-Path $base "assets"

function Read-Utf8($path) {
  return [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
}

function Write-Utf8($path, $text) {
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($path, $text, $utf8NoBom)
}

function Fix-TextEncoding($text) {
  $text = $text.Replace("Â©", "©")
  $text = $text.Replace("Â·", "·")
  $text = $text.Replace("â€”", "—")
  $text = $text.Replace("â€“", "–")
  $text = $text.Replace("â€™", "’")
  $text = $text.Replace("â€˜", "‘")
  $text = $text.Replace("â€œ", "“")
  $text = $text.Replace("â€", "”")
  $text = $text.Replace("Ã©", "é")
  return $text
}

foreach ($file in $htmlFiles) {
  $text = Read-Utf8 $file.FullName
  $text = Fix-TextEncoding $text
  $text = $text.Replace("assets/collections/", "assets/")

  if ($text -notmatch 'href="collections\.html"') {
    $text = $text.Replace('<a href="services.html">Services</a><a href="process.html">Process</a>', '<a href="services.html">Services</a><a href="collections.html">Collections</a><a href="portfolio.html">Portfolio</a><a href="process.html">Process</a>')
  } else {
    $text = $text.Replace('<a href="services.html">Services</a><a href="process.html">Process</a>', '<a href="services.html">Services</a><a href="collections.html">Collections</a><a href="portfolio.html">Portfolio</a><a href="process.html">Process</a>')
  }

  Write-Utf8 $file.FullName $text
}

if (Test-Path -LiteralPath $collectionsPath) {
  $collections = Read-Utf8 $collectionsPath
  $collections = Fix-TextEncoding $collections
  $collections = $collections.Replace("assets/collections/", "assets/")

  if ($collections -notmatch 'collection-purpose') {
    $purpose = @'
    <section class="section-sm collection-purpose">
      <div class="container collection-purpose-grid reveal">
        <article class="purpose-card">
          <p class="eyebrow">Collections</p>
          <h2>What clients can order.</h2>
          <p>These are House of Gemini’s product lines — each one designed around a clear lifestyle, occasion or institution.</p>
        </article>
        <article class="purpose-card">
          <p class="eyebrow">Portfolio</p>
          <h2>Proof of what she can deliver.</h2>
          <p>The portfolio stays focused on selected examples and client-style systems, so it supports the collections without repeating every image.</p>
        </article>
      </div>
    </section>
'@
    $collections = $collections -replace '(?s)(</nav>\s*)', "`$1$purpose"
  }

  Write-Utf8 $collectionsPath $collections
}

if (Test-Path -LiteralPath $portfolioPath) {
  $portfolio = Read-Utf8 $portfolioPath
  $portfolio = Fix-TextEncoding $portfolio

  $newMain = @'
  <main id="main">
    <section class="page-hero portfolio-hero">
      <div class="container page-hero-grid reveal">
        <div>
          <p class="eyebrow">Selected proof</p>
          <h1>Portfolio shows the work. Collections show what clients can order.</h1>
        </div>
        <p class="lead">Collections are the product lines. Portfolio is the proof book: selected examples that show House of Gemini’s range, finish and ability to build complete clothing systems.</p>
      </div>
    </section>

    <section class="section-sm portfolio-purpose">
      <div class="container portfolio-purpose-grid reveal">
        <article class="purpose-card">
          <p class="eyebrow">Collections</p>
          <h2>What clients can choose.</h2>
          <p>Explore product lines such as kimonos, Savannah Bloom, signature elegance, professional uniforms and school uniforms.</p>
          <a class="text-link" href="collections.html">View collections</a>
        </article>
        <article class="purpose-card">
          <p class="eyebrow">Portfolio</p>
          <h2>Proof of delivery.</h2>
          <p>A focused proof book with the strongest examples, systems and finishes — without repeating every collection image again.</p>
          <a class="text-link" href="contact.html">Start your order</a>
        </article>
      </div>
    </section>

    <section class="proof-section proof-dark">
      <div class="container proof-grid-wrap reveal">
        <div class="proof-copy">
          <p class="eyebrow">Professional uniforms</p>
          <h2>Workwear that carries a brand clearly.</h2>
          <p>From offices and hospitality to field teams and industrial sites, House of Gemini can translate a brand identity into clothing that looks polished and performs in real work.</p>
          <a class="btn btn-gold" href="collections.html#professional-uniform">View professional collection</a>
        </div>
        <div class="proof-grid">
          <article class="proof-card featured"><img loading="lazy" decoding="async" src="assets/professional-uniform-4.jpg" alt="Coastal facility services branded industrial uniforms"></article>
          <article class="proof-card"><img loading="lazy" decoding="async" src="assets/professional-uniform-3.jpg" alt="High visibility construction workwear uniforms"></article>
          <article class="proof-card"><img loading="lazy" decoding="async" src="assets/professional-uniform-5.jpg" alt="Professional wellness uniforms with African inspired details"></article>
        </div>
      </div>
    </section>

    <section class="proof-section">
      <div class="container proof-grid-wrap proof-reverse reveal">
        <div class="proof-copy">
          <p class="eyebrow">School systems</p>
          <h2>Uniform identity built as a full system.</h2>
          <p>School wear is more than one outfit. It needs everyday pieces, sportswear, warm layers and graduation attire that all feel connected.</p>
          <a class="btn" href="collections.html#school-uniform">View school collection</a>
        </div>
        <div class="proof-grid proof-grid-contain">
          <article class="proof-card featured"><img loading="lazy" decoding="async" src="assets/school-uniform-1.jpg" alt="Complete school uniform board"></article>
          <article class="proof-card"><img loading="lazy" decoding="async" src="assets/school-uniform-2.jpg" alt="School uniform board with everyday wear, cardigan and tracksuit"></article>
          <article class="proof-card"><img loading="lazy" decoding="async" src="assets/school-uniform-5.jpg" alt="Blue school uniform system board"></article>
        </div>
      </div>
    </section>

    <section class="proof-section proof-soft">
      <div class="container proof-grid-wrap reveal">
        <div class="proof-copy">
          <p class="eyebrow">Fashion expression</p>
          <h2>Elegant pieces with African print, ease and presence.</h2>
          <p>For clients who want statement dressing, resort wear, Ankara looks or refined occasion pieces, House of Gemini designs with warmth, confidence and a graceful finish.</p>
          <a class="btn btn-gold" href="collections.html#savannah-bloom">View fashion collections</a>
        </div>
        <div class="proof-grid">
          <article class="proof-card featured"><img loading="lazy" decoding="async" src="assets/kimono-1.jpg" alt="Resort kimono and shorts look"></article>
          <article class="proof-card"><img loading="lazy" decoding="async" src="assets/savannah-bloom-1.jpg" alt="African print statement dress"></article>
          <article class="proof-card"><img loading="lazy" decoding="async" src="assets/signature-elegance-2.jpg" alt="Burgundy signature elegance dress"></article>
        </div>
      </div>
    </section>

    <section class="section-sm">
      <div class="container">
        <div class="cta-panel reveal">
          <div>
            <p class="eyebrow">Ready to begin?</p>
            <h2>Let’s turn your idea into clothing people are proud to wear.</h2>
            <p>Tell us what you need, how many pieces, and when you need them.</p>
          </div>
          <div class="actions">
            <a class="btn btn-gold" href="contact.html">Start Your Order</a>
            <a class="btn btn-outline" href="collections.html">View Collections</a>
          </div>
        </div>
      </div>
    </section>
  </main>
'@

  $portfolio = $portfolio -replace '(?s)<main id="main">.*?</main>', $newMain
  Write-Utf8 $portfolioPath $portfolio
}

if (Test-Path -LiteralPath $stylePath) {
  $css = Read-Utf8 $stylePath
  $css = Fix-TextEncoding $css
  $marker = "/* --- 2026 cleanup: collections + portfolio rhythm --- */"
  $idx = $css.IndexOf($marker)
  if ($idx -ge 0) {
    $css = $css.Substring(0, $idx).TrimEnd()
  }
  $cleanupCss = @'

/* --- 2026 cleanup: collections + portfolio rhythm --- */
.collection-jump {
  position: sticky;
  top: 0;
  z-index: 30;
  border-top: 1px solid rgba(122, 83, 47, 0.12);
  border-bottom: 1px solid rgba(122, 83, 47, 0.12);
  background: rgba(255, 252, 246, 0.96);
  backdrop-filter: blur(14px);
}

.collection-jump-grid {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  padding: 1rem 0;
}

.collection-jump-grid a {
  border: 1px solid rgba(190, 142, 61, .28);
  border-radius: 999px;
  padding: .75rem 1.15rem;
  color: var(--green, #143f35);
  background: rgba(255,255,255,.7);
  font-weight: 800;
  text-decoration: none;
}

.collection-purpose,
.portfolio-purpose {
  padding: clamp(2rem, 4vw, 3rem) 0 !important;
}

.collection-purpose-grid,
.portfolio-purpose-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.purpose-card {
  padding: clamp(1.25rem, 2.5vw, 2rem);
  border: 1px solid rgba(190, 142, 61, .18);
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, .68);
  box-shadow: 0 20px 60px rgba(45, 32, 20, .08);
}

.purpose-card h2 {
  margin: .4rem 0 .55rem;
}

.text-link {
  display: inline-flex;
  margin-top: .6rem;
  color: var(--burgundy, #6c2638);
  font-weight: 800;
  text-decoration: none;
}

.collection-section {
  min-height: auto !important;
  padding: clamp(3rem, 6vw, 5.5rem) 0 !important;
  scroll-margin-top: 160px;
}

.collection-section > .container {
  display: grid;
  grid-template-columns: minmax(280px, .82fr) minmax(520px, 1.18fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: center;
}

.collection-section > .container > .actions {
  grid-column: 1 / -1;
  margin-top: clamp(.35rem, 1.3vw, .9rem);
}

.collection-copy h2 {
  font-size: clamp(2.3rem, 5vw, 5.4rem) !important;
  line-height: .98;
  margin-bottom: 1rem;
}

.collection-copy .lead,
.collection-copy p {
  font-size: clamp(1rem, 1.35vw, 1.22rem) !important;
  line-height: 1.7;
  max-width: 42rem;
}

.collection-gallery {
  display: grid !important;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: clamp(.75rem, 1.2vw, 1rem);
  align-items: stretch;
}

.collection-card {
  margin: 0;
  min-height: 0 !important;
  border-radius: 1.3rem;
  overflow: hidden;
  background: #eadfce;
  box-shadow: 0 20px 60px rgba(39, 29, 16, .12);
}

.collection-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.collection-card:nth-child(1),
.collection-card:nth-child(2) {
  grid-column: span 3;
  aspect-ratio: 4 / 5;
}

.collection-card:nth-child(n+3) {
  grid-column: span 2;
  aspect-ratio: 1 / 1;
}

#school-uniform .collection-card img {
  object-fit: contain;
  background: #f6efe4;
  padding: .25rem;
}

.collection-section-dark .collection-card img {
  background: #123f35;
}

.proof-section {
  padding: clamp(3.2rem, 6vw, 6rem) 0;
}

.proof-dark {
  background: #104638;
  color: #fff;
}

.proof-soft {
  background: #efe3d2;
}

.proof-grid-wrap {
  display: grid;
  grid-template-columns: minmax(260px, .76fr) minmax(520px, 1.24fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: center;
}

.proof-reverse {
  grid-template-columns: minmax(520px, 1.24fr) minmax(260px, .76fr);
}

.proof-reverse .proof-copy { order: 2; }
.proof-reverse .proof-grid { order: 1; }

.proof-copy h2 {
  font-size: clamp(2.25rem, 5vw, 5rem);
  line-height: 1;
  margin: .6rem 0 1rem;
  color: inherit;
}

.proof-copy p {
  max-width: 38rem;
  line-height: 1.7;
  font-size: clamp(1rem, 1.3vw, 1.18rem);
}

.proof-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.proof-card {
  margin: 0;
  border-radius: 1.4rem;
  overflow: hidden;
  min-height: 240px;
  background: #eadfce;
  box-shadow: 0 22px 70px rgba(0, 0, 0, .18);
}

.proof-card.featured {
  grid-row: span 2;
  min-height: 500px;
}

.proof-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.proof-grid-contain .proof-card img {
  object-fit: contain;
  background: #fbf4e9;
  padding: .35rem;
}

@media (max-width: 980px) {
  .collection-section > .container,
  .proof-grid-wrap,
  .proof-reverse,
  .portfolio-purpose-grid,
  .collection-purpose-grid {
    grid-template-columns: 1fr;
  }

  .proof-reverse .proof-copy,
  .proof-reverse .proof-grid {
    order: initial;
  }

  .collection-gallery,
  .proof-grid {
    grid-template-columns: 1fr 1fr;
  }

  .collection-card:nth-child(n) {
    grid-column: auto;
    aspect-ratio: 4 / 5;
  }

  .proof-card.featured {
    grid-row: auto;
    min-height: 320px;
  }
}

@media (max-width: 640px) {
  .collection-jump-grid {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: .85rem 0;
  }

  .collection-gallery,
  .proof-grid {
    grid-template-columns: 1fr;
  }

  .collection-card:nth-child(n) {
    aspect-ratio: 4 / 5;
  }

  .collection-section {
    padding: 2.4rem 0 !important;
  }

  .proof-section {
    padding: 2.8rem 0;
  }
}
'@
  Write-Utf8 $stylePath ($css.TrimEnd() + $cleanupCss)
}

$allHtmlText = ($htmlFiles | ForEach-Object { Read-Utf8 $_.FullName }) -join "`n"
$srcMatches = [regex]::Matches($allHtmlText, 'src="(assets/[^"]+)"')
$missing = New-Object System.Collections.Generic.List[string]
foreach ($m in $srcMatches) {
  $rel = $m.Groups[1].Value -replace '/', '\'
  $full = Join-Path $base $rel
  if (!(Test-Path -LiteralPath $full)) {
    if (!$missing.Contains($m.Groups[1].Value)) { $missing.Add($m.Groups[1].Value) }
  }
}

$weakRefs = Select-String -Path (Join-Path $base "*.html") -Pattern "afrifama-polo|afrifama-field-shirt-final|afrifama-bucket-hat|assets/collections/" -SimpleMatch -ErrorAction SilentlyContinue

"Updated local clean folder: $base"
"Missing referenced assets:"
if ($missing.Count -eq 0) { "None" } else { $missing | Sort-Object }
"Weak/old image references still visible in HTML:"
if (!$weakRefs) { "None" } else { $weakRefs | ForEach-Object { "$($_.Path):$($_.LineNumber) $($_.Line.Trim())" } }
