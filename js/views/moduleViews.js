/* =========================================================
   moduleViews.js — Construtores de HTML de cada slide.
   Mantém app.js enxuto e centraliza o markup dos módulos.
   ========================================================= */

const ModuleViews = (() => {
  "use strict";

  // ---------- MÓDULO 1 ----------
  function m1(slide) {
    return `
      <div class="m1-layout">
        <div id="timelineMount"></div>
        <div class="citation m1-citation">
          “${slide.content.citation.text}”
          <cite>— ${slide.content.citation.cite}</cite>
        </div>
      </div>
    `;
  }

  // ---------- MÓDULO 2 ----------
  function m2(slide) {
    const defs = slide.content.definitions.map(d => `
      <div class="m2-def-card">
        <h3>${d.term}</h3>
        <p>${d.desc}</p>
      </div>
    `).join("");

    const sups = slide.content.supports.map(sp => `
      <tr>
        <td><strong>${sp.type}</strong></td>
        <td>${sp.reactions}</td>
        <td>${sp.dof}</td>
        <td>${sp.real}</td>
      </tr>
    `).join("");

    return `
      <div class="m2-defs">${defs}</div>
      <div class="card mt-4">
        <h3>Tipos de apoio — graus de liberdade e reações</h3>
        <table class="table-tech">
          <thead><tr><th>Apoio</th><th>Reações</th><th>Bloqueia</th><th>Exemplo real</th></tr></thead>
          <tbody>${sups}</tbody>
        </table>
      </div>
      <div id="reactionMount" class="mt-4"></div>
    `;
  }

  // ---------- MÓDULO 3 ----------
  function m3(slide) {
    const loads = slide.content.loadTypes.map(l => `
      <div class="m3-load-card">
        <div class="m3-load-card__icon">${l.icon}</div>
        <h3>${l.name}</h3>
        <div class="m3-load-card__unit">${l.unit}</div>
        <p>${l.desc}</p>
      </div>
    `).join("");

    return `
      <div class="m3-loads">${loads}</div>
      <div id="deformationMount"></div>
    `;
  }

  // ---------- MÓDULO 4 ----------
  function m4(slide) {
    const fs = slide.content.formulas.map(f => `
      <div class="formula">
        <span class="formula__label">${f.label}</span>
        <span data-latex="${f.latex}">${f.latex}</span>
      </div>
    `).join("");
    const pts = slide.content.caseStudy.points.map(p => `<li>${p}</li>`).join("");

    return `
      <div class="grid grid--2">
        <div class="card"><h3>Fórmulas fundamentais</h3><div class="m4-formulas">${fs}</div></div>
        <div class="card card--accent">
          <h3>${slide.content.caseStudy.title}</h3>
          <ul class="m4-case-list">${pts}</ul>
          <p class="text-muted mt-2">${slide.content.caseStudy.reference}</p>
        </div>
      </div>
      <div class="citation mt-4">
        ${slide.content.citation.text}
        <cite>— ${slide.content.citation.cite}</cite>
      </div>
    `;
  }

  // ---------- MÓDULO 5 ----------
  function m5(slide) {
    const fs = slide.content.formulas.map(f => `
      <div class="formula">
        <span class="formula__label">${f.label}</span>
        <span data-latex="${f.latex}">${f.latex}</span>
      </div>
    `).join("");

    return `
      <div class="m5-top">
        <div class="card"><h3>Fórmulas por seção</h3>${fs}</div>
        <div class="card card--accent">
          <h3>${slide.content.optimization.title}</h3>
          <ul>${slide.content.optimization.points.map(p => `<li>${p}</li>`).join("")}</ul>
        </div>
      </div>
      <div class="card">
        <h3>Comparador interativo de seções (mesma área)</h3>
        <p class="text-muted">Clique em cada seção para inspecionar I, W e σ sob M = 50 kN·m.</p>
        <div id="sectionComparatorMount" class="mt-2"></div>
      </div>
    `;
  }

  // ---------- MÓDULO 6 ----------
  function m6(slide) {
    return `
      <div class="m6-wrapper">
        <div class="card">
          <h3>${slide.content.caseTitle}</h3>
          <p class="text-muted">Ajuste os sliders e observe V(x), M(x), I, W e σ<sub>max</sub> em tempo real.</p>
          <div id="beamSimulatorMount" class="mt-2"></div>
        </div>
        <div class="compare-panel">
          <div class="card card--accent">
            <h3>${slide.content.synthesis.civil.title}</h3>
            <ul>${slide.content.synthesis.civil.items.map(i => `<li>${i}</li>`).join("")}</ul>
          </div>
          <div class="card card--warn">
            <h3>${slide.content.synthesis.production.title}</h3>
            <ul>${slide.content.synthesis.production.items.map(i => `<li>${i}</li>`).join("")}</ul>
          </div>
        </div>
      </div>
    `;
  }

  function render(slide) {
    switch (slide.id) {
      case "m1": return m1(slide);
      case "m2": return m2(slide);
      case "m3": return m3(slide);
      case "m4": return m4(slide);
      case "m5": return m5(slide);
      case "m6": return m6(slide);
      default:   return "";
    }
  }

  return { render };
})();

window.ModuleViews = ModuleViews;