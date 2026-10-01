/**
 * Calculadora de economia — ARQUITETURA PRONTA, DESABILITADA.
 *
 * Os multiplicadores comerciais ainda serão validados. NÃO preencha com valores estimados.
 * Para ativar: preencher `values` com dados validados pelo comercial e trocar `enabled` para true.
 * Enquanto algum valor obrigatório for null, a funcionalidade permanece desligada mesmo com enabled=true.
 */
export const economyCalculator = {
  enabled: false,
  // Valores comerciais centralizados aqui (todos null até validação).
  values: {
    // Exemplo de estrutura — nomes finais a definir com o comercial:
    // monthlyCostByUnitRange: { up_to_20: null, '21_50': null, ... },
    monthlyCostByUnitRange: {
      up_to_20: null,
      '21_50': null,
      '51_100': null,
      '101_200': null,
      over_200: null,
    },
    modelMultiplier: null,
  },
  disclaimer: 'Estimativa ilustrativa. O resultado real depende de uma avaliação da estrutura do condomínio.',
};
