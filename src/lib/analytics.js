import { ANALYTICS } from '../config/site.js';

/**
 * dataLayer padronizado. Só parâmetros da allowlist passam; qualquer coisa parecida com
 * e-mail/telefone é descartada. Nenhum evento carrega nome, telefone, e-mail, condomínio ou cidade.
 */
export const EVENT_PARAMS = {
  assessment_start: ['total_questions'],
  assessment_question: ['question_id', 'question_index', 'answer_value'],
  assessment_progress: ['progress_pct', 'question_index'],
  assessment_complete: ['total_questions'],
  assessment_result: ['primary_gap', 'unit_range', 'user_role', 'main_pain', 'attention_count'],
  lead_form_start: ['primary_gap', 'user_role'],
  generate_lead: ['primary_gap', 'unit_range', 'user_role', 'main_pain'],
  report_download: ['report_type'],
  contact_click: ['contact_method', 'location'],
};

const EMAIL_LIKE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE_LIKE = /(?:\+?\d[\s().-]*){10,}/;

function isSafeValue(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'number' || typeof v === 'boolean') return true;
  if (typeof v !== 'string') return false;
  return !EMAIL_LIKE.test(v) && !PHONE_LIKE.test(v);
}

export function sanitizeEvent(name, params = {}) {
  const allowed = EVENT_PARAMS[name];
  if (!allowed) throw new Error(`Evento desconhecido: ${name}`);
  const clean = {};
  for (const key of allowed) {
    if (key in params && isSafeValue(params[key])) clean[key] = params[key];
  }
  return { event: name, ...clean };
}

let gtmLoaded = false;
function loadGtm(id) {
  if (!id || gtmLoaded || typeof document === 'undefined') return;
  gtmLoaded = true;
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  loadGtm(ANALYTICS.gtmId);
}

export function track(name, params = {}) {
  const payload = sanitizeEvent(name, params);
  if (typeof window === 'undefined') return payload;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  // Dentro do embed do Wix (iframe), o GTM vive na página pai: encaminha por postMessage.
  if (ANALYTICS.bridgeToParent && window.parent && window.parent !== window) {
    try {
      window.parent.postMessage({ source: 'evolua-diagnostico', payload }, '*');
    } catch {
      /* noop */
    }
  }
  return payload;
}
