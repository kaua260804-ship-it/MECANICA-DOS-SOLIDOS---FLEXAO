/* =========================================================
   reactionAnimator.js — MÓDULO 2 (v3 - correção de queda e contraste)
   ========================================================= */

const ReactionAnimator = (() => {
  "use strict";

  let root = null;
  let state = {
    dropped: false,
    showReactions: false
  };

  const W = 800, H = 360;
  const groundY = 310;
  const beamY = 200;
  const beamX0 = 140;
  const beamX1 = 660;
  const loadX = 500;
  const supportH = 36;

  function svgMarkup() {
    return `
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="Demonstração de reações de apoio"
           style="width:100%; height:auto; display:block;">
        <defs>
          <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/>
          </marker>
          <marker id="arrowHeadMag" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-2)"/>
          </marker>
        </defs>

        <!-- Terreno -->
        <line x1="20" y1="${groundY}" x2="${W - 20}" y2="${groundY}"
              stroke="var(--line)" stroke-width="2" stroke-dasharray="6 6"/>

        <!-- Viga Original -->
        <line x1="${beamX0}" y1="${beamY}" x2="${beamX1}" y2="${beamY}"
              stroke="var(--txt-1)" stroke-width="6" stroke-linecap="round"/>

        <!-- Viga Defletida -->
        <path class="deflected-beam" data-deflected
              d="M${beamX0},${beamY} Q${(beamX0 + beamX1) / 2},${beamY + 30} ${beamX1},${beamY}"
              stroke="var(--accent)" stroke-width="5" fill="none" stroke-linecap="round"/>

        <!-- Apoio A (Pino) -->
        <g transform="translate(${beamX0},${beamY})">
          <polygon points="0,0 -24,${supportH} 24,${supportH}"
                   fill="var(--accent)" opacity="0.95"/>
          <line x1="-34" x2="34" y1="${supportH + 4}" y2="${supportH + 4}"
                stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>
          <text x="0" y="${supportH + 34}" fill="var(--txt-2)" font-size="18"
                font-family="var(--font-mono)" text-anchor="middle" font-weight="700">A</text>
        </g>

        <!-- Apoio B (Rolete) -->
        <g transform="translate(${beamX1},${beamY})">
          <polygon points="0,0 -24,${supportH - 8} 24,${supportH - 8}"
                   fill="var(--accent)" opacity="0.95"/>
          <circle cx="-12" cy="${supportH - 2}" r="7" fill="var(--accent)"/>
          <circle cx="12"  cy="${supportH - 2}" r="7" fill="var(--accent)"/>
          <line x1="-34" x2="34" y1="${supportH + 10}" y2="${supportH + 10}"
                stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>
          <text x="0" y="${supportH + 44}" fill="var(--txt-2)" font-size="18"
                font-family="var(--font-mono)" text-anchor="middle" font-weight="700">B</text>
        </g>

        <!-- Bloco F (O bloco estático com transform base no eixo X correto) -->
        <g class="load-block" data-load
           transform="translate(${loadX}, ${beamY - 140})">
          <!-- Grupo interno para a animação não "esquecer" o eixo X -->
          <g class="load-inner" data-load-inner>
            <rect x="-36" y="-36" width="72" height="72" rx="8"
                  fill="var(--warn)" opacity="0.95"/>
            <text x="0" y="8" fill="#041018" font-size="24"
                  font-family="var(--font-mono)" text-anchor="middle" font-weight="800">F</text>
          </g>
        </g>

        <!-- ================= REAÇÕES ================= -->

        <!-- R_Ay (Seta e Rótulo) -->
        <g class="force-arrow" data-reaction="A" transform="translate(${beamX0}, ${groundY - 10})">
          <line x1="0" y1="0" x2="0" y2="-${groundY - beamY - supportH - 20}"
                stroke="var(--accent)" stroke-width="5" marker-end="url(#arrowHead)"/>
          <!-- Fundo escuro para contraste noturno -->
          <rect x="-90" y="${-Math.round((groundY - beamY) / 2) - 18}" width="80" height="36" rx="6" fill="var(--bg-0)" opacity="0.85" stroke="var(--line)"/>
          <text x="-50" y="${-Math.round((groundY - beamY) / 2) + 6}"
                fill="var(--accent)" font-size="22"
                font-family="var(--font-mono)" font-weight="800" text-anchor="middle">R_Ay</text>
        </g>

        <!-- R_Bx (Fictícia para apoio móvel, mostrando a teoria ou anulada) -->
        <g class="force-arrow" data-reaction="Bx" transform="translate(${beamX1}, ${beamY - 10})">
          <line x1="0" y1="0" x2="-40" y2="0"
                stroke="var(--txt-3)" stroke-width="3" marker-end="url(#arrowHead)" opacity="0.4" stroke-dasharray="4 4"/>
          <rect x="-85" y="-18" width="60" height="36" rx="6" fill="var(--bg-0)" opacity="0.85" stroke="var(--line)"/>
          <text x="-55" y="6" fill="var(--txt-3)" font-size="18"
                font-family="var(--font-mono)" font-weight="800" text-anchor="middle" text-decoration="line-through">R_Bx</text>
        </g>

        <!-- R_By (Seta e Rótulo) -->
        <g class="force-arrow" data-reaction="B" transform="translate(${beamX1}, ${groundY - 10})">
          <line x1="0" y1="0" x2="0" y2="-${groundY - beamY - supportH - 20}"
                stroke="var(--accent)" stroke-width="5" marker-end="url(#arrowHead)"/>
          <rect x="10" y="${-Math.round((groundY - beamY) / 2) - 18}" width="80" height="36" rx="6" fill="var(--bg-0)" opacity="0.85" stroke="var(--line)"/>
          <text x="50" y="${-Math.round((groundY - beamY) / 2) + 6}"
                fill="var(--accent)" font-size="22"
                font-family="var(--font-mono)" font-weight="800" text-anchor="middle">R_By</text>
        </g>

        <!-- Carga F -->
        <g class="force-arrow" data-reaction="F" transform="translate(${loadX}, ${beamY - 70})">
          <line x1="0" y1="0" x2="0" y2="70"
                stroke="var(--accent-2)" stroke-width="5" marker-end="url(#arrowHeadMag)"/>
          <rect x="16" y="-18" width="120" height="36" rx="6" fill="var(--bg-0)" opacity="0.85" stroke="var(--line)"/>
          <text x="26" y="6" fill="var(--accent-2)" font-size="22"
                font-family="var(--font-mono)" font-weight="800">F = 10 kN</text>
        </g>

        <!-- Cotas -->
        <g opacity="0.7">
          <line x1="${beamX0}" y1="${beamY - 20}" x2="${loadX}" y2="${beamY - 20}"
                stroke="var(--txt-3)" stroke-width="1.5" stroke-dasharray="4 3"/>
          <line x1="${beamX0}" y1="${beamY - 26}" x2="${beamX0}" y2="${beamY - 14}"
                stroke="var(--txt-3)" stroke-width="1.5"/>
          <line x1="${loadX}" y1="${beamY - 26}" x2="${loadX}" y2="${beamY - 14}"
                stroke="var(--txt-3)" stroke-width="1.5"/>
          <text x="${(beamX0 + loadX) / 2}" y="${beamY - 28}"
                fill="var(--txt-2)" font-size="15" font-family="var(--font-mono)"
                text-anchor="middle" font-weight="700">4,0 m</text>
        </g>
        <g opacity="0.7">
          <line x1="${loadX}" y1="${beamY - 20}" x2="${beamX1}" y2="${beamY - 20}"
                stroke="var(--txt-3)" stroke-width="1.5" stroke-dasharray="4 3"/>
          <line x1="${beamX1}" y1="${beamY - 26}" x2="${beamX1}" y2="${beamY - 14}"
                stroke="var(--txt-3)" stroke-width="1.5"/>
          <text x="${(loadX + beamX1) / 2}" y="${beamY - 28}"
                fill="var(--txt-2)" font-size="15" font-family="var(--font-mono)"
                text-anchor="middle" font-weight="700">6,0 m</text>
        </g>
      </svg>
    `;
  }

  function renderUI() {
    return `
      <div class="m2-animator">
        <div class="m2-animator__title">🎬 Demonstração: forças de reação</div>
        <div class="m2-animator__subtitle">
          Clique em <strong>Play</strong> para soltar a carga <em>F</em> sobre a viga. Depois, revele as reações de apoio em A e B.
        </div>
        <div class="reaction-toolbar">
          <button class="btn-play" data-action="play">
            <span class="btn-play__icon">▶</span> Play
          </button>
          <button class="btn" data-action="reactions">
            <span aria-hidden="true">🎯</span> Mostrar reações
          </button>
          <button class="btn btn--ghost" data-action="reset">
            <span aria-hidden="true">↺</span> Reset
          </button>
        </div>
        <div class="reaction-stage" data-stage>${svgMarkup()}</div>
        <div class="m2-reactions-bar">
          <div class="m2-reaction-chip" data-chip="A">
            <span class="m2-reaction-chip__icon">↑</span> R_Ay = 6,0 kN
          </div>
          <div class="m2-reaction-chip" data-chip="B">
            <span class="m2-reaction-chip__icon">↑</span> R_By = 4,0 kN
          </div>
        </div>
      </div>
    `;
  }

  function playDrop() {
    const stage = root.querySelector("[data-stage]");
    const block = stage.querySelector("[data-load-inner]");
    const deflected = stage.querySelector("[data-deflected]");
    if (!block) return;
    block.classList.remove("is-impact");
    block.classList.add("is-falling");
    if (deflected) deflected.classList.add("is-shown");
    setTimeout(() => {
      block.classList.remove("is-falling");
      block.classList.add("is-impact");
    }, 1200);
    state.dropped = true;
  }

  function showReactions() {
    const stage = root.querySelector("[data-stage]");
    stage.querySelectorAll(".force-arrow").forEach(el => el.classList.add("is-visible"));
    root.querySelectorAll(".m2-reaction-chip").forEach(c => c.classList.add("is-visible"));
    state.showReactions = true;
  }

  function reset() {
    const stage = root.querySelector("[data-stage]");
    stage.querySelectorAll(".force-arrow").forEach(el => el.classList.remove("is-visible"));
    const block = stage.querySelector("[data-load-inner]");
    if (block) {
      block.classList.remove("is-falling", "is-impact");
      void block.offsetWidth; // reflow
    }
    const deflected = stage.querySelector("[data-deflected]");
    if (deflected) deflected.classList.remove("is-shown");
    root.querySelectorAll(".m2-reaction-chip").forEach(c => c.classList.remove("is-visible"));
    state.dropped = false;
    state.showReactions = false;
  }

  function bind() {
    root.querySelector('[data-action="play"]')?.addEventListener("click", playDrop);
    root.querySelector('[data-action="reactions"]')?.addEventListener("click", showReactions);
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

window.ReactionAnimator = ReactionAnimator;