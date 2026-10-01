import { QUESTIONS, getQuestion } from '../data/questions/index.js';
import {
  DIMENSIONS,
  THRESHOLDS,
  DIAGNOSTIC_WEIGHTS,
  UNSURE_VALUES,
  GAP_TIEBREAK_ORDER,
  PAIN_DIMENSION,
} from '../data/scoring/index.js';
import { INSIGHTS, VISIBILITY_INSIGHT } from '../data/results/index.js';

/** Máximo possível por dimensão, derivado dos pesos (nada hardcoded). */
export function maxScores() {
  const max = Object.fromEntries(DIMENSIONS.map((d) => [d, 0]));
  for (const table of Object.values(DIAGNOSTIC_WEIGHTS)) {
    for (const d of DIMENSIONS) {
      max[d] += Math.max(0, ...Object.values(table).map((w) => w[d] || 0));
    }
  }
  return max;
}

export function levelFor(pct) {
  if (pct >= THRESHOLDS.structured) return 'structured';
  if (pct >= THRESHOLDS.improvement) return 'improvement';
  return 'attention';
}

/** Retorna os ids de perguntas ainda sem resposta válida. */
export function missingAnswers(answers = {}) {
  return QUESTIONS.filter((q) => {
    const a = answers[q.id];
    if (q.type === 'multi') return !Array.isArray(a) || a.length === 0;
    return !a;
  }).map((q) => q.id);
}

/** Normaliza a resposta da dor: array ordenado → { main, secondary }. */
export function painOf(answers) {
  const list = Array.isArray(answers.mainPain) ? answers.mainPain : [];
  return { main: list[0] || null, secondary: list[1] || null };
}

/**
 * Motor de diagnóstico. Puro e determinístico: mesma entrada → mesma saída.
 * A dor (mainPain), o papel e o porte NÃO alteram scores — só a narrativa/destaques.
 */
export function diagnose(answers) {
  const missing = missingAnswers(answers);
  if (missing.length) throw new Error(`Respostas incompletas: ${missing.join(', ')}`);

  const max = maxScores();
  const raw = Object.fromEntries(DIMENSIONS.map((d) => [d, 0]));
  for (const [qid, table] of Object.entries(DIAGNOSTIC_WEIGHTS)) {
    const weights = table[answers[qid]];
    if (!weights) throw new Error(`Resposta desconhecida para ${qid}: ${answers[qid]}`);
    for (const d of DIMENSIONS) raw[d] += weights[d] || 0;
  }

  const scores = {};
  for (const d of DIMENSIONS) {
    const pct = max[d] === 0 ? 0 : Math.round((raw[d] / max[d]) * 100);
    scores[d] = { raw: raw[d], max: max[d], pct, level: levelFor(pct) };
  }

  const { main: mainPain, secondary: secondaryPain } = painOf(answers);
  const painDims = [PAIN_DIMENSION[mainPain], PAIN_DIMENSION[secondaryPain]].filter(Boolean);

  // Ordena as dimensões que NÃO estão "estruturadas": menor pct primeiro; empate → dor, depois ordem fixa.
  const gaps = DIMENSIONS.filter((d) => scores[d].level !== 'structured').sort((a, b) => {
    if (scores[a].pct !== scores[b].pct) return scores[a].pct - scores[b].pct;
    const pa = painDims.includes(a) ? 0 : 1;
    const pb = painDims.includes(b) ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return GAP_TIEBREAK_ORDER.indexOf(a) - GAP_TIEBREAK_ORDER.indexOf(b);
  });

  const unsureCount = Object.entries(UNSURE_VALUES).filter(([q, vals]) => vals.includes(answers[q])).length;
  const insights = INSIGHTS.filter((i) => i.when.values.includes(answers[i.when.question]));
  if (unsureCount >= VISIBILITY_INSIGHT.minUnsure) insights.push({ ...VISIBILITY_INSIGHT, dimension: null });

  return {
    scores,
    levels: Object.fromEntries(DIMENSIONS.map((d) => [d, scores[d].level])),
    primaryGap: gaps[0] || null,
    secondaryGaps: gaps.slice(1),
    attentionCount: gaps.length,
    painDimensions: painDims,
    mainPain,
    secondaryPain,
    unsureCount,
    insights,
  };
}

export function answerLabel(questionId, value) {
  const q = getQuestion(questionId);
  return q?.options.find((o) => o.value === value)?.label ?? String(value ?? '');
}
