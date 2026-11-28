/* =========================================================
   slidesData.js — Conteúdo textual dos 6 módulos.
   Os cards apontam para as funções de render do engine.js.
   ========================================================= */

const SLIDES_DATA = [
  {
    id: 1,
    shortTitle: "1. Abertura",
    title: "Abertura & Histórico",
    subtitle: "Apresentação do fenômeno físico da flexão em vigas, acidentes históricos emblemáticos e a evolução científica de Galileu até Euler-Bernoulli.",
    speakers: "Integrante 1 • Abertura e Contextualização",
    notes: [
      "Contextualize o tema e apresente os 6 módulos.",
      "Explique o que é flexão pura e simples.",
      "Comente o caso histórico de Tacoma Narrows (1940).",
      "Destaque a evolução: Galileu (1638) → Euler-Bernoulli (1750)."
    ],
    cards: [
      { id: "m1_c1", tag: "CONCEITO FUNDAMENTAL", title: "O Que é Flexão Pura e Simples?", caption: "Esforços transversais (F) ou momentos fletores (M) curvem o eixo longitudinal da viga, transformando a linha reta indeformada na linha elástica.", render: "renderM1C1" },
      { id: "m1_c2", tag: "CASO HISTÓRICO (1940)", title: "Colapso de Tacoma Narrows & Fadiga", caption: "Oscilações dinâmicas crescentes de flexão e torção levaram ao colapso estrutural, impulsionando o rigor no cálculo de rigidez e estabilidade.", render: "renderM1C2" },
      { id: "m1_c3", tag: "EVOLUÇÃO DA TEORIA", title: "Linha do Tempo: Galileu → Euler-Bernoulli", caption: "De Galileu (1638, tensão uniforme incorreta) à hipótese de Euler-Bernoulli (1750): seções planas permanecem planas, gerando deformação linear.", render: "renderM1C3" }
    ]
  },
  {
    id: 2,
    shortTitle: "2. Apoios",
    title: "Vigas & Tipos de Apoios",
    subtitle: "Como as restrições de movimento determinam as reações externas: Apoio Móvel (1º Gênero), Apoio Fixo (2º Gênero) e Engaste (3º Gênero).",
    speakers: "Integrante 2 • Vínculos Estruturais no Dia a Dia",
    notes: [
      "Apoio Móvel: 1 reação (Ry). Permite dilatação.",
      "Apoio Fixo: 2 reações (Rx, Ry). Permite rotação.",
      "Engaste: 3 reações (Rx, Ry, M). Bloqueia tudo.",
      "Exemplos reais: rolete de ponte, pino de portão, marquise."
    ],
    cards: [
      { id: "m2_c1", tag: "1º GÊNERO • 1 REAÇÃO (Ry)", title: "Apoio Móvel (Roletes / Neoprene de Ponte)", caption: "Bloqueia apenas o deslocamento vertical (Ry), permitindo livre dilatação horizontal (Δx) e rotação angular (θ) sem gerar tensões térmicas.", render: "renderM2C1" },
      { id: "m2_c2", tag: "2º GÊNERO • 2 REAÇÕES (Rx, Ry)", title: "Apoio Fixo (Pino Articulado / Dobradiça)", caption: "Impede translação vertical (Ry) e horizontal (Rx) sob cargas inclinadas, mas permite livre rotação (θ) da viga sem momento reativo.", render: "renderM2C2" },
      { id: "m2_c3", tag: "3º GÊNERO • 3 REAÇÕES (Rx, Ry, M)", title: "Engaste (Marquise / Prateleira na Parede)", caption: "Restringe totalmente translações (Rx, Ry) e rotação (θ), fazendo surgir um Momento Fletor Reativo (M) na parede para equilibrar o balanço.", render: "renderM2C3" }
    ]
  },
  {
    id: 3,
    shortTitle: "3. Cargas & Maquete",
    title: "Cargas, Maquete & Linha Neutra",
    subtitle: "Comparação entre cargas concentradas e distribuídas, ensaio físico na maquete biapoiada e comportamento interno de tração, compressão e Linha Neutra.",
    speakers: "Integrante 3 (Cargas/Maquete) + Integrante 4 (Fibras/LN)",
    notes: [
      "Carga pontual concentra tensão. Distribuída espalha.",
      "A maquete mostra a flecha δ crescendo com o peso.",
      "Fibras superiores comprimem (azul). Fibras inferiores tracionam (vermelho).",
      "Linha neutra é o plano de comprimento indeformado."
    ],
    cards: [
      { id: "m3_c1", tag: "CARREGAMENTOS EXTERNOS", title: "Carga Pontual (F) vs. Distribuída (q)", caption: "Alternância entre carga concentrada no meio do vão e carga uniformemente distribuída (q = F/L), comparando reações e flecha máxima (δ).", render: "renderM3C1" },
      { id: "m3_c2", tag: "ENSAIO EXPERIMENTAL", title: "Simulação da Maquete Física Biapoiada", caption: "Aplicação gradual de pesos no centro da maquete com leitura em tempo real da flecha vertical (δ) e retorno elástico ao descarregar.", render: "renderM3C2" },
      { id: "m3_c3", tag: "ANATOMIA INTERNA (INT. 4)", title: "Compressão, Tração e Linha Neutra (LN)", caption: "Fibras superiores comprimidas em Azul (-σ), inferiores tracionadas em Vermelho (+σ) e plano central Dourado sem variação de comprimento (ε = 0).", render: "renderM3C3" }
    ]
  },
  {
    id: 4,
    shortTitle: "4. Tensões & Lab",
    title: "Tensões & Ensaio Científico (Civil)",
    subtitle: "Equação da flexão σ = -M·y/I, perfil linear de tensões na seção transversal, ensaio de flexão em laboratório e Lei de Hooke.",
    speakers: "Integrante 4 • Formulação Matemática e Laboratório",
    notes: [
      "Deduza σ = -My/I.",
      "Perfil de tensão é triangular (borboleta).",
      "Ensaio de 4 pontos: fissura na zona tracionada.",
      "Lei de Hooke: σ = E·ε."
    ],
    cards: [
      { id: "m4_c1", tag: "EQUAÇÃO DA FLEXÃO: σ = -M·y / I", title: "Perfil Triangular (Borboleta) de Tensões", caption: "A tensão normal cresce linearmente a partir da Linha Neutra (y = 0, σ = 0) até atingir os picos máximos de compressão e tração nas bordas (±c).", render: "renderM4C1" },
      { id: "m4_c2", tag: "LABORATÓRIO ENG. CIVIL", title: "Ensaio de Flexão em 4 Pontos (Concreto)", caption: "Prensa universal aplica carga em prisma de concreto: na zona de momento constante, surge fissura na face inferior tracionada (justificando o aço).", render: "renderM4C2" },
      { id: "m4_c3", tag: "REGIME ELÁSTICO LINEAR", title: "Lei de Hooke Sincronizada (σ = E · ε)", caption: "Enquanto a tensão permanece abaixo do limite de escoamento, deformação e curvatura obedecem à reta de rigidez E, sem deformação residual.", render: "renderM4C3" }
    ]
  },
  {
    id: 5,
    shortTitle: "5. Inércia & Otimização",
    title: "Seções, Inércia & Otimização (Produção)",
    subtitle: "Como a geometria da seção transversal governa a rigidez à flexão e como a Engenharia de Produção otimiza massa, custo e desempenho industrial.",
    speakers: "Integrante 5 • Geometria, Inércia (I), Módulo (W) e Indústria",
    notes: [
      "I = b·h³/12. Dobrar h quadruplica a rigidez.",
      "Perfil I remove material ocioso do centro.",
      "W = I/c (módulo de resistência).",
      "Aplicação: racks, pontes rolantes, mezaninos."
    ],
    cards: [
      { id: "m5_c1", tag: "INÉRCIA: I = b·h³ / 12", title: "Régua Deitada vs. Régua em Pé", caption: "Sob a mesma carga F, colocar a seção em pé eleva a altura (h) ao cubo, multiplicando o Momento de Inércia (I) e reduzindo drasticamente a flecha (δ).", render: "renderM5C1" },
      { id: "m5_c2", tag: "EFICIÊNCIA GEOMÉTRICA (W = I / y_máx)", title: "Seção Maciça vs. Perfil I Otimizado", caption: "Remover material perto da Linha Neutra (onde σ ≈ 0) e concentrar nas mesas reduz até 55% da massa mantendo alta resistência à flexão.", render: "renderM5C2" },
      { id: "m5_c3", tag: "APLICAÇÃO ENG. DE PRODUÇÃO", title: "Ponte Rolante Industrial em Perfil W", caption: "Viga metálica de alma esbelta suporta cargas móveis em galpão fabril com menor peso próprio, menor custo de fundação e maior vão livre.", render: "renderM5C3" }
    ]
  },
  {
    id: 6,
    shortTitle: "6. Diagramas & Fechamento",
    title: "Diagramas, Caso Real & Fechamento",
    subtitle: "Traçado sincronizado de Cortante (DEC) e Momento Fletor (DMF), dimensionamento prático de uma viga real e integração Civil × Produção.",
    speakers: "Integrante 6 + Apoio 4 & 5 • Síntese Final",
    notes: [
      "DEC salta onde há carga concentrada.",
      "DMF atinge pico onde V = 0.",
      "Dimensionamento: M → σ → W → verificação FS.",
      "Síntese: segurança (Civil) + economia (Produção)."
    ],
    cards: [
      { id: "m6_c1", tag: "ESFORÇOS INTERNOS SOLICITANTES", title: "Diagramas Sincronizados: DEC (V) e DMF (M)", caption: "Para carga central P, o Cortante (DEC) salta de +P/2 para -P/2 no meio do vão, exatamente onde o Momento Fletor (DMF) atinge o pico M_máx = P·L/4.", render: "renderM6C1" },
      { id: "m6_c2", tag: "VERIFICAÇÃO ESTRUTURAL REAL", title: "Dimensionamento Passo a Passo (FS ≥ 1.5)", caption: "Fluxo de cálculo em tempo real: dados do vão e carga → M_máx → tensão atuante σ = M_máx/W → aprovação com Fator de Segurança.", render: "renderM6C2" },
      { id: "m6_c3", tag: "SÍNTESE MULTIDISCIPLINAR", title: "Engenharia Civil × Engenharia de Produção", caption: "A convergência perfeita: rigor normativo, rigidez e segurança (Civil) aliados à economia de material, leveza e produtividade (Produção).", render: "renderM6C3" }
    ]
  }
];

window.SLIDES_DATA = SLIDES_DATA;
