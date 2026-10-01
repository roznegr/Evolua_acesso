/**
 * Ponte de analytics para o Wix.
 * O diagnóstico roda num iframe (elemento "Incorporar código HTML"), então o GTM do site Wix não vê o
 * dataLayer do iframe. Este script recebe os eventos via postMessage e os empurra para o dataLayer da página.
 *
 * Instalar: Wix → Configurações → Custom Code → Adicionar código → colar dentro de <script> → "Body - end",
 * aplicar a "Todas as páginas" (ou só à página da LP). O GTM deve estar instalado no site Wix (Marketing → GTM).
 */
(function () {
  var ALLOWED = [
    'assessment_start', 'assessment_question', 'assessment_progress', 'assessment_complete',
    'assessment_result', 'lead_form_start', 'generate_lead', 'report_download', 'contact_click',
  ];
  window.dataLayer = window.dataLayer || [];
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.source !== 'evolua-diagnostico' || !d.payload) return;
    var p = d.payload;
    if (ALLOWED.indexOf(p.event) === -1) return;
    var clean = {};
    Object.keys(p).forEach(function (k) {
      var v = p[k];
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') clean[k] = v;
    });
    window.dataLayer.push(clean);
  });
})();
