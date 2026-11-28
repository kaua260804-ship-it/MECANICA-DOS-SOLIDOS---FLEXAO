/* =========================================================
   slidesData.js — Conteúdo dos 6 módulos (revisado tecnicamente)
   ========================================================= */

const SLIDES_DATA = [
  {
    id: 1,
    shortTitle: "1. Abertura",
    title: "Abertura & Histórico",
    subtitle: "O fenômeno físico da flexão, o caso de Tacoma Narrows (instabilidade aeroelástica) e a evolução de Galileu a Euler-Bernoulli.",
    speakers: "Integrante 1 • Abertura e Contextualização",
    notes: [
      "M1.1 — A viga deforma quando a carga é aplicada: linha elástica. Flexão simples envolve momento fletor (M) e esforço cortante (V).",
      "M1.2 — Tacoma Narrows (1940): explicação mais aceita envolve instabilidade aeroelástica e acoplamento torção-flexão, indo além de uma ressonância simples.",
      "M1.3 — Galileu (1638) supôs tensão uniforme (incorreto). Euler-Bernoulli (1750): seções planas permanecem planas → linha neutra.",
      "Valores nos diagramas são ilustrativos. O foco é a tendência física."
    ],
    cards: [
      { id: "m1_c1", tag: "CONCEITO FUNDAMENTAL", title: "Flexão Pura e Simples", caption: "Quando uma carga F ou um momento M curva o eixo da viga, a linha reta indeformada vira linha elástica.", render: "renderM1C1" },
      { id: "m1_c2", tag: "CASO HISTÓRICO (1940)", title: "Tacoma Narrows — Instabilidade Aeroelástica", caption: "O colapso envolveu instabilidade aeroelástica e acoplamento de torção e flexão, superando uma simples ressonância. Rigidez EI e GJ são críticas.", render: "renderM1C2" },
      { id: "m1_c3", tag: "EVOLUÇÃO DA TEORIA", title: "Galileu → Euler-Bernoulli", caption: "Galileu (1638) supôs tensão uniforme (incorreto). Euler-Bernoulli (1750): seções planas permanecem planas → deformação linear → linha neutra.", render: "renderM1C3" }
    ]
  },
  {
    id: 2,
    shortTitle: "2. Apoios",
    title: "Vigas & Tipos de Apoios",
    subtitle: "Restrições de movimento e reações externas — apresentação didática com carga vertical.",
    speakers: "Integrante 2 • Vínculos Estruturais",
    notes: [
      "M2.1 — Rolete: bloqueia apenas Ry. Permite deslocamento horizontal (Δx) e rotação (θ).",
      "M2.2 — Pino: bloqueia Rx e Ry, permite rotação. Em vigas, trabalha em conjunto com outro apoio (ex.: biapoiada) para formar sistema estável.",
      "M2.3 — Engaste: bloqueia Rx, Ry e M. Com carga exclusivamente vertical, Rx = 0 por equilíbrio.",
      "Todos os valores são ilustrativos."
    ],
    cards: [
      { id: "m2_c1", tag: "1º GÊNERO • 1 REAÇÃO (Ry)", title: "Apoio Móvel (Rolete)", caption: "Bloqueia apenas Ry. Permite deslocamento horizontal (Δx) e rotação (θ). Exemplo prático: aparelho de apoio elastomérico (neoprene).", render: "renderM2C1" },
      { id: "m2_c2", tag: "2º GÊNERO • 2 REAÇÕES (Rx, Ry)", title: "Apoio Fixo (Pino) — em viga biapoiada", caption: "Pino + rolete compõem viga biapoiada isostática. Trava translação e libera rotação; com carga só vertical, Rx = 0.", render: "renderM2C2" },
      { id: "m2_c3", tag: "3º GÊNERO • 3 REAÇÕES (Rx, Ry, M)", title: "Engaste (Marquise em Balanço)", caption: "Bloqueia translações e rotação, gerando momento reativo M na ligação. Com carga apenas vertical, Rx = 0.", render: "renderM2C3" }
    ]
  },
  {
    id: 3,
    shortTitle: "3. Cargas & Maquete",
    title: "Cargas, Maquete & Linha Neutra",
    subtitle: "Carga pontual vs. distribuída, ensaio na maquete e anatomia interna da seção.",
    speakers: "Integrante 3 (Cargas/Maquete) + Integrante 4 (Fibras/LN)",
    notes: [
      "M3.1 — Mesma resultante (10 kN): carga concentrada gera maior momento/flecha que carga uniformemente distribuída no mesmo vão.",
      "M3.2 — Maquete física: no regime elástico, flecha cresce proporcionalmente à carga e retorna ao descarregar.",
      "M3.3 — Na flexão positiva (concavidade para cima), fibras superiores comprimem e inferiores tracionam; na linha neutra, ε = 0 e σ = 0."
    ],
    cards: [
      { id: "m3_c1", tag: "CARREGAMENTOS EXTERNOS", title: "Carga Pontual (F) vs. Distribuída (q)", caption: "Para a mesma resultante (F = q·L) em viga biapoiada, a flecha na carga concentrada no centro é maior que na distribuída.", render: "renderM3C1" },
      { id: "m3_c2", tag: "ENSAIO EXPERIMENTAL", title: "Ensaio na Maquete Física", caption: "Incremento gradual de carga → flecha δ proporcional no regime elástico → retorno ao descarregar.", render: "renderM3C2" },
      { id: "m3_c3", tag: "ANATOMIA INTERNA (INT. 4)", title: "Compressão, Tração e Linha Neutra", caption: "Fibras superiores comprimidas, inferiores tracionadas e linha neutra sem deformação longitudinal (ε = 0).", render: "renderM3C3" }
    ]
  },
  {
    id: 4,
    shortTitle: "4. Tensões & Lab",
    title: "Tensões & Ensaio Científico (Civil)",
    subtitle: "Fórmula σ = −My/I, perfil borboleta, ensaio de flexão em 4 pontos (NBR 12142) e Lei de Hooke.",
    speakers: "Integrante 4 • Formulação Matemática e Laboratório",
    notes: [
      "M4.1 — Seção plana + Hooke (σ = E·ε) → distribuição linear de tensões: σ = −M·y / I.",
      "M4.2 — Ensaio de flexão em 4 pontos: NBR 12142 (ensaio de tração na flexão). NBR 6118 trata do projeto de estruturas de concreto.",
      "M4.3 — Na zona elástica linear, σ é proporcional a ε com inclinação E; exceder o escoamento causa deformação plástica permanente."
    ],
    cards: [
      { id: "m4_c1", tag: "DEDUÇÃO: σ = −M·y / I", title: "Perfil Borboleta de Tensões", caption: "Deformação linear + Lei de Hooke → tensão linear, nula na linha neutra e máxima nas fibras extremas.", render: "renderM4C1" },
      { id: "m4_c2", tag: "LABORATÓRIO ENG. CIVIL", title: "Ensaio de Flexão em 4 Pontos", caption: "Ensaio normatizado pela NBR 12142. A baixa resistência à tração do concreto justifica o reforço tracionado.", render: "renderM4C2" },
      { id: "m4_c3", tag: "REGIME ELÁSTICO LINEAR", title: "Lei de Hooke (σ = E · ε)", caption: "Inclinação da reta elástica = módulo de elasticidade E. Acima do limite de escoamento há deformação permanente.", render: "renderM4C3" }
    ]
  },
  {
    id: 5,
    shortTitle: "5. Inércia & Otimização",
    title: "Seções, Inércia & Otimização (Produção)",
    subtitle: "Como a geometria governa a rigidez. I = b·h³/12. Perfil I industrial.",
    speakers: "Integrante 5 • Geometria, Inércia (I) e Otimização Industrial",
    notes: [
      "M5.1 — Para retângulo, I = b·h³/12. Dobrar h multiplica I por 8; para mesma área (b·h), aumentar a razão h/b eleva I na proporção de h/b.",
      "M5.2 — Perfil I concentra massa longe da linha neutra (mesas), aumentando o momento de inércia para dada massa.",
      "M5.3 — Em vigas de rolamento e estruturas metálicas (NBR 8800), perfis I/W otimizam rigidez, massa própria e custo."
    ],
    cards: [
      { id: "m5_c1", tag: "INÉRCIA: I = b·h³ / 12", title: "Seção Deitada vs. Seção em Pé", caption: "Aumentar h eleva I = b·h³/12 com potência cúbica; em seções de mesma área, maior altura relativa aumenta a rigidez à flexão.", render: "renderM5C1" },
      { id: "m5_c2", tag: "GEOMETRIA OTIMIZADA (W = I / c)", title: "Seção Maciça vs. Perfil I", caption: "Concentrar material nas mesas (longe da linha neutra) melhora a eficiência de inércia em relação à área/massa.", render: "renderM5C2" },
      { id: "m5_c3", tag: "APLICAÇÃO ENG. DE PRODUÇÃO", title: "Ponte Rolante Industrial", caption: "Perfis estruturais (NBR 8800) combinam resistência à flexão com menor peso próprio em vãos maiores.", render: "renderM5C3" }
    ]
  },
  {
    id: 6,
    shortTitle: "6. Diagramas & Fechamento",
    title: "Diagramas, Dimensionamento & Síntese",
    subtitle: "DEC/DMF, verificação ELU (NBR 8800) simplificada e integração Civil × Produção.",
    speakers: "Integrante 6 + Apoio 4 & 5",
    notes: [
      "M6.1 — Em viga biapoiada com carga central P: V varia de +P/2 a −P/2 e M atinge o máximo P·L/4 onde V = 0.",
      "M6.2 — Na NBR 8800, o dimensionamento baseia-se em estados limites (ex.: Md ≤ MRd), além de checar deformações, cisalhamento e flambagem lateral.",
      "M6.3 — Engenharia Civil e Engenharia de Produção se complementam entre segurança/rigidez e eficiência de recursos/custo."
    ],
    cards: [
      { id: "m6_c1", tag: "ESFORÇOS INTERNOS", title: "DEC (V) e DMF (M) Sincronizados", caption: "No esforço cortante (V), ocorre salto na carga concentrada; onde V = 0, o momento fletor (M) atinge o valor máximo.", render: "renderM6C1" },
      { id: "m6_c2", tag: "VERIFICAÇÃO ELU (NBR 8800)", title: "Dimensionamento Simplificado", caption: "Abordagem didática introdutória; projetos reais seguem critérios normativos completos (ELU/ELS, cisalhamento, flecha e estabilidade).", render: "renderM6C2" },
      { id: "m6_c3", tag: "SÍNTESE MULTIDISCIPLINAR", title: "Eng. Civil × Eng. de Produção", caption: "Segurança estrutural e rigidez (Civil) aliadas à otimização de massa, processos e custos (Produção).", render: "renderM6C3" }
    ]
  }
];

window.SLIDES_DATA = SLIDES_DATA;
