/**
 * Configuração do site. Valores sensíveis ao ambiente vêm de variáveis VITE_* no build
 * (ver .env.example); aqui ficam os defaults.
 */
const env = import.meta.env ?? {};

export const SITE = {
  name: 'Evolua',
  domain: 'evoluatech.com.br',
  url: 'https://evoluatech.com.br/',
  // WhatsApp da Evolua em formato internacional, só dígitos (ex.: 5522999999999). PENDENTE: definir.
  whatsappNumber: env.VITE_WHATSAPP_NUMBER || '',
  privacyUrl: env.VITE_PRIVACY_URL || '',
};

export const LEAD = {
  // Endpoint que recebe o lead (ex.: função HTTP do Wix Velo ou webhook Make/Zapier). Ver wix/README.md.
  endpoint: env.VITE_LEAD_ENDPOINT || '',
  timeoutMs: 12000,
  // Em `npm run dev`, sem endpoint, o envio é simulado. Em produção, sem endpoint, o formulário mostra erro.
  allowMockWhenNoEndpoint: Boolean(env.DEV || env.VITE_LEAD_MOCK), // VITE_LEAD_MOCK: só para builds de preview
};

export const ANALYTICS = {
  // Se definido, o GTM é carregado dentro desta página (útil fora do Wix). No embed do Wix o GTM fica no
  // site Wix e recebe os eventos via ponte postMessage (wix/parent-bridge.js).
  gtmId: env.VITE_GTM_ID || '',
  bridgeToParent: true,
};

export const PRINT_REPORT = { enabled: true };
