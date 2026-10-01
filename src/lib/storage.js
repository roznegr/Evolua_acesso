const KEY = 'evolua.assessment.v1';

/** Só guarda respostas do questionário, etapa e leadId — NUNCA dados pessoais do formulário. */
export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage indisponível (modo privado, bloqueio): a página funciona sem persistência */
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}
