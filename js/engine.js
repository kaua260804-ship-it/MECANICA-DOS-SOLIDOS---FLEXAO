/* =========================================================
   engine.js — Motor de renderização SVG + Helpers
   (Animações originais do Gemini adaptadas para o nosso fluxo)
   ========================================================= */

// Helpers de Easing
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function pulseWave(t) { return 0.5 - 0.5 * Math.cos(t * Math.PI * 2); }
function holdWave(t) {
  if (t < 0.32) { const x = t / 0.32; return x * x * (3 - 2 * x); }
  else if (t < 0.68) { return 1; }
  else if (t < 0.92) { const x = 1 - (t - 0.68) / 0.24; return x * x * (3 - 2 * x); }
  return 0;
}

// Helpers SVG
function arrowLine(x1, y1, x2, y2, color, width = 2.5, headSize = 7) {
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
  const bend = w * 46;
  const x0 = 85, x1 = 395, xm = 240, y0 = 155, h = 12;
  let topPts = [], botPts = [], neutralPts = [];
  for (let i = 0; i <= 32; i++) {
    const s = i / 32;
    const x = x0 + (x1 - x0) * s;
    const dy = bend * Math.sin(Math.PI * s);
    const slope = (bend * Math.PI / (x1 - x0)) * Math.cos(Math.PI * s);
    const nx = -slope, ny = 1, len = Math.hypot(nx, ny);
    const ux = (nx / len) * h, uy = (ny / len) * h;
    neutralPts.push(`${x.toFixed(1)},${(y0 + dy).toFixed(1)}`);
    topPts.push(`${(x - ux).toFixed(1)},${(y0 + dy - uy).toFixed(1)}`);
    botPts.unshift(`${(x + ux).toFixed(1)},${(y0 + dy + uy).toFixed(1)}`);
  }
  const forceY = 65 + w * 28;
  const forceVal = (w * 12).toFixed(1);
  svg.innerHTML = `
    <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="5,5"/>
    <text x="${x1 - 5}" y="${y0 - 16}" fill="#64748B" font-size="10" font-family="JetBrains Mono" text-anchor="end">Eixo Indeformado</text>
    <polygon points="${topPts.concat(botPts).join(" ")}" fill="rgba(2,132,199,0.18)" stroke="#0284C7" stroke-width="2.2"/>
    <polyline points="${neutralPts.join(" ")}" fill="none" stroke="#CA8A04" stroke-width="2" stroke-dasharray="4,3"/>
    ${pinSupport(x0, y0 + h)}
    ${rollerSupport(x1, y0 + h)}
    ${arrowLine(xm, forceY, xm, y0 + bend - h - 4, "#DC2626", 3.2, 9)}
    <rect x="${xm - 48}" y="${forceY - 26}" width="96" height="20" rx="4" fill="#F1F5F9" stroke="#DC2626" stroke-width="1"/>
    <text x="${xm}" y="${forceY - 12}" fill="#DC2626" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">F = ${forceVal} kN</text>
    ${w > 0.08 ? `
      <line x1="${xm + 16}" y1="${y0}" x2="${xm + 16}" y2="${y0 + bend}" stroke="#CA8A04" stroke-width="1.5"/>
      <line x1="${xm + 11}" y1="${y0}" x2="${xm + 21}" y2="${y0}" stroke="#CA8A04" stroke-width="1.5"/>
      <line x1="${xm + 11}" y1="${y0 + bend}" x2="${xm + 21}" y2="${y0 + bend}" stroke="#CA8A04" stroke-width="1.5"/>
      <text x="${xm + 26}" y="${y0 + bend / 2 + 4}" fill="#CA8A04" font-size="11" font-family="JetBrains Mono" font-weight="bold">δ = ${(w * 18.5).toFixed(1)} mm</text>
    ` : ""}
    ${w > 0.05 ? `
      ${arrowLine(x0, y0 + 68, x0, y0 + 42, "#16A34A", 2.4, 7)}
      <text x="${x0}" y="${y0 + 82}" fill="#16A34A" font-size="10" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">R1=${(w * 6).toFixed(1)}kN</text>
      ${arrowLine(x1, y0 + 68, x1, y0 + 42, "#16A34A", 2.4, 7)}
      <text x="${x1}" y="${y0 + 82}" fill="#16A34A" font-size="10" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">R2=${(w * 6).toFixed(1)}kN</text>
    ` : ""}
    <text x="240" y="282" fill="#475569" font-size="11" font-family="Inter" text-anchor="middle">Carga Transversal → Momento Fletor → Curvatura Elástica</text>
  `;
}

function renderM1C2(svg, t) {
  let amp = 0, broken = false;
  if (t < 0.78) { const grow = t / 0.78; amp = (grow * grow) * 42; }
  else if (t < 0.94) { broken = true; amp = 42; }
  const freq = t * Math.PI * 14;
  const yDeck = 165, xL = 70, xR = 410;
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
    <g opacity="${0.4 + 0.6 * Math.min(1, t * 1.4)}">
      ${arrowLine(25, 115, 75, 125, "#0284C7", 2, 6)}
      ${arrowLine(20, 145, 70, 155, "#0284C7", 2, 6)}
      <text x="22" y="102" fill="#0284C7" font-size="10" font-family="JetBrains Mono">VENTO / CARGA</text>
    </g>
    <rect x="125" y="75" width="10" height="155" fill="#94A3B8" stroke="#475569" stroke-width="1.5"/>
    <rect x="345" y="75" width="10" height="155" fill="#94A3B8" stroke="#475569" stroke-width="1.5"/>
    <path d="M 70,165 Q 100,120 130,78 Q 240,155 350,78 Q 380,120 410,165" fill="none" stroke="#475569" stroke-width="2"/>
    ${!broken ? `
      <polyline points="${deckPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}" fill="none" stroke="${amp > 24 ? '#DC2626' : '#CA8A04'}" stroke-width="5" stroke-linecap="round"/>
    ` : `
      <polyline points="${leftHalf}" fill="none" stroke="#DC2626" stroke-width="5" transform="rotate(14, 130, 165)"/>
      <polyline points="${rightHalf}" fill="none" stroke="#DC2626" stroke-width="5" transform="rotate(-14, 350, 165)"/>
      <rect x="155" y="45" width="170" height="28" rx="6" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.5"/>
      <text x="240" y="63" fill="#DC2626" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">COLAPSO POR RESSONÂNCIA</text>
    `}
    <rect x="150" y="242" width="180" height="24" rx="5" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="240" y="258" fill="${amp > 24 ? '#DC2626' : '#16A34A'}" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
      Amplitude Flexão: ${broken ? "RUPTURA!" : Math.round((amp / 42) * 100) + "%"}
    </text>
  `;
}

function renderM1C3(svg, t) {
  const isEuler = t >= 0.48;
  const localT = isEuler ? (t - 0.48) / 0.52 : t / 0.48;
  const w = Math.sin(localT * Math.PI);
  svg.innerHTML = `
    <rect x="24" y="18" width="205" height="28" rx="6" fill="${!isEuler ? 'rgba(202,138,4,0.18)' : '#F1F5F9'}" stroke="${!isEuler ? '#CA8A04' : '#CBD5E1'}"/>
    <text x="126" y="36" fill="${!isEuler ? '#CA8A04' : '#94A3B8'}" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">1638 • GALILEU GALILEI</text>
    <rect x="251" y="18" width="205" height="28" rx="6" fill="${isEuler ? 'rgba(22,163,74,0.18)' : '#F1F5F9'}" stroke="${isEuler ? '#16A34A' : '#CBD5E1'}"/>
    <text x="353" y="36" fill="${isEuler ? '#16A34A' : '#94A3B8'}" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">1750 • EULER-BERNOULLI</text>
    <g opacity="${!isEuler ? 1 : 0.35}">
      <rect x="42" y="75" width="14" height="145" fill="#CBD5E1" stroke="#94A3B8"/>
      <rect x="56" y="110" width="110" height="75" fill="rgba(202,138,4,0.12)" stroke="#CA8A04" stroke-width="1.8"/>
      ${[120, 138, 156, 174].map(y => arrowLine(56, y, 56 + 26 + w * 14, y, "#DC2626", 2, 5)).join("")}
      <text x="115" y="206" fill="#CA8A04" font-size="10" font-family="JetBrains Mono" text-anchor="middle">Tensão Uniforme (Incorreto)</text>
      <text x="115" y="220" fill="#64748B" font-size="9.5" text-anchor="middle">Ignorava a Compressão</text>
    </g>
    <g opacity="${isEuler ? 1 : 0.35}">
      <rect x="272" y="75" width="14" height="145" fill="#CBD5E1" stroke="#94A3B8"/>
      <rect x="286" y="110" width="110" height="75" fill="rgba(2,132,199,0.12)" stroke="#0284C7" stroke-width="1.8"/>
      <line x1="286" y1="147.5" x2="405" y2="147.5" stroke="#CA8A04" stroke-width="1.5" stroke-dasharray="4,3"/>
      ${arrowLine(286, 118, 286 + 24 + w * 16, 118, "#DC2626", 2, 5)}
      ${arrowLine(286, 132, 286 + 12 + w * 8, 132, "#DC2626", 1.8, 4)}
      ${arrowLine(286 + 12 + w * 8, 163, 286, 163, "#0284C7", 1.8, 4)}
      ${arrowLine(286 + 24 + w * 16, 177, 286, 177, "#0284C7", 2, 5)}
      <text x="348" y="206" fill="#16A34A" font-size="10" font-family="JetBrains Mono" text-anchor="middle">Perfil Linear (σ = -My/I)</text>
      <text x="348" y="220" fill="#64748B" font-size="9.5" text-anchor="middle">Seções Planas + Tração/Comp.</text>
    </g>
    <text x="240" y="276" fill="#334155" font-size="11" text-anchor="middle">
      ${!isEuler ? "Galileu supôs tração constante em toda a altura da seção" : "Euler-Bernoulli definiu a Linha Neutra e a variação linear"}
    </text>
  `;
}

// ===== MÓDULO 2 =====
function renderM2C1(svg, t) {
  const w = pulseWave(t);
  const dx = w * 32, angle = w * 10;
  svg.innerHTML = `
    <line x1="90" y1="215" x2="390" y2="215" stroke="#94A3B8" stroke-width="3"/>
    <text x="240" y="236" fill="#64748B" font-size="10.5" font-family="JetBrains Mono" text-anchor="middle">PILAR DE PONTE / APOIO DE NEOPRENE</text>
    <g transform="translate(${dx}, 0)">
      <g transform="rotate(${angle}, 190, 170)">
        <rect x="110" y="142" width="230" height="24" rx="4" fill="rgba(2,132,199,0.18)" stroke="#0284C7" stroke-width="2.2"/>
        <text x="225" y="158" fill="#1E293B" font-size="10.5" font-family="JetBrains Mono" text-anchor="middle">VIGA LONGARINA</text>
      </g>
      <polygon points="190,170 174,196 206,196" fill="rgba(2,132,199,0.2)" stroke="#0284C7" stroke-width="2"/>
      <circle cx="190" cy="170" r="4" fill="#FFFFFF" stroke="#0284C7" stroke-width="2"/>
      <circle cx="180" cy="204" r="6.5" fill="#F8FAFC" stroke="#16A34A" stroke-width="2"/>
      <circle cx="200" cy="204" r="6.5" fill="#F8FAFC" stroke="#16A34A" stroke-width="2"/>
      ${arrowLine(190, 268, 190, 222, "#16A34A", 3, 8)}
      <text x="202" y="258" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold">Ry (Bloqueado)</text>
    </g>
    ${arrowLine(155, 115, 225, 115, "#CA8A04", 2.5, 7)}
    <text x="190" y="105" fill="#CA8A04" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">Δx LIVRE (Dilatação)</text>
    <path d="M 275,130 A 35,35 0 0,1 285,165" fill="none" stroke="#CA8A04" stroke-width="2" stroke-dasharray="3,2"/>
    <text x="325" y="132" fill="#CA8A04" font-size="11" font-family="JetBrains Mono" font-weight="bold">θ LIVRE</text>
    <rect x="24" y="20" width="195" height="26" rx="5" fill="#F1F5F9" stroke="#16A34A"/>
    <text x="121" y="37" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">1 REAÇÃO: Apenas Ry ≠ 0</text>
  `;
}

function renderM2C2(svg, t) {
  const w = pulseWave(t);
  const angle = w * 14;
  svg.innerHTML = `
    <rect x="135" y="208" width="90" height="16" rx="3" fill="#CBD5E1" stroke="#0284C7" stroke-width="1.8"/>
    ${pinSupport(180, 172, "#0284C7")}
    <g transform="rotate(${angle}, 180, 172)">
      <rect x="165" y="146" width="245" height="24" rx="4" fill="rgba(2,132,199,0.18)" stroke="#0284C7" stroke-width="2.2"/>
      <text x="290" y="162" fill="#1E293B" font-size="10.5" font-family="JetBrains Mono" text-anchor="middle">PORTÃO / VIGA ARTICULADA</text>
      ${arrowLine(375, 85, 345, 142, "#DC2626", 3, 8)}
      <text x="382" y="78" fill="#DC2626" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">F Inclinada</text>
    </g>
    ${arrowLine(180, 268, 180, 228, "#16A34A", 3, 8)}
    <text x="190" y="260" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold">Ry</text>
    ${arrowLine(85, 172, 152, 172, "#16A34A", 3, 8)}
    <text x="115" y="162" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">Rx</text>
    <path d="M 245,132 A 45,45 0 0,1 255,178" fill="none" stroke="#CA8A04" stroke-width="2.2"/>
    <text x="268" y="128" fill="#CA8A04" font-size="11" font-family="JetBrains Mono" font-weight="bold">θ LIVRE (M = 0)</text>
    <rect x="24" y="20" width="210" height="26" rx="5" fill="#F1F5F9" stroke="#16A34A"/>
    <text x="129" y="37" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">2 REAÇÕES: Rx ≠ 0 e Ry ≠ 0</text>
  `;
}

function renderM2C3(svg, t) {
  const w = holdWave(t);
  const tipDrop = w * 34;
  let topPts = [], botPts = [];
  const x0 = 120, x1 = 385, y0 = 148, h = 13;
  for (let i = 0; i <= 25; i++) {
    const s = i / 25;
    const x = x0 + (x1 - x0) * s;
    const dy = tipDrop * (1.5 * s * s - 0.5 * s * s * s);
    topPts.push(`${x.toFixed(1)},${(y0 + dy - h).toFixed(1)}`);
    botPts.unshift(`${x.toFixed(1)},${(y0 + dy + h).toFixed(1)}`);
  }
  svg.innerHTML = `
    <rect x="55" y="65" width="65" height="175" rx="4" fill="#CBD5E1" stroke="#0284C7" stroke-width="2"/>
    <text x="87" y="90" fill="#475569" font-size="10" font-family="JetBrains Mono" text-anchor="middle">PILAR /</text>
    <text x="87" y="103" fill="#475569" font-size="10" font-family="JetBrains Mono" text-anchor="middle">PAREDE</text>
    <polygon points="${topPts.concat(botPts).join(" ")}" fill="rgba(2,132,199,0.18)" stroke="#0284C7" stroke-width="2.2"/>
    <text x="235" y="${y0 + tipDrop * 0.35 + 4}" fill="#1E293B" font-size="10.5" font-family="JetBrains Mono" text-anchor="middle">MARQUISE / BALANÇO</text>
    ${arrowLine(375, 65 + tipDrop, 375, y0 + tipDrop - h - 4, "#DC2626", 3.2, 8)}
    <text x="375" y="${56 + tipDrop}" fill="#DC2626" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">F (Ponta)</text>
    ${w > 0.05 ? `
      ${arrowLine(108, 225, 108, 175, "#16A34A", 2.8, 7)}
      <text x="95" y="218" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="end">Ry</text>
      ${arrowLine(22, 148, 52, 148, "#16A34A", 2.8, 7)}
      <text x="35" y="138" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">Rx</text>
      <path d="M 142,115 A 34,34 0 0,0 142,182" fill="none" stroke="#CA8A04" stroke-width="3"/>
      <polygon points="142,115 135,124 148,123" fill="#CA8A04"/>
      <text x="165" y="106" fill="#CA8A04" font-size="11" font-family="JetBrains Mono" font-weight="bold">M Reativo (θ = 0)</text>
    ` : ""}
    <rect x="230" y="20" width="225" height="26" rx="5" fill="#F1F5F9" stroke="#CA8A04"/>
    <text x="342" y="37" fill="#CA8A04" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">3 REAÇÕES: Rx, Ry e Momento M</text>
  `;
}

// ===== MÓDULO 3 =====
function renderM3C1(svg, t) {
  const isDist = t >= 0.5;
  const localT = isDist ? (t - 0.5) / 0.5 : t / 0.5;
  const w = Math.sin(localT * Math.PI);
  const maxDeflect = isDist ? 24 : 38;
  const bend = w * maxDeflect;
  const x0 = 80, x1 = 400, y0 = 165, h = 11;
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
      distArrows += arrowLine(ax, 82, ax, beamTop, "#DC2626", 2, 5);
    }
    distArrows += `<line x1="${x0 + 12}" y1="82" x2="${x1 - 12}" y2="82" stroke="#DC2626" stroke-width="2.5"/>`;
  }
  svg.innerHTML = `
    <rect x="24" y="18" width="205" height="26" rx="5" fill="${!isDist ? 'rgba(220,38,38,0.18)' : '#F1F5F9'}" stroke="${!isDist ? '#DC2626' : '#CBD5E1'}"/>
    <text x="126" y="35" fill="${!isDist ? '#DC2626' : '#94A3B8'}" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">CARGA PONTUAL (F = 10kN)</text>
    <rect x="251" y="18" width="205" height="26" rx="5" fill="${isDist ? 'rgba(220,38,38,0.18)' : '#F1F5F9'}" stroke="${isDist ? '#DC2626' : '#CBD5E1'}"/>
    <text x="353" y="35" fill="${isDist ? '#DC2626' : '#94A3B8'}" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">DISTRIBUÍDA (q = 2.5kN/m)</text>
    ${!isDist ? `
      ${arrowLine(240, 72, 240, y0 + bend - h - 4, "#DC2626", 3.5, 9)}
      <text x="240" y="64" fill="#DC2626" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">F = 10 kN (Concentrada)</text>
    ` : `
      ${distArrows}
      <text x="240" y="72" fill="#DC2626" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">q = 2.5 kN/m × 4m = 10 kN</text>
    `}
    <polygon points="${topPts.concat(botPts).join(" ")}" fill="rgba(2,132,199,0.18)" stroke="#0284C7" stroke-width="2"/>
    ${pinSupport(x0, y0 + h)}
    ${rollerSupport(x1, y0 + h)}
    ${arrowLine(x0, y0 + 66, x0, y0 + 40, "#16A34A", 2.4, 7)}
    <text x="${x0}" y="${y0 + 80}" fill="#16A34A" font-size="10.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">R1 = 5.0 kN</text>
    ${arrowLine(x1, y0 + 66, x1, y0 + 40, "#16A34A", 2.4, 7)}
    <text x="${x1}" y="${y0 + 80}" fill="#16A34A" font-size="10.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">R2 = 5.0 kN</text>
    <rect x="145" y="246" width="190" height="26" rx="5" fill="#F1F5F9" stroke="#CA8A04"/>
    <text x="240" y="263" fill="#CA8A04" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
      Flecha Máx δ = ${(bend * 0.45).toFixed(1)} mm
    </text>
  `;
}

function renderM3C2(svg, t) {
  let stage = 0;
  if (t < 0.2) stage = 0;
  else if (t < 0.4) stage = 1;
  else if (t < 0.65) stage = 2;
  else if (t < 0.85) stage = 3;
  const mass = stage * 200;
  const delta = stage * 11;
  const deltaMM = (stage * 4.2).toFixed(1);
  const x0 = 85, x1 = 395, xm = 240, y0 = 152, h = 8;
  let topPts = [], botPts = [];
  for (let i = 0; i <= 28; i++) {
    const s = i / 28;
    const x = x0 + (x1 - x0) * s;
    const dy = delta * Math.sin(Math.PI * s);
    topPts.push(`${x.toFi
