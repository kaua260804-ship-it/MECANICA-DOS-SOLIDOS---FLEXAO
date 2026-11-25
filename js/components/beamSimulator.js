/* =========================================================
   beamSimulator.js — Simulador interativo de viga.
   Gera SVG dinâmico com:
     • Esquema estrutural (apoios, cargas)
     • Diagrama de Cortante V(x)
     • Diagrama de Momento Fletor M(x)
     • Cálculo de I, W, σ_max
   Suporta: biapoiada, balanço, com balanço; carga
   concentrada ou distribuída.
   ========================================================= */

const BeamSimulator = (() => {
  "use strict";

  // ---------- Estado padrão (ajuste valores iniciais aqui) ----------
  const state = {
    support: "simples",     // "simples" | "balanco" | "comBalanco"
    loadType: "concentrada",// "concentrada" | "distribuida"
    F: 10,                  // kN  (ou q em kN/m)
    L: 6,                   // m
    b: 0.20,                // m
    h: 0.40,                // m
    E: 200e9                // Pa (aço) — usado apenas p/ referência
  };

  // ---------- Container raiz ----------
  let root = null;

  // ---------- Helpers geométricos por tipo de apoio ----------
  function computeReactions() {
    const { support, loadType, F, L } = state;
    // Retorna { Ra, Rb, isCantilever, a } conforme tipo.
    // Para biapoiada simples: Ra = Rb = F/2 (conc) ou qL/2 (dist).
    if (support === "simples") {
      if (loadType === "concentrada") return { Ra: F / 2, Rb: F / 2, Mmax: F * L / 4 };
      return { Ra: F * L / 2, Rb: F * L / 2, Mmax: F * L * L / 8 };
    }
    if (support === "balanco") {
      // Viga em balanço: carga na ponta (concentrada) ou distribuída.
      if (loadType === "concentrada") return { Ra: F, Rb: 0, Mmax: F * L, isCantilever: true };
      return { Ra: F * L, Rb: 0, Mmax: F * L * L / 2, isCantilever: true };
    }
    // "comBalanco": biapoiada com um balanço à direita (L/3 de balanço)
    const a = L * 0.6667; // vão entre apoios
    const bBal = L - a;   // balanço
    if (loadType === "concentrada") {
      // Carga F aplicada na ponta do balanço.
      const Rb = F * (a + bBal) / a;
      const Ra = F - Rb;
      // Momento máximo no apoio B (negativo)
      return { Ra, Rb, Mmax: Math.abs(F * bBal), a, bBal, isCantilever: false };
    }
    // distribuída em todo o vão + balanço
    const Ra = F * L * (L / 2 - bBal) / a;
    const Rb = F * L - Ra;
    return { Ra, Rb, Mmax: Math.abs(F * bBal * bBal / 2), a, bBal, isCantilever: false };
  }

  // ---------- Funções de V(x) e M(x) para o diagrama ----------
  function diagrams(N = 120) {
    const { support, loadType, F, L } = state;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * L;
      let V = 0, M = 0;
      if (support === "simples") {
        if (loadType === "concentrada") {
          V = x < L / 2 ? F / 2 : -F / 2;
          M = x <= L / 2 ? (F / 2) * x : (F / 2) * (L - x);
        } else {
          V = F * (L / 2 - x);
          M = (F * x / 2) * (L - x);
        }
      } else if (support === "balanco") {
        if (loadType === "concentrada") {
          V = -F;
          M = -F * (L - x);
        } else {
          V = -F * (L - x);
          M = -(F / 2) * (L - x) * (L - x);
        }
      } else { // comBalanco
        const a = L * 0.6667, bBal = L - a;
        const { Ra, Rb } = computeReactions();
        if (loadType === "concentrada") {
          const xF = L; // carga na ponta do balanço
          if (x < a) {
            V = Ra;
            M = Ra * x;
          } else {
            V = Ra - F;
            M = Ra * x - F * (x - a);
          }
        } else {
          // distribuída: reações + carga
          if (x < a) {
            V = Ra - F * x;
            M = Ra * x - F * x * x / 2;
          } else {
            V = Ra - F * x;
            M = Ra * x - F * x * x / 2;
          }
        }
      }
      pts.push({ x, V, M });
    }
    return pts;
  }

  // ---------- Cálculos geométricos da seção ----------
  function sectionProps() {
    const b = state.b, h = state.h;
    const I = (b * h * h * h) / 12;
    const c = h / 2;
    const W = I / c;
    const { Mmax } = computeReactions();
    const MmaxNm = Mmax * 1000; // kN·m → N·m
    const sigma = MmaxNm / W;   // Pa
    return { I, W, sigma, Mmax, c };
  }

  // ---------- Renderização SVG ----------
  function renderSVG() {
    const W = 760, H = 420;
    const margin = { top: 20, right: 30, bottom: 20, left: 40 };
    const plotW = W - margin.left - margin.right;
    const plotH = H - margin.top - margin.bottom;

    const pts = diagrams(120);
    const { Mmax } = computeReactions();
    const props = sectionProps();

    const maxV = Math.max(...pts.map(p => Math.abs(p.V)), 1e-6);
    const maxM = Math.max(...pts.map(p => Math.abs(p.M)), 1e-6);

    // Escalas
    const xScale = x => margin.left + (x / state.L) * plotW;
    const yV = v => margin.top + (0.5 - 0.5 * (v / maxV)) * plotH;
    const yM = m => margin.top + (0.5 - 0.5 * (m / maxM)) * plotH;

    // Helpers de path
    const pathV = pts.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.x).toFixed(1)},${yV(p.V).toFixed(1)}`).join(" ");
    const pathM = pts.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.x).toFixed(1)},${yM(p.M).toFixed(1)}`).join(" ");

    // Esquema da viga (linha superior, pequeno)
    const beamY = margin.top + 40;
    const beamX0 = margin.left + 20, beamX1 = W - margin.right - 20;
    const supA = beamX0, supB = state.support === "simples" ? (beamX0 + beamX1) / 2 + 80 : beamX1 - 100;

    // SVG
    const svg = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Diagramas de cortante e momento">
        <defs>
          <linearGradient id="gradM" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="rgba(56,189,248,.35)"/>
            <stop offset="100%" stop-color="rgba(56,189,248,.02)"/>
          </linearGradient>
          <linearGradient id="gradV" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="rgba(244,114,182,.35)"/>
            <stop offset="100%" stop-color="rgba(244,114,182,.02)"/>
          </linearGradient>
        </defs>

        <!-- Grid de fundo -->
        <g stroke="var(--grid)" stroke-width="1">
          ${[0, 1, 2, 3, 4].map(i => `<line x1="${margin.left}" x2="${margin.left + plotW}" y1="${margin.top + (plotH / 4) * i}" y2="${margin.top + (plotH / 4) * i}"/>`).join("")}
        </g>

        <!-- Título -->
        <text x="${margin.left}" y="${margin.top - 4}" fill="var(--txt-2)" font-size="11" font-family="var(--font-mono)">Diagrama de Esforço Cortante V(x) [kN] — magenta</text>
        <text x="${margin.left}" y="${margin.top + plotH - 4}" fill="var(--txt-2)" font-size="11" font-family="var(--font-mono)">Diagrama de Momento Fletor M(x) [kN·m] — azul</text>

        <!-- Curvas -->
        <path d="${pathV}" fill="none" stroke="var(--accent-2)" stroke-width="2.5" />
        <path d="${pathM}" fill="none" stroke="var(--accent)" stroke-width="2.5" />

        <!-- Linha do zero -->
        <line x1="${margin.left}" x2="${margin.left + plotW}" y1="${margin.top + plotH / 2}" y2="${margin.top + plotH / 2}" stroke="var(--txt-3)" stroke-dasharray="4 4" stroke-width="1" />

        <!-- Eixo x -->
        <line x1="${margin.left}" x2="${margin.left + plotW}" y1="${margin.top + plotH}" y2="${margin.top + plotH}" stroke="var(--line)" />

        <!-- Marcadores de máximo -->
        <text x="${margin.left + plotW - 8}" y="${margin.top + plotH / 2 - 8}" fill="var(--accent)" font-size="11" font-family="var(--font-mono)" text-anchor="end">Mmax = ${Mmax.toFixed(2)} kN·m</text>

        <!-- Esquema da viga simplificado -->
        <g transform="translate(0,${beamY - 40})">
          <line x1="${beamX0}" x2="${beamX1}" y1="0" y2="0" stroke="var(--txt-1)" stroke-width="4" stroke-linecap="round"/>
          ${renderSupportIcon(supA, 0, state.support === "balanco" ? "engaste" : "pino")}
          ${state.support !== "balanco" ? renderSupportIcon(supB, 0, "role") : ""}
          ${renderLoadIcon((beamX0 + beamX1) / 2, 0, state.loadType, state.F)}
        </g>
      </svg>
    `;

    return svg;
  }

  function renderSupportIcon(x, y, type) {
    if (type === "pino") {
      return `<g transform="translate(${x},${y})">
        <polygon points="0,0 -8,14 8,14" fill="var(--accent)" opacity="0.9"/>
        <line x1="-12" x2="12" y1="14" y2="14" stroke="var(--accent)" stroke-width="2"/>
      </g>`;
    }
    if (type === "role") {
      return `<g transform="translate(${x},${y})">
        <circle cx="0" cy="8" r="5" fill="var(--accent)"/>
        <line x1="-14" x2="14" y1="16" y2="16" stroke="var(--accent)" stroke-width="2"/>
      </g>`;
    }
    // engaste
    return `<g transform="translate(${x},${y})">
      <rect x="-6" y="-18" width="12" height="36" fill="var(--accent)" opacity="0.8"/>
      <line x1="-14" x2="-14" y1="-20" y2="20" stroke="var(--accent)" stroke-width="2"/>
    </g>`;
  }

  function renderLoadIcon(x, y, type, F) {
    if (type === "concentrada") {
      return `<g transform="translate(${x},${y - 6})">
        <line x1="0" x2="0" y1="-22" y2="0" stroke="var(--warn)" stroke-width="3" marker-end="url(#arr)"/>
        <polygon points="-6,-22 6,-22 0,-30" fill="var(--warn)"/>
        <text x="8" y="-16" fill="var(--warn)" font-size="12" font-family="var(--font-mono)">F = ${F} kN</text>
      </g>`;
    }
    // distribuída (vários arrows)
    let arrows = "";
    for (let i = -4; i <= 4; i++) {
      arrows += `<line x1="${i * 10}" x2="${i * 10}" y1="-22" y2="0" stroke="var(--warn)" stroke-width="1.5" opacity="0.7"/>`;
    }
    return `<g transform="translate(${x},${y - 6})">
      ${arrows}
      <line x1="-44" x2="44" y1="-24" y2="-24" stroke="var(--warn)" stroke-width="2"/>
      <text x="50" y="-20" fill="var(--warn)" font-size="12" font-family="var(--font-mono)">q = ${F} kN/m</text>
    </g>`;
  }

  // ---------- UI completa (HTML) ----------
  function renderUI() {
    const props = sectionProps();
    return `
      <div class="simulator">
        <div class="simulator__canvas-wrap">${renderSVG()}</div>
        <div class="simulator__panel">
          <div class="card card--flat">
            <h3>Parâmetros da viga</h3>
            <div class="controls">
              <div class="control">
                <label>Tipo de apoio</label>
                <div class="segmented" data-group="support">
                  <button data-val="simples" class="${state.support === 'simples' ? 'active' : ''}">Biapoiada</button>
                  <button data-val="balanco" class="${state.support === 'balanco' ? 'active' : ''}">Balanço</button>
                  <button data-val="comBalanco" class="${state.support === 'comBalanco' ? 'active' : ''}">Com balanço</button>
                </div>
              </div>
              <div class="control">
                <label>Tipo de carga</label>
                <div class="segmented" data-group="loadType">
                  <button data-val="concentrada" class="${state.loadType === 'concentrada' ? 'active' : ''}">Concentrada</button>
                  <button data-val="distribuida" class="${state.loadType === 'distribuida' ? 'active' : ''}">Distribuída</button>
                </div>
              </div>
              ${slider("Força F / q", "F", state.F, 1, 50, 1, "kN")}
              ${slider("Vão L", "L", state.L, 2, 12, 0.5, "m")}
              ${slider("Base b", "b", state.b, 0.05, 0.6, 0.01, "m")}
              ${slider("Altura h", "h", state.h, 0.1, 1.0, 0.01, "m")}
            </div>
          </div>
          <div class="card card--accent">
            <h3>Resultados</h3>
            <div class="stats">
              <div class="stat">
                <div class="stat__label">I (Inércia)</div>
                <div class="stat__value">${(props.I * 1e8).toFixed(2)}<small> ×10⁻⁸ m⁴</small></div>
              </div>
              <div class="stat">
                <div class="stat__label">W (Resistência)</div>
                <div class="stat__value">${(props.W * 1e6).toFixed(2)}<small> ×10⁻⁶ m³</small></div>
              </div>
              <div class="stat stat--tension">
                <div class="stat__label">σ máx (tração)</div>
                <div class="stat__value">${(props.sigma / 1e6).toFixed(1)}<small> MPa</small></div>
              </div>
              <div class="stat stat--compression">
                <div class="stat__label">σ máx (compressão)</div>
                <div class="stat__value">${(props.sigma / 1e6).toFixed(1)}<small> MPa</small></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function slider(label, key, val, min, max, step, unit) {
    return `
      <div class="control">
        <label>${label}</label>
        <input type="range" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${val}" />
        <span class="control__value" data-out="${key}">${val.toFixed(step < 1 ? 2 : 0)} ${unit}</span>
      </div>
    `;
  }

  // ---------- Bind de eventos ----------
  function bind() {
    // Sliders
    root.querySelectorAll('input[type="range"]').forEach(inp => {
      inp.addEventListener('input', e => {
        const key = e.target.dataset.key;
        state[key] = parseFloat(e.target.value);
        const out = root.querySelector(`[data-out="${key}"]`);
        if (out) out.textContent = `${state[key].toFixed(key === 'b' || key === 'h' ? 2 : (key === 'L' ? 1 : 0))} ${key === 'F' ? 'kN' : (key === 'L' ? 'm' : 'm')}`;
        root.innerHTML = renderUI();
        bind();
      });
    });
    // Segmented
    root.querySelectorAll('.segmented').forEach(seg => {
      const group = seg.dataset.group;
      seg.querySelectorAll('button').forEach(b => {
        b.addEventListener('click', () => {
          state[group] = b.dataset.val;
          root.innerHTML = renderUI();
          bind();
        });
      });
    });
  }

  // ---------- API pública ----------
  function mount(container) {
    if (!container) return;
    root = container;
    root.innerHTML = renderUI();
    bind();
  }

  return { mount, state };
})();

window.BeamSimulator = BeamSimulator;