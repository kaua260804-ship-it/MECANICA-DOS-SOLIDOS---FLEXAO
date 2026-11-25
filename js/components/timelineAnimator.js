/* =========================================================
   timelineAnimator.js — MÓDULO 1
   Timeline horizontal animada com navegação por setas,
   clique nos pontos e auto-advance opcional.
   ========================================================= */

const TimelineAnimator = (() => {
  "use strict";

  let root = null;
  let items = [];
  let activeIdx = 0;
  let autoTimer = null;

  function renderUI() {
    const nodes = items.map((it, i) => `
      <div class="timeline-v2__node" data-idx="${i}">
        <div class="timeline-v2__year">${it.year}</div>
        <div class="timeline-v2__dot"></div>
        <div class="timeline-v2__card">
          <h4>${it.title}</h4>
          <p>${it.desc}</p>
        </div>
      </div>
    `).join("");

    return `
      <div class="m1-timeline-wrap">
        <div class="m1-timeline-controls">
          <div class="text-muted">Clique nos marcos ou use as setas. Cada parada é um capítulo da história da flexão.</div>
          <div class="m1-timeline-nav">
            <button data-nav="prev" title="Anterior">‹</button>
            <button data-nav="auto" title="Auto-play">▶</button>
            <button data-nav="next" title="Próximo">›</button>
          </div>
        </div>
        <div class="timeline-v2" data-tl>
          <div class="timeline-v2__track"></div>
          <div class="timeline-v2__progress" data-progress></div>
          ${nodes}
        </div>
      </div>
    `;
  }

  function apply(idx) {
    if (!root) return;
    activeIdx = Math.max(0, Math.min(items.length - 1, idx));
    const nodes = root.querySelectorAll(".timeline-v2__node");
    const progress = root.querySelector("[data-progress]");
    const pct = items.length > 1 ? (activeIdx / (items.length - 1)) * 88 : 0;

    nodes.forEach((n, i) => {
      n.classList.toggle("is-active", i === activeIdx);
      if (i < activeIdx) n.classList.add("is-visited");
      else n.classList.remove("is-visited");
    });
    if (progress) progress.style.width = pct + "%";
  }

  function next() { apply(activeIdx + 1); }
  function prev() { apply(activeIdx - 1); }

  function toggleAuto() {
    if (autoTimer) {
      clearInterval(autoTimer); autoTimer = null;
      root.querySelector('[data-nav="auto"]').textContent = "▶";
      return;
    }
    root.querySelector('[data-nav="auto"]').textContent = "⏸";
    autoTimer = setInterval(() => {
      if (activeIdx >= items.length - 1) {
        apply(0);
      } else {
        next();
      }
    }, 2600);
  }

  function bind() {
    root.querySelectorAll(".timeline-v2__node").forEach(n => {
      n.addEventListener("click", () => apply(parseInt(n.dataset.idx, 10)));
    });
    root.querySelector('[data-nav="prev"]')?.addEventListener("click", prev);
    root.querySelector('[data-nav="next"]')?.addEventListener("click", next);
    root.querySelector('[data-nav="auto"]')?.addEventListener("click", toggleAuto);
  }

  function mount(container, timelineData) {
    if (!container) return;
    root = container;
    items = timelineData || [];
    root.innerHTML = renderUI();
    bind();
    apply(0);
  }

  function destroy() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  return { mount, destroy, next, prev };
})();

window.TimelineAnimator = TimelineAnimator;