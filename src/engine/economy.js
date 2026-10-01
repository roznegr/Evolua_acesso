import { economyCalculator } from '../config/economy.js';

function hasAllValues(values) {
  return Object.values(values).every((v) =>
    v && typeof v === 'object' ? hasAllValues(v) : typeof v === 'number' && Number.isFinite(v),
  );
}

/** A calculadora só está disponível se habilitada E com todos os valores preenchidos. */
export function isEconomyAvailable(config = economyCalculator) {
  return config.enabled === true && hasAllValues(config.values);
}

/**
 * Cálculo da economia. Retorna null quando indisponível — nunca inventa faixas.
 * A fórmula real deve ser definida junto com os multiplicadores validados.
 */
export function calculateEconomy(answers, config = economyCalculator) {
  if (!isEconomyAvailable(config)) return null;
  const base = config.values.monthlyCostByUnitRange[answers.unitRange];
  if (typeof base !== 'number') return null;
  return { monthlyReference: base * config.values.modelMultiplier, disclaimer: config.disclaimer };
}
