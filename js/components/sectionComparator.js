/* =========================================================
   sectionComparator.js — Comparador interativo de seções
   transversais com a MESMA área. Desenha em SVG: retângulo,
   perfil I, tubular vazada e triângulo. Calcula I, W e mostra
   qual seção suporta maior momento fletor (com mesmo Mmax).
   ========================================================= */

const SectionComparator = (() => {
  "use strict";

  // Área fixa comum (m²) — comparar com mesma massa
  const AREA = 0.04; // 400 cm²

  const sections = {
    retangular: { name: "Retangular", build: buildRet },
    perfilI:    { name: "Perfil I (duplo T)", build: buildI },
    tubular:    { name: "Tubular vazada", build: buildTubular },
    triangular: { name: "Triangular", build: buildTri }
  };

  let currentKey = "perfilI";
  let root = null;

  // ---------- Geometrias (todas com área ~= AREA) ----------
  function buildRet() {
    // b = h/2 ; A = b*h = h²/2 = AREA → h = sqrt(2A)
    const h = Math.sqrt(2 * AREA);
    const b = h / 2;
    const I = (b * h ** 3) / 12;
    const c = h / 2;
    return { b, h, I, W: I / c, label: `b=${(b*100).toFixed(1)} cm · h=${(h*100).toFixed(1)} cm` };
  }

  function buildI() {
    // Perfil I ideal: duas mesas + alma. Simplificação:
    // Mesas: bf x tf ; alma: tw x hw. A = 2*bf*tf + tw*hw.
    // Usamos h total fixo = h_tot. bf = h_tot/2, tw = 0.1 h_tot.
    // Resolvemos tf para A = AREA.
    const hTot = 0.30;                 // 30 cm
    const bf = hTot / 2;               // 15 cm
    const tw = 0.10 * hTot;            // 3 cm
    const hw = hTot - 4 * 0;           // altura útil (aproximada)
    // A = 2*bf*tf + tw*(hTot - 2*tf) = AREA
    // 2*bf*tf + tw*hTot - 2*tw*tf = AREA
    // tf*(2*bf - 2*tw) = AREA - tw*hTot
    const tf = (AREA - tw * hTot) / (2 * bf - 2 * tw);
    const hAlma = hTot - 2 * tf;
    // I = (bf*hTot³ - (bf-tw)*hAlma³)/12
    const I = (bf * hTot ** 3 - (bf - tw) * hAlma ** 3) / 12;
    const c = hTot / 2;
    return {
      bf, tw, tf, hTot, hAlma, I, W: I / c,
      label: `bf=${(bf*100).toFixed(1)} · tf=${(tf*100).toFixed(1)} · h=${(hTot*100).toFixed(0)} cm`
    };
  }

  function buildTubular() {
    // Tubo quadrado vazado: lado L, espessura t.
    // A = L² - (L-2t)² = 4Lt - 4t² = AREA → resolve t para L=0.25 m.
    const L = 0.25;
    // 4Lt - 4t² = AREA → 4t² - 4Lt + AREA = 0
    const a = 4, b = -4 * L, c = AREA;
    const disc = b * b - 4 * a * c;
    const t = (-b - Math.sqrt(disc)) / (2 * a);
    const Li = L - 2 * t;
    const I = (L ** 4 - Li ** 4) / 12;
    const cx = L / 2;
    return { L, t, Li, I, W: I / cx, label: `L=${(L*100).toFixed(0)} cm · t=${(t*1000).toFixed(1)} mm` };
  }

  function buildTri() {
    // Triângulo base b, altura h. A = b*h/2 = AREA → h = 2*AREA/b.
    // Usamos b = 2h para um triângulo "esbelto".
    // b = 2h → 2h²/2 = h² = AREA → h = sqrt(AREA)
    const h = Math.sqrt(AREA);
    const b = 2 * h;
    const I = (b * h ** 3) / 36;
    const c = h / 3; // centróide a h/3 da base (ou 2h/3 do vértice). W usa y_max = 2h/3.
    const W = I / (2 * h / 3);
    return { b, h, I, W, label: `b=${(b*100).toFixed(1)} cm · h=${(h*100).toFixed(1)} cm` };
  }

  // ---------- Desenho SVG de cada seção ----------
  function drawSection(key, data) {
    const S = 260;
    const pad = 40;
    if (key === "retangular") {
      const scale = (S - 2 * pad) / Math.max(data.b, data.h);
      const w = data.b * scale, h = data.h * scale;
      const x = (S - w) / 2, y = (S - h) / 2;
      return `<svg viewBox="0 0 ${S} ${S}" width="220" height="220">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="rgba(56,189,248,.15)" stroke="var(--accent)" stroke-width="2"/>
        <line x1="${x}" x2="${x + w}" y1="${y + h/2}" y2="${y + h/2}" stroke="var(--ok)" stroke-dasharray="4 3" stroke-width="1.5"/>
        <text x="${S/2}" y="${y + h/2 - 6}" fill="var(--ok)" font-size="10" font-family="var(--font-mono)" text-anchor="middle">L.N.</text>
        <text x="${x + w/2}" y="${y + h + 18}" fill="var(--txt-3)" font-size="10" font-family="var(--font-mono)" text-anchor="middle">b</text>
        <text x="${x - 10}" y="${y + h/2 + 4}" fill="var(--txt-3)" font-size="10" font-family="var(--font-mono)" text-anchor="middle">h</text>
      </svg>`;
    }
    if (key === "perfilI") {
      const scale = (S - 2 * pad) / data.hTot;
      const bf = data.bf * scale, h = data.hTot * scale;
      const tw = data.tw * scale, tf = data.tf * scale;
      const x = (S - bf) / 2, y = (S - h) / 2;
      return `<svg viewBox="0 0 ${S} ${S}" width="220" height="220">
        <path d="M${x},${y} h${bf} v${tf} h-${(bf-tw)/2} v${h-2*tf} h${(bf-tw)/2} v${tf} h-${bf} v-${tf} h${(bf-tw)/2} v-${h-2*tf} h-${(bf-tw)/2} z"
              fill="rgba(56,189,248,.15)" stroke="var(--accent)" stroke-width="2"/>
        <line x1="${x}" x2="${x+bf}" y1="${y+h/2}" y2="${y+h/2}" stroke="var(--ok)" stroke-dasharray="4 3" stroke-width="1.5"/>
        <text x="${S/2}" y="${y+h/2 - 6}" fill="var(--ok)" font-size="10" font-family="var(--font-mono)" text-anchor="middle">L.N.</text>
      </svg>`;
    }
    if (key === "tubular") {
      const scale = (S - 2 * pad) / data.L;
      const L = data.L * scale, Li = data.Li * scale;
      const x = (S - L) / 2, y = (S - L) / 2;
      return `<svg viewBox="0 0 ${S} ${S}" width="220" height="220">
        <rect x="${x}" y="${y}" width="${L}" height="${L}" fill="rgba(56,189,248,.15)" stroke="var(--accent)" stroke-width="2"/>
        <rect x="${x + (L-Li)/2}" y="${y + (L-Li)/2}" width="${Li}" height="${Li}" fill="var(--bg-1)" stroke="var(--accent)" stroke-width="2"/>
        <line x1="${x}" x2="${x+L}" y1="${y+L/2}" y2="${y+L/2}" stroke="var(--ok)" stroke-dasharray="4 3" stroke-width="1.5"/>
      </svg>`;
    }
    // triangular
    const scale = (S - 2 * pad) / Math.max(data.b, data.h);
    const w = data.b * scale, h = data.h * scale;
    const x = (S - w) / 2, y = (S - h) / 2;
    return `<svg viewBox="0 0 ${S} ${S}" width="220" height="220">
      <polygon points="${x + w/2},${y} ${x},${y + h} ${x + w},${y + h}" fill="rgba(56,189,248,.15)" stroke="var(--accent)" stroke-width="2"/>
      <line x1="${x}" x2="${x + w}" y1="${y + 2*h/3}" y2="${y + 2*h/3}" stroke="var(--ok)" stroke-dasharray="4 3" stroke-width="1.5"/>
      <text x="${x + w + 6}" y="${y + 2*h/3 + 4}" fill="var(--ok)" font-size="10" font-family="var(--font-mono)">L.N.</text>
    </svg>`;
  }

  // ---------- Render UI ----------
  function renderUI() {
    const data = {};
    Object.keys(sections).forEach(k => data[k] = sections[k].build());

    // Encontra melhor W
    const bestKey = Object.keys(data).reduce((a, b) => data[a].W > data[b].W ? a : b);

    const cards = Object.keys(sections).map(k => {
      const d = data[k];
      const isBest = k === bestKey;
      return `
        <div class="section-card ${k === currentKey ? 'section-card--active' : ''}" data-key="${k}">
          ${drawSection(k, d)}
          <div class="section-card__name">${sections[k].name}</div>
          <div class="section-card__metric">
            I = <strong>${(d.I * 1e8).toFixed(2)}</strong> ×10⁻⁸ m⁴<br/>
            W = <strong>${(d.W * 1e6).toFixed(2)}</strong> ×10⁻⁶ m³
            ${isBest ? '<br/><span style="color:var(--ok)">★ Melhor rigidez</span>' : ''}
          </div>
        </div>
      `;
    }).join("");

    const cur = data[currentKey];
    const Mmax = 50; // kN·m (exemplo ilustrativo de mesma carga)
    const sigmaCur = (Mmax * 1000) / cur.W; // Pa

    return `
      <div class="section-grid">${cards}</div>
      <div class="card mt-4 card--accent">
        <h3>${sections[currentKey].name} — detalhes</h3>
        <div class="stats">
          <div class="stat">
            <div class="stat__label">Área</div>
            <div class="stat__value">${(AREA*1e4).toFixed(1)}<small> cm²</small></div>
          </div>
          <div class="stat">
            <div class="stat__label">I</div>
            <div class="stat__value">${(cur.I*1e8).toFixed(2)}<small> ×10⁻⁸ m⁴</small></div>
          </div>
          <div class="stat">
            <div class="stat__label">W</div>
            <div class="stat__value">${(cur.W*1e6).toFixed(2)}<small> ×10⁻⁶ m³</small></div>
          </div>
          <div class="stat stat--tension">
            <div class="stat__label">σ com M=50 kN·m</div>
            <div class="stat__value">${(sigmaCur/1e6).toFixed(1)}<small> MPa</small></div>
          </div>
        </div>
        <p class="text-muted mt-2">${cur.label}</p>
      </div>
    `;
  }

  function bind() {
    root.querySelectorAll('.section-card').forEach(card => {
      card.addEventListener('click', () => {
        currentKey = card.dataset.key;
        root.innerHTML = renderUI();
        bind();
      });
    });
  }

  function mount(container) {
    if (!container) return;
    root = container;
    root.innerHTML = renderUI();
    bind();
  }

  return { mount };
})();

window.SectionComparator = SectionComparator;