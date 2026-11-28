/* =========================================================
   app.js — navegação por telas (1 animação por tela).
   Começa PAUSADO no quadro-chave; Espaço anima; R reinicia.
   Janela do apresentador (N) mostra as notas só para quem fala.
   ========================================================= */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const stage = $("stage"), nav = $("moduleNav"), counter = $("counter");
  const btnPlay = $("btnPlay");
  const LOOP = 6000;
  const isPresenter = /[?&]presenter/.test(location.search);
  const modOf = s => MODULES.find(m => m.id === s.mod);

  let idx = 0, playing = false, t0 = 0, dirty = true, popup = null;

  /* ---------- tela ---------- */
  function buildNav() {
    nav.innerHTML = "";
    MODULES.forEach(m => {
      const b = document.createElement("button");
      b.className = "pill" + (m.id === SCREENS[idx].mod ? " active" : "");
      b.textContent = m.nav;
      b.onclick = () => go(SCREENS.findIndex(s => s.mod === m.id));
      nav.appendChild(b);
    });
  }

  function show(i) {
    idx = (i + SCREENS.length) % SCREENS.length;
    const s = SCREENS[idx], m = modOf(s);
    playing = false; dirty = true;
    if (btnPlay) { btnPlay.textContent = "▶ Animar"; btnPlay.classList.remove("on"); }
    let body;
    if (s.photo) {
      body = `<div class="photo"><img id="photoImg" src="${s.photo}" alt="${s.title}">
        <div class="photo__empty" id="photoEmpty" style="display:none">Coloque a foto em <code>${s.photo}</code><br>(aparelho de apoio de ponte)</div></div>`;
    } else {
      body = `<svg id="viz" viewBox="0 0 480 300" preserveAspectRatio="xMidYMid meet"></svg><div class="viz__bar" id="vizBar"></div>`;
    }
    stage.innerHTML = `<section class="screen">
      <div class="screen__head">
        <div class="screen__eyebrow">${m.nav}</div>
        <h2 class="screen__title">${s.title}</h2>
        <p class="screen__line">${s.line}</p>
      </div>
      <div class="viz">${body}</div></section>`;
    if (s.photo) {
      const img = $("photoImg");
      img.onerror = () => { img.style.display = "none"; $("photoEmpty").style.display = "block"; };
    }
    buildNav();
    counter.textContent = `${idx + 1} / ${SCREENS.length}`;
    syncPresenter();
  }
  const go = i => show(i);

  /* ---------- animação ---------- */
  function draw(t) {
    const s = SCREENS[idx], svg = $("viz");
    if (svg && s.render && RENDERERS[s.render]) RENDERERS[s.render](svg, t);
    const bar = $("vizBar"); if (bar) bar.style.width = playing ? (t * 100).toFixed(1) + "%" : "0%";
  }
  function loop(now) {
    if (playing) draw(((now - t0) % LOOP) / LOOP);
    else if (dirty) { draw(SCREENS[idx].key ?? 0.5); dirty = false; }
    requestAnimationFrame(loop);
  }
  function togglePlay() {
    if (!SCREENS[idx].render) return;
    playing = !playing;
    if (playing) t0 = performance.now();
    else dirty = true;
    btnPlay.textContent = playing ? "⏸ Pausar" : "▶ Animar";
    btnPlay.classList.toggle("on", playing);
  }
  function restart() {
    if (!SCREENS[idx].render) return;
    playing = true; t0 = performance.now();
    btnPlay.textContent = "⏸ Pausar"; btnPlay.classList.add("on");
  }

  /* ---------- apresentador ---------- */
  function syncPresenter() {
    if (popup && !popup.closed) popup.postMessage({ type: "idx", idx }, "*");
  }
  function openPresenter() {
    popup = window.open(location.pathname + "?presenter", "presenter", "width=980,height=760");
  }

  function presenterView() {
    document.body.classList.add("presenter");
    const start = Date.now();
    const render = () => {
      const s = SCREENS[idx], m = modOf(s), n = SCREENS[(idx + 1) % SCREENS.length];
      stage.innerHTML = `<div class="pres">
        <div class="pres__who">${m.who} · ${m.time}</div>
        <h2 class="pres__title">${idx + 1}/${SCREENS.length} · ${s.title}</h2>
        <ul class="pres__notes">${s.notes.map(x => `<li>${x}</li>`).join("")}</ul>
        <div class="pres__next"><b>Próxima:</b> ${n.title} <span style="color:#64748B">(${modOf(n).who})</span></div>
        <div class="pres__bar"><button class="ctrl" id="pPrev">‹ Anterior</button><button class="ctrl" id="pNext">Próxima ›</button><span class="pres__clock" id="pClock"></span></div></div>`;
      $("pPrev").onclick = () => window.opener && window.opener.postMessage({ type: "nav", d: -1 }, "*");
      $("pNext").onclick = () => window.opener && window.opener.postMessage({ type: "nav", d: 1 }, "*");
    };
    window.addEventListener("message", e => { if (e.data && e.data.type === "idx") { idx = e.data.idx; render(); } });
    setInterval(() => { const c = $("pClock"); if (c) { const sec = Math.floor((Date.now() - start) / 1000); c.textContent = String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0"); } }, 500);
    render();
    if (window.opener) window.opener.postMessage({ type: "hello" }, "*");
    window.addEventListener("keydown", e => {
      if (!window.opener) return;
      if (["ArrowRight", "PageDown"].includes(e.key)) window.opener.postMessage({ type: "nav", d: 1 }, "*");
      if (["ArrowLeft", "PageUp"].includes(e.key)) window.opener.postMessage({ type: "nav", d: -1 }, "*");
    });
  }

  /* ---------- eventos ---------- */
  if (isPresenter) { presenterView(); return; }

  $("btnPrev").onclick = () => go(idx - 1);
  $("btnNext").onclick = () => go(idx + 1);
  btnPlay.onclick = togglePlay;
  $("btnPresenter").onclick = openPresenter;
  window.addEventListener("message", e => {
    if (!e.data) return;
    if (e.data.type === "nav") go(idx + e.data.d);
    if (e.data.type === "hello") syncPresenter();
  });
  window.addEventListener("keydown", e => {
    const k = e.key;
    if (["ArrowRight", "PageDown"].includes(k)) { e.preventDefault(); go(idx + 1); }
    else if (["ArrowLeft", "PageUp"].includes(k)) { e.preventDefault(); go(idx - 1); }
    else if (k === " ") { e.preventDefault(); togglePlay(); }
    else if (k === "Home") go(0);
    else if (k === "End") go(SCREENS.length - 1);
    else if (/^[1-6]$/.test(k)) go(SCREENS.findIndex(s => s.mod === +k));
    else if (k.toLowerCase() === "r") restart();
    else if (k.toLowerCase() === "n") openPresenter();
    else if (k.toLowerCase() === "f") { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
  });

  show(0);
  requestAnimationFrame(loop);
})();
