/* =========================================================
   HOUSE OF GEMINI — ORDER TOOLS (order.html)
   QUICK EDIT: prices, lead times and fabrics live in CONFIG below.
   Orders for the tracker live in orders.json.
   ========================================================= */
(function () {
  "use strict";

  const CONFIG = {
    // Set to true once Anita has confirmed every number below.
    // While false, the estimate card says these are preview prices.
    pricesConfirmed: false,
    whatsapp: "254726411745",
    // [name, low KSh per piece, high KSh per piece, preview shape]
    items: {
      coverall: ["Coverall", 2200, 3200, "long"],
      polo: ["Polo", 900, 1300, "top"],
      shirt: ["Shirt", 1100, 1700, "top"],
      trouser: ["Trousers", 1100, 1600, "long"],
      dress: ["School dress", 1100, 1600, "top"],
      sweater: ["Sweater", 1000, 1500, "top"],
      hat: ["Bucket hat", 450, 700, "top"],
      apron: ["Apron", 500, 850, "top"]
    },
    // [name, low per piece per position, high per piece per position, one-time setup per position]
    branding: {
      none: ["No logo", 0, 0, 0],
      heat: ["Heat press", 100, 200, 1000],
      emb: ["Embroidery", 150, 280, 1500]
    },
    // [name, KSh per piece]
    trims: [["Gold", 80, "#E3B13E"], ["Reflective", 150, "#CDD3D8"], ["Red", 80, "#C0392B"], ["None", 0, "none"]],
    fabrics: [["Forest drill", "#2F4A3A"], ["Navy twill", "#1F2A44"], ["Black", "#1E1E1F"], ["Khaki", "#A3946B"], ["Maroon", "#6B2430"], ["Royal blue", "#2A4FA0"], ["Ash grey", "#878C90"], ["White", "#EEEBE3"]],
    // Volume discount by total pieces: [minimum pieces, fraction off]
    discounts: [[100, 0.15], [50, 0.10], [20, 0.05]],
    // Lead time by total pieces: [up to pieces, label, days]
    leadTimes: [[19, "7 to 10 days", 10], [49, "2 to 3 weeks", 21], [99, "3 to 4 weeks", 28], [Infinity, "4 to 6 weeks", 42]],
    // Group orders: days before the event for each milestone
    groupPlan: [["Fabric", -28], ["Sizes due", -21], ["Fitting", -10], ["Collect", -3]],
    groupMinDays: 28
  };

  const root = document.querySelector(".hog-tools");
  if (!root) return;
  const $ = id => document.getElementById(id);
  const wa = text => "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
  const r50 = n => Math.round(n / 50) * 50;
  const ksh = n => "KSh " + r50(n).toLocaleString("en-KE");
  const num = n => r50(n).toLocaleString("en-KE");
  const fmt = d => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const fmtY = d => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const params = new URLSearchParams(location.search);

  /* ---------- tabs ---------- */
  const tabs = [["quote", "t-quote"], ["group", "t-group"], ["track", "t-track"]];
  function show(id, push) {
    tabs.forEach(([p, t]) => { $(p).hidden = p !== id; $(t).setAttribute("aria-selected", String(p === id)); });
    if (push) history.replaceState(null, "", location.pathname + location.search + "#" + id);
    if (id === "track") sew();
  }
  tabs.forEach(([p, t]) => $(t).addEventListener("click", () => show(p, true)));

  function chips(id, val, cb) {
    const box = $(id);
    const set = v => { box.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.v === v))); cb(v); };
    box.addEventListener("click", e => { const c = e.target.closest(".chip"); if (c) set(c.dataset.v); });
    set(val);
  }
  const lastVals = new WeakMap();
  function tween(el, to, render) {
    const from = lastVals.get(el) || to.map(() => 0);
    lastVals.set(el, to);
    if (reduce) { el.innerHTML = render(to); return; }
    const t0 = performance.now(), dur = 550;
    cancelAnimationFrame(el._raf);
    const step = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.innerHTML = render(to.map((v, i) => from[i] + (v - from[i]) * e));
      if (k < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  /* =================== QUOTE =================== */
  const ITEMS = CONFIG.items, BR = CONFIG.branding, FABRICS = CONFIG.fabrics, TRIMS = CONFIG.trims;
  const qty = { coverall: 20 };
  let brand = "emb", pos = 1, active = "coverall", fabric = 0, trim = 0;

  const SHAPES = {
    long: {
      body: "M70 20 L95 14 Q110 26 125 14 L150 20 L190 60 L176 112 L158 100 L158 150 L163 248 L121 248 L112 160 L108 160 L99 248 L57 248 L62 150 L62 100 L44 112 L30 60 Z",
      detail: '<path d="M95 14 L110 38 L125 14" fill="none" stroke="rgb(0 0 0 / .35)" stroke-width="1.5"/><path d="M110 38 L110 158" stroke="rgb(0 0 0 / .3)" stroke-width="1.2" stroke-dasharray="3 3"/><path d="M74 132 h22 v18 h-22 z M124 132 h22 v18 h-22 z" fill="none" stroke="rgb(0 0 0 / .28)" stroke-width="1.2" stroke-dasharray="3 2"/>',
      trim: '<rect x="40" y="118" width="140" height="8"/><rect x="40" y="212" width="140" height="8"/><rect x="0" y="86" width="60" height="7" transform="rotate(-62 44 92)"/><rect x="160" y="86" width="60" height="7" transform="rotate(62 176 92)"/>',
      chest: [132, 58], sleeve: [178, 80]
    },
    top: {
      body: "M70 30 L96 20 Q110 32 124 20 L150 30 L192 62 L176 98 L158 88 L160 214 L60 214 L62 88 L44 98 L28 62 Z",
      detail: '<path d="M96 20 L104 46 L116 46 L124 20" fill="none" stroke="rgb(0 0 0 / .35)" stroke-width="1.5"/><circle cx="110" cy="54" r="2" fill="rgb(0 0 0 / .35)"/><circle cx="110" cy="66" r="2" fill="rgb(0 0 0 / .35)"/><path d="M64 204 H156" stroke="rgb(0 0 0 / .25)" stroke-dasharray="3 3"/>',
      trim: '<path d="M96 20 L104 46 L116 46 L124 20" fill="none" stroke-width="5"/><rect x="40" y="204" width="140" height="10"/><rect x="20" y="88" width="40" height="7" transform="rotate(-62 44 92)"/><rect x="160" y="88" width="40" height="7" transform="rotate(62 176 92)"/>',
      chest: [134, 70], sleeve: [176, 76]
    }
  };

  function drawGarment() {
    const s = SHAPES[ITEMS[active][3]], f = FABRICS[fabric][1], t = TRIMS[trim][2], on = brand !== "none";
    $("garment").innerHTML =
      '<defs><clipPath id="hogClip"><path d="' + s.body + '"/></clipPath>' +
      '<linearGradient id="hogShade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".45" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>' +
      '<path d="' + s.body + '" fill="' + f + '" stroke="rgb(0 0 0 / .35)" stroke-width="1.5"/>' +
      '<g clip-path="url(#hogClip)"><g fill="' + (t === "none" ? "transparent" : t) + '" stroke="' + (t === "none" ? "transparent" : t) + '">' + s.trim + '</g>' +
      '<path d="' + s.body + '" fill="url(#hogShade)"/></g>' + s.detail +
      (on ? '<circle cx="' + s.chest[0] + '" cy="' + s.chest[1] + '" r="8" fill="#E8D8A8" stroke="rgb(0 0 0 / .3)" stroke-dasharray="' + (brand === "emb" ? "1.6 1.4" : "0") + '"/>' : "") +
      (on && pos >= 3 ? '<rect x="' + (s.sleeve[0] - 6) + '" y="' + (s.sleeve[1] - 5) + '" width="12" height="10" rx="2" fill="#E8D8A8" stroke="rgb(0 0 0 / .3)" transform="rotate(62 ' + s.sleeve[0] + " " + s.sleeve[1] + ')"/>' : "");
    $("backTag").style.opacity = on && pos >= 2 ? 1 : 0;
    $("pName").textContent = ITEMS[active][0] + " · " + FABRICS[fabric][0];
  }

  function swatches() {
    $("fabricSw").innerHTML = FABRICS.map(([n, c], i) => '<button type="button" class="fs" style="background:' + c + '" aria-label="' + n + '" title="' + n + '" aria-pressed="' + (i === fabric) + '" data-i="' + i + '"></button>').join("");
    $("trimSw").innerHTML = TRIMS.map(([n, , c], i) => '<button type="button" class="fs" style="background:' + (c === "none" ? "repeating-linear-gradient(135deg,#e9eee7 0 4px,#ced8ce 4px 5px)" : c) + '" aria-label="' + n + ' trim" title="' + n + '" aria-pressed="' + (i === trim) + '" data-i="' + i + '"></button>').join("");
    $("fabName").innerHTML = "<b>" + FABRICS[fabric][0] + "</b>";
    $("trimName").innerHTML = "<b>" + TRIMS[trim][0] + "</b>" + (TRIMS[trim][0] === "Reflective" ? " · high-vis tape" : "");
  }
  $("fabricSw").addEventListener("click", e => { const b = e.target.closest(".fs"); if (!b) return; fabric = +b.dataset.i; swatches(); drawGarment(); calc(); });
  $("trimSw").addEventListener("click", e => { const b = e.target.closest(".fs"); if (!b) return; trim = +b.dataset.i; swatches(); drawGarment(); calc(); });

  function tiles() {
    $("tiles").innerHTML = Object.entries(ITEMS).map(([k, [n, lo]]) => {
      const q = qty[k] || 0;
      return '<div class="tile ' + (q ? "on" : "") + '" data-k="' + k + '" role="button" tabindex="0" aria-label="' + n + (q ? ", " + q + " pieces" : ", add") + '">' +
        '<span class="add" aria-hidden="true">' + (q ? "✓" : "+") + "</span><b>" + n + "</b><small>from KSh " + lo.toLocaleString("en-KE") + "</small>" +
        (q ? '<div class="step"><button type="button" data-d="-1" aria-label="Fewer ' + n + '">−</button><input type="number" min="0" value="' + q + '" aria-label="' + n + ' quantity"><button type="button" data-d="1" aria-label="More ' + n + '">+</button></div>' : "") +
        "</div>";
    }).join("");
  }
  $("tiles").addEventListener("click", e => {
    const t = e.target.closest(".tile"); if (!t) return;
    const k = t.dataset.k, b = e.target.closest("button[data-d]");
    if (b) {
      qty[k] = Math.max(0, (qty[k] || 0) + (+b.dataset.d) * (qty[k] >= 20 ? 5 : 1));
      if (!qty[k]) delete qty[k]; else active = k;
      tiles(); drawGarment(); calc(); return;
    }
    if (e.target.closest(".step")) return;
    if (qty[k]) {
      if (active === k) { delete qty[k]; const ks = Object.keys(qty); if (ks.length) active = ks[0]; } else active = k;
    } else { qty[k] = 10; active = k; }
    tiles(); drawGarment(); calc();
  });
  $("tiles").addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("tile")) { e.preventDefault(); e.target.click(); }
  });
  $("tiles").addEventListener("change", e => {
    const i = e.target.closest(".step input"); if (!i) return;
    const k = i.closest(".tile").dataset.k, v = Math.max(0, parseInt(i.value, 10) || 0);
    if (v) qty[k] = v; else delete qty[k];
    tiles(); calc();
  });

  chips("brandChips", "emb", v => { brand = v; $("posChips").hidden = v === "none"; $("newWrap").hidden = v === "none"; drawGarment(); calc(); });
  chips("posChips", "1", v => { pos = +v; drawGarment(); calc(); });

  function calc() {
    let lo = 0, hi = 0, q = 0;
    const rows = [];
    for (const [k, n] of Object.entries(qty)) {
      const [nm, a, b] = ITEMS[k];
      lo += a * n; hi += b * n; q += n;
      rows.push([n + " × " + nm, ksh(a * n) + " – " + ksh(b * n)]);
    }
    const d = (CONFIG.discounts.find(([min]) => q >= min) || [0, 0])[1];
    const [bn, bl, bh, bs] = BR[brand], on = brand !== "none";
    const trimCost = TRIMS[trim][1] * q;
    const bLo = on ? bl * pos * q : 0, bHi = on ? bh * pos * q : 0;
    const setup = on && $("newLogo").checked ? bs * pos : 0;
    const tLo = lo * (1 - d) + bLo + setup + trimCost, tHi = hi * (1 - d) + bHi + setup + trimCost;
    if (on) rows.push([bn + " × " + pos, ksh(bLo) + " – " + ksh(bHi)]);
    if (trimCost) rows.push([TRIMS[trim][0] + " trim", ksh(trimCost)]);
    if (setup) rows.push([brand === "emb" ? "Digitising, once" : "Setup, once", ksh(setup)]);
    if (d) rows.push(["Volume −" + Math.round(d * 100) + "%", "−" + ksh(lo * d)]);

    tween($("qRange"), [tLo, tHi], ([a, b]) => q ? '<span class="cur">KSh</span>' + num(a) + '<span class="to">–</span>' + num(b) : "Pick a piece");
    $("qPer").textContent = q ? q + " pieces · about " + ksh(tLo / q) + "–" + num(tHi / q) + " each" : "";
    $("qBreak").innerHTML = rows.map(([a, b]) => "<div><dt>" + esc(a) + "</dt><dd>" + esc(b) + "</dd></div>").join("");

    const lead = CONFIG.leadTimes.find(([max]) => q <= max);
    const nextTier = CONFIG.discounts.slice().reverse().find(([min]) => q < min);
    $("qSpec").innerHTML = [
      ["Fabric", FABRICS[fabric][0]],
      ["Trim", TRIMS[trim][0]],
      ["Logo", on ? bn + ", " + ["chest", "chest + back", "3 spots"][pos - 1] : "None"],
      ["Ready in", q ? lead[1] : "–"],
      ["Discount", d ? Math.round(d * 100) + "% applied" : q && nextTier ? (nextTier[0] - q) + " more for " + Math.round(nextTier[1] * 100) + "%" : "–"]
    ].map(([a, b]) => "<dt>" + a + "</dt><dd>" + esc(b) + "</dd>").join("");

    const nb = $("needBy").value, w = $("qWarn");
    if (nb && q) {
      const left = Math.round((new Date(nb) - new Date()) / 864e5);
      w.hidden = left >= lead[2];
      w.textContent = "Tight: " + (left < 0 ? "that date has passed" : left + " days") + ". Message us and we'll see what's possible.";
    } else w.hidden = true;

    const org = $("org").value.trim();
    $("qWa").href = wa([
      "Hello House of Gemini, I'd like a uniform quote.",
      org && "Organisation: " + org,
      ...Object.entries(qty).map(([k, n]) => "- " + n + " x " + ITEMS[k][0]),
      "Fabric: " + FABRICS[fabric][0],
      "Trim: " + TRIMS[trim][0],
      "Logo: " + (on ? bn + ", " + pos + " position" + (pos > 1 ? "s" : "") + (setup ? " (new logo)" : "") : "None"),
      q && "Website estimate: " + ksh(tLo) + " to " + ksh(tHi),
      nb && "Needed by: " + fmtY(new Date(nb))
    ].filter(Boolean).join("\n"));
  }
  ["org", "needBy"].forEach(id => $(id).addEventListener("input", calc));
  $("newLogo").addEventListener("change", calc);
  $("qFine").textContent = CONFIG.pricesConfirmed
    ? "Indicative. Final price confirmed on WhatsApp."
    : "Preview prices. Final price confirmed on WhatsApp.";
  swatches(); tiles(); drawGarment(); calc();

  /* =================== GROUP =================== */
  const guest = params.get("g");
  const iso = d => d.toISOString().slice(0, 10);
  const ev0 = addDays(new Date(), 56);
  $("gDate").value = iso(ev0);
  let look = "coord", fab = "us", cm = false;

  function hash(s) { let x = 7; for (const c of s) x = (x * 31 + c.charCodeAt(0)) % 9000; return 1000 + x; }

  function inviteUrl(code, name, date, lk) {
    const u = new URL("order.html", location.href);
    u.search = new URLSearchParams({ g: code, e: name, d: date, l: lk }).toString();
    u.hash = "group";
    return u.toString();
  }

  function organiser() {
    const name = $("gName").value.trim() || "Our event", type = $("gType").value;
    const n = Math.max(2, parseInt($("gCount").value, 10) || 2);
    const ds = $("gDate").value, ev = ds ? new Date(ds) : ev0;
    const code = "HOG-" + type.slice(0, 3).toUpperCase() + "-" + hash(name + ds);
    $("gCode").textContent = code;
    const plan = CONFIG.groupPlan.map(([a, o]) => [a === "Fabric" && fab === "own" ? "Fabric in" : a, o]).concat([[type, 0]]);
    $("gDates").innerHTML = plan.map(([a, o]) => "<dt>" + esc(a) + "</dt><dd" + (o ? "" : ' style="color:#d8b273"') + ">" + fmt(addDays(ev, o)) + "</dd>").join("");
    const lead = Math.round((ev - new Date()) / 864e5), w = $("gWarn");
    w.hidden = lead >= CONFIG.groupMinDays;
    w.textContent = "Only " + Math.max(lead, 0) + " days to go. Groups usually need about 4 weeks, so message us first.";
    const link = inviteUrl(code, name, ds || iso(ev0), look);
    $("gPreview").href = link;
    $("gWa").href = wa("Hello House of Gemini, I'm organising " + name + " (" + type + ") on " + fmtY(ev) + ".\nPeople: " + n + "\nLook: " + (look === "match" ? "Matching" : "Same fabric, own style") + "\nFabric: " + (fab === "own" ? "We bring our own" : "Please source it") + "\nGroup code: " + code);
    organiser.invite = "You're invited to " + name + ". Please add your size before " + fmt(addDays(ev, -21)) + ": " + link;
  }

  if (guest) {
    // Guest view, opened from an organiser's invite link
    $("gSetup").hidden = true;
    $("gTag").hidden = true;
    $("gGrid").style.gridTemplateColumns = "minmax(0, 640px)";
    $("gGrid").style.justifyContent = "center";
    const ev = params.get("e") || "the group", dd = params.get("d");
    $("mTitle").textContent = "Join " + ev;
    $("mSub").textContent = "Group " + guest + (dd ? " · sizes due " + fmt(addDays(new Date(dd), -21)) : "");
    $("mStyleBox").hidden = params.get("l") === "match";
  } else {
    $("mform").hidden = true;
    chips("lookChips", "coord", v => { look = v; organiser(); });
    chips("fabChips", "us", v => { fab = v; organiser(); });
    ["gName", "gType", "gDate", "gCount"].forEach(id => $(id).addEventListener("input", organiser));
    $("gType").addEventListener("change", organiser);
    $("gMinus").addEventListener("click", () => { $("gCount").value = Math.max(2, (+$("gCount").value || 2) - 1); organiser(); });
    $("gPlus").addEventListener("click", () => { $("gCount").value = Math.min(300, (+$("gCount").value || 2) + 1); organiser(); });
    $("gCopy").addEventListener("click", () => {
      const b = $("gCopy"), label = "Copy invite";
      const ok = () => { b.textContent = "Copied"; setTimeout(() => { b.textContent = label; }, 1600); };
      const fail = () => { window.prompt ? window.prompt("Copy this invite:", organiser.invite) : null; };
      if (navigator.clipboard) navigator.clipboard.writeText(organiser.invite).then(ok, fail); else fail();
    });
    organiser();
  }

  $("modeBtn").addEventListener("click", () => {
    cm = !cm; $("cmBox").hidden = !cm; $("stdBox").hidden = cm;
    $("modeBtn").textContent = cm ? "Use a standard size" : "Use my measurements";
  });
  $("mform").addEventListener("submit", e => {
    e.preventDefault();
    const nm = $("mName").value.trim(), err = $("mErr");
    if (!nm) { err.hidden = false; err.textContent = "Add your name so we know whose outfit this is."; $("mName").focus(); return; }
    let size;
    if (cm) {
      const v = ["cChest", "cWaist", "cHips", "cLen"].map(i => $(i).value.trim());
      if (v.some(x => !x)) { err.hidden = false; err.textContent = "Fill in all four measurements in cm, or use a standard size."; return; }
      size = "Chest " + v[0] + ", waist " + v[1] + ", hips " + v[2] + ", length " + v[3] + " (cm)";
    } else size = $("mSize").value;
    err.hidden = true;
    const styleLine = $("mStyleBox").hidden ? "" : "\nStyle: " + $("mStyle").value;
    window.open(wa("Hello House of Gemini, my size for group " + (guest || "order") + " (" + (params.get("e") || "") + ").\nName: " + nm + styleLine + "\nSize: " + size), "_blank", "noopener");
  });

  /* =================== TRACK =================== */
  const STAGES = ["Booked", "Measured", "Cutting", "Sewing", "Finishing", "Ready"];
  let orders = null, cur = null;
  const loadOrders = fetch("orders.json", { cache: "no-store" })
    .then(r => (r.ok ? r.json() : { orders: {} }))
    .then(j => { orders = j.orders || {}; })
    .catch(() => { orders = {}; });

  function norm(raw) {
    let k = raw.trim().toUpperCase().replace(/\s+/g, "");
    if (/^\d+$/.test(k)) k = "HOG-" + k;
    if (/^HOG\d/.test(k)) k = "HOG-" + k.slice(3);
    return k;
  }
  function track(raw) {
    const k = norm(raw), err = $("tErr");
    if (!k) return;
    loadOrders.then(() => {
      const o = orders[k];
      if (!o) {
        $("ticket").hidden = true; err.hidden = false;
        err.textContent = "We couldn't find " + raw.trim() + ". Check the number on your WhatsApp confirmation, or message us.";
        return;
      }
      err.hidden = true; $("ticket").hidden = false; cur = o;
      const booked = new Date(o.booked), ready = new Date(o.ready), stage = Math.max(0, Math.min(5, o.stage | 0));
      $("tNo").textContent = k.replace("HOG-", "№ ");
      $("tItem").textContent = o.item;
      $("tReady").textContent = stage === 5 ? "Ready now" : "Ready ~ " + fmt(ready);
      const span = (ready - booked) / 864e5;
      $("tTrack").querySelectorAll(".st").forEach(n => n.remove());
      STAGES.forEach((s, i) => {
        const done = i < stage || (stage === 5 && i === 5), now = i === stage && stage < 5;
        const d = addDays(booked, Math.round(span * i / 5));
        const el = document.createElement("div");
        el.className = "st" + (done ? " done" : now ? " now" : "");
        el.innerHTML = '<span class="n">' + (done ? "✓" : i + 1) + "</span><b>" + s + "</b><small>" + (now ? "now" : fmt(d)) + "</small>";
        $("tTrack").appendChild(el);
      });
      $("tNote").textContent = o.note || "";
      $("tNote").hidden = !o.note;
      $("tWa").href = wa("Hello House of Gemini, a question about order " + k + ".");
      if (location.search.indexOf("o=") === -1) history.replaceState(null, "", location.pathname + "?o=" + encodeURIComponent(k) + "#track");
      sew();
    });
  }
  function sew() {
    if (!cur || $("track").hidden) return;
    const f = $("tFill"), nd = $("tNeedle"), frac = Math.max(0, Math.min(5, cur.stage | 0)) / 5;
    $("ticket").style.setProperty("--stubh", $("stub").offsetHeight + "px");
    [f, nd].forEach(x => { x.style.transition = "none"; });
    f.style.width = "0"; nd.style.left = "calc(100% / 12)"; void f.offsetWidth;
    [f, nd].forEach(x => { x.style.transition = ""; });
    requestAnimationFrame(() => {
      f.style.width = "calc((100% - 100% / 6) * " + frac + ")";
      nd.style.left = "calc(100% / 12 + (100% - 100% / 6) * " + frac + ")";
      nd.style.opacity = frac === 1 ? 0 : 1;
    });
  }
  $("tform").addEventListener("submit", e => { e.preventDefault(); track($("orderNo").value); });
  window.addEventListener("resize", () => { if (!$("track").hidden && cur) $("ticket").style.setProperty("--stubh", $("stub").offsetHeight + "px"); });

  /* ---------- start ---------- */
  const start = location.hash.slice(1);
  if (params.get("o")) { $("orderNo").value = params.get("o"); show("track"); track(params.get("o")); }
  else if (guest) show("group");
  else show(tabs.some(([p]) => p === start) ? start : "quote");
  if (location.hash) window.scrollTo(0, 0);
  window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (tabs.some(([p]) => p === h)) show(h); });
})();
