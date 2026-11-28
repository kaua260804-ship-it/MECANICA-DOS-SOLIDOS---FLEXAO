/* =========================================================
   engine.js — Motor de renderização SVG (v2 — revisão técnica)
   Ajustes Claude Code aplicados:
   - ViewBox 400×250, fontes SVG 12-14px (legibilidade)
   - Tacoma = flutter aeroelástico (não ressonância nem fadiga)
   - I ∝ h³: dobrando h, I ×8. Régua em pé = (h/b)² = 25×
   - Rx oculto quando carga é vertical pura
   - Exemplo contínuo: L=4m, P=10kN
   - Valores ilustrativos marcados
   ========================================================= */

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function pulseWave(t) { return 0.5 - 0.5 * Math.cos(t * Math.PI * 2); }
function holdWave(t) {
  if (t < 0.32) { const x = t / 0.32; return x * x * (3 - 2 * x); }
  else if (t < 0.68) { return 1; }
  else if (t < 0.92) { const x = 1 - (t - 0.68) / 0.24; return x * x * (3 - 2 * x); }
  return 0;
}

function arrowLine(x1, y1, x2, y2, color, width = 2.5, headSize = 8) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ax1 = x2 - headSize * Math.cos(angle - Math.PI / 6);
  const ay1 = y2 - headSize * Math.sin(angle - Math.PI / 6);
  const ax2 = x2 - headSize * Math.cos(angle + Math.PI / 6);
  const ay2 = y2 - headSize * Math.sin(angle + Math.PI / 6);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/><polygon points="${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}" fill="${color}"/>`;
}

function pinSupport(x, y, color = "#0284C7") {
  return `
    <polygon points="${x},${y} ${x - 14},${y + 22} ${x + 14},${y + 22}" fill="rgba(2,132,199,0.15)" stroke="${color}" stroke-width="2"/>
    <circle cx="${x}" cy="${y}" r="3.5" fill="#FFFFFF" stroke="${color}" stroke-width="2"/>
    <line x1="${x - 20}" y1="${y + 22}" x2="${x + 20}" y2="${y + 22}" stroke="${color}" stroke-width="2"/>
    <line x1="${x - 15}" y1="${y + 27}" x2="${x - 10}" y2="${y + 22}" stroke="${color}" stroke-width="1.5"/>
    <line x1="${x - 5}" y1="${y + 27}" x2="${x}" y2="${y + 22}" stroke="${color}" stroke-width="1.5"/>
    <line x1="${x + 5}" y1="${y + 27}" x2="${x + 10}" y2="${y + 22}" stroke="${color}" stroke-width="1.5"/>
  `;
}

function rollerSupport(x, y, color = "#0284C7") {
  return `
    <polygon points="${x},${y} ${x - 13},${y + 17} ${x + 13},${y + 17}" fill="rgba(2,132,199,0.15)" stroke="${color}" stroke-width="2"/>
    <circle cx="${x}" cy="${y}" r="3.5" fill="#FFFFFF" stroke="${color}" stroke-width="2"/>
    <circle cx="${x - 7}" cy="${y + 21}" r="3.5" fill="none" stroke="${color}" stroke-width="1.8"/>
    <circle cx="${x + 7}" cy="${y + 21}" r="3.5" fill="none" stroke="${color}" stroke-width="1.8"/>
    <line x1="${x - 20}" y1="${y + 25}" x2="${x + 20}" y2="${y + 25}" stroke="${color}" stroke-width="2"/>
  `;
}

// ===== MÓDULO 1 =====
function renderM1C1(svg, t) {
  const w = holdWave(t);
  const bend = w * 42;
  const x0 = 70, x1 = 330, xm = 200, y0 = 135, h = 11;
  let topPts = [], botPts = [], neutralPts = [];
  for (let i = 0; i <= 30; i++) {
    const s = i / 30;
    const x = x0 + (x1 - x0) * s;
    const dy = bend * Math.sin(Math.PI * s);
    const slope = (bend * Math.PI / (x1 - x0)) * Math.cos(Math.PI * s);
    const nx = -slope, ny = 1, len = Math.hypot(nx, ny);
    const ux = (nx / len) * h, uy = (ny / len) * h;
    neutralPts.push(`${x.toFixed(1)},${(y0 + dy).toFixed(1)}`);
    topPts.push(`${(x - ux).toFixed(1)},${(y0 + dy - uy).toFixed(1)}`);
    botPts.unshift(`${(x + ux).toFixed(1)},${(y0 + dy + uy).toFixed(1)}`);
  }
  svg.innerHTML = `
    <text x="200" y="20" fill="#0F172A" font-size="13" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">FLEXÃO SIMPLES: M + V</text>
    <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="5,5"/>
    <polygon points="${topPts.concat(botPts).join(" ")}" fill="rgba(2,132,199,0.18)" stroke="#0284C7" stroke-width="2.5"/>
    <polyline points="${neutralPts.join(" ")}" fill="none" stroke="#CA8A04" stroke-width="2" stroke-dasharray="4,3"/>
    ${pinSupport(x0, y0 + h)}
    ${rollerSupport(x1, y0 + h)}
    ${arrowLine(xm, 55, xm, y0 + bend - h - 4, "#DC2626", 3.5, 10)}
    <rect x="${xm - 50}" y="28" width="100" height="22" rx="4" fill="#F1F5F9" stroke="#DC2626" stroke-width="1.5"/>
    <text x="${xm}" y="44" fill="#DC2626" font-size="13" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">F = 10 kN</text>
    <text x="200" y="235" fill="#475569" font-size="12" text-anchor="middle">Linha indeformada → linha elástica (valores ilustrativos)</text>
  `;
}

function renderM1C2(svg, t) {
  let amp = 0, broken = false;
  if (t < 0.78) { const grow = t / 0.78; amp = (grow * grow) * 38; }
  else if (t < 0.94) { broken = true; amp = 38; }
  const freq = t * Math.PI * 14;
  const yDeck = 145, xL = 55, xR = 345;
  let deckPts = [];
  for (let i = 0; i <= 40; i++) {
    const s = i / 40;
    const x = xL + (xR - xL) * s;
    const wave = Math.sin(Math.PI * s) * Math.sin(freq) * amp;
    const twist = Math.sin(2 * Math.PI * s) * Math.cos(freq) * (amp * 0.45);
    deckPts.push({ x, y: yDeck + wave + twist });
  }
  const leftHalf = deckPts.slice(0, 21).map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const rightHalf = deckPts.slice(20).map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  svg.innerHTML = `
    <text x="200" y="20" fill="#0F172A" font-size="13" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">TACOMA NARROWS (1940)</text>
    <g opacity="${0.5 + 0.5 * Math.min(1, t * 1.4)}">
      ${arrowLine(18, 105, 55, 112, "#0284C7", 2.2, 7)}
      ${arrowLine(18, 130, 55, 137, "#0284C7", 2.2, 7)}
      <text x="15" y="95" fill="#0284C7" font-size="12" font-family="JetBrains Mono" font-weight="bold">VENTO</text>
    </g>
    <rect x="105" y="70" width="9" height="140" fill="#94A3B8" stroke="#475569"/>
    <rect x="286" y="70" width="9" height="140" fill="#94A3B8" stroke="#475569"/>
    <path d="M 55,145 Q 80,105 110,73 Q 200,140 290,73 Q 320,105 345,145" fill="none" stroke="#475569" stroke-width="2"/>
    ${!broken ? `
      <polyline points="${deckPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}" fill="none" stroke="${amp > 20 ? '#DC2626' : '#CA8A04'}" stroke-width="5" stroke-linecap="round"/>
    ` : `
      <polyline points="${leftHalf}" fill="none" stroke="#DC2626" stroke-width="5" transform="rotate(14, 110, 145)"/>
      <polyline points="${rightHalf}" fill="none" stroke="#DC2626" stroke-width="5" transform="rotate(-14, 290, 145)"/>
      <rect x="115" y="40" width="170" height="26" rx="6" fill="#FEE2E2" stroke="#DC2626" stroke-width="2"/>
      <text x="200" y="58" fill="#DC2626" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">COLAPSO</text>
    `}
    <rect x="100" y="220" width="200" height="24" rx="5" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="200" y="236" fill="${amp > 20 ? '#DC2626' : '#16A34A'}" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
      ${broken ? "FLUTTER AEROELÁSTICO" : `Amplitude: ${Math.round((amp / 38) * 100)}%`}
    </text>
  `;
}

function renderM1C3(svg, t) {
  const isEuler = t >= 0.48;
  const localT = isEuler ? (t - 0.48) / 0.52 : t / 0.48;
  const w = Math.sin(localT * Math.PI);
  svg.innerHTML = `
    <rect x="15" y="15" width="180" height="28" rx="6" fill="${!isEuler ? 'rgba(202,138,4,0.18)' : '#F1F5F9'}" stroke="${!isEuler ? '#CA8A04' : '#CBD5E1'}"/>
    <text x="105" y="34" fill="${!isEuler ? '#CA8A04' : '#94A3B8'}" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">1638 · GALILEU</text>
    <rect x="205" y="15" width="180" height="28" rx="6" fill="${isEuler ? 'rgba(22,163,74,0.18)' : '#F1F5F9'}" stroke="${isEuler ? '#16A34A' : '#CBD5E1'}"/>
    <text x="295" y="34" fill="${isEuler ? '#16A34A' : '#94A3B8'}" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">1750 · EULER-BERNOULLI</text>
    <g opacity="${!isEuler ? 1 : 0.35}">
      <rect x="30" y="65" width="12" height="130" fill="#CBD5E1" stroke="#94A3B8"/>
      <rect x="42" y="95" width="95" height="70" fill="rgba(202,138,4,0.12)" stroke="#CA8A04" stroke-width="2"/>
      ${[105, 122, 139, 156].map(y => arrowLine(42, y, 42 + 24 + w * 12, y, "#DC2626", 2, 6)).join("")}
      <text x="100" y="185" fill="#CA8A04" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">Tensão uniforme</text>
      <text x="100" y="200" fill="#64748B" font-size="10" text-anchor="middle">(incorreto)</text>
    </g>
    <g opacity="${isEuler ? 1 : 0.35}">
      <rect x="220" y="65" width="12" height="130" fill="#CBD5E1" stroke="#94A3B8"/>
      <rect x="232" y="95" width="95" height="70" fill="rgba(2,132,199,0.12)" stroke="#0284C7" stroke-width="2"/>
      <line x1="232" y1="130" x2="327" y2="130" stroke="#CA8A04" stroke-width="2" stroke-dasharray="4,3"/>
      ${arrowLine(232, 102, 232 + 22 + w * 14, 102, "#DC2626", 2, 6)}
      ${arrowLine(232, 116, 232 + 11 + w * 7, 116, "#DC2626", 2, 6)}
      ${arrowLine(232 + 11 + w * 7, 144, 232, 144, "#0284C7", 2, 6)}
      ${arrowLine(232 + 22 + w * 14, 158, 232, 158, "#0284C7", 2, 6)}
      <text x="290" y="185" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">Linear + L.N.</text>
      <text x="290" y="200" fill="#64748B" font-size="10" text-anchor="middle">(correto)</text>
    </g>
    <text x="200" y="235" fill="#334155" font-size="12" text-anchor="middle">
      ${!isEuler ? "Galileu: tensão uniforme (não há L.N.)" : "Euler-Bernoulli: seções planas → deformação linear"}
    </text>
  `;
}

// ===== MÓDULO 2 =====
function renderM2C1(svg, t) {
  const w = pulseWave(t);
  const dx = w * 28, angle = w * 8;
  svg.innerHTML = `
    <text x="200" y="20" fill="#0F172A" font-size="13" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">APOIO MÓVEL (ROLETE)</text>
    <line x1="70" y1="190" x2="330" y2="190" stroke="#94A3B8" stroke-width="3"/>
    <g transform="translate(${dx}, 0)">
      <g transform="rotate(${angle}, 170, 145)">
        <rect x="90" y="120" width="200" height="22" rx="4" fill="rgba(2,132,199,0.18)" stroke="#0284C7" stroke-width="2.5"/>
        <text x="190" y="135" fill="#1E293B" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">VIGA</text>
      </g>
      <polygon points="170,145 155,170 185,170" fill="rgba(2,132,199,0.2)" stroke="#0284C7" stroke-width="2"/>
      <circle cx="170" cy="145" r="4" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
      <circle cx="162" cy="178" r="6" fill="#F8FAFC" stroke="#16A34A" stroke-width="2"/>
      <circle cx="178" cy="178" r="6" fill="#F8FAFC" stroke="#16A34A" stroke-width="2"/>
      ${arrowLine(170, 235, 170, 196, "#16A34A", 3.5, 9)}
      <text x="182" y="225" fill="#16A34A" font-size="12" font-family="JetBrains Mono" font-weight="bold">Ry</text>
    </g>
    ${arrowLine(120, 95, 220, 95, "#CA8A04", 2.5, 8)}
    <text x="170" y="85" fill="#CA8A04" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">Δx LIVRE</text>
    <rect x="15" y="215" width="175" height="26" rx="5" fill="#F1F5F9" stroke="#16A34A" stroke-width="1.5"/>
    <text x="102" y="233" fill="#16A34A" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">1 reação: Ry</text>
  `;
}

function renderM2C2(svg, t) {
  const w = pulseWave(t);
  const bend = w * 18;
  // VIGA BIApoiada (pino + rolete) — evita mecanismo
  let topPts = [], botPts = [];
  const x0 = 55, x1 = 345, y0 = 135, h = 10;
  for (let i = 0; i <= 25; i++) {
    const s = i / 25;
    const x = x0 + (x1 - x0) * s;
    const dy = bend * Math.sin(Math.PI * s);
    topPts.push(`${x.toFixed(1)},${(y0 + dy - h).toFixed(1)}`);
    botPts.unshift(`${x.toFixed(1)},${(y0 + dy + h).toFixed(1)}`);
  }
  svg.innerHTML = `
    <text x="200" y="20" fill="#0F172A" font-size="13" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">APOIO FIXO + ROLETE (BIAPOIADA)</text>
    <polygon points="${topPts.concat(botPts).join(" ")}" fill="rgba(2,132,199,0.18)" stroke="#0284C7" stroke-width="2.5"/>
    ${pinSupport(x0, y0 + h)}
    ${rollerSupport(x1, y0 + h)}
    ${arrowLine(200, 60, 200, y0 + bend - h - 4, "#DC2626", 3.5, 9)}
    <rect x="160" y="34" width="80" height="22" rx="4" fill="#F1F5F9" stroke="#DC2626" stroke-width="1.5"/>
    <text x="200" y="50" fill="#DC2626" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">F = 10 kN</text>
    ${arrowLine(x0, y0 + 70, x0, y0 + 42, "#16A34A", 3, 8)}
    <text x="${x0}" y="${y0 + 84}" fill="#16A34A" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">Ry = 5</text>
    ${arrowLine(x1, y0 + 70, x1, y0 + 42, "#16A34A", 3, 8)}
    <text x="${x1}" y="${y0 + 84}" fill="#16A34A" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">Ry = 5</text>
    <text x="${x0}" y="${y0 + 110}" fill="#64748B" font-size="11" font-family="JetBrains Mono" text-anchor="middle">Rx = 0</text>
    <rect x="15" y="215" width="175" height="26" rx="5" fill="#F1F5F9" stroke="#16A34A" stroke-width="1.5"/>
    <text x="102" y="233" fill="#16A34A" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">2 reações: Rx, Ry</text>
    <text x="200" y="235" fill="#475569" font-size="11" text-anchor="middle">Carga vertical → Rx = 0 por equilíbrio</text>
  `;
}

function renderM2C3(svg, t) {
  const w = holdWave(t);
  const tipDrop = w * 30;
  let topPts = [], botPts = [];
  const x0 = 105, x1 = 340, y0 = 130, h = 12;
  for (let i = 0; i <= 25; i++) {
    const s = i / 25;
    const x = x0 + (x1 - x0) * s;
    const dy = tipDrop * (1.5 * s * s - 0.5 * s * s * s);
    topPts.push(`${x.toFixed(1)},${(y0 + dy - h).toFixed(1)}`);
    botPts.unshift(`${x.toFixed(1)},${(y0 + dy + h).toFixed(1)}`);
  }
  svg.innerHTML = `
    <text x="200" y="20" fill="#0F172A" font-size="13" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">ENGASTE (BALANÇO)</text>
    <rect x="45" y="55" width="60" height="155" rx="4" fill="#CBD5E1" stroke="#0284C7" stroke-width="2.5"/>
    <text x="75" y="80" fill="#475569" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">PAREDE</text>
    <polygon points="${topPts.concat(botPts).join(" ")}" fill="rgba(2,132,199,0.18)" stroke="#0284C7" stroke-width="2.5"/>
    ${arrowLine(330, 50 + tipDrop, 330, y0 + tipDrop - h - 4, "#DC2626", 3.5, 9)}
    <text x="330" y="40" fill="#DC2626" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">F</text>
    ${w > 0.05 ? `
      ${arrowLine(93, 205, 93, 155, "#16A34A", 3, 8)}
      <text x="83" y="195" fill="#16A34A" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="end">Ry</text>
      <path d="M 120,95 A 30,30 0 0,0 120,160" fill="none" stroke="#CA8A04" stroke-width="3"/>
      <polygon points="120,95 114,103 126,102" fill="#CA8A04"/>
      <text x="140" y="88" fill="#CA8A04" font-size="12" font-family="JetBrains Mono" font-weight="bold">M reativo</text>
    ` : ""}
    <rect x="200" y="215" width="185" height="26" rx="5" fill="#F1F5F9" stroke="#CA8A04" stroke-width="1.5"/>
    <text x="292" y="233" fill="#CA8A04" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">3 reações: Rx=0, Ry, M</text>
  `;
}

// ===== MÓDULO 3 =====
function renderM3C1(svg, t) {
  const isDist = t >= 0.5;
  const localT = isDist ? (t - 0.5) / 0.5 : t / 0.5;
  const w = Math.sin(localT * Math.PI);
  const maxDeflect = isDist ? 22 : 34;
  const bend = w * maxDeflect;
  const x0 = 60, x1 = 340, y0 = 140, h = 10;
  let topPts = [], botPts = [];
  for (let i = 0; i <= 30; i++) {
    const s = i / 30;
    const x = x0 + (x1 - x0) * s;
    const dy = bend * Math.sin(Math.PI * s);
    topPts.push(`${x.toFixed(1)},${(y0 + dy - h).toFixed(1)}`);
    botPts.unshift(`${x.toFixed(1)},${(y0 + dy + h).toFixed(1)}`);
  }
  let distArrows = "";
  if (isDist) {
    for (let i = 0; i < 9; i++) {
      const s = i / 8;
      const ax = x0 + 12 + (x1 - x0 - 24) * s;
      const beamTop = y0 + bend * Math.sin(Math.PI * s) - h - 3;
      distArrows += arrowLine(ax, 65, ax, beamTop, "#DC2626", 2, 6);
    }
    distArrows += `<line x1="${x0 + 12}" y1="65" x2="${x1 - 12}" y2="65" stroke="#DC2626" stroke-width="2.5"/>`;
  }
  svg.innerHTML = `
    <rect x="15" y="15" width="180" height="26" rx="5" fill="${!isDist ? 'rgba(220,38,38,0.18)' : '#F1F5F9'}" stroke="${!isDist ? '#DC2626' : '#CBD5E1'}"/>
    <text x="105" y="32" fill="${!isDist ? '#DC2626' : '#94A3B8'}" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">PONTUAL F = 10 kN</text>
    <rect x="205" y="15" width="180" height="26" rx="5" fill="${isDist ? 'rgba(220,38,38,0.18)' : '#F1F5F9'}" stroke="${isDist ? '#DC2626' : '#CBD5E1'}"/>
    <text x="295" y="32" fill="${isDist ? '#DC2626' : '#94A3B8'}" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">DISTRIB. q = 2,5 kN/m</text>
    ${!isDist ? `
      ${arrowLine(200, 55, 200, y0 + bend - h - 4, "#DC2626", 3.5, 9)}
    ` : `
      ${distArrows}
    `}
    <polygon points="${topPts.concat(botPts).join(" ")}" fill="rgba(2,132,199,0.18)" stroke="#0284C7" stroke-width="2.5"/>
    ${pinSupport(x0, y0 + h)}
    ${rollerSupport(x1, y0 + h)}
    ${arrowLine(x0, y0 + 62, x0, y0 + 36, "#16A34A", 2.8, 8)}
    ${arrowLine(x1, y0 + 62, x1, y0 + 36, "#16A34A", 2.8, 8)}
    <text x="${x0}" y="${y0 + 76}" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">5 kN</text>
    <text x="${x1}" y="${y0 + 76}" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">5 kN</text>
    <rect x="100" y="215" width="200" height="26" rx="5" fill="#F1F5F9" stroke="#CA8A04" stroke-width="1.5"/>
    <text x="200" y="233" fill="#CA8A04" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
      Flecha ${isDist ? "distrib." : "pontual"} = ${(bend * 0.45).toFixed(1)} mm
    </text>
    <text x="200" y="248" fill="#64748B" font-size="10" text-anchor="middle">Valores ilustrativos</text>
  `;
}

function renderM3C2(svg, t) {
  let stage = 0;
  if (t < 0.2) stage = 0;
  else if (t < 0.4) stage = 1;
  else if (t < 0.65) stage = 2;
  else if (t < 0.85) stage = 3;
  const mass = stage * 200;
  const delta = stage * 10;
  const deltaMM = (stage * 4.2).toFixed(1);
  const x0 = 70, x1 = 330, xm = 200, y0 = 135, h = 8;
  let topPts = [], botPts = [];
  for (let i = 0; i <= 28; i++) {
    const s = i / 28;
    const x = x0 + (x1 - x0) * s;
    const dy = delta * Math.sin(Math.PI * s);
    topPts.push(`${x.toFixed(1)},${(y0 + dy - h).toFixed(1)}`);
    botPts.unshift(`${x.toFixed(1)},${(y0 + dy + h).toFixed(1)}`);
  }
  let weightsSVG = "";
  for (let k = 0; k < stage; k++) {
    const wy = y0 + delta - h - 14 * (k + 1);
    weightsSVG += `
      <rect x="${xm - 20}" y="${wy}" width="40" height="12" rx="2" fill="#DC2626" stroke="#FCA5A5" stroke-width="1.2"/>
      <text x="${xm}" y="${wy + 9}" fill="#FFFFFF" font-size="9" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">200g</text>
    `;
  }
  svg.innerHTML = `
    <text x="200" y="20" fill="#0F172A" font-size="13" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">ENSAIO NA MAQUETE</text>
    <rect x="35" y="190" width="330" height="12" rx="3" fill="#CBD5E1" stroke="#94A3B8"/>
    <rect x="60" y="140" width="18" height="52" fill="#E2E8F0" stroke="#0284C7" stroke-width="1.8"/>
    <rect x="322" y="140" width="18" height="52" fill="#E2E8F0" stroke="#0284C7" stroke-width="1.8"/>
    <rect x="225" y="110" width="12" height="80" fill="#F1F5F9" stroke="#94A3B8"/>
    ${[122, 134, 146, 158, 170].map(ry => `<line x1="225" y1
