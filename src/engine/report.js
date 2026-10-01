import {
  DIMENSION_META,
  DIMENSION_COPY,
  LEVEL_LABELS,
  PAIN_COPY,
  PAIN_LABELS,
  ROLE_COPY,
  DISCUSSION_QUESTIONS,
  SOLUTION_EVALUATION_QUESTIONS,
  DISCLAIMER,
  FULL_RESULT_COPY,
  PAIN_BRIDGE,
} from '../data/results/index.js';
import { DIMENSIONS } from '../data/scoring/index.js';
import { answerLabel } from './diagnosis.js';

/**
 * Modelo do relatório/kit de assembleia, independente de formato.
 * Hoje renderizado como HTML imprimível (ver ui/printReport.js); no futuro, o mesmo modelo
 * pode alimentar um gerador de PDF (server-side ou jsPDF) sem tocar no motor.
 */
export function buildReport({ answers, diagnosis, condominium = '', city = '', generatedAt = new Date() }) {
  const dimensions = DIMENSIONS.map((d) => ({
    id: d,
    label: DIMENSION_META[d].label,
    level: diagnosis.levels[d],
    levelLabel: LEVEL_LABELS[diagnosis.levels[d]],
    text: DIMENSION_COPY[d][diagnosis.levels[d]],
  }));

  const focus = [diagnosis.primaryGap, ...diagnosis.secondaryGaps].filter(Boolean);
  const discussion = (focus.length ? focus : DIMENSIONS).flatMap((d) => DISCUSSION_QUESTIONS[d]);
  const pain = PAIN_COPY[diagnosis.mainPain];

  return {
    version: 1,
    title: `Análise preliminar${condominium ? ` — ${condominium}` : ''}`,
    subtitle: city || '',
    generatedAt: generatedAt.toISOString(),
    role: ROLE_COPY[answers.userRole]?.label ?? '',
    summary: {
      attentionCount: diagnosis.attentionCount,
      text: diagnosis.attentionCount ? FULL_RESULT_COPY.closing : FULL_RESULT_COPY.allStructured,
    },
    dimensions,
    insights: diagnosis.insights.map((i) => i.text),
    concerns: [diagnosis.mainPain, diagnosis.secondaryPain]
      .filter(Boolean)
      .map((p) => ({ id: p, label: PAIN_LABELS[p] })),
    painNarrative: pain ? { ...pain, bridge: PAIN_BRIDGE } : null,
    discussionQuestions: discussion,
    solutionEvaluationQuestions: SOLUTION_EVALUATION_QUESTIONS,
    councilChecklist: dimensions.map((d) => ({
      item: `Revisar ${d.label.toLowerCase()}`,
      status: d.levelLabel,
    })),
    answers: Object.keys(answers).map((id) => ({ id, value: answers[id] })),
    disclaimer: DISCLAIMER,
  };
}

/** Resumo em texto para o time comercial (anexado ao payload do lead). */
export function buildSalesSummary({ contact, answers, diagnosis, commercial }) {
  const lines = [
    `Lead: ${contact.name}`,
    `Papel: ${ROLE_COPY[answers.userRole]?.label ?? answers.userRole}`,
    `Condomínio: ${contact.condominium}`,
    `Cidade: ${contact.city}`,
    `Unidades: ${answerLabel('unitRange', answers.unitRange)}`,
    '',
    `Estrutura atual: ${answerLabel('currentModel', answers.currentModel)}`,
    `Visitantes: ${answerLabel('visitorProcess', answers.visitorProcess)}`,
    `Consulta de registros: ${answerLabel('accessRecords', answers.accessRecords)}`,
    `Câmeras: ${answerLabel('cameraCoverage', answers.cameraCoverage)}`,
    `Contingência: ${answerLabel('contingency', answers.contingency)}`,
    '',
    `Principal preocupação: ${(answers.mainPain || []).map((p) => PAIN_LABELS[p]).join(' / ')}`,
    '',
    'Diagnóstico preliminar:',
    ...DIMENSIONS.map((d) => `- ${DIMENSION_META[d].label}: ${LEVEL_LABELS[diagnosis.levels[d]]}`),
    '',
    `Prioridade interna: ${commercial.routing}`,
    `Momento: ${commercial.timing ?? 'não informado'}`,
  ];
  return lines.join('\n');
}
