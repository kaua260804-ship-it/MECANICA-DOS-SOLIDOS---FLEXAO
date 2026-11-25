/* =========================================================
   deformationAnimator.js — MÓDULO 3
   Laboratório virtual de deformação: animação sincronizada
   das fibras (encurtamento sup., alongamento inf.) + LN.
   ========================================================= */

const DeformationAnimator = (() => {
  "use strict";

  let root = null;
  let playing = false;

  const W = 800, H = 300;
  const beamX0 = 60, beamX1 = 740;
  const beamTop = 100, beamBottom = 200;
  const lnY = (beamTop + beamBottom) / 2; // 150

  function svgMarkup() {
    // Fibras horizontais: 5 faixas
    const bands = [];
    const N = 5;
    for (let i = 0; i < N; i++) {
      const y = beamTop + ((beamBottom - beamTop) / (N + 1)) * (i + 1);
      const isTop = i < (N - 1) / 2;
      const isBottom = i > (N - 1) / 2;
      const cls = isTop ? "is-stretched-top" : isBottom ? "is-stretched-bottom" : "";
      bands.push(`<line class="defo-fiber ${cls ? "" : ""}" data-fiber="${i}"
        x1="${beamX0 + 20}" x2="${beamX1 - 20}" y1="${y}" y2="${y}"
        stroke="var(--txt-3)" stroke-width="2" stroke-dasharray="10 4"/>`);
    }

    return `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Laboratório virtual de deformação">
        <defs>
          <linearGradient id="beamGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"  stop-color="var(--accent-2)" stop-opacity=".35"/>
            <stop offset="50%" stop-color="var(--ok)" stop-opacity=".25"/>
            <stop offset="100%" stop-color="var(--accent)" stop-opacity=".35"/>
          </linearGradient>
        </defs>

        <!-- Corpo da viga -->
        <rect x="${beamX0}" y="${beamTop}" width="${beamX1 - beamX0}" height="${beamBottom - beamTop}"
              fill="url(#beamGrad)" stroke="var(--line)" stroke-width="2" rx="6"/>

        <!-- Fibras -->
        ${bands.join("")}

        <!-- Linha neutra -->
        <line x1="${beamX0 - 10}" x2="${beamX1 + 10}" y1="${lnY}" y2="${lnY}"
              stroke="var(--ok)" stroke-width="3" stroke-dasharray="8 4"/>
        <text x="${beamX1 + 18}" y="${lnY + 5}" fill="var(--ok)" font-size="14" font-family="var(--font-mono)" font-weight="700">L.N.</text>

        <!-- Apoios -->
        <g transform="translate(${beamX0},${beamBottom})">
          <polygon points="0,0 -18,24 18,24" fill="var(--accent)" opacity="0.9"/>
          <line x1="-26" x2="26" y1="28" y2="28" stroke="var(--accent)" stroke-width="3"/>
        </g>
        <g transform="translate(${beamX1},${beamBottom})">
          <polygon points="0,0 -18,22 18,22" fill="var(--accent)" opacity="0.9"/>
          <circle cx="-8" cy="28" r="5" fill="var(--accent)"/>
          <circle cx="8" cy="28" r="5" fill="var(--accent)"/>
          <line x1="-26" x2="26" y1="36" y2="36" stroke="var(--accent)" stroke-width="3"/>
        </g>

        <!-- Indicação da carga -->
        <g class="defo-load-indicator" data-load>
          <line x1="${W / 2}" y1="${beamTop - 60}" x2="${W / 2}" y2="${beamTop - 10}"
                stroke="var(--warn)" stroke-width="6" marker-end="url(#arrowHeadMag)"/>
          <text x="${W / 2 + 14}" y="${beamTop - 40}" fill="var(--warn)"
                font-size="16" font-family="var(--font-mono)" font-weight="700">F ↓</text>
        </g>

        <!-- Anotações de tração/compressão -->
        <g class="defo-note defo-note--compression" data-note="comp" transform="translate(20,${beamTop - 24})">
          <rect x="0" y="-18" width="200" height="26" rx="6" fill="var(--bg-2)" stroke="var(--accent-2)"/>
          <text x="10" y="0" fill="var(--accent-2)" font-size="14" font-family="var(--font-mono)">↑ Compressão (encurta)</text>
        </g>
        <g class="defo-note defo-note--tension" data-note="tens" transform="translate(20,${beamBottom + 56})">
          <rect x="0" y="-18" width="200" height="26" rx="6" fill="var(--bg-2)" stroke="var(--accent)"/>
          <text x="10" y="0" fill="var(--accent)" font-size="14" font-family="var(--font-mono)">↓ Tração (alonga)</text>
        </g>
        <g class="defo-note defo-note--neutral" data-note="neut" transform="translate(${beamX1 - 220},${lnY - 40})">
          <rect x="0" y="-18" width="200" height="26" rx="6" fill="var(--bg-2)" stroke="var(--ok)"/>
          <text x="10" y="0" fill="var(--ok)" font-size="14" font-family="var(--font-mono)">↔ L.N. indeformada</text>
        </g>
      </svg>
    `;
  }

  function renderUI() {
    return `
      <div class="m3-lab">
        <div class="m3-lab__title">🔬 Laboratório Virtual — deformação da seção</div>
        <p class="text-muted">Clique em <strong>Play</strong> para aplicar a carga e observar as fibras se deformando em tempo real.</p>
        <div class="m3-lab__toolbar">
          <button class="btn-play" data-action="play">
            <span class="btn-play__icon">▶</span> Play
          </button>
          <button class="btn btn--ghost" data-action="reset">
            <span aria-hidden="true">↺</span> Reset
          </button>
        </div>
        <div class="defo-stage" data-stage>${svgMarkup()}</div>
        <div class="m3-info-chips">
          <div class="m3-chip m3-chip--compression">
            <div class="m3-chip__label">Zona superior</div>
            <div class="m3-chip__text">Fibras encurtam → compressão (σ &lt; 0)</div>
          </div>
          <div class="m3-chip m3-chip--neutral">
            <div class="m3-chip__label">Linha Neutra</div>
            <div class="m3-chip__text">Comprimento indeformado → σ = 0</div>
          </div>
          <div class="m3-chip m3-chip--tension">
            <div class="m3-chip__label">Zona inferior</div>
            <div class="m3-chip__text">Fibras alongam → tração (σ &gt; 0)</div>
          </div>
        </div>
      </div>
    `;
  }

  function play() {
    if (playing) return;
    playing = true;
    const stage = root.querySelector("[data-stage]");
    // Mostra carga + notas
    stage.querySelector("[data-load]")?.classList.add("is-visible");
    stage.querySelector('[data-note="comp"]')?.classList.add("is-visible");
    stage.querySelector('[data-note="tens"]')?.classList.add("is-visible");
    stage.querySelector('[data-note="neut"]')?.classList.add("is-visible");
    // Deforma fibras
    stage.querySelectorAll("[data-fiber]").forEach((f, i) => {
      const n = stage.querySelectorAll("[data-fiber]").length;
      const mid = (n - 1) / 2;
      if (i < mid) f.classList.add("is-stretched-top");
      else if (i > mid) f.classList.add("is-stretched-bottom");
    });
  }

  function reset() {
    playing = false;
    const stage = root.querySelector("[data-stage]");
    stage.querySelector("[data-load]")?.classList.remove("is-visible");
    stage.querySelectorAll(".defo-note").forEach(n => n.classList.remove("is-visible"));
    stage.querySelectorAll("[data-fiber]").forEach(f => {
      f.classList.remove("is-stretched-top", "is-stretched-bottom");
    });
  }

  function bind() {
    root.querySelector('[data-action="play"]')?.addEventListener("click", play);
    root.querySelector('[data-action="reset"]')?.addEventListener("click", reset);
  }

  function mount(container) {
    if (!container) return;
    root = container;
    root.innerHTML = renderUI();
    bind();
  }

  return { mount, reset };
})();

window.DeformationAnimator = DeformationAnimator;