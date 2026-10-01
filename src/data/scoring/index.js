/**
 * Pesos e regras do motor. NENHUM texto aqui — só números e mapeamentos.
 * Para ajustar o diagnóstico, edite este arquivo (e os testes em tests/engine.test.js).
 *
 * Dimensões internas: accessControl | traceability | continuity | efficiency
 */
export const DIMENSIONS = ['accessControl', 'traceability', 'continuity', 'efficiency'];

/** Níveis por percentual normalizado (0–100). O percentual NUNCA é exibido ao visitante. */
export const THRESHOLDS = { improvement: 40, structured: 70 }; // <40 attention · 40–69 improvement · ≥70 structured

/** Perguntas cujo valor soma pontos. `unitRange`, `mainPain`, `userRole` NÃO pontuam. */
export const DIAGNOSTIC_WEIGHTS = {
  // Modelo sozinho não prova controle: só pesa continuidade e eficiência, e de forma pequena.
  currentModel: {
    porter_24h: { continuity: 1, efficiency: 1 },
    porter_partial: { continuity: 1, efficiency: 1 },
    remote: { continuity: 2, efficiency: 2 },
    hybrid: { continuity: 2, efficiency: 2 },
    undefined: { continuity: 0, efficiency: 0 },
  },
  visitorProcess: {
    pre_authorized: { accessControl: 3, traceability: 2, efficiency: 3 },
    confirm_now: { accessControl: 2, traceability: 1, efficiency: 1 },
    whatsapp: { accessControl: 2, traceability: 1, efficiency: 2 },
    app_system: { accessControl: 3, traceability: 3, efficiency: 3 },
    no_single_process: { accessControl: 0, traceability: 0, efficiency: 0 },
    unknown: { accessControl: 1, traceability: 0, efficiency: 0 },
  },
  // Peso alto em rastreabilidade (máx. 4).
  accessRecords: {
    fast: { traceability: 4 },
    laborious: { traceability: 3 },
    partial: { traceability: 2 },
    no: { traceability: 0 },
    unknown: { traceability: 1 },
  },
  cameraCoverage: {
    full_coverage: { accessControl: 3, traceability: 3 },
    gaps: { accessControl: 2, traceability: 2 },
    unknown_access: { accessControl: 2, traceability: 1 },
    very_limited: { accessControl: 1, traceability: 1 },
    none: { accessControl: 0, traceability: 0 },
    unknown: { accessControl: 1, traceability: 0 },
  },
  contingency: {
    defined: { continuity: 4 },
    doubts: { continuity: 3 },
    depends: { continuity: 2 },
    none: { continuity: 0 },
    unknown: { continuity: 1 },
  },
};

/** Respostas "não sei" — usadas para gerar o insight de visibilidade. */
export const UNSURE_VALUES = {
  visitorProcess: ['unknown'],
  accessRecords: ['unknown'],
  cameraCoverage: ['unknown', 'unknown_access'],
  contingency: ['unknown'],
};

/** Desempate quando duas dimensões têm o mesmo percentual: a dor declarada vem primeiro, depois esta ordem. */
export const GAP_TIEBREAK_ORDER = ['continuity', 'traceability', 'accessControl', 'efficiency'];

/** Dor declarada → dimensão relacionada (só destaque/personalização; NÃO altera score). */
export const PAIN_DIMENSION = {
  access_security: 'accessControl',
  cost: 'efficiency',
  visitors: 'accessControl',
  providers: 'accessControl',
  deliveries: 'efficiency',
  no_records: 'traceability',
  porter_dependency: 'continuity',
  resident_complaints: 'efficiency',
  no_specific: null,
};

/** Qualificação comercial — INDEPENDENTE do diagnóstico. Uso interno (Evolua), nunca exibido nem enviado ao GA4. */
export const COMMERCIAL = {
  profile: { up_to_20: 1, '21_50': 2, '51_100': 3, '101_200': 4, over_200: 4, unknown: 0 },
  authority: { sindico: 4, administradora: 4, subsindico: 3, conselheiro: 3, morador: 1, other: 1 },
  timingActive: ['evaluating', 'next_months', 'discussed'],
  // priority | nurture | influencer — nenhum lead é descartado.
  // priority: decisor (authority ≥ priorityAuthority) COM dor concreta ou intenção ativa; ou qualquer papel
  //           com authority ≥ 3 que já esteja avaliando alternativas.
  // influencer: authority ≤ influencerMaxAuthority (ex.: morador). Demais → nurture.
  routing: {
    priorityAuthority: 4,
    influencerMaxAuthority: 1,
  },
};
