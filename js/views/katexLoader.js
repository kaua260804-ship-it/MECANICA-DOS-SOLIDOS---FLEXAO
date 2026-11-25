/* =========================================================
   katexLoader.js — Renderização robusta de fórmulas KaTeX
   com fallback e retry.
   ========================================================= */

const KatexLoader = (() => {
  "use strict";

  let ready = false;

  function checkReady() {
    return typeof window.katex !== "undefined" && typeof window.renderMathInElement === "function";
  }

  function renderAll() {
    if (!checkReady()) return false;
    document.querySelectorAll("[data-latex]").forEach(el => {
      if (el.dataset.katexDone === "1") return;
      try {
        window.katex.render(el.dataset.latex, el, { throwOnError: false, displayMode: true });
        el.dataset.katexDone = "1";
      } catch (e) {
        console.warn("[KaTeX] falhou:", el.dataset.latex, e);
      }
    });
    return true;
  }

  function waitFor(cb, tries = 30, delay = 300) {
    if (checkReady()) { ready = true; cb(); return; }
    if (tries <= 0) {
      console.warn("[KaTeX] não carregou (offline?). Fórmulas renderizarão como texto.");
      return;
    }
    setTimeout(() => waitFor(cb, tries - 1, delay), delay);
  }

  function init() {
    waitFor(() => renderAll());
  }

  // Permite forçar re-render após navegação
  function refresh() { return renderAll(); }

  return { init, refresh };
})();

window.KatexLoader = KatexLoader;