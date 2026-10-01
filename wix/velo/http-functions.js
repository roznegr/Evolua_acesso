/**
 * REFERÊNCIA — NÃO TESTADA contra um site Wix real. Revise antes de publicar.
 *
 * Wix Velo → Backend → http-functions.js (modo desenvolvedor ligado). Cria:
 *   POST https://www.evoluatech.com.br/_functions/lead
 * Pré-requisito: coleção "Leads" no CMS com campos compatíveis (ou ajuste o insert abaixo).
 * Use esta URL em VITE_LEAD_ENDPOINT. O front envia JSON como text/plain (evita preflight CORS).
 */
import { ok, badRequest, serverError, response } from 'wix-http-functions';
import wixData from 'wix-data';

const CORS = {
  'Access-Control-Allow-Origin': '*', // restrinja ao domínio de origem do iframe se possível
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const withCors = (r) => ({ ...r, headers: { ...(r.headers || {}), ...CORS } });

export function options_lead() {
  return response({ status: 204, headers: CORS });
}

export async function post_lead(request) {
  try {
    const body = JSON.parse(await request.body.text());
    if (body.type === 'lead') {
      await wixData.insert('Leads', {
        leadId: body.leadId,
        name: body.contact.name,
        whatsapp: body.contact.whatsapp,
        email: body.contact.email,
        condominium: body.contact.condominium,
        city: body.contact.city,
        routing: body.assessment.commercial.routing,
        salesSummary: body.salesSummary,
        payload: body, // JSON completo (respostas, scores, commercial, UTMs)
      }, { suppressAuth: true });
    } else if (body.type === 'lead_update') {
      const found = await wixData.query('Leads').eq('leadId', body.leadId).find({ suppressAuth: true });
      if (found.items.length) {
        const item = found.items[0];
        item.routing = body.commercial.routing;
        item.timing = body.commercial.timing;
        await wixData.update('Leads', item, { suppressAuth: true });
      }
    } else {
      return badRequest(withCors({ body: { error: 'tipo inválido' } }));
    }
    return ok(withCors({ body: { ok: true } }));
  } catch (err) {
    return serverError(withCors({ body: { error: 'falha ao salvar' } }));
  }
}
