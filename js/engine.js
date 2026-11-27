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
    topPts.push(`${x.toFixed(1)},${(y0 + dy - h).toFixed(1)}`);
    botPts.unshift(`${x.toFixed(1)},${(y0 + dy + h).toFixed(1)}`);
  }
  let weightsSVG = "";
  for (let k = 0; k < stage; k++) {
    const wy = y0 + delta - h - 16 * (k + 1);
    weightsSVG += `
      <rect x="${xm - 24}" y="${wy}" width="48" height="14" rx="2" fill="#DC2626" stroke="#FCA5A5" stroke-width="1.2"/>
      <text x="${xm}" y="${wy + 10.5}" fill="#FFFFFF" font-size="9" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">200g</text>
    `;
  }
  svg.innerHTML = `
    <rect x="45" y="220" width="390" height="16" rx="3" fill="#CBD5E1" stroke="#94A3B8"/>
    <rect x="75" y="160" width="20" height="60" fill="#E2E8F0" stroke="#0284C7" stroke-width="1.8"/>
    <rect x="385" y="160" width="20" height="60" fill="#E2E8F0" stroke="#0284C7" stroke-width="1.8"/>
    <rect x="275" y="128" width="14" height="92" fill="#F1F5F9" stroke="#94A3B8"/>
    ${[140, 152, 164, 176, 188, 200].map(ry => `<line x1="275" y1="${ry}" x2="282" y2="${ry}" stroke="#475569" stroke-width="1.2"/>`).join("")}
    <polygon points="273,${y0 + delta} 262,${y0 + delta - 5} 262,${y0 + delta + 5}" fill="#CA8A04"/>
    <polygon points="${topPts.concat(botPts).join(" ")}" fill="rgba(22,163,74,0.2)" stroke="#16A34A" stroke-width="2"/>
    ${weightsSVG}
    <rect x="302" y="135" width="95" height="54" rx="6" fill="#0F172A" stroke="#CA8A04" stroke-width="1.5"/>
    <text x="349" y="152" fill="#94A3B8" font-size="9" font-family="JetBrains Mono" text-anchor="middle">DEFLECTÔMETRO</text>
    <text x="349" y="170" fill="#FBBF24" font-size="14" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">δ=${deltaMM}mm</text>
    <text x="349" y="182" fill="#34D399" font-size="9" font-family="JetBrains Mono" text-anchor="middle">Carga: ${mass}g</text>
    <text x="240" y="34" fill="#0F172A" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
      ENSAIO NA MAQUETE: PROPORCIONALIDADE CARGA × FLECHA
    </text>
    <text x="240" y="266" fill="#475569" font-size="11" text-anchor="middle">
      ${stage === 0 ? "Sem carga: retorno completo à posição original (Regime Elástico)" : `Massa aplicada: ${mass}g → Deflexão proporcional medida na régua`}
    </text>
  `;
}

function renderM3C3(svg, t) {
  const w = holdWave(t);
  const shrink = w * 26, stretch = w * 26;
  const cx = 240, cy = 148, halfW = 120, halfH = 56;
  const xTL = cx - halfW + shrink, xTR = cx + halfW - shrink;
  const xBL = cx - halfW - stretch, xBR = cx + halfW + stretch;
  svg.innerHTML = `
    <polygon points="${xTL},${cy - halfH} ${xTR},${cy - halfH} ${cx + halfW},${cy} ${cx - halfW},${cy}" fill="rgba(2,132,199,0.22)" stroke="#0284C7" stroke-width="2"/>
    <polygon points="${cx - halfW},${cy} ${cx + halfW},${cy} ${xBR},${cy + halfH} ${xBL},${cy + halfH}" fill="rgba(220,38,38,0.22)" stroke="#DC2626" stroke-width="2"/>
    <line x1="${cx - halfW - 18}" y1="${cy}" x2="${cx + halfW + 18}" y2="${cy}" stroke="#CA8A04" stroke-width="2.5" stroke-dasharray="6,4"/>
    <rect x="372" y="${cy - 11}" width="88" height="22" rx="4" fill="#F1F5F9" stroke="#CA8A04"/>
    <text x="416" y="${cy + 4}" fill="#CA8A04" font-size="10" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">LINHA NEUTRA</text>
    ${w > 0.05 ? `
      ${arrowLine(xTL - 34, cy - 36, xTL - 4, cy - 36, "#0284C7", 3, 7)}
      ${arrowLine(xTR + 34, cy - 36, xTR + 4, cy - 36, "#0284C7", 3, 7)}
      <text x="${cx}" y="${cy - 32}" fill="#0284C7" font-size="11.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">COMPRESSÃO (-σ) • ENCURTA</text>
      ${arrowLine(xBL + 4, cy + 36, xBL - 32, cy + 36, "#DC2626", 3, 7)}
      ${arrowLine(xBR - 4, cy + 36, xBR + 32, cy + 36, "#DC2626", 3, 7)}
      <text x="${cx}" y="${cy + 40}" fill="#DC2626" font-size="11.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">TRAÇÃO (+σ) • ALONGA</text>
    ` : `
      <text x="${cx}" y="${cy - 28}" fill="#0284C7" font-size="11" font-family="JetBrains Mono" text-anchor="middle">Fibras Superiores (Repouso)</text>
      <text x="${cx}" y="${cy + 36}" fill="#DC2626" font-size="11" font-family="JetBrains Mono" text-anchor="middle">Fibras Inferiores (Repouso)</text>
    `}
    <text x="240" y="254" fill="#CA8A04" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
      Na Linha Neutra: Deformação ε = 0 e Tensão σ = 0
    </text>
  `;
}

// ===== MÓDULO 4 =====
function renderM4C1(svg, t) {
  const w = holdWave(t);
  const maxLen = 15 + w * 85;
  const sigmaMax = (w * 145).toFixed(0);
  const cx = 265, cy = 150, halfH = 82;
  svg.innerHTML = `
    <rect x="24" y="18" width="185" height="30" rx="6" fill="#F1F5F9" stroke="#0284C7"/>
    <text x="116" y="38" fill="#0284C7" font-size="13" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">σ = - (M · y) / I</text>
    <rect x="65" y="${cy - halfH}" width="44" height="${halfH * 2}" fill="rgba(148,163,184,0.18)" stroke="#475569" stroke-width="2"/>
    <line x1="52" y1="${cy}" x2="122" y2="${cy}" stroke="#CA8A04" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="87" y="${cy - halfH - 8}" fill="#475569" font-size="10" font-family="JetBrains Mono" text-anchor="middle">SEÇÃO</text>
    <text x="46" y="${cy + 4}" fill="#CA8A04" font-size="10" font-family="JetBrains Mono" text-anchor="end">y=0</text>
    <line x1="${cx}" y1="${cy - halfH - 12}" x2="${cx}" y2="${cy + halfH + 12}" stroke="#94A3B8" stroke-width="2"/>
    <line x1="${cx - 115}" y1="${cy}" x2="${cx + 115}" y2="${cy}" stroke="#CA8A04" stroke-width="2" stroke-dasharray="5,3"/>
    <polygon points="${cx},${cy} ${cx},${cy - halfH} ${cx - maxLen},${cy - halfH}" fill="rgba(2,132,199,0.22)" stroke="#0284C7" stroke-width="2.2"/>
    <polygon points="${cx},${cy} ${cx},${cy + halfH} ${cx + maxLen},${cy + halfH}" fill="rgba(220,38,38,0.22)" stroke="#DC2626" stroke-width="2.2"/>
    ${arrowLine(cx - maxLen, cy - halfH, cx, cy - halfH, "#0284C7", 2.5, 6)}
    ${arrowLine(cx - maxLen * 0.5, cy - halfH * 0.5, cx, cy - halfH * 0.5, "#0284C7", 1.8, 5)}
    ${arrowLine(cx, cy + halfH * 0.5, cx + maxLen * 0.5, cy + halfH * 0.5, "#DC2626", 1.8, 5)}
    ${arrowLine(cx, cy + halfH, cx + maxLen, cy + halfH, "#DC2626", 2.5, 6)}
    <text x="${cx - maxLen - 6}" y="${cy - halfH - 6}" fill="#0284C7" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="end">-σ_máx = -${sigmaMax} MPa</text>
    <text x="${cx + maxLen + 6}" y="${cy + halfH + 16}" fill="#DC2626" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="start">+σ_máx = +${sigmaMax} MPa</text>
    <text x="${cx + 10}" y="${cy - 6}" fill="#CA8A04" font-size="10" font-family="JetBrains Mono">LN (σ = 0)</text>
  `;
}

function renderM4C2(svg, t) {
  const load = Math.min(1, t / 0.72);
  const cracked = t >= 0.62 && t < 0.94;
  const drop = load * 14;
  const x0 = 85, x1 = 395, y0 = 175, h = 22;
  svg.innerHTML = `
    <rect x="150" y="${42 + drop}" width="180" height="22" rx="4" fill="#CBD5E1" stroke="#475569" stroke-width="2"/>
    <text x="240" y="${57 + drop}" fill="#0F172A" font-size="10" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">PRENSA UNIVERSAL (F/2 + F/2)</text>
    ${arrowLine(188, 66 + drop, 188, y0 - h + drop * 0.4, "#DC2626", 3, 7)}
    ${arrowLine(292, 66 + drop, 292, y0 - h + drop * 0.4, "#DC2626", 3, 7)}
    <rect x="${x0}" y="${y0 - h + drop * 0.3}" width="${x1 - x0}" height="${h * 2}" rx="2" fill="#94A3B8" stroke="#475569" stroke-width="2"/>
    <rect x="188" y="${y0 - h + drop * 0.3}" width="104" height="${h * 2}" fill="rgba(202,138,4,0.18)" stroke="#CA8A04" stroke-dasharray="4,2"/>
    <text x="240" y="${y0 - h - 8 + drop * 0.3}" fill="#CA8A04" font-size="9.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">M = CONSTANTE</text>
    ${cracked ? `
      <polyline points="240,${y0 + h + drop * 0.3} 237,${y0 + 8 + drop * 0.3} 243,${y0 - 4 + drop * 0.3} 239,${y0 - 14 + drop * 0.3}" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round"/>
      <rect x="140" y="236" width="200" height="26" rx="5" fill="#FEE2E2" stroke="#DC2626"/>
      <text x="240" y="253" fill="#DC2626" font-size="10.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">FISSURA POR TRAÇÃO NA BASE!</text>
    ` : `
      <text x="240" y="253" fill="#475569" font-size="11" font-family="JetBrains Mono" text-anchor="middle">
        Carga Aplicada: ${(load * 28.5).toFixed(1)} kN (Concreto Simples)
      </text>
    `}
    ${pinSupport(x0 + 15, y0 + h + drop * 0.3)}
    ${rollerSupport(x1 - 15, y0 + h + drop * 0.3)}
  `;
}

function renderM4C3(svg, t) {
  const w = holdWave(t);
  const gx0 = 85, gy0 = 225, gx1 = 415, gy1 = 55;
  const elasticEndX = 320, elasticEndY = 95;
  const px = gx0 + w * (elasticEndX - gx0);
  const py = gy0 - w * (gy0 - elasticEndY);
  svg.innerHTML = `
    ${arrowLine(gx0, gy0, gx0, gy1 - 10, "#94A3B8", 2, 6)}
    ${arrowLine(gx0, gy0, gx1 + 10, gy0, "#94A3B8", 2, 6)}
    <text x="${gx0 - 12}" y="${gy1}" fill="#0284C7" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="end">σ (MPa)</text>
    <text x="${gx1}" y="${gy0 + 18}" fill="#DC2626" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="end">ε (Deformação)</text>
    <polygon points="${gx0},${gy0} ${elasticEndX},${elasticEndY} ${elasticEndX},${gy0}" fill="rgba(22,163,74,0.12)"/>
    <line x1="${gx0}" y1="${gy0}" x2="${elasticEndX}" y2="${elasticEndY}" stroke="#16A34A" stroke-width="3"/>
    <path d="M ${elasticEndX},${elasticEndY} Q 355,82 405,92" fill="none" stroke="#94A3B8" stroke-width="2" stroke-dasharray="5,4"/>
    <text x="362" y="74" fill="#94A3B8" font-size="9.5" font-family="JetBrains Mono" text-anchor="middle">Escoamento</text>
    <polyline points="150,188 210,188 210,155" fill="none" stroke="#CA8A04" stroke-width="1.5"/>
    <text x="220" y="176" fill="#CA8A04" font-size="10.5" font-family="JetBrains Mono" font-weight="bold">tg(α) = E = σ/ε</text>
    <line x1="${gx0}" y1="${py}" x2="${px}" y2="${py}" stroke="#0284C7" stroke-width="1.2" stroke-dasharray="3,3"/>
    <line x1="${px}" y1="${gy0}" x2="${px}" y2="${py}" stroke="#DC2626" stroke-width="1.2" stroke-dasharray="3,3"/>
    <circle cx="${px}" cy="${py}" r="6.5" fill="#CA8A04" stroke="#FFFFFF" stroke-width="2"/>
    <rect x="115" y="24" width="250" height="28" rx="6" fill="#F1F5F9" stroke="#16A34A"/>
    <text x="240" y="42" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
      σ = ${(w * 210).toFixed(0)} MPa  |  ε = ${(w * 1.05).toFixed(2)}‰ (Linear)
    </text>
  `;
}

// ===== MÓDULO 5 =====
function renderM5C1(svg, t) {
  const w = holdWave(t);
  const bendFlat = w * 48, bendEdge = w * 5;
  svg.innerHTML = `
    <line x1="240" y1="20" x2="240" y2="275" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="120" y="34" fill="#DC2626" font-size="11.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">1. RÉGUA DEITADA</text>
    <text x="120" y="49" fill="#475569" font-size="10" font-family="JetBrains Mono" text-anchor="middle">I = b·h³/12 (Baixo)</text>
    <rect x="92" y="60" width="56" height="12" fill="rgba(220,38,38,0.18)" stroke="#DC2626" stroke-width="1.5"/>
    <path d="M 35,145 Q 120,${145 + bendFlat * 2} 205,145" fill="none" stroke="#DC2626" stroke-width="6" stroke-linecap="round"/>
    ${pinSupport(35, 148, "#475569")}
    ${rollerSupport(205, 148, "#475569")}
    ${arrowLine(120, 92, 120, 140 + bendFlat, "#DC2626", 2.5, 6)}
    <rect x="35" y="218" width="170" height="44" rx="6" fill="#F1F5F9" stroke="#DC2626"/>
    <text x="120" y="236" fill="#DC2626" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">Flecha δ = ${(w * 36).toFixed(1)} mm</text>
    <text x="120" y="252" fill="#475569" font-size="9.5" text-anchor="middle">Baixa rigidez à flexão</text>
    <text x="360" y="34" fill="#16A34A" font-size="11.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">2. RÉGUA EM PÉ</text>
    <text x="360" y="49" fill="#475569" font-size="10" font-family="JetBrains Mono" text-anchor="middle">h³ multiplica I em 25×!</text>
    <rect x="354" y="56" width="12" height="36" fill="rgba(22,163,74,0.18)" stroke="#16A34A" stroke-width="1.5"/>
    <path d="M 275,145 Q 360,${145 + bendEdge * 2} 445,145" fill="none" stroke="#16A34A" stroke-width="14" stroke-linecap="round"/>
    ${pinSupport(275, 152, "#475569")}
    ${rollerSupport(445, 152, "#475569")}
    ${arrowLine(360, 96, 360, 136 + bendEdge, "#DC2626", 2.5, 6)}
    <rect x="275" y="218" width="170" height="44" rx="6" fill="#F1F5F9" stroke="#16A34A"/>
    <text x="360" y="236" fill="#16A34A" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">Flecha δ = ${(w * 1.4).toFixed(1)} mm</text>
    <text x="360" y="252" fill="#475569" font-size="9.5" text-anchor="middle">Mesma massa, 25× mais rígida</text>
  `;
}

function renderM5C2(svg, t) {
  const morph = holdWave(t);
  const cx = 155, cy = 152, halfW = 48, halfH = 76, flangeH = 18;
  const webHalf = halfW - morph * 39;
  const massPct = Math.round(100 - morph * 52);
  const inertiaPct = Math.round(100 - morph * 14);
  svg.innerHTML = `
    <path d="M ${cx - halfW},${cy - halfH} L ${cx + halfW},${cy - halfH} L ${cx + halfW},${cy - halfH + flangeH} L ${cx + webHalf},${cy - halfH + flangeH} L ${cx + webHalf},${cy + halfH - flangeH} L ${cx + halfW},${cy + halfH - flangeH} L ${cx + halfW},${cy + halfH} L ${cx - halfW},${cy + halfH} L ${cx - halfW},${cy + halfH - flangeH} L ${cx - webHalf},${cy + halfH - flangeH} L ${cx - webHalf},${cy - halfH + flangeH} L ${cx - halfW},${cy - halfH + flangeH} Z" fill="rgba(2,132,199,0.22)" stroke="#0284C7" stroke-width="2.4"/>
    <line x1="${cx - 65}" y1="${cy}" x2="${cx + 65}" y2="${cy}" stroke="#CA8A04" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="${cx}" y="${cy - 6}" fill="#CA8A04" font-size="9.5" font-family="JetBrains Mono" text-anchor="middle">σ ≈ 0</text>
    ${morph > 0.15 ? `
      ${arrowLine(cx - halfW - 14, cy, cx - webHalf - 4, cy, "#16A34A", 2, 5)}
      ${arrowLine(cx + halfW + 14, cy, cx + webHalf + 4, cy, "#16A34A", 2, 5)}
    ` : ""}
    <g transform="translate(245, 42)">
      <rect x="0" y="0" width="210" height="215" rx="10" fill="#F8FAFC" stroke="#CBD5E1"/>
      <text x="105" y="26" fill="#0F172A" font-size="11.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
        ${morph < 0.5 ? "SEÇÃO MACIÇA" : "PERFIL I OTIMIZADO"}
      </text>
      <text x="16" y="56" fill="#475569" font-size="10.5" font-family="JetBrains Mono">Massa / Custo Aço:</text>
      <rect x="16" y="64" width="178" height="14" rx="4" fill="#E2E8F0"/>
      <rect x="16" y="64" width="${1.78 * massPct}" height="14" rx="4" fill="${morph > 0.5 ? '#16A34A' : '#DC2626'}"/>
      <text x="194" y="56" fill="${morph > 0.5 ? '#16A34A' : '#DC2626'}" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="end">${massPct}%</text>
      <text x="16" y="106" fill="#475569" font-size="10.5" font-family="JetBrains Mono">Inércia (I) e Módulo (W):</text>
      <rect x="16" y="114" width="178" height="14" rx="4" fill="#E2E8F0"/>
      <rect x="16" y="114" width="${1.78 * inertiaPct}" height="14" rx="4" fill="#0284C7"/>
      <text x="194" y="106" fill="#0284C7" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="end">${inertiaPct}%</text>
      <rect x="14" y="146" width="182" height="54" rx="6" fill="rgba(22,163,74,0.1)" stroke="#16A34A" stroke-width="1"/>
      <text x="105" y="168" fill="#16A34A" font-size="10.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">EFICIÊNCIA W / MASSA</text>
      <text x="105" y="186" fill="#0F172A" font-size="10" text-anchor="middle">
        ${morph > 0.5 ? "+80% mais eficiente por kg!" : "Material ocioso no centro"}
      </text>
    </g>
  `;
}

function renderM5C3(svg, t) {
  const pos = pulseWave(t);
  const x0 = 65, x1 = 415, yBeam = 105;
  const trolleyX = 115 + pos * 250;
  svg.innerHTML = `
    <rect x="45" y="75" width="22" height="190" fill="#E2E8F0" stroke="#0284C7" stroke-width="2"/>
    <rect x="413" y="75" width="22" height="190" fill="#E2E8F0" stroke="#0284C7" stroke-width="2"/>
    <rect x="${x0}" y="${yBeam}" width="${x1 - x0}" height="24" fill="rgba(2,132,199,0.18)" stroke="#0284C7" stroke-width="2"/>
    <line x1="${x0}" y1="${yBeam + 5}" x2="${x1}" y2="${yBeam + 5}" stroke="#0284C7" stroke-width="1.5"/>
    <line x1="${x0}" y1="${yBeam + 19}" x2="${x1}" y2="${yBeam + 19}" stroke="#0284C7" stroke-width="1.5"/>
    <text x="240" y="94" fill="#0284C7" font-size="10.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">VIGA PERFIL W • VÃO LIVRE INDUSTRIAL (12m)</text>
    <g transform="translate(${trolleyX}, 0)">
      <rect x="-26" y="${yBeam - 14}" width="52" height="14" rx="3" fill="#CA8A04" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="-16" cy="${yBeam}" r="4" fill="#1E293B"/>
      <circle cx="16" cy="${yBeam}" r="4" fill="#1E293B"/>
      <line x1="0" y1="${yBeam + 24}" x2="0" y2="178" stroke="#94A3B8" stroke-width="2.5"/>
      <rect x="-32" y="178" width="64" height="36" rx="4" fill="rgba(220,38,38,0.2)" stroke="#DC2626" stroke-width="2"/>
      <text x="0" y="200" fill="#DC2626" font-size="10" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">5.0 TON</text>
    </g>
    <line x1="25" y1="265" x2="455" y2="265" stroke="#475569" stroke-width="3"/>
    <rect x="85" y="230" width="310" height="26" rx="5" fill="#F1F5F9" stroke="#16A34A"/>
    <text x="240" y="247" fill="#16A34A" font-size="10.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
      ENG. PRODUÇÃO: -38% PESO ESTRUTURAL • MAIOR LAYOUT FABRIL
    </text>
  `;
}

// ===== MÓDULO 6 =====
function renderM6C1(svg, t) {
  const sweep = clamp(t / 0.72, 0, 1);
  const x0 = 95, x1 = 385, xm = 240;
  const curX = x0 + sweep * (x1 - x0);
  let decPath = `M ${x0},145 L ${x0},122 `;
  if (curX <= xm) decPath += `L ${curX},122 L ${curX},145 Z`;
  else decPath += `L ${xm},122 L ${xm},168 L ${curX},168 L ${curX},145 Z`;
  let dmfPath = `M ${x0},215 `;
  if (curX <= xm) {
    const s = (curX - x0) / (xm - x0);
    const yM = 215 + s * 46;
    dmfPath += `L ${curX},${yM} L ${curX},215 Z`;
  } else {
    const s = (curX - xm) / (x1 - xm);
    const yM = 261 - s * 46;
    dmfPath += `L ${xm},261 L ${curX},${yM} L ${curX},215 Z`;
  }
  svg.innerHTML = `
    <line x1="${x0}" y1="68" x2="${x1}" y2="68" stroke="#0284C7" stroke-width="5"/>
    ${arrowLine(xm, 24, xm, 63, "#DC2626", 2.8, 7)}
    <text x="${xm + 10}" y="38" fill="#DC2626" font-size="10.5" font-family="JetBrains Mono" font-weight="bold">P</text>
    ${arrowLine(x0, 96, x0, 73, "#16A34A", 2.2, 6)}
    ${arrowLine(x1, 96, x1, 73, "#16A34A", 2.2, 6)}
    <text x="${x0 - 12}" y="92" fill="#16A34A" font-size="9.5" font-family="JetBrains Mono" text-anchor="end">P/2</text>
    <text x="${x1 + 12}" y="92" fill="#16A34A" font-size="9.5" font-family="JetBrains Mono" text-anchor="start">P/2</text>
    <text x="24" y="149" fill="#0284C7" font-size="10.5" font-family="JetBrains Mono" font-weight="bold">DEC (V)</text>
    <line x1="${x0}" y1="145" x2="${x1}" y2="145" stroke="#94A3B8" stroke-width="1.5"/>
    <path d="${decPath}" fill="rgba(2,132,199,0.22)" stroke="#0284C7" stroke-width="2"/>
    ${sweep > 0.1 ? `<text x="${x0 + 18}" y="117" fill="#0284C7" font-size="9.5" font-family="JetBrains Mono">+P/2</text>` : ""}
    ${sweep > 0.6 ? `<text x="${x1 - 18}" y="180" fill="#0284C7" font-size="9.5" font-family="JetBrains Mono" text-anchor="end">-P/2</text>` : ""}
    <text x="24" y="220" fill="#CA8A04" font-size="10.5" font-family="JetBrains Mono" font-weight="bold">DMF (M)</text>
    <line x1="${x0}" y1="215" x2="${x1}" y2="215" stroke="#94A3B8" stroke-width="1.5"/>
    <path d="${dmfPath}" fill="rgba(202,138,4,0.22)" stroke="#CA8A04" stroke-width="2.2"/>
    ${sweep >= 0.5 ? `
      <circle cx="${xm}" cy="261" r="4" fill="#CA8A04"/>
      <text x="${xm}" y="278" fill="#CA8A04" font-size="10.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">M_máx = P·L / 4 (Onde V = 0)</text>
    ` : ""}
    <line x1="${curX}" y1="58" x2="${curX}" y2="265" stroke="#64748B" stroke-width="1" stroke-dasharray="3,3"/>
  `;
}

function renderM6C2(svg, t) {
  const step = t < 0.22 ? 1 : t < 0.45 ? 2 : t < 0.68 ? 3 : 4;
  svg.innerHTML = `
    <text x="240" y="30" fill="#0F172A" font-size="11.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
      DIMENSIONAMENTO REAL: VIGA METÁLICA W 200×19.3
    </text>
    <g opacity="${step >= 1 ? 1 : 0.25}">
      <rect x="28" y="48" width="200" height="72" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.6"/>
      <text x="40" y="68" fill="#0284C7" font-size="10" font-family="JetBrains Mono" font-weight="bold">1. PARÂMETROS DO PROJETO</text>
      <text x="40" y="86" fill="#1E293B" font-size="10.5" font-family="JetBrains Mono">Vão L = 4.0 m  |  q = 8 kN/m</text>
      <text x="40" y="104" fill="#475569" font-size="10" font-family="JetBrains Mono">W_x = 194 cm³ | σ_adm = 165 MPa</text>
    </g>
    <g opacity="${step >= 2 ? 1 : 0.25}">
      <rect x="252" y="48" width="200" height="72" rx="8" fill="#FFFFFF" stroke="#CA8A04" stroke-width="1.6"/>
      <text x="264" y="68" fill="#CA8A04" font-size="10" font-family="JetBrains Mono" font-weight="bold">2. MOMENTO FLETOR MÁXIMO</text>
      <text x="264" y="88" fill="#1E293B" font-size="11" font-family="JetBrains Mono">M_máx = q·L² / 8</text>
      <text x="264" y="106" fill="#CA8A04" font-size="11.5" font-family="JetBrains Mono" font-weight="bold">M_máx = 16.0 kN·m</text>
    </g>
    <g opacity="${step >= 3 ? 1 : 0.25}">
      <rect x="28" y="136" width="200" height="72" rx="8" fill="#FFFFFF" stroke="#DC2626" stroke-width="1.6"/>
      <text x="40" y="156" fill="#DC2626" font-size="10" font-family="JetBrains Mono" font-weight="bold">3. TENSÃO NORMAL ATUANTE</text>
      <text x="40" y="176" fill="#1E293B" font-size="11" font-family="JetBrains Mono">σ = M_máx / W_x</text>
      <text x="40" y="194" fill="#DC2626" font-size="11.5" font-family="JetBrains Mono" font-weight="bold">σ = 82.5 MPa &lt; 165 MPa</text>
    </g>
    <g opacity="${step >= 4 ? 1 : 0.25}">
      <rect x="252" y="136" width="200" height="72" rx="8" fill="${step >= 4 ? 'rgba(22,163,74,0.1)' : '#FFFFFF'}" stroke="#16A34A" stroke-width="2"/>
      <text x="264" y="156" fill="#16A34A" font-size="10" font-family="JetBrains Mono" font-weight="bold">4. FATOR DE SEGURANÇA</text>
      <text x="264" y="176" fill="#1E293B" font-size="11" font-family="JetBrains Mono">FS = 250 / 82.5 = 3.03</text>
      <text x="264" y="196" fill="#16A34A" font-size="12" font-family="JetBrains Mono" font-weight="bold">✓ PERFIL APROVADO</text>
    </g>
    <text x="240" y="246" fill="#475569" font-size="11" text-anchor="middle">
      ${step === 4 ? "Segurança estrutural garantida com economia de material!" : `Calculando etapa ${step} de 4...`}
    </text>
  `;
}

function renderM6C3(svg, t) {
  const w = pulseWave(t);
  const pulseR = 34 + w * 6;
  svg.innerHTML = `
    <rect x="22" y="54" width="155" height="175" rx="10" fill="rgba(2,132,199,0.1)" stroke="#0284C7" stroke-width="2"/>
    <text x="99" y="78" fill="#0284C7" font-size="11.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">ENG. CIVIL</text>
    <line x1="38" y1="88" x2="160" y2="88" stroke="#CBD5E1"/>
    <text x="36" y="110" fill="#1E293B" font-size="10.5">• Segurança & Normas</text>
    <text x="36" y="132" fill="#1E293B" font-size="10.5">• Rigidez & Flecha (δ)</text>
    <text x="36" y="154" fill="#1E293B" font-size="10.5">• Resistência (σ_adm)</text>
    <text x="36" y="176" fill="#1E293B" font-size="10.5">• Estabilidade Global</text>
    <text x="99" y="212" fill="#0284C7" font-size="10" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">CONFIABILIDADE</text>
    <rect x="303" y="54" width="155" height="175" rx="10" fill="rgba(202,138,4,0.1)" stroke="#CA8A04" stroke-width="2"/>
    <text x="380" y="78" fill="#CA8A04" font-size="11.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">ENG. PRODUÇÃO</text>
    <line x1="319" y1="88" x2="441" y2="88" stroke="#CBD5E1"/>
    <text x="317" y="110" fill="#1E293B" font-size="10.5">• Otimização de Massa</text>
    <text x="317" y="132" fill="#1E293B" font-size="10.5">• Redução de Custos</text>
    <text x="317" y="154" fill="#1E293B" font-size="10.5">• Menor Desperdício</text>
    <text x="317" y="176" fill="#1E293B" font-size="10.5">• Eficiência Fabril</text>
    <text x="380" y="212" fill="#CA8A04" font-size="10" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">EFICIÊNCIA</text>
    ${arrowLine(178, 142, 202, 142, "#0284C7", 2.5, 6)}
    ${arrowLine(302, 142, 278, 142, "#CA8A04", 2.5, 6)}
    <circle cx="240" cy="142" r="${pulseR}" fill="rgba(22,163,74,0.18)" stroke="#16A34A" stroke-width="2.5"/>
    <text x="240" y="138" fill="#16A34A" font-size="10.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">PROJETO</text>
    <text x="240" y="152" fill="#0F172A" font-size="10.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">ÓTIMO</text>
    <text x="240" y="264" fill="#16A34A" font-size="11.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
      SEGURANÇA + ECONOMIA = ENGENHARIA DE EXCELÊNCIA
    </text>
  `;
}
