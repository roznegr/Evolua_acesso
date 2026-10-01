import { escapeHtml as e } from './dom.js';

/**
 * Renderiza o modelo de relatório (engine/report.js) como HTML imprimível.
 * "Salvar como PDF" pelo diálogo de impressão. Para PDF gerado de verdade no futuro, troque
 * este módulo por um gerador que consuma o MESMO modelo — o motor não muda.
 */
export function reportToHtml(r) {
  const list = (items) => `<ul>${items.map((i) => `<li>${e(i)}</li>`).join('')}</ul>`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${e(r.title)}</title>
<style>
body{font:15px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#17302d;margin:32px;max-width:760px}
h1{font-size:24px;margin:0 0 4px}h2{font-size:17px;margin:28px 0 8px;color:#0f6f66}
.muted{color:#5b706d}.dim{border:1px solid #cfe3df;border-radius:12px;padding:12px 14px;margin:8px 0}
.dim b{display:block}.pill{font-size:12px;color:#0f6f66}ul{padding-left:20px}
.disc{margin-top:28px;font-size:12px;color:#5b706d;border-top:1px solid #cfe3df;padding-top:12px}
@media print{body{margin:16mm}}
</style></head><body>
<h1>${e(r.title)}</h1><p class="muted">${e(r.subtitle)}${r.subtitle && r.role ? ' · ' : ''}${e(r.role)}</p>
<p>${e(r.summary.text)}</p>
<h2>Resumo do diagnóstico</h2>
${r.dimensions.map((d) => `<div class="dim"><b>${e(d.label)}</b><span class="pill">${e(d.levelLabel)}</span><p>${e(d.text)}</p></div>`).join('')}
${r.insights.length ? `<h2>Pontos identificados</h2>${list(r.insights)}` : ''}
${r.painNarrative ? `<h2>${e(r.painNarrative.title)}</h2><p>${e(r.painNarrative.body)}</p>` : ''}
<h2>Perguntas para a discussão no condomínio</h2>${list(r.discussionQuestions)}
<h2>Perguntas importantes para avaliar soluções</h2>${list(r.solutionEvaluationQuestions)}
<h2>Checklist para conselho e administradora</h2>
${list(r.councilChecklist.map((c) => `☐ ${c.item} (${c.status})`))}
<p class="disc">${e(r.disclaimer)}</p>
</body></html>`;
}

export function printReport(report) {
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  frame.srcdoc = reportToHtml(report);
  frame.onload = () => {
    try {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } finally {
      setTimeout(() => frame.remove(), 1500);
    }
  };
  document.body.appendChild(frame);
}
