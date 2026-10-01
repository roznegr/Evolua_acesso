import { COMMERCIAL } from '../data/scoring/index.js';
import { painOf } from './diagnosis.js';

/**
 * Qualificação comercial. Totalmente separada do diagnóstico:
 * porte/papel/dor/timing nunca entram em `scores`, e vice-versa.
 * Uso interno — não exibir ao visitante nem enviar ao GA4.
 */
export function qualify(answers, timing = null) {
  const profile = COMMERCIAL.profile[answers.unitRange] ?? 0;
  const authority = COMMERCIAL.authority[answers.userRole] ?? 0;
  const { main } = painOf(answers);
  const concretePain = main && main !== 'no_specific' ? 1 : 0;
  const timingActive = timing ? COMMERCIAL.timingActive.includes(timing) : false;

  return {
    profile,
    authority,
    pain: concretePain,
    timing, // null até o visitante responder após a captura
    routing: route({ authority, concretePain, timing, timingActive }),
  };
}

function route({ authority, concretePain, timing, timingActive }) {
  const { priorityAuthority, influencerMaxAuthority } = COMMERCIAL.routing;
  if (authority <= influencerMaxAuthority) return 'influencer';
  if (timing === 'evaluating') return 'priority';
  if (authority >= priorityAuthority && (concretePain || timingActive)) return 'priority';
  return 'nurture';
}
