/* =========================================================
   engine.js — cálculos (a partir de CONFIG) + renderizadores SVG.
   viewBox 480×300; textos ≥ 13 unidades (≈ 20+ px na projeção).
   ========================================================= */
"use strict";

const MONO = "Consolas, 'DejaVu Sans Mono', monospace";
const SANS = "'Segoe UI', Arial, sans-serif";
const C = {
  blue: "#0B5CAD", blueL: "#DBEAFE", red: "#C81E1E", redL: "#FEE2E2",
  green: "#15803D", greenL: "#DCFCE7", amber: "#92400E", amberL: "#FEF3C7",
  ink: "#0F172A", grey: "#334155", line: "#64748B", mid: "#CBD5E1"
};

/* ---------- helpers numéricos ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const prog = (t, a, b) => ease((t - a) / (b - a));
const pulse = t => 0.5 - 0.5 * Math.cos(t * 2 * Math.PI);
const hold = t => t < 0.32 ? ease(t / 0.32) : t < 0.68 ? 1 : t < 0.92 ? ease(1 - (t - 0.68) / 0.24) : 0;
const fmt = (v, n = 1) => v.toFixed(n).replace(".", ",");
const fmtI = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/* ---------- helpers SVG ---------- */
function T(x, y, s, o = {}) {
  const { size = 14, color = C.ink, bold = false, anchor = "start", mono = false } = o;
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${bold ? 800 : 600}" text-anchor="${anchor}" font-family="${mono ? MONO : SANS}">${s}</text>`;
}
const Ln = (x1, y1, x2, y2, c = C.ink, w = 3, dash = "") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const Rc = (x, y, w, h, fill, stroke, sw = 3, rx = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const Pg = (pts, fill, stroke, sw = 3) =>
  `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
function Ar(x1, y1, x2, y2, c, w = 4, hs = 11) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p1 = [x2 - hs * Math.cos(a - Math.PI / 6), y2 - hs * Math.sin(a - Math.PI / 6)];
  const p2 = [x2 - hs * Math.cos(a + Math.PI / 6), y2 - hs * Math.sin(a + Math.PI / 6)];
  return `${Ln(x1, y1, x2 - (hs * 0.6) * Math.cos(a), y2 - (hs * 0.6) * Math.sin(a), c, w)}<polygon points="${x2},${y2} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}" fill="${c}"/>`;
}
function pin(x, y, c = C.blue) {
  return `${Pg(`${x},${y} ${x - 14},${y + 22} ${x + 14},${y + 22}`, C.blueL, c)}<circle cx="${x}" cy="${y}" r="4.5" fill="#fff" stroke="${c}" stroke-width="3"/>${Ln(x - 23, y + 22, x + 23, y + 22, c, 3)}`;
}
function roller(x, y, c = C.blue) {
  return `${Pg(`${x},${y} ${x - 13},${y + 18} ${x + 13},${y + 18}`, C.blueL, c)}<circle cx="${x}" cy="${y}" r="4.5" fill="#fff" stroke="${c}" stroke-width="3"/><circle cx="${x - 7}" cy="${y + 23}" r="4" fill="#fff" stroke="${c}" stroke-width="2.5"/><circle cx="${x + 7}" cy="${y + 23}" r="4" fill="#fff" stroke="${c}" stroke-width="2.5"/>${Ln(x - 23, y + 31, x + 23, y + 31, c, 3)}`;
}
function beamSVG(x0, x1, yc, h, dyFn, fill = C.blueL, stroke = C.blue, n = 40) {
  const top = [], bot = [];
  for (let i = 0; i <= n; i++) {
    const s = i / n, x = x0 + (x1 - x0) * s, dy = dyFn(s);
    top.push(`${x.toFixed(1)},${(yc + dy - h).toFixed(1)}`);
    bot.unshift(`${x.toFixed(1)},${(yc + dy + h).toFixed(1)}`);
  }
  return Pg(top.concat(bot).join(" "), fill, stroke, 3);
}
function distLoad(x0, x1, yTop, yBot, n = 8, c = C.red) {
  let s = Ln(x0, yTop, x1, yTop, c, 3);
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; s += Ar(x, yTop, x, yBot, c, 2.5, 8); }
  return s;
}

/* ---------- cálculos a partir de CONFIG ---------- */
const K = (() => {
  const r = CONFIG.ref, E = r.E, Lmm = r.L * 1000;
  const Ii = (d, bf, tf, tw) => (bf * d ** 3 - (bf - tw) * (d - 2 * tf) ** 3) / 12;
  const Ai = (d, bf, tf, tw) => 2 * bf * tf + tw * (d - 2 * tf);
  const p = r.perfil, I = Ii(p.d, p.bf, p.tf, p.tw), c = p.d / 2, W = I / c, A = Ai(p.d, p.bf, p.tf, p.tw), m = A * 7.85e-3;
  const q = r.P / r.L, Mp = r.P * r.L / 4, Mq = q * r.L ** 2 / 8;
  const sig = Mp * 1e6 * c / I;
  const dP = r.P * 1000 * Lmm ** 3 / (48 * E * I), dq = 5 * q * Lmm ** 4 / (384 * E * I);
  const sigAdm = r.fy / r.fsAdm;
  const qpp = m * 9.81 / 1000, Mpp = qpp * r.L ** 2 / 8, Mtot = Mp + Mpp;
  const sigTot = Mtot * 1e6 * c / I, dpp = 5 * qpp * Lmm ** 4 / (384 * E * I), dTot = dP + dpp, dLim = Lmm / r.flechaLim;
  const f = r.folgado, I2 = Ii(f.d, f.bf, f.tf, f.tw), W2 = I2 / (f.d / 2), m2 = Ai(f.d, f.bf, f.tf, f.tw) * 7.85e-3, sig2 = Mp * 1e6 / W2;
  // maquete
  const mq = CONFIG.maquete, IrF = mq.b * mq.h ** 3 / 12, IrU = mq.h * mq.b ** 3 / 12;
  const dMq = g => (g / 1000 * 9.81) * mq.L ** 3 / (48 * mq.E * IrF);
  // concreto
  const cc = CONFIG.concreto, Prup = cc.fct * cc.b * cc.h ** 2 / cc.L / 1000;
  // seções
  const s = CONFIG.secoes;
  const rect = { A: s.rect.b * s.rect.h, I: s.rect.b * s.rect.h ** 3 / 12, Iy: s.rect.h * s.rect.b ** 3 / 12, h: s.rect.h };
  const tb = s.tub; const tub = {
    A: tb.h * tb.b - (tb.h - 2 * tb.t) * (tb.b - 2 * tb.t),
    I: (tb.b * tb.h ** 3 - (tb.b - 2 * tb.t) * (tb.h - 2 * tb.t) ** 3) / 12,
    Iy: (tb.h * tb.b ** 3 - (tb.h - 2 * tb.t) * (tb.b - 2 * tb.t) ** 3) / 12, h: tb.h
  };
  const si = s.I; const sI = {
    A: Ai(si.h, si.b, si.tf, si.tw), I: Ii(si.h, si.b, si.tf, si.tw),
    Iy: (2 * si.tf * si.b ** 3 + (si.h - 2 * si.tf) * si.tw ** 3) / 12, h: si.h
  };
  [rect, tub, sI].forEach(o => o.W = o.I / (o.h / 2));
  const bEq = sI.W * 6 / s.rect.h ** 2, saving = (1 - sI.A / (bEq * s.rect.h)) * 100;
  // mezanino
  const mz = CONFIG.mezanino, Mm = mz.q * mz.L ** 2 / 8;
  const Wreq = Mm * 1e6 / sigAdm / 1e3, dLimM = mz.L * 1000 / mz.flechaLim;
  const Ireq = 5 * mz.q * (mz.L * 1000) ** 4 / (384 * E * dLimM) / 1e4;
  return {
    I, W, A, m, q, Mp, Mq, sig, dP, dq, sigAdm, qpp, Mpp, Mtot, sigTot, dpp, dTot, dLim,
    WreqRef: Mtot * 1e6 / sigAdm / 1e3, FS: r.fy / sigTot, FSsimple: r.fy / sig,
    I2, W2, m2, sig2, FS2: r.fy / sig2, dm: (m2 / m - 1) * 100,
    IrF, IrU, ratioI: IrU / IrF, dMq,
    Prup, epsCr: cc.fct / cc.Ec * 1000, epsY: r.fy / E * 1000,
    rect, tub, sI, bEq, saving, Mm, Wreq, Ireq,
    Mbi: q * r.L ** 2 / 8, Mbal: q * r.L ** 2 / 2, Mcont: q * r.L ** 2 / 8,
    epsFibra: sig / E * 1000, // ‰  (= mm por metro)
    Ax: r.P * 0.5, Ay: r.P * Math.cos(Math.PI / 6) / 2
  };
})();

/* =============== MÓDULO 1 =============== */
function rRuler(svg, t) {
  const w = hold(t), m = CONFIG.maquete, g = m.massas[0];
  const dFlat = K.dMq(g), dUp = dFlat / K.ratioI;
  const bendF = w * 40, bendU = w * 0.8;
  svg.innerHTML = `
    ${Ln(240, 10, 240, 290, C.mid, 3, "6 6")}
    ${T(120, 30, "1 · DEITADA", { size: 18, bold: true, anchor: "middle", color: C.red })}
    ${T(120, 52, `I = ${fmt(K.IrF, 0)} mm⁴`, { size: 15, anchor: "middle", mono: true, bold: true })}
    ${Rc(95, 66, 50, 6, C.redL, C.red, 2)} ${T(152, 74, "seção", { size: 13, color: C.grey })}
    <path d="M 35,170 Q 120,${170 + bendF * 2} 205,170" fill="none" stroke="${C.red}" stroke-width="7" stroke-linecap="round"/>
    ${pin(35, 176)} ${roller(205, 176)}
    ${Ar(120, 112, 120, 158 + bendF * 0.9, C.red, 4, 11)}
    ${Rc(30, 236, 180, 54, "#fff", C.red, 3, 8)}
    ${T(120, 260, `δ = ${fmt(dFlat * w, 1)} mm`, { size: 20, bold: true, anchor: "middle", mono: true, color: C.red })}
    ${T(120, 281, `${g} g · previsto`, { size: 13, anchor: "middle", color: C.grey })}

    ${T(360, 30, "2 · EM PÉ", { size: 18, bold: true, anchor: "middle", color: C.green })}
    ${T(360, 52, `I = ${fmtI(K.IrU)} mm⁴ (${fmt(K.ratioI, 0)}×)`, { size: 15, anchor: "middle", mono: true, bold: true })}
    ${Rc(357, 62, 6, 50, C.greenL, C.green, 2)} ${T(372, 90, "seção", { size: 13, color: C.grey })}
    <path d="M 275,170 Q 360,${170 + bendU * 2} 445,170" fill="none" stroke="${C.green}" stroke-width="18" stroke-linecap="round"/>
    ${pin(275, 182)} ${roller(445, 182)}
    ${Ar(360, 118, 360, 152 + bendU, C.red, 4, 11)}
    ${Rc(270, 236, 180, 54, "#fff", C.green, 3, 8)}
    ${T(360, 260, `δ = ${fmt(dUp * w, 2)} mm`, { size: 20, bold: true, anchor: "middle", mono: true, color: C.green })}
    ${T(360, 281, "mesma carga", { size: 13, anchor: "middle", color: C.grey })}`;
}

function rTimeline(svg, t) {
  const k = Math.min(3, Math.floor(t * 4.2));
  const xs = [70, 190, 310, 430];
  const M = [
    ["1638", "Galileu", "σ uniforme", "erro de 3×"],
    ["~1750", "Euler-Bernoulli", "seções planas", "curvatura ∝ M"],
    ["1826", "Navier", "σ = M·y/I", "LN no centroide"],
    ["1940", "Tacoma", "pouca rigidez", "lição de projeto"]
  ];
  let s = Ln(30, 140, 450, 140, C.ink, 5);
  xs.forEach((x, i) => {
    const on = i <= k, cur = i === k, col = i === 3 ? C.red : C.blue;
    s += `<circle cx="${x}" cy="140" r="${cur ? 16 : 12}" fill="${on ? col : "#fff"}" stroke="${on ? col : C.line}" stroke-width="4"/>`;
    s += T(x, 100, M[i][0], { size: 22, bold: true, anchor: "middle", color: on ? col : C.line, mono: true });
    s += T(x, 186, M[i][1], { size: 15, bold: true, anchor: "middle", color: on ? C.ink : C.line });
    s += T(x, 212, M[i][2], { size: 14, anchor: "middle", color: on ? C.grey : C.mid });
    s += T(x, 232, M[i][3], { size: 14, anchor: "middle", color: on ? C.grey : C.mid });
  });
  svg.innerHTML = s;
}

function rGalileu(svg, t) {
  const w = prog(t, 0.05, 0.45), r = prog(t, 0.55, 0.85);
  const bw = 90 * w;
  svg.innerHTML = `
    ${T(125, 30, "GALILEU · 1638", { size: 17, bold: true, anchor: "middle", color: C.amber })}
    ${Rc(40, 60, 34, 130, "#E2E8F0", C.ink, 3)}
    ${Pg(`74,60 ${74 + bw},60 ${74 + bw},190 74,190`, C.amberL, C.amber)}
    ${w > 0.3 ? [75, 110, 150, 185].map(y => Ar(74, y - 5, 74 + bw - 8, y - 5, C.red, 3, 9)).join("") : ""}
    ${T(125, 218, "tração uniforme", { size: 15, anchor: "middle", color: C.grey })}
    ${T(125, 246, "M = σ·b·h²/2", { size: 17, bold: true, anchor: "middle", mono: true, color: C.amber })}
    ${Ln(240, 14, 240, 270, C.mid, 3, "6 6")}
    ${T(355, 30, "ELÁSTICO · EULER-NAVIER", { size: 17, bold: true, anchor: "middle", color: C.blue })}
    ${Rc(270, 60, 34, 130, "#E2E8F0", C.ink, 3)}
    ${Pg(`370,125 370,60 ${370 - 60 * w},60`, C.blueL, C.blue)}
    ${Pg(`370,125 370,190 ${370 + 60 * w},190`, C.redL, C.red)}
    ${Ln(300, 125, 450, 125, C.amber, 3, "7 5")} ${T(432, 117, "LN", { size: 14, bold: true, color: C.amber })}
    ${T(355, 218, "linear: comprime e traciona", { size: 15, anchor: "middle", color: C.grey })}
    ${T(355, 246, "M = σ·b·h²/6", { size: 17, bold: true, anchor: "middle", mono: true, color: C.blue })}
    ${r > 0.05 ? `${Rc(120, 258, 240, 36, C.amberL, C.amber, 3, 8)}${T(240, 283, "Galileu: 3× a resistência real", { size: 17, bold: true, anchor: "middle", color: C.amber })}` : ""}`;
}

function rTacoma(svg, t) {
  let amp = 0, broken = false;
  if (t < 0.78) amp = (t / 0.78) ** 2 * 42; else if (t < 0.94) { broken = true; amp = 42; }
  const f = t * Math.PI * 14, yD = 165, xL = 70, xR = 410, pts = [];
  for (let i = 0; i <= 40; i++) {
    const s = i / 40, x = xL + (xR - xL) * s;
    pts.push({ x, y: yD + Math.sin(Math.PI * s) * Math.sin(f) * amp + Math.sin(2 * Math.PI * s) * Math.cos(f) * amp * 0.45 });
  }
  const L = pts.slice(0, 21).map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const R = pts.slice(20).map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const col = amp > 24 ? C.red : C.amber;
  svg.innerHTML = `
    <g opacity="${0.5 + 0.5 * Math.min(1, t * 1.4)}">${Ar(20, 115, 72, 127, C.blue, 3.5, 10)}${Ar(16, 150, 68, 162, C.blue, 3.5, 10)}${T(18, 100, "VENTO", { size: 15, bold: true, color: C.blue })}</g>
    ${Rc(125, 75, 11, 155, C.mid, C.ink, 2.5)} ${Rc(344, 75, 11, 155, C.mid, C.ink, 2.5)}
    <path d="M 70,165 Q 100,120 130,78 Q 240,155 350,78 Q 380,120 410,165" fill="none" stroke="${C.grey}" stroke-width="3"/>
    ${!broken ? `<polyline points="${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`
      : `<polyline points="${L}" fill="none" stroke="${C.red}" stroke-width="7" stroke-linecap="round" transform="rotate(14,130,165)"/><polyline points="${R}" fill="none" stroke="${C.red}" stroke-width="7" stroke-linecap="round" transform="rotate(-14,350,165)"/>${Rc(130, 36, 220, 34, C.redL, C.red, 3, 8)}${T(240, 60, "COLAPSO · 7/11/1940", { size: 18, bold: true, anchor: "middle", color: C.red })}`}
    ${Rc(95, 248, 290, 40, "#fff", broken ? C.red : C.line, 3, 8)}
    ${T(240, 275, broken ? "≈ 4 meses após a abertura" : `Torção do tabuleiro: ${Math.round(amp / 42 * 100)}%`, { size: 17, bold: true, anchor: "middle", color: broken ? C.red : C.ink })}`;
}

/* =============== MÓDULO 2 =============== */
function rFlexao(svg, t) {
  const w = hold(t), x0 = 80, x1 = 400, xm = 240, y0 = 140, h = 13, bend = w * 40;
  const fy = 40 + w * 26;
  svg.innerHTML = `
    ${Ln(x0, y0, x1, y0, C.line, 2.5, "7 6")}
    ${beamSVG(x0, x1, y0, h, s => bend * Math.sin(Math.PI * s))}
    ${pin(x0, y0 + h)} ${roller(x1, y0 + h)}
    ${Ar(xm, fy + 8, xm, y0 + bend - h - 4, C.red, 5, 13)}
    ${T(xm + 14, fy + 22, `P = ${CONFIG.ref.P} kN`, { size: 18, bold: true, color: C.red, mono: true })}
    ${w > 0.1 ? `${Ln(xm + 30, y0, xm + 30, y0 + bend, C.amber, 3)}${Ln(xm + 22, y0, xm + 38, y0, C.amber, 3)}${Ln(xm + 22, y0 + bend, xm + 38, y0 + bend, C.amber, 3)}${T(xm + 44, y0 + bend + h + 24, `δ = ${fmt(K.dP * w, 1)} mm`, { size: 16, bold: true, color: C.amber, mono: true })}` : ""}
    ${Ar(x0, 248, x0, 200, C.green, 4, 12)} ${T(x0, 272, `R = ${fmt(CONFIG.ref.P / 2)} kN`, { size: 16, bold: true, anchor: "middle", color: C.green, mono: true })}
    ${Ar(x1, 248, x1, 200, C.green, 4, 12)} ${T(x1, 272, `R = ${fmt(CONFIG.ref.P / 2)} kN`, { size: 16, bold: true, anchor: "middle", color: C.green, mono: true })}
    ${T(xm, 266, `Mmáx = ${fmt(K.Mp)} kN·m`, { size: 18, bold: true, anchor: "middle", mono: true })}
    ${T(xm, 288, "L = " + CONFIG.ref.L + " m", { size: 14, anchor: "middle", color: C.grey })}`;
}

function rVigas(svg, t) {
  const rows = [
    { y: 84, name: "Biapoiada", sub: "isostática", val: `${fmt(K.Mbi)} kN·m`, c: C.green, type: "bi" },
    { y: 170, name: "Balanço", sub: "isostática", val: `${fmt(K.Mbal)} kN·m`, c: C.red, type: "bal" },
    { y: 246, name: "Contínua", sub: "hiperestática", val: `−${fmt(K.Mcont)} kN·m`, c: C.amber, type: "cont" }
  ];
  let s = "";
  rows.forEach((r, i) => {
    const w = prog(t, i * 0.25, i * 0.25 + 0.2), vis = t >= i * 0.25 - 0.001;
    if (!vis) return;
    const x0 = 140, x1 = 310, y = r.y;
    s += T(10, y - 6, r.name, { size: 17, bold: true });
    s += T(10, y + 16, r.sub, { size: 14, color: C.grey });
    s += Ln(x0, y, x1, y, C.blue, 9);
    s += distLoad(x0 + 6, x1 - 6, y - 36 + (1 - w) * 12, y - 12, 6);
    if (r.type === "bal") s += Rc(x0 - 14, y - 36, 14, 72, C.mid, C.ink, 3);
    else s += pin(x0, y + 4) + roller(x1, y + 4);
    if (r.type === "cont") s += roller((x0 + x1) / 2, y + 4);
    s += T(350, y - 8, "Mmáx", { size: 14, color: C.grey });
    s += T(350, y + 16, r.val, { size: 18, bold: true, mono: true, color: r.c });
  });
  svg.innerHTML = s;
}

function rApoioMovel(svg, t) {
  const w = pulse(t), dx = w * 34, x0 = 90, x1 = 380 + dx, y = 120;
  svg.innerHTML = `
    ${Rc(x0, y - 13, x1 - x0, 26, C.blueL, C.blue, 3)}
    ${T((x0 + x1) / 2, y + 7, "VIGA", { size: 15, bold: true, anchor: "middle", color: C.blue })}
    ${pin(x0, y + 13)} ${roller(x1 - 10, y + 13)}
    ${T(x0, 190, "fixo", { size: 15, anchor: "middle", color: C.grey, bold: true })}
    ${T(x1 - 10, 190, "móvel", { size: 15, anchor: "middle", color: C.grey, bold: true })}
    ${Ar(x1 - 10, 262, x1 - 10, 210, C.green, 5, 13)} ${T(x1 - 20, 252, "Ry", { size: 20, bold: true, anchor: "end", color: C.green, mono: true })}
    ${Ar(x1 + 4, 70, x1 + 40, 70, C.amber, 4, 12)} ${T(x1 + 2, 56, "Δx livre", { size: 16, bold: true, anchor: "end", color: C.amber })}
    ${Rc(20, 14, 230, 34, "#fff", C.green, 3, 8)} ${T(135, 38, "1 reação: só Ry", { size: 18, bold: true, anchor: "middle", color: C.green })}
    ${T(90, 262, "dilata, gira, sem tensão térmica", { size: 15, color: C.grey })}`;
}

function rApoioFixo(svg, t) {
  const w = prog(t, 0.05, 0.5), x0 = 100, x1 = 390, y = 130, xm = 245;
  svg.innerHTML = `
    ${Rc(x0, y - 13, x1 - x0, 26, C.blueL, C.blue, 3)}
    ${pin(x0, y + 13)} ${roller(x1, y + 13)}
    ${Ar(xm - 40 * w, y - 13 - 74 * w, xm, y - 15, C.red, 5, 13)}
    ${T(xm - 52, 36, "P = 10 kN a 30°", { size: 17, bold: true, anchor: "end", color: C.red, mono: true })}
    ${w > 0.5 ? `
      ${Ar(x0 - 12, y, 28, y, C.green, 5, 13)} ${T(10, y - 18, `Ax = ${fmt(K.Ax)} kN`, { size: 16, bold: true, color: C.green, mono: true })}
      ${Ar(x0, 250, x0, 196, C.green, 5, 13)} ${T(x0 + 12, 244, `Ay = ${fmt(K.Ay, 2)} kN`, { size: 16, bold: true, color: C.green, mono: true })}
      ${Ar(x1, 250, x1, 206, C.green, 5, 13)} ${T(x1 - 12, 244, `By = ${fmt(K.Ay, 2)} kN`, { size: 16, bold: true, anchor: "end", color: C.green, mono: true })}` : ""}
    ${Rc(170, 262, 170, 30, "#fff", C.green, 3, 8)} ${T(255, 283, "2 reações: Rx e Ry", { size: 16, bold: true, anchor: "middle", color: C.green })}`;
}

function rEngaste(svg, t) {
  const w = hold(t), tip = w * 36, x0 = 70, x1 = 400, y0 = 120, h = 14;
  svg.innerHTML = `
    ${Rc(40, 50, 30, 190, C.mid, C.ink, 3)}
    ${beamSVG(x0, x1, y0, h, s => tip * (1.5 * s * s - 0.5 * s ** 3), C.blueL, C.blue)}
    ${Ar(x1 - 10, 40 + tip, x1 - 10, y0 + tip - h - 4, C.red, 5, 13)}
    ${T(x1 - 24, 46 + tip, "P = 2 kN", { size: 17, bold: true, anchor: "end", color: C.red, mono: true })}
    ${Ln(x0, 216, x1, 216, C.grey, 2.5)} ${Ln(x0, 208, x0, 224, C.grey, 2.5)} ${Ln(x1, 208, x1, 224, C.grey, 2.5)} ${T((x0 + x1) / 2, 240, "L = 1,5 m", { size: 15, anchor: "middle", color: C.grey, bold: true })}
    ${w > 0.05 ? `
      <path d="M 120,190 A 44,44 0 0,0 120,100" fill="none" stroke="${C.amber}" stroke-width="5"/><polygon points="120,100 108,102 117,114" fill="${C.amber}"/>
      ${T(130, 82, `M = ${fmt(2 * 1.5)} kN·m`, { size: 18, bold: true, color: C.amber, mono: true })}
      ${Ar(94, 262, 94, 188, C.green, 5, 13)} ${T(106, 262, "Ry = 2,0 kN", { size: 16, bold: true, color: C.green, mono: true })}` : ""}
    ${Rc(236, 262, 234, 34, "#fff", C.amber, 3, 8)} ${T(353, 285, "3 reações: Rx, Ry e M", { size: 17, bold: true, anchor: "middle", color: C.amber })}
    ${T(20, 292, "Rx = 0", { size: 14, color: C.grey, bold: true })}`;
}

/* =============== MÓDULO 3 =============== */
function rCargas(svg, t) {
  const dist = t >= 0.5, lt = dist ? (t - 0.5) / 0.5 : t / 0.5, w = Math.sin(lt * Math.PI);
  const bend = w * (dist ? 24 : 38), x0 = 80, x1 = 400, y0 = 150, h = 12;
  const load = dist
    ? distLoad(x0 + 10, x1 - 10, 72, y0 - h - 6, 8)
    : Ar(240, 66, 240, y0 + bend - h - 4, C.red, 6, 14);
  svg.innerHTML = `
    ${Rc(20, 8, 215, 32, !dist ? C.redL : "#fff", !dist ? C.red : C.mid, 3, 8)}
    ${T(127, 31, `PONTUAL P = ${CONFIG.ref.P} kN`, { size: 16, bold: true, anchor: "middle", color: !dist ? C.red : C.line })}
    ${Rc(245, 8, 215, 32, dist ? C.redL : "#fff", dist ? C.red : C.mid, 3, 8)}
    ${T(352, 31, `DISTRIB. q = ${fmt(K.q)} kN/m`, { size: 16, bold: true, anchor: "middle", color: dist ? C.red : C.line })}
    ${load}
    ${beamSVG(x0, x1, y0 + 0, h, s => bend * Math.sin(Math.PI * s))}
    ${pin(x0, y0 + h)} ${roller(x1, y0 + h)}
    ${Ar(x0, 250, x0, 200, C.green, 4, 12)} ${T(x0, 272, "R = 5,0 kN", { size: 15, bold: true, anchor: "middle", color: C.green, mono: true })}
    ${Ar(x1, 250, x1, 200, C.green, 4, 12)} ${T(x1, 272, "R = 5,0 kN", { size: 15, bold: true, anchor: "middle", color: C.green, mono: true })}
    ${Rc(130, 226, 220, 64, "#fff", C.amber, 3, 8)}
    ${T(240, 252, `Mmáx = ${fmt(dist ? K.Mq : K.Mp)} kN·m`, { size: 19, bold: true, anchor: "middle", color: C.amber, mono: true })}
    ${T(240, 278, `δ = ${fmt(dist ? K.dq : K.dP)} mm`, { size: 19, bold: true, anchor: "middle", color: C.amber, mono: true })}`;
}

function rMaquete(svg, t) {
  const m = CONFIG.maquete;
  const stage = t < 0.2 ? 0 : t < 0.4 ? 1 : t < 0.65 ? 2 : t < 0.9 ? 3 : 0;
  const g = stage ? m.massas[stage - 1] : 0;
  const meas = stage && m.medido[stage - 1] != null;
  const dmm = stage ? (meas ? m.medido[stage - 1] : K.dMq(g)) : 0;
  const delta = dmm * 1.8, x0 = 70, x1 = 370, xm = 220, y0 = 150, h = 8;
  let wts = "";
  for (let i = 0; i < stage; i++) {
    const wy = y0 + delta - h - 24 * (i + 1);
    wts += `${Rc(xm - 30, wy, 60, 22, C.red, "#7F1D1D", 2, 3)}${T(xm, wy + 16, `${m.massas[i]} g`, { size: 14, bold: true, anchor: "middle", color: "#fff", mono: true })}`;
  }
  svg.innerHTML = `
    ${Rc(40, 232, 340, 14, C.mid, C.ink, 2.5)} ${Rc(58, 168, 24, 64, "#E2E8F0", C.ink, 3)} ${Rc(358, 168, 24, 64, "#E2E8F0", C.ink, 3)}
    ${Ln(x0, y0, x1, y0, C.line, 2, "6 5")}
    ${beamSVG(x0, x1, y0, h, s => delta * Math.sin(Math.PI * s), C.greenL, C.green)}
    ${wts}
    ${Rc(300, 40, 170, 100, "#fff", C.ink, 3, 10)}
    ${T(385, 62, "DEFLECTÔMETRO", { size: 13, bold: true, anchor: "middle", color: C.grey })}
    ${T(385, 94, `δ = ${fmt(dmm, 1)} mm`, { size: 22, bold: true, anchor: "middle", mono: true, color: C.amber })}
    ${T(385, 118, `${g} g`, { size: 17, bold: true, anchor: "middle", mono: true, color: C.green })}
    ${T(385, 134, stage ? (meas ? "medido" : "previsto (ilustrativo)") : "sem carga", { size: 13, anchor: "middle", color: C.grey })}
    ${T(240, 280, stage === 0 ? "Sem carga: volta à posição original (elástico)" : `${g} g → δ proporcional`, { size: 17, bold: true, anchor: "middle" })}`;
}

function rFibras(svg, t) {
  const w = hold(t), sh = w * 26, cx = 240, cy = 140, hw = 130, hh = 62;
  const eps = fmt(K.epsFibra, 2);
  svg.innerHTML = `
    ${Pg(`${cx - hw + sh},${cy - hh} ${cx + hw - sh},${cy - hh} ${cx + hw},${cy} ${cx - hw},${cy}`, C.blueL, C.blue)}
    ${Pg(`${cx - hw},${cy} ${cx + hw},${cy} ${cx + hw + sh},${cy + hh} ${cx - hw - sh},${cy + hh}`, C.redL, C.red)}
    ${Ln(cx - hw - 24, cy, cx + hw + 20, cy, C.amber, 4, "8 5")}
    ${T(cx, cy - 22, w > 0.05 ? "COMPRESSÃO · encurta" : "fibras superiores", { size: 17, bold: true, anchor: "middle", color: C.blue })}
    ${T(cx, cy + 36, w > 0.05 ? "TRAÇÃO · alonga" : "fibras inferiores", { size: 17, bold: true, anchor: "middle", color: C.red })}
    ${Rc(cx + hw + 22, cy - 13, 62, 26, "#fff", C.amber, 3, 6)} ${T(cx + hw + 53, cy + 6, "LN", { size: 17, bold: true, anchor: "middle", color: C.amber })}
    ${w > 0.05 ? `${Ar(cx - hw - sh - 4, cy + hh + 18, cx - hw - sh - 40, cy + hh + 18, C.red, 3.5, 10)}${Ar(cx + hw + sh + 4, cy + hh + 18, cx + hw + sh + 40, cy + hh + 18, C.red, 3.5, 10)}` : ""}
    ${T(cx, 248, "Na linha neutra: ε = 0 e σ = 0", { size: 18, bold: true, anchor: "middle", color: C.amber })}
    ${T(cx, 280, `fibra inferior alonga ${eps} mm por metro`, { size: 16, anchor: "middle", color: C.grey })}`;
}

/* =============== MÓDULO 4 =============== */
function rDeducao(svg, t) {
  const rows = [
    ["Seções planas permanecem planas", "ε varia linearmente com y"],
    ["Geometria da curvatura", "ε = −y/ρ"],
    ["Material elástico (Hooke)", "σ = E·ε = −E·y/ρ"],
    ["Equilíbrio: M = ∫σ·y dA", "σ = −M·y/I"]
  ];
  let s = "";
  rows.forEach((r, i) => {
    if (t < i * 0.22 - 0.001) return;
    const cur = (i === 3) || (t < (i + 1) * 0.22), y = 24 + i * 68;
    const col = i === 3 ? C.green : C.blue;
    if (i === 3) s += Rc(14, y - 8, 452, 62, C.greenL, C.green, 3, 10);
    s += `<circle cx="34" cy="${y + 22}" r="15" fill="${col}"/>` + T(34, y + 29, String(i + 1), { size: 18, bold: true, anchor: "middle", color: "#fff" });
    s += T(62, y + 14, r[0], { size: 16, color: C.grey, bold: true });
    s += T(62, y + 42, r[1], { size: 22, bold: true, mono: true, color: i === 3 ? C.green : C.ink });
  });
  svg.innerHTML = s;
}

function rTensoes(svg, t) {
  const w = hold(t), len = 15 + w * 90, cx = 285, cy = 158, hh = 76, s = K.sig * w;
  svg.innerHTML = `
    ${T(24, 30, "σ = −M·y / I", { size: 24, bold: true, mono: true, color: C.blue })}
    ${Rc(64, cy - hh, 38, hh * 2, "#E2E8F0", C.ink, 3)} ${Ln(48, cy, 118, cy, C.amber, 3, "7 5")} ${T(44, cy + 5, "y=0", { size: 14, anchor: "end", color: C.amber, bold: true })}
    ${Ln(cx, cy - hh - 10, cx, cy + hh + 10, C.ink, 3)} ${Ln(cx - 125, cy, cx + 125, cy, C.amber, 3, "7 5")}
    ${Pg(`${cx},${cy} ${cx},${cy - hh} ${cx - len},${cy - hh}`, C.blueL, C.blue)}
    ${Pg(`${cx},${cy} ${cx},${cy + hh} ${cx + len},${cy + hh}`, C.redL, C.red)}
    ${T(cx - len - 6, cy - hh - 8, `−${fmt(s, 0)} MPa`, { size: 18, bold: true, anchor: "end", color: C.blue, mono: true })}
    ${T(cx + len + 6, cy + hh + 20, `+${fmt(s, 0)} MPa`, { size: 18, bold: true, color: C.red, mono: true })}
    ${T(cx + 12, cy - 8, "LN: σ = 0", { size: 15, bold: true, color: C.amber })}
    ${T(240, 290, `M = ${fmt(K.Mp, 0)} kN·m · I = ${fmt(K.I / 1e4, 0)} cm⁴ · y = ${CONFIG.ref.perfil.d / 2} mm`, { size: 15, bold: true, anchor: "middle", color: C.grey, mono: true })}`;
}

function rHooke(svg, t) {
  const w = hold(t);
  const panel = (ox, title, sub, endLbl, col, yLbl, xLbl, xEnd) => {
    const px = ox + 10 + w * (xEnd - 10), py = 220 - w * 130;
    return `${T(ox + 85, 28, title, { size: 17, bold: true, anchor: "middle", color: col })}
      ${T(ox + 85, 48, sub, { size: 14, anchor: "middle", color: C.grey, mono: true })}
      ${Ar(ox, 220, ox, 70, C.ink, 3, 9)} ${Ar(ox, 220, ox + 180, 220, C.ink, 3, 9)}
      ${T(ox + 8, 76, yLbl, { size: 14, bold: true, color: col })} ${T(ox + 178, 242, "ε", { size: 16, bold: true, anchor: "end" })}
      ${Ln(ox, 220, ox + xEnd, 90, col, 5)}
      ${Ln(ox, py, px, py, C.mid, 2, "4 4")} ${Ln(px, 220, px, py, C.mid, 2, "4 4")}
      <circle cx="${px}" cy="${py}" r="7" fill="${C.amber}" stroke="#fff" stroke-width="2"/>
      ${T(ox + 85, 268, endLbl, { size: 15, bold: true, anchor: "middle", color: col })}
      ${T(ox + 85, 288, xLbl, { size: 13, anchor: "middle", color: C.grey })}`;
  };
  svg.innerHTML =
    panel(30, "AÇO", "E = 200 GPa", `escoa a ε = ${fmt(K.epsY, 2)}‰`, C.green, "σ ≤ 250 MPa", "escala: até 1,4‰", 160) +
    Ln(240, 14, 240, 290, C.mid, 3, "6 6") +
    panel(270, "CONCRETO (tração)", "E ≈ 27 GPa", `fissura a ε ≈ ${fmt(K.epsCr, 2)}‰`, C.red, "σ ≤ 4,5 MPa", "escala: até 0,2‰", 150);
}

function rEnsaio(svg, t) {
  const load = Math.min(1, t / 0.72), cracked = t >= 0.62 && t < 0.97;
  const drop = load * 10, x0 = 70, x1 = 410, y0 = 170, h = 24;
  const a = CONFIG.concreto.a / CONFIG.concreto.L * (x1 - x0), xa = x0 + a, xb = x1 - a;
  const P = load * K.Prup;
  svg.innerHTML = `
    ${Rc(xa - 36, 34 + drop, xb - xa + 72, 22, C.mid, C.ink, 3, 4)} ${T(240, 50 + drop, "PRENSA", { size: 14, bold: true, anchor: "middle" })}
    ${Ar(xa, 58 + drop, xa, y0 - h - 3 + drop * 0.5, C.red, 5, 12)} ${Ar(xb, 58 + drop, xb, y0 - h - 3 + drop * 0.5, C.red, 5, 12)}
    ${Rc(x0, y0 - h + drop * 0.5, x1 - x0, h * 2, "#E2E8F0", C.ink, 3)}
    ${Rc(xa, y0 - h + drop * 0.5, xb - xa, h * 2, C.amberL, C.amber, 3)}
    ${T(240, y0 + h + 40 + drop * 0.5, "V = 0 · M constante", { size: 16, bold: true, anchor: "middle", color: C.amber })}
    ${cracked ? `<polyline points="240,${y0 + h + drop * 0.5} 236,${y0 + 6 + drop * 0.5} 244,${y0 - 6 + drop * 0.5} 239,${y0 - 14 + drop * 0.5}" fill="none" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/>` : ""}
    ${pin(x0 + 22, y0 + h + drop * 0.5)} ${roller(x1 - 22, y0 + h + drop * 0.5)}
    ${cracked
      ? `${Rc(70, 246, 340, 40, C.redL, C.red, 3, 8)}${T(240, 273, `FISSURA NA BASE · fct,f = ${fmt(CONFIG.concreto.fct)} MPa`, { size: 16, bold: true, anchor: "middle", color: C.red })}`
      : T(240, 272, `P = ${fmt(P, 1)} kN (concreto simples)`, { size: 18, bold: true, anchor: "middle", mono: true })}`;
}

/* =============== MÓDULO 5 =============== */
function rAltura(svg, t) {
  const w = hold(t), by = 205;
  const cols = [
    { x: 90, bw: 40, bh: 48, lbl: "BASE", f: 1, c: C.blue },
    { x: 240, bw: 40 + 40 * w, bh: 48, lbl: "DOBRAR b", f: 1 + w, c: C.amber, tgt: "× 2" },
    { x: 390, bw: 40, bh: 48 + 48 * w, lbl: "DOBRAR h", f: 1 + 7 * w, c: C.red, tgt: "× 8" }
  ];
  let s = "";
  cols.forEach(c => {
    s += T(c.x, 34, c.lbl, { size: 17, bold: true, anchor: "middle", color: c.c });
    s += Rc(c.x - c.bw / 2, by - c.bh, c.bw, c.bh, "#fff", c.c, 4);
    s += T(c.x, 248, c.tgt ? `I × ${fmt(c.f, 1)}` : "I × 1", { size: 24, bold: true, anchor: "middle", mono: true, color: c.c });
  });
  svg.innerHTML = s + Ln(30, by, 450, by, C.ink, 3) +
    T(240, 284, "I = b·h³/12   →   (2h)³ = 8·h³", { size: 17, bold: true, anchor: "middle", mono: true, color: C.grey });
}

function rSecoes(svg, t) {
  const S = CONFIG.secoes, ox = [90, 240, 390], y0 = 52, sc = 1;
  const rect = (x, w, h, fill, st) => Rc(x - w / 2, y0, w, h, fill, st, 3);
  let s = "";
  // retangular
  s += T(ox[0], 26, "Retangular", { size: 17, bold: true, anchor: "middle" });
  s += rect(ox[0], S.rect.b * sc, S.rect.h * sc, C.blueL, C.blue);
  // tubular
  s += T(ox[1], 26, "Tubular", { size: 17, bold: true, anchor: "middle" });
  s += rect(ox[1], S.tub.b, S.tub.h, C.blueL, C.blue) + Rc(ox[1] - S.tub.b / 2 + S.tub.t, y0 + S.tub.t, S.tub.b - 2 * S.tub.t, S.tub.h - 2 * S.tub.t, "#fff", C.blue, 2.5);
  // I
  s += T(ox[2], 26, "Perfil I", { size: 17, bold: true, anchor: "middle" });
  const I = S.I;
  s += Rc(ox[2] - I.b / 2, y0, I.b, I.tf, C.blueL, C.blue, 3) + Rc(ox[2] - I.b / 2, y0 + I.h - I.tf, I.b, I.tf, C.blueL, C.blue, 3) + Rc(ox[2] - I.tw / 2, y0 + I.tf, I.tw, I.h - 2 * I.tf, C.blueL, C.blue, 3);
  const data = [K.rect, K.tub, K.sI];
  data.forEach((d, i) => {
    s += T(ox[i], 182, `Wx = ${fmt(d.W / 1e3)} cm³`, { size: 17, bold: true, anchor: "middle", mono: true, color: i === 2 ? C.green : C.ink });
    s += T(ox[i], 204, `Ix = ${fmt(d.I / 1e6, 2)}·10⁶`, { size: 14, anchor: "middle", mono: true, color: C.grey });
    s += T(ox[i], 224, `Iy = ${fmt(d.Iy / 1e6, 2)}·10⁶`, { size: 14, anchor: "middle", mono: true, color: i === 1 ? C.green : (i === 2 ? C.red : C.grey), bold: true });
  });
  s += T(240, 241, "Ix: eixo forte · Iy: eixo fraco", { size: 13, anchor: "middle", color: C.grey });
  if (t > 0.5) s += Rc(40, 250, 400, 42, C.greenL, C.green, 3, 8) + T(240, 278, `Mesmo Wx e altura: Perfil I usa −${fmt(K.saving, 0)}% de aço`, { size: 17, bold: true, anchor: "middle", color: C.green });
  else s += T(240, 278, "Mesma massa (≈ 7,85 kg/m) e mesma altura (100 mm)", { size: 16, bold: true, anchor: "middle", color: C.grey });
  svg.innerHTML = s;
}

function rMezanino(svg, t) {
  const mz = CONFIG.mezanino;
  const rows = [
    [`L = ${mz.L} m · q = ${mz.q} kN/m`, C.ink],
    [`M = q·L²/8 = ${fmt(K.Mm)} kN·m`, C.ink],
    [`Tensão:  Wx ≥ ${fmt(K.Wreq, 0)} cm³`, C.blue],
    [`Flecha (L/${mz.flechaLim}):  I ≥ ${fmtI(K.Ireq)} cm⁴`, C.red],
    ["A flecha manda: perfil maior", C.green]
  ];
  let s = distLoad(110, 370, 18, 36, 9) + Ln(110, 44, 370, 44, C.blue, 9) + pin(110, 48) + roller(370, 48);
  s += T(466, 16, "NBR 8800", { size: 14, bold: true, anchor: "end", color: C.grey });
  rows.forEach((r, i) => {
    if (t < i * 0.18 - 0.001) return;
    const y = 128 + i * 38;
    if (i === 4) s += Rc(20, y - 24, 440, 36, C.greenL, C.green, 3, 8);
    s += T(32, y, r[0], { size: 19, bold: true, mono: true, color: r[1] });
  });
  svg.innerHTML = s;
}

/* =============== MÓDULO 6 =============== */
function diagBase(svg, kind, t) {
  const sweep = clamp(t / 0.72, 0, 1), x0 = 95, x1 = 385, xm = 240, curX = x0 + sweep * (x1 - x0);
  const VB = 150, MB = 212, vamp = 28, mamp = 46;
  let dec, dmf, vTxt, mTxt, mLbl;
  if (kind === "P") {
    dec = `M ${x0},${VB} L ${x0},${VB - vamp} ` + (curX <= xm ? `L ${curX},${VB - vamp} L ${curX},${VB} Z` : `L ${xm},${VB - vamp} L ${xm},${VB + vamp} L ${curX},${VB + vamp} L ${curX},${VB} Z`);
    const my = x => x <= xm ? MB + (x - x0) / (xm - x0) * mamp : MB + (x1 - x) / (x1 - xm) * mamp;
    dmf = `M ${x0},${MB} ` + (curX <= xm ? `L ${curX},${my(curX)} L ${curX},${MB} Z` : `L ${xm},${MB + mamp} L ${curX},${my(curX)} L ${curX},${MB} Z`);
    mLbl = `Mmáx = P·L/4 = ${fmt(K.Mp)} kN·m`;
  } else {
    const vy = x => VB - vamp * (1 - 2 * (x - x0) / (x1 - x0));
    let p = `M ${x0},${VB} L ${x0},${vy(x0)} `; for (let x = x0; x <= curX; x += 4) p += `L ${x},${vy(x)} `;
    dec = p + `L ${curX},${vy(curX)} L ${curX},${VB} Z`;
    const my = x => { const s = (x - x0) / (x1 - x0); return MB + mamp * 4 * s * (1 - s); };
    let q = `M ${x0},${MB} `; for (let x = x0; x <= curX; x += 4) q += `L ${x},${my(x)} `;
    dmf = q + `L ${curX},${my(curX)} L ${curX},${MB} Z`;
    mLbl = `Mmáx = q·L²/8 = ${fmt(K.Mq)} kN·m`;
  }
  const load = kind === "P" ? Ar(xm, 12, xm, 50, C.red, 5, 12) + T(xm + 12, 28, "P = 10 kN", { size: 15, bold: true, color: C.red, mono: true })
    : distLoad(x0, x1, 24, 46, 10) + T(xm, 13, "q = 2,5 kN/m", { size: 14, bold: true, anchor: "middle", color: C.red, mono: true });
  svg.innerHTML = `
    ${Ln(x0, 56, x1, 56, C.blue, 8)} ${load}
    ${pin(x0, 58)} ${roller(x1, 58)}
    ${T(8, VB + 5, "V", { size: 18, bold: true, color: C.blue })} ${Ln(x0, VB, x1, VB, C.line, 2)}
    ${Pg(dec.replace(/[MLZ]/g, m => m === "M" ? "" : "").replace(/\s+/g, " ").trim(), C.blueL, C.blue, 3)}
    ${T(8, MB + 5, "M", { size: 18, bold: true, color: C.amber })} ${Ln(x0, MB, x1, MB, C.line, 2)}
    ${Pg(dmf.replace(/[MLZ]/g, "").replace(/\s+/g, " ").trim(), C.amberL, C.amber, 3)}
    ${kind === "P" ? (sweep > 0.15 ? T(x0 + 40, VB - vamp - 5, "+5,0", { size: 15, bold: true, color: C.blue, mono: true }) : "") + (sweep > 0.65 ? T(x1 - 40, VB + vamp + 18, "−5,0", { size: 15, bold: true, anchor: "end", color: C.blue, mono: true }) : "") : (sweep > 0.1 ? T(x0 + 8, VB - vamp - 5, "+5,0", { size: 15, bold: true, color: C.blue, mono: true }) : "") + (sweep > 0.85 ? T(x1 - 8, VB + vamp + 18, "−5,0", { size: 15, bold: true, anchor: "end", color: C.blue, mono: true }) : "")}
    ${sweep >= 0.5 ? `<circle cx="${xm}" cy="${MB + mamp}" r="5" fill="${C.amber}"/>${T(xm, 294, mLbl + " (onde V = 0)", { size: 15, bold: true, anchor: "middle", color: C.amber, mono: true })}` : ""}
    ${Ln(curX, 66, curX, MB + mamp + 4, C.grey, 1.5, "4 4")}`;
}
const rDiagP = (svg, t) => diagBase(svg, "P", t);
const rDiagQ = (svg, t) => diagBase(svg, "Q", t);

function rDimens(svg, t) {
  const step = t < 0.15 ? 1 : t < 0.3 ? 2 : t < 0.45 ? 3 : t < 0.6 ? 4 : t < 0.75 ? 5 : 6;
  const R = CONFIG.ref, p = R.perfil;
  const cards = [
    ["1 DADOS", `L = ${R.L} m · P = ${R.P} kN`, `I ${p.d}×${p.bf}×${p.tf}×${p.tw}`, C.blue],
    ["2 MOMENTO", `P·L/4 + peso próprio`, `M = ${fmt(K.Mtot, 2)} kN·m`, C.amber],
    ["3 MÓDULO", `Wexig = M/σadm`, `${fmt(K.WreqRef, 0)} ≤ ${fmt(K.W / 1e3)} cm³ ✓`, C.blue],
    ["4 TENSÃO E FS", `σ = ${fmt(K.sigTot, 0)} MPa`, `FS = ${fmt(K.FS)} ≥ ${R.fsAdm} ✓`, C.red],
    ["5 FLECHA", `δ = ${fmt(K.dTot)} mm`, `≤ L/${R.flechaLim} = ${fmt(K.dLim)} ✓`, C.red],
    ["6 USO", `σ ${fmt(K.sigTot / K.sigAdm * 100, 0)}% · δ ${fmt(K.dTot / K.dLim * 100, 0)}%`, "a flecha governa", C.green]
  ];
  let s = "";
  cards.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2), x = 12 + col * 236, y = 8 + row * 96, on = step >= i + 1;
    s += `<g opacity="${on ? 1 : 0.18}">${Rc(x, y, 224, 86, i === 5 && on ? C.greenL : "#fff", c[3], 3, 10)}
      ${T(x + 12, y + 22, c[0], { size: 14, bold: true, color: c[3] })}
      ${T(x + 12, y + 47, c[1], { size: 16, bold: true, mono: true })}
      ${T(x + 12, y + 72, c[2], { size: 16, bold: true, mono: true, color: c[3] })}</g>`;
  });
  svg.innerHTML = s;
}

function rCivilProd(svg, t) {
  const g = prog(t, 0.05, 0.6), maxM = K.m2, maxF = K.FS2;
  const bar = (y, label, v1, v2, max, unit, d) => `
    ${T(14, y, label, { size: 17, bold: true })}
    ${Rc(14, y + 10, 330 * (v1 / max) * g, 28, C.greenL, C.green, 3, 4)} ${T(14 + 330 * (v1 / max) * g + 8, y + 31, `${fmt(v1)} ${unit}`, { size: 16, bold: true, mono: true, color: C.green })}
    ${Rc(14, y + 46, 330 * (v2 / max) * g, 28, C.redL, C.red, 3, 4)} ${T(14 + 330 * (v2 / max) * g + 8, y + 67, `${fmt(v2)} ${unit}${d}`, { size: 16, bold: true, mono: true, color: C.red })}`;
  svg.innerHTML = `
    ${bar(30, "Massa", K.m, K.m2, maxM * 1.35, "kg/m", `  (+${fmt(K.dm, 0)}%)`)}
    ${bar(128, "Fator de segurança", K.FSsimple, K.FS2, maxF * 1.35, "", "")}
    ${Rc(14, 232, 12, 12, C.green, C.green, 1)} ${T(32, 243, "perfil de referência (mais leve que passa)", { size: 14, color: C.grey, bold: true })}
    ${Rc(14, 254, 12, 12, C.red, C.red, 1)} ${T(32, 265, "perfil folgado (200×100×6×5)", { size: 14, color: C.grey, bold: true })}
    ${t > 0.6 ? T(240, 292, "Folga que ninguém pediu = custo e peso a mais", { size: 16, bold: true, anchor: "middle", color: C.amber }) : ""}`;
}

function rConclusao(svg, t) {
  const L = [
    "A teoria evoluiu errando e corrigindo.",
    "Apoios definem reações; reações, o momento.",
    "Mesma carga espalhada: metade do momento.",
    "σ = −M·y/I: tração embaixo, compressão em cima.",
    "A forma é de graça: h³ vale mais que material.",
    "O melhor perfil é o mais leve que passa."
  ];
  const k = Math.min(6, Math.floor(t * 7));
  let s = "";
  L.forEach((txt, i) => {
    if (i >= k) return;
    const y = 36 + i * 46;
    s += `<circle cx="28" cy="${y - 6}" r="14" fill="${C.blue}"/>` + T(28, y, String(i + 1), { size: 17, bold: true, anchor: "middle", color: "#fff" });
    s += T(54, y, txt, { size: 18, bold: true });
  });
  svg.innerHTML = s;
}

window.RENDERERS = { rRuler, rTimeline, rGalileu, rTacoma, rFlexao, rVigas, rApoioMovel, rApoioFixo, rEngaste, rCargas, rMaquete, rFibras, rDeducao, rTensoes, rHooke, rEnsaio, rAltura, rSecoes, rMezanino, rDiagP, rDiagQ, rDimens, rCivilProd, rConclusao };
window.K = K;
