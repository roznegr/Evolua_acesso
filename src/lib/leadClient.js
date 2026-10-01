import { LEAD } from '../config/site.js';

/**
 * Envia o lead. Resolve { ok: true } SOMENTE com confirmação de sucesso (HTTP 2xx do endpoint).
 * Usa Content-Type text/plain para evitar preflight CORS (funciona com Wix Velo e webhooks).
 */
export async function sendToEndpoint(payload, { endpoint = LEAD.endpoint, fetchImpl = globalThis.fetch, allowMock = LEAD.allowMockWhenNoEndpoint } = {}) {
  if (!endpoint) {
    if (allowMock) {
      console.info('[lead:mock]', payload);
      return { ok: true, mock: true };
    }
    return { ok: false, error: 'not_configured' };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LEAD.timeoutMs);
  try {
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) return { ok: false, error: `http_${res.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}

export const submitLead = (payload, opts) => sendToEndpoint(payload, opts);
export const submitLeadUpdate = (payload, opts) => sendToEndpoint(payload, opts);
