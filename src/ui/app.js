import { h } from './dom.js';
import { QUESTIONS, TIMING_QUESTION } from '../data/questions/index.js';
import {
  LEVEL_LABELS,
  DIMENSION_META,
  DIMENSION_COPY,
  PAIN_COPY,
  PAIN_BRIDGE,
  ROLE_COPY,
  DISCLAIMER,
  PREVIEW_COPY,
  FULL_RESULT_COPY,
  ASSEMBLY_COPY,
  CONFIRMATION_COPY,
} from '../data/results/index.js';
import { DIMENSIONS } from '../data/scoring/index.js';
import { diagnose, missingAnswers, painOf } from '../engine/diagnosis.js';
import { qualify } from '../engine/qualification.js';
import { buildReport } from '../engine/report.js';
import { buildLeadPayload, buildLeadUpdatePayload } from '../engine/payload.js';
import { isEconomyAvailable } from '../engine/economy.js';
import { track } from '../lib/analytics.js';
import { loadState, saveState, clearState } from '../lib/storage.js';
import { validateLead, normalizeBrPhone } from '../lib/validate.js';
import { submitLead, submitLeadUpdate } from '../lib/leadClient.js';
import { SITE, PRINT_REPORT } from '../config/site.js';
import { printReport } from './printReport.js';

const TOTAL = QUESTIONS.length;
const PROCESSING_MS = 1800;

export function createApp(root) {
  const saved = loadState() || {};
  const state = {
    view: 'intro',
    step: 0,
    answers: saved.answers || {},
    leadId: saved.leadId || null,
    timing: saved.timing || null,
    maxProgress: saved.maxProgress || 0,
    maxHint: null,
    form: { name: '', whatsapp: '', email: '', condominium: '', city: '' },
    formStarted: false,
    errors: {},
    submitError: null,
    sending: false,
    contactName: '',
    contactCondominium: '',
  };

  const persist = () =>
    saveState({ answers: state.answers, leadId: state.leadId, timing: state.timing, maxProgress: state.maxProgress });

  const firstUnanswered = () => QUESTIONS.findIndex((q) => missingAnswers(state.answers).includes(q.id));
  const complete = () => missingAnswers(state.answers).length === 0;

  // Restaura sessão anterior sem reenviar eventos.
  if (state.leadId && complete()) state.view = 'result';
  else if (complete()) state.view = 'preview';
  else if (Object.keys(state.answers).length) state.step = Math.max(0, firstUnanswered());

  function go(view, { focus = true } = {}) {
    state.view = view;
    render(focus);
  }

  // ---------- ações ----------
  function start() {
    if (complete() && !state.leadId) return go('preview');
    if (state.leadId) return go('result');
    if (!Object.keys(state.answers).length) track('assessment_start', { total_questions: TOTAL });
    state.step = Math.max(0, firstUnanswered());
    go('question');
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function answer(q, value) {
    if (q.type === 'multi') {
      const cur = state.answers[q.id] || [];
      let next;
      if (cur.includes(value)) next = cur.filter((v) => v !== value);
      else if (q.exclusive?.includes(value)) next = [value];
      else if (cur.length >= q.max) {
        // Limite atingido: não troca silenciosamente (a 1ª escolha é a dor principal); orienta a desmarcar.
        state.maxHint = q.id;
        return render(false);
      } else next = [...cur.filter((v) => !q.exclusive?.includes(v)), value];
      state.maxHint = null;
      state.answers[q.id] = next;
      persist();
      render(false);
      return;
    }
    state.answers[q.id] = value;
    persist();
    render(false);
    setTimeout(() => advance(q), 280);
  }

  function advance(q) {
    const value = state.answers[q.id];
    if (!value || (Array.isArray(value) && !value.length)) return;
    track('assessment_question', {
      question_id: q.id,
      question_index: state.step + 1,
      answer_value: Array.isArray(value) ? value.join(',') : value,
    });
    const pct = Math.round(((state.step + 1) / TOTAL) * 100);
    if (pct > state.maxProgress) {
      state.maxProgress = pct;
      track('assessment_progress', { progress_pct: pct, question_index: state.step + 1 });
    }
    persist();
    if (state.step + 1 < TOTAL) {
      state.step += 1;
      go('question');
    } else {
      finish();
    }
  }

  function finish() {
    track('assessment_complete', { total_questions: TOTAL });
    go('processing');
    setTimeout(() => {
      if (state.view !== 'processing') return;
      const d = diagnose(state.answers);
      const { main } = painOf(state.answers);
      track('assessment_result', {
        primary_gap: d.primaryGap || 'none',
        unit_range: state.answers.unitRange,
        user_role: state.answers.userRole,
        main_pain: main,
        attention_count: d.attentionCount,
      });
      go('preview');
    }, PROCESSING_MS);
  }

  function back() {
    if (state.view === 'form') return go('preview');
    if (state.step === 0) return go('intro');
    state.step -= 1;
    go('question');
  }

  function forward() {
    if (state.step + 1 < TOTAL) {
      state.step += 1;
      go('question');
    } else if (complete()) go('preview');
  }

  async function submit(ev) {
    ev.preventDefault();
    if (state.sending) return;
    const f = state.form;
    if (f.website) return; // honeypot
    state.errors = validateLead(f);
    if (Object.keys(state.errors).length) {
      state.submitError = null;
      render(false);
      root.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    state.sending = true;
    state.submitError = null;
    render(false);

    const d = diagnose(state.answers);
    const commercial = qualify(state.answers, state.timing);
    const leadId = state.leadId || `lead_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const payload = buildLeadPayload({
      leadId,
      contact: {
        name: f.name.trim(),
        whatsapp: normalizeBrPhone(f.whatsapp),
        email: f.email.trim(),
        condominium: f.condominium.trim(),
        city: f.city.trim(),
      },
      consent: { text: 'Aceite implícito ao enviar o formulário (aviso de contato pela Evolua)', at: new Date().toISOString() },
      source: sourceInfo(),
      answers: state.answers,
      diagnosis: d,
      commercial,
    });

    const res = await submitLead(payload);
    state.sending = false;
    if (!res.ok) {
      state.submitError = res.error;
      return render(false);
    }
    // generate_lead só depois da confirmação de sucesso do envio.
    const { main } = painOf(state.answers);
    track('generate_lead', {
      primary_gap: d.primaryGap || 'none',
      unit_range: state.answers.unitRange,
      user_role: state.answers.userRole,
      main_pain: main,
    });
    state.leadId = leadId;
    state.contactName = f.name.trim();
    state.contactCondominium = f.condominium.trim();
    state.form = { name: '', whatsapp: '', email: '', condominium: '', city: '' }; // PII não fica em memória
    persist();
    go('result');
  }

  async function chooseTiming(value) {
    state.timing = value;
    persist();
    render(false);
    const commercial = qualify(state.answers, value);
    await submitLeadUpdate(buildLeadUpdatePayload({ leadId: state.leadId, commercial }));
  }

  function restart() {
    clearState();
    Object.assign(state, { answers: {}, leadId: null, timing: null, maxProgress: 0, step: 0, errors: {}, formStarted: false });
    go('intro');
  }

  function sourceInfo() {
    const p = new URLSearchParams(location.search);
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => p.get(k) && (utm[k] = p.get(k)));
    return { url: location.origin + location.pathname, referrer: document.referrer || '', utm };
  }

  function whatsappUrl() {
    if (!SITE.whatsappNumber) return null;
    const who = state.contactCondominium ? ` do condomínio ${state.contactCondominium}` : '';
    const text = encodeURIComponent(`Olá! Fiz o diagnóstico da Evolua${who} e gostaria de receber a análise completa.`);
    return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
  }

  // ---------- views ----------
  const viewIntro = () => {
    const resuming = Object.keys(state.answers).length > 0;
    return h(
      'div',
      { class: 'card-body' },
      h('p', { class: 'eyebrow' }, 'Diagnóstico gratuito · cerca de 2 minutos'),
      h('h2', { tabindex: '-1', class: 'view-title' }, 'Entenda como o acesso do seu condomínio funciona hoje'),
      h('p', { class: 'lead' }, `São ${TOTAL} perguntas rápidas, uma por vez. Ao final você recebe um diagnóstico preliminar e pode preparar a conversa com conselho e assembleia.`),
      h('button', { class: 'btn btn-primary btn-lg', type: 'button', onClick: start }, resuming ? 'Continuar diagnóstico' : 'Iniciar diagnóstico'),
      resuming && h('button', { class: 'btn-link', type: 'button', onClick: restart }, 'Recomeçar do zero'),
    );
  };

  const progressBar = () =>
    h(
      'div',
      { class: 'progress', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(TOTAL), 'aria-valuenow': String(state.step + 1), 'aria-label': 'Progresso do diagnóstico' },
      h('div', { class: 'progress-fill', style: `width:${((state.step + 1) / TOTAL) * 100}%` }),
    );

  const viewQuestion = () => {
    const q = QUESTIONS[state.step];
    const cur = state.answers[q.id];
    const selected = (v) => (Array.isArray(cur) ? cur.includes(v) : cur === v);
    const multi = q.type === 'multi';
    const answered = Array.isArray(cur) ? cur.length > 0 : Boolean(cur);
    return h(
      'div',
      { class: 'card-body' },
      progressBar(),
      h('p', { class: 'step-count', 'aria-live': 'polite' }, `Pergunta ${state.step + 1} de ${TOTAL}`),
      h('h2', { tabindex: '-1', class: 'view-title' }, q.title),
      q.helper && h('p', { class: `helper${state.maxHint === q.id ? ' warn' : ''}` }, state.maxHint === q.id ? 'Você já escolheu 2. Desmarque uma opção para trocar.' : q.helper),
      h(
        'div',
        { class: 'options', role: multi ? 'group' : 'radiogroup', 'aria-label': q.title },
        q.options.map((o) =>
          h(
            'button',
            {
              type: 'button',
              class: `option${selected(o.value) ? ' is-selected' : ''}`,
              role: multi ? 'checkbox' : 'radio',
              'aria-checked': String(selected(o.value)),
              onClick: () => answer(q, o.value),
            },
            h('span', { class: 'option-mark', 'aria-hidden': 'true' }),
            h('span', { class: 'option-label' }, o.label),
          ),
        ),
      ),
      h(
        'div',
        { class: 'nav' },
        h('button', { class: 'btn-ghost', type: 'button', onClick: back }, '← Voltar'),
        multi
          ? h('button', { class: 'btn btn-primary', type: 'button', disabled: !answered, onClick: () => advance(q) }, state.step + 1 === TOTAL ? 'Ver diagnóstico' : 'Continuar')
          : answered && h('button', { class: 'btn-ghost', type: 'button', onClick: forward }, 'Avançar →'),
      ),
    );
  };

  const viewProcessing = () =>
    h(
      'div',
      { class: 'card-body center', role: 'status' },
      h('div', { class: 'spinner', 'aria-hidden': 'true' }),
      h('h2', { tabindex: '-1', class: 'view-title' }, 'Organizando suas respostas'),
      h('p', { class: 'lead' }, 'Avaliando controle de acesso, rastreabilidade, continuidade e eficiência.'),
    );

  const levelPill = (level) => h('span', { class: `pill pill-${level}` }, LEVEL_LABELS[level]);

  function gateText(n) {
    if (n === 0) return PREVIEW_COPY.gate.none;
    if (n === 1) return PREVIEW_COPY.gate.one;
    return PREVIEW_COPY.gate.many(n);
  }

  const viewPreview = () => {
    const d = diagnose(state.answers);
    return h(
      'div',
      { class: 'card-body' },
      h('p', { class: 'eyebrow' }, 'Resultado preliminar'),
      h('h2', { tabindex: '-1', class: 'view-title' }, PREVIEW_COPY.title),
      h('p', { class: 'lead' }, PREVIEW_COPY.subtitle),
      h(
        'ul',
        { class: 'dims' },
        DIMENSIONS.map((dim) =>
          h('li', { class: 'dim' }, h('span', { class: 'dim-name' }, DIMENSION_META[dim].label), levelPill(d.levels[dim])),
        ),
      ),
      h('p', { class: 'gate' }, gateText(d.attentionCount)),
      h('button', { class: 'btn btn-primary btn-lg', type: 'button', onClick: () => go('form') }, PREVIEW_COPY.cta),
      h('div', { class: 'nav' }, h('button', { class: 'btn-ghost', type: 'button', onClick: () => { state.step = TOTAL - 1; go('question'); } }, '← Revisar respostas')),
      h('p', { class: 'disclaimer' }, DISCLAIMER),
    );
  };

  const field = (id, label, opts = {}) =>
    h(
      'div',
      { class: 'field' },
      h('label', { for: `f-${id}` }, label),
      h('input', {
        id: `f-${id}`,
        name: id,
        type: opts.type || 'text',
        inputmode: opts.inputmode,
        autocomplete: opts.autocomplete,
        value: state.form[id],
        'aria-invalid': state.errors[id] ? 'true' : 'false',
        'aria-describedby': state.errors[id] ? `e-${id}` : undefined,
        onInput: (e) => (state.form[id] = e.target.value),
      }),
      state.errors[id] && h('p', { class: 'error', id: `e-${id}` }, state.errors[id]),
    );

  const viewForm = () => {
    const d = diagnose(state.answers);
    const errorMsg = {
      not_configured: 'O envio ainda não está configurado. Fale conosco pelo WhatsApp.',
      timeout: 'A conexão demorou demais. Tente novamente.',
      network: 'Não foi possível enviar agora. Verifique sua conexão e tente novamente.',
    };
    return h(
      'form',
      {
        class: 'card-body',
        novalidate: true,
        onSubmit: submit,
        onFocusin: () => {
          if (state.formStarted) return;
          state.formStarted = true;
          track('lead_form_start', { primary_gap: d.primaryGap || 'none', user_role: state.answers.userRole });
        },
      },
      h('p', { class: 'eyebrow' }, 'Quase lá'),
      h('h2', { tabindex: '-1', class: 'view-title' }, 'Receber minha análise completa'),
      h('p', { class: 'lead' }, 'Informe seus dados para liberar a análise completa do seu condomínio.'),
      field('name', 'Nome', { autocomplete: 'name' }),
      field('whatsapp', 'WhatsApp (com DDD)', { type: 'tel', inputmode: 'tel', autocomplete: 'tel' }),
      field('email', 'E-mail', { type: 'email', inputmode: 'email', autocomplete: 'email' }),
      field('condominium', 'Nome do condomínio', { autocomplete: 'organization' }),
      field('city', 'Cidade', { autocomplete: 'address-level2' }),
      h('div', { class: 'hp', 'aria-hidden': 'true' }, h('label', {}, 'Site', h('input', { tabindex: '-1', autocomplete: 'off', onInput: (e) => (state.form.website = e.target.value) }))),
      state.submitError &&
        h('p', { class: 'error banner', role: 'alert' }, errorMsg[state.submitError] || 'Não foi possível enviar agora. Tente novamente em instantes.'),
      h('button', { class: 'btn btn-primary btn-lg', type: 'submit', disabled: state.sending }, state.sending ? 'Enviando…' : 'Receber minha análise completa'),
      h(
        'p',
        { class: 'fineprint' },
        'Ao enviar, você concorda que a Evolua use seus dados para entrar em contato sobre o condomínio. Não compartilhamos seus dados. ',
        SITE.privacyUrl && h('a', { href: SITE.privacyUrl, target: '_blank', rel: 'noopener' }, 'Política de privacidade'),
      ),
      h('div', { class: 'nav' }, h('button', { class: 'btn-ghost', type: 'button', onClick: back }, '← Voltar')),
    );
  };

  function viewResult() {
    const d = diagnose(state.answers);
    const role = ROLE_COPY[state.answers.userRole];
    const pain = PAIN_COPY[d.mainPain];
    const wa = whatsappUrl();
    const card = (dim, big) =>
      h(
        'article',
        { class: `res-card${big ? ' res-main' : ''}` },
        h('div', { class: 'res-head' }, h('h4', {}, DIMENSION_META[dim].label), levelPill(d.levels[dim])),
        d.painDimensions.includes(dim) && h('span', { class: 'badge' }, FULL_RESULT_COPY.relatedBadge),
        h('p', {}, DIMENSION_COPY[dim][d.levels[dim]]),
      );
    const others = DIMENSIONS.filter((x) => x !== d.primaryGap && x !== d.secondaryGaps[0]);
    return h(
      'div',
      { class: 'card-body' },
      h('div', { class: 'confirm' }, h('span', { class: 'check', 'aria-hidden': 'true' }, '✓'), h('div', {}, h('strong', {}, state.contactName ? `${CONFIRMATION_COPY.title}, ${state.contactName.split(' ')[0]}` : CONFIRMATION_COPY.title), h('p', {}, CONFIRMATION_COPY.body))),
      h('h2', { tabindex: '-1', class: 'view-title' }, FULL_RESULT_COPY.title),
      role && h('p', { class: 'lead' }, role.cta),
      d.primaryGap
        ? [h('h3', {}, FULL_RESULT_COPY.primaryLabel), card(d.primaryGap, true)]
        : h('p', { class: 'lead' }, FULL_RESULT_COPY.allStructured),
      d.secondaryGaps.length > 0 && [h('h3', {}, FULL_RESULT_COPY.secondaryLabel), card(d.secondaryGaps[0])],
      h('h3', {}, 'Demais dimensões'),
      others.map((x) => card(x)),
      d.insights.length > 0 && [h('h3', {}, 'Observações sobre as suas respostas'), h('ul', { class: 'insights' }, d.insights.map((i) => h('li', {}, i.text)))],
      pain && h('section', { class: 'pain' }, h('h3', {}, pain.title), h('p', {}, pain.body), h('p', {}, PAIN_BRIDGE)),
      h('p', { class: 'lead' }, FULL_RESULT_COPY.closing),
      timingBlock(),
      assemblyBlock(wa),
      isEconomyAvailable() && h('section', { id: 'economy' }), // reservado: calculadora desabilitada por config
      h('p', { class: 'disclaimer' }, DISCLAIMER),
      h('button', { class: 'btn-link', type: 'button', onClick: restart }, 'Refazer diagnóstico'),
    );
  }

  const timingBlock = () =>
    h(
      'section',
      { class: 'timing' },
      h('h3', {}, TIMING_QUESTION.title),
      h(
        'div',
        { class: 'options compact', role: 'radiogroup' },
        TIMING_QUESTION.options.map((o) =>
          h(
            'button',
            { type: 'button', class: `option${state.timing === o.value ? ' is-selected' : ''}`, role: 'radio', 'aria-checked': String(state.timing === o.value), onClick: () => chooseTiming(o.value) },
            h('span', { class: 'option-mark', 'aria-hidden': 'true' }),
            h('span', { class: 'option-label' }, o.label),
          ),
        ),
      ),
      state.timing && h('p', { class: 'helper' }, 'Obrigado! Isso ajuda a Evolua a preparar a conversa.'),
    );

  const assemblyBlock = (wa) =>
    h(
      'section',
      { class: 'assembly' },
      h('h3', {}, ASSEMBLY_COPY.title),
      h('p', {}, ASSEMBLY_COPY.intro),
      h('ul', { class: 'checklist' }, ASSEMBLY_COPY.items.map((i) => h('li', {}, i))),
      h(
        'div',
        { class: 'actions' },
        PRINT_REPORT.enabled &&
          h(
            'button',
            {
              class: 'btn btn-secondary',
              type: 'button',
              onClick: () => {
                track('report_download', { report_type: 'summary_print' });
                printReport(buildReport({ answers: state.answers, diagnosis: diagnose(state.answers), condominium: state.contactCondominium }));
              },
            },
            'Baixar resumo do diagnóstico',
          ),
        wa &&
          h('a', { class: 'btn btn-primary', href: wa, target: '_blank', rel: 'noopener', onClick: () => track('contact_click', { contact_method: 'whatsapp', location: 'result' }) }, 'Falar com a Evolua no WhatsApp'),
      ),
    );

  const views = { intro: viewIntro, question: viewQuestion, processing: viewProcessing, preview: viewPreview, form: viewForm, result: viewResult };

  function render(focus = true) {
    const body = views[state.view]();
    const changed = root.dataset.view !== state.view + (state.view === 'question' ? state.step : '');
    root.dataset.view = state.view + (state.view === 'question' ? state.step : '');
    body.classList.toggle('enter', changed);
    root.replaceChildren(body);
    if (focus && changed) {
      const t = root.querySelector('.view-title');
      t?.focus({ preventScroll: true });
      if (state.view !== 'intro') t?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
    }
  }

  render(false);
  return { start, state };
}
