import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS } from '../src/data/questions/index.js';
import { DIAGNOSTIC_WEIGHTS, PAIN_DIMENSION, DIMENSIONS } from '../src/data/scoring/index.js';
import { PAIN_COPY, PAIN_LABELS, DIMENSION_COPY, ROLE_COPY } from '../src/data/results/index.js';
import { diagnose, maxScores, missingAnswers } from '../src/engine/diagnosis.js';
import { qualify } from '../src/engine/qualification.js';
import { buildReport } from '../src/engine/report.js';
import { buildLeadPayload } from '../src/engine/payload.js';
import { isEconomyAvailable, calculateEconomy } from '../src/engine/economy.js';
import { sanitizeEvent, track, EVENT_PARAMS } from '../src/lib/analytics.js';
import { validateLead, normalizeBrPhone } from '../src/lib/validate.js';
import { sendToEndpoint } from '../src/lib/leadClient.js';

const best = {
  unitRange: '51_100', currentModel: 'hybrid', visitorProcess: 'app_system', accessRecords: 'fast',
  cameraCoverage: 'full_coverage', contingency: 'defined', mainPain: ['cost'], userRole: 'sindico',
};
const worst = { ...best, currentModel: 'undefined', visitorProcess: 'no_single_process', accessRecords: 'no', cameraCoverage: 'none', contingency: 'none' };

test('integridade: toda opção pontuável tem peso; toda dor/papel tem texto', () => {
  for (const q of QUESTIONS.filter((x) => x.kind === 'diagnostic')) {
    for (const o of q.options) assert.ok(DIAGNOSTIC_WEIGHTS[q.id][o.value], `${q.id}.${o.value} sem peso`);
  }
  const pains = QUESTIONS.find((q) => q.id === 'mainPain').options.map((o) => o.value);
  for (const p of pains) {
    assert.ok(PAIN_COPY[p] && PAIN_LABELS[p] && p in PAIN_DIMENSION, `dor ${p} incompleta`);
  }
  for (const o of QUESTIONS.find((q) => q.id === 'userRole').options) assert.ok(ROLE_COPY[o.value]);
  for (const d of DIMENSIONS) for (const l of ['attention', 'improvement', 'structured']) assert.ok(DIMENSION_COPY[d][l]);
});

test('máximos por dimensão', () => {
  assert.deepEqual(maxScores(), { accessControl: 6, traceability: 10, continuity: 6, efficiency: 5 });
});

test('melhor cenário → tudo estruturado; pior → tudo ponto de atenção', () => {
  const b = diagnose(best);
  assert.ok(Object.values(b.levels).every((l) => l === 'structured'));
  assert.equal(b.primaryGap, null);
  assert.equal(b.attentionCount, 0);
  const w = diagnose(worst);
  assert.ok(Object.values(w.levels).every((l) => l === 'attention'));
  assert.equal(w.attentionCount, 4);
});

test('limiares: 40 e 70', () => {
  // continuity: model remote(2)+contingency doubts(3)=5/6=83 structured; depends(2)+remote(2)=4/6=67 improvement; 1+1=2/6=33 attention
  assert.equal(diagnose({ ...best, currentModel: 'remote', contingency: 'doubts' }).levels.continuity, 'structured');
  assert.equal(diagnose({ ...best, currentModel: 'remote', contingency: 'depends' }).levels.continuity, 'improvement');
  assert.equal(diagnose({ ...best, currentModel: 'porter_24h', contingency: 'unknown' }).levels.continuity, 'attention');
});

test('dor, papel e porte NÃO alteram scores', () => {
  const base = diagnose(best).scores;
  for (const patch of [{ mainPain: ['access_security', 'visitors'] }, { userRole: 'morador' }, { unitRange: 'over_200' }]) {
    assert.deepEqual(diagnose({ ...best, ...patch }).scores, base);
  }
});

test('determinístico', () => {
  assert.deepEqual(diagnose(worst), diagnose(worst));
});

test('gap principal: continuidade fraca vira principal; dor desempata', () => {
  const d = diagnose({ ...best, contingency: 'none' });
  assert.equal(d.primaryGap, 'continuity');
  assert.ok(d.insights.some((i) => i.id === 'no_contingency'));
  // empate em 0%: pior cenário, dor "no_records" puxa rastreabilidade
  assert.equal(diagnose({ ...worst, mainPain: ['no_records'] }).primaryGap, 'traceability');
  assert.equal(diagnose({ ...worst, mainPain: ['cost'] }).primaryGap, 'efficiency');
});

test('respostas incompletas são rejeitadas', () => {
  assert.deepEqual(missingAnswers({ ...best, mainPain: [] }), ['mainPain']);
  assert.throws(() => diagnose({ ...best, contingency: undefined }));
});

test('insight de baixa visibilidade com ≥2 "não sei"', () => {
  const d = diagnose({ ...best, accessRecords: 'unknown', contingency: 'unknown' });
  assert.ok(d.insights.some((i) => i.id === 'low_visibility'));
});

test('qualificação comercial separada e roteamento', () => {
  assert.equal(qualify(best).routing, 'priority'); // síndico + dor concreta
  assert.equal(qualify({ ...best, userRole: 'morador' }).routing, 'influencer');
  assert.equal(qualify({ ...best, userRole: 'conselheiro', mainPain: ['no_specific'] }).routing, 'nurture');
  assert.equal(qualify({ ...best, userRole: 'conselheiro', mainPain: ['no_specific'] }, 'evaluating').routing, 'priority');
  assert.equal(qualify({ ...best, mainPain: ['no_specific'] }, 'researching').routing, 'nurture');
  const q = qualify(best);
  assert.equal(q.profile, 3);
  assert.equal(q.authority, 4);
});

test('payload do lead preserva respostas e separa scores/commercial', () => {
  const diagnosis = diagnose(worst);
  const commercial = qualify(worst);
  const p = buildLeadPayload({
    leadId: 'x', contact: { name: 'Maria', whatsapp: '5522999999999', email: 'm@x.com', condominium: 'Res X', city: 'Macaé' },
    consent: {}, source: {}, answers: worst, diagnosis, commercial,
  });
  assert.deepEqual(p.assessment.answers, worst);
  assert.ok(p.assessment.scores && p.assessment.commercial);
  assert.equal(p.assessment.scores.commercial, undefined);
  assert.match(p.salesSummary, /Maria/);
});

test('relatório: modelo pronto para PDF futuro', () => {
  const r = buildReport({ answers: worst, diagnosis: diagnose(worst), condominium: 'Res X' });
  assert.equal(r.dimensions.length, 4);
  assert.ok(r.discussionQuestions.length > 0 && r.solutionEvaluationQuestions.length > 0);
  assert.match(r.disclaimer, /diagnóstico preliminar/);
});

test('copy: sem percentuais nem certificação', () => {
  const all = JSON.stringify([PAIN_COPY, DIMENSION_COPY]);
  assert.doesNotMatch(all, /\d+\s?%/);
  assert.doesNotMatch(all, /\d+%\s*seguro|portaria remota é/i);
});

test('calculadora de economia desabilitada por configuração', () => {
  assert.equal(isEconomyAvailable(), false);
  assert.equal(calculateEconomy(best), null);
  // mesmo habilitada, valores null mantêm desligada
  const half = { enabled: true, values: { a: null, b: 1 } };
  assert.equal(isEconomyAvailable(half), false);
  const full = { enabled: true, values: { monthlyCostByUnitRange: { '51_100': 10 }, modelMultiplier: 2 }, disclaimer: 'x' };
  assert.equal(calculateEconomy(best, full).monthlyReference, 20);
});

test('analytics: allowlist, sem PII', () => {
  const dirty = {
    primary_gap: 'continuity', unit_range: '21_50', user_role: 'sindico', main_pain: 'cost',
    name: 'Maria', email: 'maria@x.com', phone: '22999999999', condominium: 'X', city: 'Macaé',
  };
  const e = sanitizeEvent('assessment_result', dirty);
  assert.deepEqual(Object.keys(e).sort(), ['event', 'main_pain', 'primary_gap', 'unit_range', 'user_role']);
  // valor que parece e-mail/telefone num parâmetro permitido é descartado
  assert.equal(sanitizeEvent('generate_lead', { main_pain: 'a@b.com' }).main_pain, undefined);
  assert.equal(sanitizeEvent('generate_lead', { main_pain: '(22) 99999-9999' }).main_pain, undefined);
  assert.throws(() => sanitizeEvent('evento_inexistente'));
  for (const name of ['assessment_start', 'assessment_question', 'assessment_progress', 'assessment_complete', 'assessment_result', 'lead_form_start', 'generate_lead', 'report_download', 'contact_click']) {
    assert.ok(EVENT_PARAMS[name]);
  }
  for (const keys of Object.values(EVENT_PARAMS)) {
    for (const k of keys) assert.doesNotMatch(k, /name|mail|phone|whats|condo|city/);
  }
});

test('track empurra para dataLayer', () => {
  globalThis.window = { dataLayer: [], parent: null };
  window.parent = window;
  track('contact_click', { contact_method: 'whatsapp', location: 'result', email: 'a@b.com' });
  assert.deepEqual(window.dataLayer, [{ event: 'contact_click', contact_method: 'whatsapp', location: 'result' }]);
  delete globalThis.window;
});

test('validação do formulário', () => {
  assert.equal(Object.keys(validateLead({})).length, 5);
  assert.deepEqual(validateLead({ name: 'Maria', whatsapp: '(22) 99999-1234', email: 'm@x.com', condominium: 'X1', city: 'Macaé' }), {});
  assert.equal(normalizeBrPhone('(22) 99999-1234'), '5522999991234');
  assert.equal(normalizeBrPhone('+55 22 99999-1234'), '5522999991234');
  assert.equal(normalizeBrPhone('123'), null);
});

test('envio: ok só com 2xx; erros e timeout viram falha; sem endpoint em produção falha', async () => {
  const mk = (status) => async () => ({ ok: status >= 200 && status < 300, status });
  assert.deepEqual(await sendToEndpoint({}, { endpoint: 'http://x', fetchImpl: mk(200) }), { ok: true });
  assert.deepEqual(await sendToEndpoint({}, { endpoint: 'http://x', fetchImpl: mk(500) }), { ok: false, error: 'http_500' });
  assert.deepEqual(await sendToEndpoint({}, { endpoint: 'http://x', fetchImpl: async () => { throw new Error('boom'); } }), { ok: false, error: 'network' });
  assert.deepEqual(await sendToEndpoint({}, { endpoint: '', allowMock: false }), { ok: false, error: 'not_configured' });
});
