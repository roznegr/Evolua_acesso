import { buildSalesSummary } from './report.js';

export const ASSESSMENT_VERSION = '1.0';

/** Mantém `scores` (diagnóstico) e `commercial` (qualificação) sempre separados. */
export function buildAssessment({ answers, diagnosis, commercial }) {
  return {
    version: ASSESSMENT_VERSION,
    answers: structuredClone(answers),
    scores: {
      byDimension: Object.fromEntries(
        Object.entries(diagnosis.scores).map(([d, s]) => [d, { raw: s.raw, max: s.max, pct: s.pct, level: s.level }]),
      ),
      primaryGap: diagnosis.primaryGap,
      secondaryGaps: diagnosis.secondaryGaps,
    },
    commercial: { ...commercial },
  };
}

/** Payload completo do lead (contém PII — vai só para o endpoint da Evolua, nunca para GA4). */
export function buildLeadPayload({ leadId, contact, consent, source, answers, diagnosis, commercial, now = new Date() }) {
  return {
    type: 'lead',
    leadId,
    submittedAt: now.toISOString(),
    contact,
    consent,
    source,
    assessment: buildAssessment({ answers, diagnosis, commercial }),
    salesSummary: buildSalesSummary({ contact, answers, diagnosis, commercial }),
  };
}

/** Atualização posterior (ex.: timing respondido após a captura). Sem PII. */
export function buildLeadUpdatePayload({ leadId, commercial, now = new Date() }) {
  return { type: 'lead_update', leadId, updatedAt: now.toISOString(), commercial: { ...commercial } };
}
