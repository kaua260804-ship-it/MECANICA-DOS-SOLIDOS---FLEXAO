/* =========================================================
   app.js — Controlador principal enxuto.
   ========================================================= */

(() => {
  "use strict";

  const stage = document.getElementById("stage");
  const dotsNav = document.getElementById("dotsNav");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const btnFullscreen = document.getElementById("btnFullscreen");
  const btnPresenter = document.getElementById("btnPresenter");
  const btnExplorer = document.getElementById("btnExplorer");
  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");

  let current = 0;
  const total = SLIDES_DATA.length;

  // ---------- BUILD ----------
  function buildSlide(slide, index) {
    const el = document.createElement("section");
    el.className = "slide" + (index === 0 ? " slide--active" : "");
    el.dataset.id = slide.id;
    el.setAttribute("aria-hidden", index === 0 ? "false" : "true");

    el.innerHTML = `
      <header class="slide__header">
        <div>
          <div class="slide__eyebrow">${slide.eyebrow}</div>
          <h2 class="slide__title">${slide.title}<small>${slide.subtitle}</small></h2>
        </div>
        <div class="badge-presenter" data-level="${slide.presenter.level}">
          <span class="badge-presenter__dot"></span>
          ${slide.presenter.name} · ${slide.presenter.role}
        </div>
      </header>

      <div class="slide__body">${ModuleViews.render(slide)}</div>

      <div class="presenter-notes">
        <div class="presenter-notes__title">🎤 Cola do Apresentador</div>
        <ul>${slide.notes.map(n => `<li>${n}</li>`).join("")}</ul>
      </div>
    `;
    return el;
  }

  function renderAll() {
    SLIDES_DATA.forEach((s, i) => {
      stage.appendChild(buildSlide(s, i));
      const dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " dot--active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Módulo ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsNav.appendChild(dot);
    });
  }

  // ---------- MOUNT DINÂMICO ----------
  function mountComponentsFor(slideId) {
    if (slideId === "m1") {
      const mount = document.getElementById("timelineMount");
      if (mount && window.TimelineAnimator) {
        const data = SLIDES_DATA.find(s => s.id === "m1").content.timeline;
        window.TimelineAnimator.mount(mount, data);
      }
    }
    if (slideId === "m2") {
      const mount = document.getElementById("reactionMount");
      if (mount && window.ReactionAnimator) {
        window.ReactionAnimator.mount(mount);
      }
    }
    if (slideId === "m3") {
      const mount = document.getElementById("deformationMount");
      if (mount && window.DeformationAnimator) {
        window.DeformationAnimator.mount(mount);
      }
    }
    if (slideId === "m5") {
      const mount = document.getElementById("sectionComparatorMount");
      if (mount && window.SectionComparator) window.SectionComparator.mount(mount);
    }
    if (slideId === "m6") {
      const mount = document.getElementById("beamSimulatorMount");
      if (mount && window.BeamSimulator) window.BeamSimulator.mount(mount);
    }
    if (window.KatexLoader) window.KatexLoader.refresh();
  }

  // ---------- NAV ----------
  function goTo(index) {
    if (index < 0 || index >= total) return;
    const slides = stage.querySelectorAll(".slide");
    slides.forEach((s, i) => {
      const active = i === index;
      s.classList.toggle("slide--active", active);
      s.setAttribute("aria-hidden", active ? "false" : "true");
    });
    dotsNav.querySelectorAll(".dot").forEach((d, i) => {
      d.classList.toggle("dot--active", i === index);
    });
    current = index;
    updateProgress();
    mountComponentsFor(SLIDES_DATA[index].id);
    if (document.body.classList.contains("explorer")) {
      slides[index].scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      stage.scrollTop = 0;
    }
  }

  function updateProgress() {
    const pct = ((current + 1) / total) * 100;
    progressFill.style.width = pct + "%";
    progressLabel.textContent = `${current + 1} / ${total}`;
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
  }

  // ---------- EVENTOS ----------
  btnPrev.addEventListener("click", () => goTo(current - 1));
  btnNext.addEventListener("click", () => goTo(current + 1));

  document.addEventListener("keydown", e => {
    if (e.target.matches("input, textarea, select")) return;
    switch (e.key) {
      case "ArrowRight": case "PageDown":
        e.preventDefault(); goTo(current + 1); break;
      case "ArrowLeft": case "PageUp":
        e.preventDefault(); goTo(current - 1); break;
      case "f": case "F": toggleFullscreen(); break;
      case "n": case "N": togglePresenter(); break;
      case "Home": goTo(0); break;
      case "End": goTo(total - 1); break;
    }
  });

  btnFullscreen.addEventListener("click", toggleFullscreen);
  btnPresenter.addEventListener("click", togglePresenter);
  btnExplorer.addEventListener("click", toggleExplorer);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  }
  function togglePresenter() {
    document.body.classList.toggle("presenter-mode");
    btnPresenter.classList.toggle("btn--active",
      document.body.classList.contains("presenter-mode"));
  }
  function toggleExplorer() {
    document.body.classList.toggle("explorer");
    const on = document.body.classList.contains("explorer");
    btnExplorer.classList.toggle("btn--active", on);
    if (on) {
      stage.querySelectorAll(".slide").forEach(s => {
        s.classList.add("slide--active");
        s.setAttribute("aria-hidden", "false");
      });
    } else {
      goTo(current);
    }
  }

  // ---------- BOOT ----------
  renderAll();
  if (window.KatexLoader) window.KatexLoader.init();
  goTo(0);
})();