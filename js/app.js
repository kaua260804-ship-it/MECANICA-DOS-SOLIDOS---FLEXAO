/* =========================================================
   app.js — Controlador (v2 — atalhos estendidos)
   ========================================================= */

(() => {
  "use strict";

  const stage = document.getElementById("stage");
  const navContainer = document.getElementById("moduleNav");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const btnPlayPause = document.getElementById("btnPlayPause");
  const btnRestart = document.getElementById("btnRestart");
  const btnPresenter = document.getElementById("btnPresenter");
  const playIcon = document.getElementById("playIcon");
  const playLabel = document.getElementById("playLabel");
  const cycleTimerEl = document.getElementById("cycleTimer");

  let currentModuleIndex = 0;
  let isPlaying = true;
  let cycleStartTime = performance.now();
  let pausedElapsed = 0;
  const LOOP_DURATION = 5000;

  function buildNav() {
    navContainer.innerHTML = "";
    SLIDES_DATA.forEach((mod, idx) => {
      const btn = document.createElement("button");
      btn.className = idx === currentModuleIndex ? "nav-pill active" : "nav-pill";
      btn.textContent = mod.shortTitle;
      btn.onclick = () => selectModule(idx);
      navContainer.appendChild(btn);
    });
  }

  function selectModule(idx) {
    currentModuleIndex = (idx + SLIDES_DATA.length) % SLIDES_DATA.length;
    const mod = SLIDES_DATA[currentModuleIndex];
    buildNav();

    const cardsHtml = mod.cards.map((card, cIdx) => `
      <article class="card-anim">
        <header class="card-anim__header">
          <span class="card-anim__tag">${card.tag}</span>
          <span class="card-anim__num">FIG 0${mod.id}.${cIdx + 1}</span>
        </header>
        <h3 class="card-anim__title">${card.title}</h3>
        <div class="card-anim__viewport">
          <svg id="${card.id}" viewBox="0 0 400 250"></svg>
          <div class="card-anim__progress">
            <div class="card-anim__progress-fill" id="prog_${card.id}"></div>
          </div>
        </div>
        <p class="card-anim__caption">${card.caption}</p>
      </article>
    `).join("");

    const notesHtml = `
      <div class="presenter-notes">
        <div class="presenter-notes__title">🎤 Cola do Apresentador</div>
        <ul>${mod.notes.map(n => `<li>${n}</li>`).join("")}</ul>
      </div>
    `;

    stage.innerHTML = `
      <section class="slide slide--active">
        <header class="slide__header">
          <div>
            <div class="slide__eyebrow">MÓDULO 0${mod.id} / 06 · ${mod.shortTitle}</div>
            <h2 class="slide__title">${mod.title}<small>${mod.subtitle}</small></h2>
          </div>
          <div class="badge-presenter">${mod.speakers}</div>
        </header>
        <div class="focus-panel">${mod.subtitle}</div>
        <div class="cards-grid">${cardsHtml}</div>
        ${notesHtml}
      </section>
    `;

    restartCycle();
  }

  function restartCycle() {
    cycleStartTime = performance.now();
    pausedElapsed = 0;
    if (!isPlaying) togglePlay();
    renderFrame(0);
  }

  function togglePlay() {
    if (isPlaying) {
      isPlaying = false;
      pausedElapsed = (performance.now() - cycleStartTime) % LOOP_DURATION;
      playIcon.textContent = "▶";
      playLabel.textContent = "CONTINUAR";
      btnPlayPause.classList.add("is-paused");
    } else {
      isPlaying = true;
      cycleStartTime = performance.now() - pausedElapsed;
      playIcon.textContent = "⏸";
      playLabel.textContent = "PAUSAR";
      btnPlayPause.classList.remove("is-paused");
    }
  }

  function animationLoop(now) {
    let elapsed = isPlaying ? (now - cycleStartTime) % LOOP_DURATION : pausedElapsed;
    const t = elapsed / LOOP_DURATION;
    cycleTimerEl.textContent = (elapsed / 1000).toFixed(1) + "s";
    renderFrame(t);
    requestAnimationFrame(animationLoop);
  }

  function renderFrame(t) {
    const mod = SLIDES_DATA[currentModuleIndex];
    mod.cards.forEach((card) => {
      const svg = document.getElementById(card.id);
      const prog = document.getElementById(`prog_${card.id}`);
      if (prog) prog.style.width = `${(t * 100).toFixed(1)}%`;
      if (svg && window[card.render]) window[card.render](svg, t);
    });
  }

  btnPrev.onclick = () => selectModule(currentModuleIndex - 1);
  btnNext.onclick = () => selectModule(currentModuleIndex + 1);
  btnPlayPause.onclick = togglePlay;
  btnRestart.onclick = restartCycle;
  btnPresenter.onclick = () => {
    document.body.classList.toggle("presenter-mode");
    btnPresenter.classList.toggle("active");
  };

  window.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select")) return;
    // Setas + PageUp/PageDown (compatível com controle remoto de apresentação)
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); selectModule(currentModuleIndex + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); selectModule(currentModuleIndex - 1); }
    else if (e.key === " ") { e.preventDefault(); togglePlay(); }
    else if (e.key.toLowerCase() === "r") restartCycle();
    else if (e.key.toLowerCase() === "n") {
      document.body.classList.toggle("presenter-mode");
      btnPresenter.classList.toggle("active");
    }
  });

  selectModule(0);
  requestAnimationFrame(animationLoop);
})();
