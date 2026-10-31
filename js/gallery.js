// Gallery Joomax: daftar album, isi album, dan lightbox. Data dari window.JOOMAX_GALLERY.
(() => {
  "use strict";
  const C = window.JOOMAX_GALLERY; if (!C) return;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const date = (d) => { const x = new Date(d); return isNaN(x) ? esc(d) : x.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); };

  // ---------------------------------------------------------------- data
  const albums = (C.albums || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const urlOf = (a, p) => {
    const s = typeof p === "string" ? p : (p && p.src) || "";
    return !s ? "" : /^(https?:|data:|\/)/.test(s) || s.includes("/") ? s : "assets/albums/" + encodeURIComponent(a.id) + "/" + encodeURIComponent(s);
  };
  const photosOf = (a) => (a.photos || []).map((p) => ({ src: urlOf(a, p), caption: (typeof p === "object" && p.caption) || "" })).filter((p) => p.src);
  const coverOf = (a) => urlOf(a, a.cover) || (photosOf(a)[0] || {}).src || "";
  const TINT = ["#ececf0", "#f1ecea", "#ebf0ed", "#eeeaf2", "#f2f0e7"];
  const placeholder = (i) => "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice"><rect width="640" height="480" fill="${TINT[i % TINT.length]}"/>` +
    `<g fill="none" stroke="#a9a9b4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><rect x="262" y="186" width="116" height="92" rx="16"/><circle cx="296" cy="220" r="10"/><path d="m276 268 30-23 22 16 26-21"/></g></svg>`);

  if (C.title) $("#gTitle").textContent = C.title;
  if (C.subtitle) $("#gSub").textContent = C.subtitle;

  // ---------------------------------------------------------------- daftar album
  const cats = ["Semua", ...new Set(albums.map((a) => a.category).filter(Boolean))];
  let cat = "Semua", term = "";
  const chips = $("#chips");
  chips.hidden = cats.length < 3;
  chips.innerHTML = cats.map((c) => `<button type="button" class="chip" aria-pressed="${c === cat}">${esc(c)}</button>`).join("");
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    cat = b.textContent; chips.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); renderList();
  });
  $("#gq").addEventListener("input", (e) => { term = e.target.value.trim().toLowerCase(); renderList(); });

  function renderList() {
    const list = albums.filter((a) => (cat === "Semua" || a.category === cat) && (!term || (a.title + " " + (a.category || "")).toLowerCase().includes(term)));
    $("#albums").innerHTML = list.map((a, i) => {
      const n = photosOf(a).length, cv = coverOf(a);
      return `<a class="acard" href="#${esc(encodeURIComponent(a.id))}" style="--i:${i}">` +
        `<div class="acover"><img src="${esc(cv || placeholder(albums.indexOf(a)))}" alt="" loading="lazy" decoding="async"><span class="count">${n ? n + " foto" : "Segera"}</span></div>` +
        `<div class="abody"><h3>${esc(a.title)}</h3><p><time datetime="${esc(a.date)}">${date(a.date)}</time>${a.category ? `<span class="pill">${esc(a.category)}</span>` : ""}</p></div></a>`;
    }).join("");
    $("#empty").hidden = list.length > 0;
  }
  renderList();

  // ---------------------------------------------------------------- isi album
  let current = null, shots = [];
  function renderAlbum(a) {
    current = a; shots = photosOf(a);
    $("#aCat").textContent = a.category || ""; $("#aCat").hidden = !a.category;
    $("#aTitle").textContent = a.title;
    $("#aMeta").innerHTML = `${date(a.date)} &middot; ${shots.length} foto`;
    $("#aDesc").textContent = a.desc || ""; $("#aDesc").hidden = !a.desc;
    $("#photos").innerHTML = shots.map((p, i) =>
      `<button type="button" class="ph" data-i="${i}" aria-label="Buka foto ${i + 1}"><img src="${esc(p.src)}" alt="${esc(p.caption || a.title + " " + (i + 1))}" loading="lazy" decoding="async"></button>`).join("");
    $("#aEmpty").hidden = shots.length > 0;
    document.querySelectorAll("#photos img").forEach((im) => {
      if (im.complete) im.classList.add("ok"); else { im.addEventListener("load", () => im.classList.add("ok")); im.addEventListener("error", () => im.closest(".ph").remove()); }
    });
  }
  $("#photos").addEventListener("click", (e) => { const b = e.target.closest(".ph"); if (b) openLb(+b.dataset.i, b); });

  // ---------------------------------------------------------------- router (#id-album)
  const listV = $("#listView"), albumV = $("#albumView");
  const show = (v) => { [listV, albumV].forEach((x) => { x.hidden = x !== v; x.classList.remove("in"); }); void v.offsetWidth; v.classList.add("in"); };
  let first = true;
  function route() {
    const id = decodeURIComponent(location.hash.replace(/^#/, ""));
    const a = id && albums.find((x) => x.id === id);
    if (a) { renderAlbum(a); show(albumV); document.title = a.title + " - Gallery Joomax"; }
    else { show(listV); document.title = "Gallery - Joomax Teknologi Indonesia"; }
    if (!first) scrollTo({ top: 0, behavior: "auto" });
    first = false;
  }
  addEventListener("hashchange", route);
  route();

  // ---------------------------------------------------------------- lightbox
  const lb = $("#lb"), img = $("#lbImg"), cap = $("#lbCap"), cnt = $("#lbCount");
  let li = 0, opener = null, lockPrev = null;
  const load = (i) => {
    li = (i + shots.length) % shots.length;
    const p = shots[li];
    img.classList.remove("ok");
    const pre = new Image();
    pre.onload = () => { if (shots[li] === p) { img.src = p.src; img.alt = p.caption || ""; img.classList.add("ok"); } };
    pre.src = p.src;
    cap.textContent = p.caption || ""; cap.hidden = !p.caption;
    cnt.textContent = (li + 1) + " / " + shots.length;
    $("#lbPrev").hidden = $("#lbNext").hidden = shots.length < 2;
    [li + 1, li - 1].forEach((k) => { const q = shots[(k + shots.length) % shots.length]; if (q) new Image().src = q.src; });   // muat tetangga lebih dulu
  };
  function openLb(i, from) {
    if (!shots.length) return;
    opener = from || null; load(i);
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    lockPrev = document.documentElement.style.overflow; document.documentElement.style.overflow = "hidden";
    lb.focus({ preventScroll: true });
  }
  function closeLb() {
    if (!lb.classList.contains("open")) return;
    lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = lockPrev || ""; lockPrev = null;
    if (opener) opener.focus({ preventScroll: true });
  }
  $("#lbX").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", (e) => { e.stopPropagation(); load(li - 1); });
  $("#lbNext").addEventListener("click", (e) => { e.stopPropagation(); load(li + 1); });
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-fig")) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb(); else if (e.key === "ArrowRight") load(li + 1); else if (e.key === "ArrowLeft") load(li - 1);
  });
  // geser jari: kiri/kanan = foto berikutnya/sebelumnya
  let sx = null;
  lb.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") sx = e.clientX; });
  lb.addEventListener("pointerup", (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50 && shots.length > 1) load(li + (dx < 0 ? 1 : -1)); });
})();
