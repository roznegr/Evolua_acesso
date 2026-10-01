const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function digits(value = '') {
  return String(value).replace(/\D/g, '');
}

/** Normaliza WhatsApp brasileiro para 55 + DDD + número. Retorna null se inválido. */
export function normalizeBrPhone(value) {
  let d = digits(value);
  if (d.startsWith('55') && d.length > 11) d = d.slice(2);
  if (d.length === 11 && d[2] === '9') return `55${d}`;
  if (d.length === 10) return `55${d}`;
  return null;
}

export function validateLead(f) {
  const errors = {};
  if (!f.name || f.name.trim().length < 2) errors.name = 'Informe seu nome.';
  if (!normalizeBrPhone(f.whatsapp)) errors.whatsapp = 'Informe um WhatsApp válido com DDD.';
  if (!EMAIL.test((f.email || '').trim())) errors.email = 'Informe um e-mail válido.';
  if (!f.condominium || f.condominium.trim().length < 2) errors.condominium = 'Informe o nome do condomínio.';
  if (!f.city || f.city.trim().length < 2) errors.city = 'Informe a cidade.';
  return errors;
}
