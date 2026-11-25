/* =========================================================
   slidesData.js — CONTEÚDO dos 6 módulos.
   Edite textos, notas, citações e cronologias aqui.
   ========================================================= */

const SLIDES_DATA = [
  // =====================================================
  // MÓDULO 1 — Histórico & Marcos da Flexão
  // =====================================================
  {
    id: "m1",
    eyebrow: "Módulo 01 · Storytelling",
    title: "Histórico & Marcos da Flexão",
    subtitle: "Da ruptura de vigas de Galileu à síntese de Navier",
    presenter: { name: "Apresentador 1", level: "visual", role: "Fala leve" },
    notes: [
      "Percorra a timeline clicando nas setas ou nos pontos: cada parada revela um marco.",
      "Galileu (1638) superestimou a resistência porque supôs tensão uniforme na seção — faltava o conceito de linha neutra.",
      "Euler-Bernoulli (1750) formulou a equação da linha elástica EI·y'' = M(x).",
      "Navier (1826) generalizou a teoria de tensões (σ = −My/I).",
      "Feche com o caso real da ponte de Quebec (1907) e por que ele motivou normas modernas."
    ],
    content: {
      timeline: [
        { year: "1638", title: "Galileu Galilei", desc: "Duas Novas Ciências. Primeiros ensaios em vigas em balanço; tensão suposta uniforme (superestima a resistência)." },
        { year: "1678", title: "Robert Hooke", desc: "Lei de Hooke (ut tensio, sic vis): deformação proporcional à força. Base do regime elástico linear." },
        { year: "1750", title: "Euler–Bernoulli", desc: "Equação da linha elástica: EI·d²y/dx² = M(x). Consolida a teoria de vigas esbeltas." },
        { year: "1826", title: "Navier", desc: "Résumé des Leçons: teoria geral de tensões na seção; nasce a fórmula σ = −My/I." },
        { year: "1855", title: "Saint-Venant", desc: "Princípio da decomposição de esforços e torção; consolida a mecânica dos sólidos moderna." },
        { year: "1907", title: "Ruptura da ponte de Quebec", desc: "Falha estrutural real com 75 vítimas. Impulsiona revisão de coeficientes de segurança e normas modernas." },
        { year: "1940", title: "Normas modernas", desc: "Consolidação dos estados limites e coeficientes parciais de segurança (base das NBRs atuais)." }
      ],
      citation: {
        text: "A natureza não revela seus segredos a quem não a interroga com a experiência.",
        cite: "Galileu Galilei — paráfrase de Il Saggiatore (1623)"
      }
    }
  },

  // =====================================================
  // MÓDULO 2 — Conceito, Tipos de Vigas e Apoios
  // =====================================================
  {
    id: "m2",
    eyebrow: "Módulo 02 · Conceitual / Visual",
    title: "Conceito de Flexão, Tipos de Vigas e Apoios",
    subtitle: "Esforços internos, graus de liberdade e reações de apoio",
    presenter: { name: "Apresentador 2", level: "visual", role: "Fala leve" },
    notes: [
      "Explique flexão pura (só M) vs. flexão simples (M + V).",
      "Apoio móvel: 1 reação vertical. Fixo: Rv + Rh. Engaste: Rv + Rh + M.",
      "Use o botão 'Play' para soltar a carga e o botão 'Reações' para revelar o diagrama de corpo livre.",
      "Exemplo real: aparelho de apoio elastomérico em pontes (móvel) vs. marquise engastada."
    ],
    content: {
      definitions: [
        { term: "Flexão pura", desc: "Atua apenas momento fletor M; esforço cortante V = 0. Ex.: trecho central de viga com cargas simétricas." },
        { term: "Flexão simples", desc: "Atuam simultaneamente M(x) e V(x). Caso mais comum em vigas de edifícios e pontes." },
        { term: "Momento fletor M", desc: "Tende a curvar o eixo da viga. Gera tração em uma face e compressão na oposta." },
        { term: "Esforço cortante V", desc: "Tende a cisalhar a seção. Responsável pelas tensões tangenciais." }
      ],
      supports: [
        { type: "Apoio móvel (rolete)", reactions: "1 reação vertical (Rv)", dof: "Bloqueia translação vertical.", real: "Aparelho de apoio elastomérico em pontes." },
        { type: "Apoio fixo (pino)", reactions: "Rv + Rh", dof: "Bloqueia translação vertical e horizontal.", real: "Apoio articulado em pórticos metálicos." },
        { type: "Engaste (fixo rígido)", reactions: "Rv + Rh + M", dof: "Bloqueia translação e rotação.", real: "Marquises engastadas em fachadas." }
      ]
    }
  },

  // =====================================================
  // MÓDULO 3 — Carregamentos & Laboratório Virtual
  // =====================================================
  {
    id: "m3",
    eyebrow: "Módulo 03 · Demonstração ao Vivo",
    title: "Carregamentos & Laboratório Virtual de Deformação",
    subtitle: "Carga concentrada, distribuída e o encurtamento das fibras",
    presenter: { name: "Apresentador 3", level: "visual", role: "Demonstração" },
    notes: [
      "Diferencie carga pontual (kN), uniforme (kN/m) e variável (triangular).",
      "No laboratório virtual: clique em 'Play' para carregar a viga e ver as fibras superiores encurtarem (compressão) e as inferiores alongarem (tração).",
      "Aponte a linha neutra indeformada ao centro.",
      "Use a demonstração física (régua / tira de borracha) junto com a tela."
    ],
    content: {
      loadTypes: [
        { name: "Carga concentrada", unit: "F [N]", icon: "▼", desc: "Força aplicada em um ponto. Ex.: reação de pilar sobre viga." },
        { name: "Carga distribuída uniforme", unit: "q [N/m]", icon: "▤", desc: "Constante ao longo do vão. Ex.: peso próprio de laje, neve." },
        { name: "Carga distribuída variável", unit: "w(x) [N/m]", icon: "◢", desc: "Varia linearmente (ex.: empuxo hidrostático, vento)." }
      ]
    }
  },

  // =====================================================
  // MÓDULO 4 — Tensões no Regime Elástico & Experimental
  // =====================================================
  {
    id: "m4",
    eyebrow: "Módulo 04 · Técnico + Pesquisa",
    title: "Tensões no Regime Elástico & Estudo Experimental",
    subtitle: "Fórmula da flexão, Lei de Hooke e ensaios em concreto armado",
    presenter: { name: "Apresentador 4", level: "tech", role: "Fala técnica" },
    notes: [
      "Deduza σ = −My/I a partir da Lei de Hooke e da compatibilidade de deformações.",
      "Explique FS = σ_adm / σ_max ≥ 1,5.",
      "Estudo de caso: ensaio de flexão em 4 pontos em viga de concreto armado.",
      "Concreto fissura na zona tracionada; armadura de aço assume o esforço.",
      "Cite ABNT NBR 6118 (estruturas de concreto)."
    ],
    content: {
      formulas: [
        { label: "Fórmula da Flexão", latex: "\\sigma_x = -\\dfrac{M \\cdot y}{I}" },
        { label: "Lei de Hooke (1D)", latex: "\\sigma = E \\cdot \\varepsilon" },
        { label: "Módulo de Resistência", latex: "W = \\dfrac{I}{c} \\;\\Rightarrow\\; \\sigma_{max} = \\dfrac{M_{max}}{W}" },
        { label: "Fator de Segurança", latex: "FS = \\dfrac{\\sigma_{adm}}{\\sigma_{max}} \\geq 1{,}5" }
      ],
      caseStudy: {
        title: "Ensaio de flexão em 4 pontos — concreto armado",
        points: [
          "Viga biapoiada de concreto armado ensaiada até ruptura.",
          "Zona tracionada (inferior) fissura primeiro — concreto tem baixa resistência à tração (f_ct ≈ 10% de f_c).",
          "Armadura de aço (CA-50, f_yk = 500 MPa) entra em ação e garante ductilidade.",
          "Norma: ABNT NBR 6118 — Projeto de estruturas de concreto."
        ],
        reference: "Ref.: ABNT NBR 6118:2023; Beer & Johnston — Mecânica dos Materiais, cap. 4; Hibbeler — Resistência dos Materiais, cap. 6."
      },
      citation: {
        text: "A resistência dos materiais é a ciência que estuda as condições de equilíbrio e deformação dos corpos sólidos.",
        cite: "Claude-Louis Navier — Résumé des Leçons (1826)"
      }
    }
  },

  // =====================================================
  // MÓDULO 5 — Geometria da Seção & Otimização
  // =====================================================
  {
    id: "m5",
    eyebrow: "Módulo 05 · Técnico + Cálculos",
    title: "Geometria da Seção, Momento de Inércia & Otimização",
    subtitle: "Por que o perfil I vence o retângulo com a mesma massa",
    presenter: { name: "Apresentador 5", level: "tech", role: "Fala técnica" },
    notes: [
      "Compare retângulo, perfil I, tubular e triângulo com a mesma área.",
      "Perfil I tem maior I e maior W — mais eficiente.",
      "W = I/c: a fibra mais distante é o que importa.",
      "Aplicação Eng. Produção: seleção de perfis ABNT NBR 8800 em mezaninos e porta-paletes."
    ],
    content: {
      formulas: [
        { label: "Retângulo", latex: "I = \\dfrac{b\\,h^3}{12}, \\quad W = \\dfrac{b\\,h^2}{6}" },
        { label: "Triângulo", latex: "I = \\dfrac{b\\,h^3}{36}, \\quad W = \\dfrac{b\\,h^2}{24}" },
        { label: "Perfil I / Tubo", latex: "I = \\dfrac{b\\,h^3 - b_i\\,h_i^3}{12}" }
      ],
      optimization: {
        title: "Otimização Estrutural — Aplicação Eng. de Produção",
        points: [
          "Em mezaninos industriais e racks, o perfil I substitui o retângulo com 40–60% menos aço para a mesma capacidade.",
          "Norma: ABNT NBR 8800 — Projeto de estruturas de aço e mistas.",
          "Quanto maior I com a mesma área, maior W e menor σ_max → menor custo.",
          "Conceito-chave: inércia é 'massa distribuída longe da linha neutra'."
        ]
      }
    }
  },

  // =====================================================
  // MÓDULO 6 — Diagramas V, M + Calculadora + Síntese
  // =====================================================
  {
    id: "m6",
    eyebrow: "Módulo 06 · Técnico + Fechamento",
    title: "Diagramas (V e M), Calculadora Prática & Síntese Civil × Produção",
    subtitle: "Estudo de caso numérico ao vivo e painel comparativo final",
    presenter: { name: "Apresentador 6", level: "tech", role: "Fechamento" },
    notes: [
      "Resolva o caso: viga biapoiada com balanço e carga concentrada.",
      "Percorra os sliders e mostre V(x) e M(x) se redesenhando.",
      "Identifique M_max, σ_max e o W necessário.",
      "Feche com o painel Civil × Produção e a decisão segurança × manutenção × custo."
    ],
    content: {
      caseTitle: "Estudo de caso: viga de rolamento de ponte rolante",
      synthesis: {
        civil: {
          title: "🏗 Engenharia Civil",
          items: [
            "Pontes e viadutos: vigas principais de concreto protendido.",
            "Lajes de edifícios: dimensionamento à flexão (NBR 6118).",
            "Vigas de edifícios metálicos (NBR 8800)."
          ]
        },
        production: {
          title: "⚙ Engenharia de Produção",
          items: [
            "Viga de rolamento de ponte rolante / talha transportadora.",
            "Bases de máquinas industriais (vibração + flexão).",
            "Porta-paletes e mezaninos: otimização de aço × capacidade.",
            "Decisão: segurança × manutenção × custo total."
          ]
        }
      }
    }
  }
];

window.SLIDES_DATA = SLIDES_DATA;