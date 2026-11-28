/* =========================================================
   slidesData.js — Conteúdo dos 6 módulos (revisado tecnicamente)
   Notas do apresentador corrigidas. Valores marcados como ilustrativos.
   ========================================================= */

const SLIDES_DATA = [
  {
    id: 1,
    shortTitle: "1. Abertura",
    title: "Abertura & Histórico",
    subtitle: "O fenômeno físico da flexão, o caso de Tacoma Narrows (flutter aeroelástico) e a evolução de Galileu a Euler-Bernoulli.",
    speakers: "Integrante 1 • Abertura e Contextualização",
    notes: [
      "M1.1 — A viga entorta quando a carga é aplicada: linha elástica. Flexão simples = M + V.",
      "M1.2 — Tacoma Narrows (1940): NÃO foi fadiga nem ressonância. Foi flutter aeroelástico (instabilidade de torção autoexcitada).",
      "M1.3 — Galileu (1638) supôs tensão uniforme (errado). Euler-Bernoulli (1750): seções planas permanecem planas → linha neutra.",
      "Valores nos diagramas são ilustrativos. O foco é a tendência."
    ],
    cards: [
      { id: "m1_c1", tag: "CONCEITO FUNDAMENTAL", title: "Flexão Pura e Simples", caption: "Quando uma carga F ou um momento M curva o eixo da viga, a linha reta indeformada vira linha elástica.", render: "renderM1C1" },
      { id: "m1_c2", tag: "CASO HISTÓRICO (1940)", title: "Tacoma Narrows — Flutter Aeroelástico", caption: "O colapso foi uma instabilidade dinâmica de torção autoexcitada (flutter), NÃO fadiga nem simples ressonância. Lição: rigidez EI e GJ são críticas.", render: "renderM1C2" },
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
      "M2.1 — Rolete: bloqueia só Ry. Permite dilatação horizontal e rotação.",
      "M2.2 — Pino: bloqueia Rx e Ry, permite rotação. Numa aplicação real trabalha SEMPRE com segundo apoio (biapoiada).",
      "M2.3 — Engaste: bloqueia Rx, Ry e M. Com carga só vertical, Rx = 0 por equilíbrio — mostrado como nota.",
      "Todos os valores ilustrativos."
    ],
    cards: [
      { id: "m2_c1", tag: "1º GÊNERO • 1 REAÇÃO (Ry)", title: "Apoio Móvel (Rolete)", caption: "Bloqueia apenas Ry. Permite dilatação horizontal (Δx) e rotação (θ). Exemplo real: neoprene em pontes.", render: "renderM2C1" },
      { id: "m2_c2", tag: "2º GÊNERO • 2 REAÇÕES (Rx, Ry)", title: "Apoio Fixo (Pino) — em viga biapoiada", caption: "Pino + rolete = viga biapoiada (sistema isostático). Permite rotação, mas trava translação. Carga vertical → Rx = 0.", render: "renderM2C2" },
      { id: "m2_c3", tag: "3º GÊNERO • 3 REAÇÕES (Rx, Ry, M)", title: "Engaste (Marquise em Balanço)", caption: "Bloqueia rotação e ambas as translações. Surge momento reativo M na parede. Carga vertical → Rx = 0.", render: "renderM2C3" }
    ]
  },
  {
    id: 3,
    shortTitle: "3. Cargas & Maquete",
    title: "Cargas, Maquete & Linha Neutra",
    subtitle: "Carga pontual vs. distribuída, ensaio na maquete e anatomia interna da seção.",
    speakers: "Integrante 3 (Cargas/Maquete) + Integrante 4 (Fibras/LN)",
    notes: [
      "M3.1 — Mesma carga total (10 kN): pontual concentra; distribuída espalha. Flecha pontual > flecha distribuída.",
      "M3.2 — Maquete física: relação carga × flecha é linear (regime elástico). Medições reais são melhores que valores ilustrativos.",
      "M3.3 — Fibras superiores comprimem; inferiores tracionam; linha neutra não deforma (ε = 0)."
    ],
    cards: [
      { id: "m3_c1", tag: "CARREGAMENTOS EXTERNOS", title: "Carga Pontual (F) vs. Distribuída (q)", caption: "Com mesma resultante (F = q·L), a flecha da pontual é maior. Valores ilustrativos.", render: "renderM3C1" },
      { id: "m3_c2", tag: "ENSAIO EXPERIMENTAL", title: "Ensaio na Maquete Física", caption: "Aplicação gradual de pesos → flecha δ proporcional → retorno elástico ao descarregar. Se houver medição real, use-a!", render: "renderM3C2" },
      { id: "m3_c3", tag: "ANATOMIA INTERNA (INT. 4)", title: "Compressão, Tração e Linha Neutra", caption: "Fibras superiores comprimem (−σ), inferiores tracionam (+σ), linha neutra indeformada (ε = 0).", render: "renderM3C3" }
    ]
  },
  {
    id: 4,
    shortTitle: "4. Tensões & Lab",
    title: "Tensões & Ensaio Científico (Civil)",
    subtitle: "Fórmula σ = −My/I, perfil borboleta, ensaio de flexão em 4 pontos (NBR 12142) e Lei de Hooke.",
    speakers: "Integrante 4 • Formulação Matemática e Laboratório",
    notes: [
      "M4.1 — Dedução: seção plana → ε linear → Hooke → σ linear → σ = −My/I. Diagrama borboleta.",
      "M4.2 — Ensaio de flexão em 4 pontos: NBR 12142 (ensaio de tração na flexão). NBR 6118 é de PROJETO, não de ensaio.",
      "M4.3 — Gráfico σ × ε: reta com inclinação E. Projeto sempre dentro do regime elástico."
    ],
    cards: [
      { id: "m4_c1", tag: "DEDUÇÃO: σ = −M·y / I", title: "Perfil Borboleta de Tensões", caption: "ε linear → σ linear (Hooke) → diagrama triangular. Zero na linha neutra, máximo nas bordas.", render: "renderM4C1" },
      { id: "m4_c2", tag: "LABORATÓRIO ENG. CIVIL", title: "Ensaio de Flexão em 4 Pontos", caption: "Norma do ensaio: NBR 12142 (tração na flexão). Fissura na zona tracionada justifica a armadura de aço.", render: "renderM4C2" },
      { id: "m4_c3", tag: "REGIME ELÁSTICO LINEAR", title: "Lei de Hooke (σ = E · ε)", caption: "Inclinação da reta = módulo E. Projeto sempre na região linear. Além do escoamento = deformação permanente.", render: "renderM4C3" }
    ]
  },
  {
    id: 5,
    shortTitle: "5. Inércia & Otimização",
    title: "Seções, Inércia & Otimização (Produção)",
    subtitle: "Como a geometria governa a rigidez. I = b·h³/12. Perfil I industrial.",
    speakers: "Integrante 5 • Geometria, Inércia (I) e Otimização Industrial",
    notes: [
      "M5.1 — I = b·h³/12. Dobrando h, I ×8 (não ×4). Régua em pé (h = 5b) → rigidez 25× — por causa de (h/b)² = 25.",
      "M5.2 — Perfil I: retira massa do centro (σ ≈ 0) e concentra nas mesas. Percentuais da animação refletem a geometria desenhada (massa ~62%, inércia ~85%).",
      "M5.3 — Aplicação: ponte rolante, racks, mezaninos. NBR 8800."
    ],
    cards: [
      { id: "m5_c1", tag: "INÉRCIA: I = b·h³ / 12", title: "Régua Deitada vs. Régua em Pé", caption: "Dobrando h, I ×8. Régua em pé (h = 5b) → rigidez 25× por causa de (h/b)² = 25, não do h³ isolado.", render: "renderM5C1" },
      { id: "m5_c2", tag: "GEOMETRIA OTIMIZADA (W = I / c)", title: "Seção Maciça vs. Perfil I", caption: "Remover massa da zona de baixa tensão. Percentuais refletem a geometria. Tendência: menos massa, mesma rigidez.", render: "renderM5C2" },
      { id: "m5_c3", tag: "APLICAÇÃO ENG. DE PRODUÇÃO", title: "Ponte Rolante Industrial", caption: "Viga W de alma esbelta vence grandes vãos com peso próprio baixo. NBR 8800.", render: "renderM5C3" }
    ]
  },
  {
    id: 6,
    shortTitle: "6. Diagramas & Fechamento",
    title: "Diagramas, Dimensionamento & Síntese",
    subtitle: "DEC/DMF, verificação ELU (NBR 8800) simplificada e integração Civil × Produção.",
    speakers: "Integrante 6 + Apoio 4 & 5",
    notes: [
      "M6.1 — DEC salta em carga concentrada. DMF pico onde V = 0. M_máx = P·L/4.",
      "M6.2 — Verificação ELU (NBR 8800): Md ≤ MRd. σ_adm/FS é versão didática. Falta checar flecha, cisalhamento e flambagem lateral.",
      "M6.3 — Civil: segurança e rigidez. Produção: massa e custo. As duas juntas."
    ],
    cards: [
      { id: "m6_c1", tag: "ESFORÇOS INTERNOS", title: "DEC (V) e DMF (M) Sincronizados", caption: "DEC salta de +P/2 para −P/2 na carga. DMF tem pico M_máx = P·L/4 onde V = 0.", render: "renderM6C1" },
      { id: "m6_c2", tag: "VERIFICAÇÃO ELU (NBR 8800)", title: "Dimensionamento Simplificado", caption: "Md ≤ MRd. Verificação didática por tensão — projeto real exige flecha, cisalhamento e flambagem lateral. Valores ilustrativos.", render: "renderM6C2" },
      { id: "m6_c3", tag: "SÍNTESE MULTIDISCIPLINAR", title: "Eng. Civil × Eng. de Produção", caption: "Civil garante segurança e rigidez. Produção otimiza massa e custo. Juntas: engenharia de excelência.", render: "renderM6C3" }
    ]
  }
];

window.SLIDES_DATA = SLIDES_DATA;
