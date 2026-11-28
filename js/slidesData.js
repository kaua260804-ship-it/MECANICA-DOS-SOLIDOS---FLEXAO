/* =========================================================
   slidesData.js — dados do seminário.
   • CONFIG: todos os números dos exemplos (edite aqui; o engine recalcula).
   • MODULES / SCREENS: uma animação por tela; texto mínimo.
   • "notes" só aparecem na janela do apresentador (tecla N).
   ========================================================= */

const CONFIG = {
  // Viga de referência (fio condutor dos 6 módulos)
  ref: {
    L: 4,            // m
    P: 10,           // kN (pontual no meio)  → q = P/L = 2,5 kN/m
    E: 200000,       // MPa (aço)
    fy: 250,         // MPa
    fsAdm: 1.5,      // σadm = fy / 1,5 (critério didático)
    flechaLim: 360,  // δ ≤ L/360
    perfil:  { d: 160, bf: 100, tf: 5, tw: 4 },  // perfil I hipotético (troque pelo de catálogo)
    folgado: { d: 200, bf: 100, tf: 6, tw: 5 }
  },
  // Maquete (régua de acrílico). Troque "medido" pelas leituras reais (mm); null = usa o previsto.
  maquete: { L: 300, b: 25, h: 3, E: 3000, massas: [200, 400, 600], medido: [null, null, null] },
  // Ensaio de 4 pontos (valores ilustrativos — trocar pelos dados do laboratório)
  concreto: { b: 150, h: 150, L: 450, a: 150, fct: 4.5, Ec: 27000 },
  // Seções com mesma massa e mesma altura (mm)
  secoes: {
    rect: { b: 10, h: 100 },
    tub:  { h: 100, b: 50, t: 3.5 },
    I:    { h: 100, b: 50, tf: 6.5, tw: 4 }
  },
  // Mezanino
  mezanino: { L: 5, q: 9, flechaLim: 350 }
};

const MODULES = [
  { id: 1, nav: "1 Histórico",  who: "Integrante 1", time: "4 min (+ abertura 0:30 e conclusão 1:30)" },
  { id: 2, nav: "2 Apoios",     who: "Integrante 2", time: "5 min" },
  { id: 3, nav: "3 Cargas",     who: "Integrante 3 + Integrante 4", time: "6 min" },
  { id: 4, nav: "4 Tensões",    who: "Integrante 4", time: "7 min" },
  { id: 5, nav: "5 Seções",     who: "Integrante 5", time: "7 min" },
  { id: 6, nav: "6 Diagramas",  who: "Integrante 6 (apoio: 4 e 5)", time: "7 min" }
];

// key = instante (0–1) em que a animação aparece "completa" quando está pausada.
const SCREENS = [
  /* ---------- MÓDULO 1 — Histórico ---------- */
  { id: "s11", mod: 1, title: "Régua deitada dobra. Em pé, não.", line: "Três perguntas: resiste? deforma? gasta menos aço?",
    render: "rRuler", key: 0.5,
    notes: ["Abrir com a pergunta da régua (voltamos nela no módulo 5).", "Anunciar as 3 perguntas do seminário. Não listar os módulos."] },
  { id: "s12", mod: 1, title: "Quatro marcos da flexão", line: "Cada um corrigiu o anterior.",
    render: "rTimeline", key: 0.95,
    notes: ["Uma frase por marco, só pelo que corrigiu do anterior.", "Galileu 1638 → Euler-Bernoulli ~1750 → Navier 1826 → Tacoma 1940."] },
  { id: "s13", mod: 1, title: "Galileu errou por um fator 3", line: "Elástico: σ·b·h²/6, não σ·b·h²/2.",
    render: "rGalileu", key: 0.9,
    notes: ["Galileu: tração uniforme, giro na borda (M = σ·b·h²/2).", "Elástico: σ linear, compressão em cima, LN no centroide (σ·b·h²/6).", "(1/2)/(1/6) = 3: superestimava a resistência 3×."] },
  { id: "s14", mod: 1, title: "Tacoma Narrows, 1940", line: "Vento + torção + pouca rigidez.",
    render: "rTacoma", key: 0.9,
    notes: ["Aberta em jul/1940, caiu em 7/nov/1940 (≈ 4 meses). Vento ≈ 65–68 km/h.", "Explicação mais aceita: instabilidade aeroelástica (acoplamento torção-flexão), indo além de uma ressonância simples.", "Se perguntarem: desprendimento de vórtices e flutter são discutidos na literatura; não afirmar causa única. Não foi fadiga.", "Lição de rigidez (E·I e torção) — não é flexão pura."] },

  /* ---------- MÓDULO 2 — Conceito, vigas e apoios ---------- */
  { id: "s21", mod: 2, title: "O que é flexão?", line: "Carga transversal cria momento M e cortante V.",
    render: "rFlexao", key: 0.5,
    notes: ["Definir em 20 s. Pura: só M (V = 0). Simples: M + V, sem esforço normal.", "Números da viga de referência: P = 10 kN, R = 5 kN, Mmáx = 10 kN·m."] },
  { id: "s22", mod: 2, title: "Três tipos de viga", line: "Mesma carga: o balanço tem 4× o momento.",
    render: "rVigas", key: 0.95,
    notes: ["Biapoiada 5 kN·m · balanço 20 kN·m · contínua 5 kN·m no apoio central.", "Contínua: só citar \"hiperestática\" (mais reações que equações)."] },
  { id: "s23", mod: 2, title: "Apoio móvel: 1 reação", line: "Só Ry. Dilata e gira livre.",
    render: "rApoioMovel", key: 0.5,
    notes: ["Rolete: bloqueia só o vertical. Ex.: ponte, dilatação ≈ 18 mm em 50 m (aço, ΔT = 30 °C).", "Dois apoios fixos impediriam a dilatação e criariam tensões."] },
  { id: "s24", mod: 2, title: "Apoio fixo: 2 reações", line: "Rx e Ry. Gira livre (M = 0).",
    render: "rApoioFixo", key: 0.9,
    notes: ["Carga inclinada 30° → Px = 5 kN, Py = 8,66 kN.", "Só o apoio fixo reage na horizontal: Ax = 5,0 kN."] },
  { id: "s25", mod: 2, title: "Engaste: 3 reações", line: "Rx, Ry e momento M.",
    render: "rEngaste", key: 0.5,
    notes: ["Marquise: P = 2 kN na ponta, L = 1,5 m → M = 3,0 kN·m.", "Rx = 0 porque não há carga horizontal.", "Fechar: contar reações (3 equações no plano): = 3 isostática; > 3 hiperestática."] },
  { id: "s26", mod: 2, title: "Apoio de ponte na prática", line: "Neoprene fretado: aproxima um apoio móvel.",
    photo: "img/apoio-ponte.jpg", key: 0.5,
    notes: ["Foto real. Deforma por cisalhamento e gira, mas transmite pequena força horizontal.", "O rolete é o caso ideal. Citar a fonte da imagem."] },

  /* ---------- MÓDULO 3 — Cargas e demonstração ---------- */
  { id: "s31", mod: 3, title: "Pontual × distribuída", line: "Mesma carga total, metade do momento.",
    render: "rCargas", key: 0.4,
    notes: ["Mesmas reações (5 kN). M: 10 → 5 kN·m. Flecha: 9,3 → 5,8 mm (62%).", "A distribuída fica mais perto dos apoios (braço menor)."] },
  { id: "s32", mod: 3, title: "Maquete: carga × flecha", line: "Dobrou a carga, dobrou a flecha.",
    render: "rMaquete", key: 0.75,
    notes: ["Demonstração ao vivo: 3 massas, ler δ, comparar com a previsão, retirar a carga (retorno elástico).", "Trocar os valores previstos pelas leituras (CONFIG.maquete.medido)."] },
  { id: "s33", mod: 3, title: "Dentro da viga", line: "Cima comprime, baixo traciona, meio não muda.",
    render: "rFibras", key: 0.5,
    notes: ["Integrante 4 assume aqui. Número: a fibra inferior alonga 0,56 mm a cada metro.", "Linha neutra: ε = 0 e σ = 0. A fórmula fica para o módulo 4."] },

  /* ---------- MÓDULO 4 — Tensões e ensaio ---------- */
  { id: "s41", mod: 4, title: "De onde vem σ = −M·y/I", line: "Quatro passos.",
    render: "rDeducao", key: 0.95,
    notes: ["Uma linha por passo, sem derivar na lousa.", "Seções planas → ε = −y/ρ → Hooke → equilíbrio M = ∫σ·y dA."] },
  { id: "s42", mod: 4, title: "Perfil de tensões", line: "Linear. Zero na linha neutra.",
    render: "rTensoes", key: 0.5,
    notes: ["Viga de referência: M = 10 kN·m, I = 713 cm⁴, y = 80 mm → σ = ±112 MPa."] },
  { id: "s43", mod: 4, title: "Lei de Hooke: σ = E·ε", line: "Mesma deformação, tensões muito diferentes.",
    render: "rHooke", key: 0.5,
    notes: ["Aço: E = 200 GPa, escoa a ε = 1,25‰. Concreto: E ≈ 27 GPa, fissura à tração a ε ≈ 0,17‰.", "Escalas diferentes nos dois gráficos."] },
  { id: "s44", mod: 4, title: "Ensaio de flexão em 4 pontos", line: "Fissura onde o concreto traciona.",
    render: "rEnsaio", key: 0.85,
    notes: ["Entre as cargas: V = 0 e M constante (flexão pura).", "Pruptura ≈ 34 kN → fct,f = 4,5 MPa (ilustrativo; usar dados reais). Norma do ensaio: NBR 12142; projeto: NBR 6118.", "Por isso o aço na face tracionada."] },

  /* ---------- MÓDULO 5 — Seções e otimização ---------- */
  { id: "s51", mod: 5, title: "A altura manda: I = b·h³/12", line: "Régua em pé: 69× mais rígida.",
    render: "rRuler", key: 0.5,
    notes: ["Voltar à régua da abertura. Razão em pé/deitada = (h/b)² = (25/3)² ≈ 69.", "Régua em pé tombaria: apoiar lateralmente na demonstração."] },
  { id: "s52", mod: 5, title: "Dobrar h: I fica 8×", line: "Dobrar b só dobra I.",
    render: "rAltura", key: 0.5,
    notes: ["h³: 2³ = 8. Corrigido: NÃO é ×4."] },
  { id: "s53", mod: 5, title: "Três seções, mesma massa", line: "Wx: 16,7 · 25,7 · 32,8 cm³.",
    render: "rSecoes", key: 0.95,
    notes: ["Dizer uma vez: W do perfil laminado ≠ Wx = I/c (módulo de resistência).", "Perfil I vence no eixo forte; tubular no eixo fraco e na torção.", "Mesmo Wx e mesma altura: perfil I usa 49% menos aço."] },
  { id: "s54", mod: 5, title: "Mezanino: a flecha manda", line: "NBR 8800 · vão 5 m.",
    render: "rMezanino", key: 0.95,
    notes: ["M = 28,1 kN·m → Wx ≥ 169 cm³ por tensão, mas I ≥ 2 563 cm⁴ por flecha.", "Racks de perfis formados a frio: NBR 14762. Conferir sobrecarga (NBR 6120) e limites de flecha."] },

  /* ---------- MÓDULO 6 — Diagramas e síntese ---------- */
  { id: "s61", mod: 6, title: "Diagramas V e M", line: "M máximo onde V = 0.",
    render: "rDiagP", key: 0.85,
    notes: ["Diagrama pré-calculado: narrar, não calcular do zero.", "dM/dx = V. V = ±5 kN com salto no meio; M sobe até 10 kN·m."] },
  { id: "s62", mod: 6, title: "Carga distribuída", line: "V reta, M parábola.",
    render: "rDiagQ", key: 0.85,
    notes: ["Mesma ideia: V cruza o zero no meio; Mmáx = q·L²/8 = 5,0 kN·m."] },
  { id: "s63", mod: 6, title: "Dimensionamento em 6 passos", line: "Critério simplificado (tensão admissível).",
    render: "rDimens", key: 0.95,
    notes: ["Integrante 4 comenta o passo 3–4 (30 s). Integrante 5 comenta a escolha do perfil (30 s).", "A NBR 8800 usa estados-limites; cisalhamento e flambagem lateral ficam fora deste exemplo.", "Perfil I 160×100×5×4 é hipotético: trocar por um de catálogo."] },
  { id: "s64", mod: 6, title: "Civil × Produção", line: "O melhor perfil é o mais leve que passa.",
    render: "rCivilProd", key: 0.95,
    notes: ["Perfil folgado: +34% de massa e FS = 3,5. Segurança (Civil) e economia (Produção) no mesmo cálculo."] },
  { id: "s65", mod: 6, title: "Conclusão", line: "Uma ideia de cada integrante.",
    render: "rConclusao", key: 0.97,
    notes: ["Cada integrante diz a própria frase (~10 s), na ordem. Integrante 1 fecha:", "\"Uma viga bem projetada é segura (Civil) e leve (Produção). Estamos abertos às perguntas.\""] }
];

window.CONFIG = CONFIG; window.MODULES = MODULES; window.SCREENS = SCREENS;
