/* Comportamento da home: menu, seletor de público, abas do fluxo, carrossel, contagem, revelação, formulário e tracking.
   Sem bibliotecas. Respeita prefers-reduced-motion. */
(function () {
  'use strict';
  var doc = document;
  var cfg = window.EVOLUA_CONFIG || {};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var embutido = window.parent && window.parent !== window;
  doc.documentElement.classList.add('js');

  // Tracking: só parâmetros da lista; nada de dado pessoal.
  var PARAMS = {
    page_view: [], form_start: ['form_id'], generate_lead: ['tipo'], contact_click: ['contact_method'],
    solution_view: ['solution_id'], condominio_view: [], empresa_view: [], file_download: ['file_name'],
  };
  function track(name, params) {
    if (!PARAMS[name]) return;
    var p = { event: name };
    PARAMS[name].forEach(function (k) { if (params && typeof params[k] === 'string' && params[k].indexOf('@') === -1) p[k] = params[k]; });
    (window.dataLayer = window.dataLayer || []).push(p);
    if (embutido) { try { window.parent.postMessage({ source: 'evolua-site', payload: p }, '*'); } catch (e) { /* noop */ } }
  }
  doc.addEventListener('click', function (ev) {
    var el = ev.target.closest && ev.target.closest('[data-evento]');
    if (!el) return;
    track(el.getAttribute('data-evento'), { contact_method: el.getAttribute('data-metodo') || '' });
  });

  // Menu móvel
  var mbtn = doc.querySelector('.menu-btn'), mmob = doc.getElementById('menu-mob');
  if (mbtn && mmob) {
    mbtn.addEventListener('click', function () {
      var aberto = mbtn.getAttribute('aria-expanded') === 'true';
      mbtn.setAttribute('aria-expanded', String(!aberto));
      mbtn.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
      mmob.hidden = aberto;
    });
    mmob.addEventListener('click', function (e) { if (e.target.tagName === 'A') { mmob.hidden = true; mbtn.setAttribute('aria-expanded', 'false'); } });
  }

  // Seletor Condomínios/Empresas (mobile)
  var sel = doc.querySelector('.cam__sel');
  if (sel) {
    sel.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      sel.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      doc.querySelectorAll('[data-painel]').forEach(function (c) { c.hidden = c.getAttribute('data-painel') !== b.getAttribute('data-alvo'); });
    });
  }

  // Abas do fluxo
  var tabs = doc.querySelector('.fluxo__abas');
  if (tabs) {
    var abas = [].slice.call(tabs.querySelectorAll('[role=tab]'));
    var ativar = function (aba, foco) {
      abas.forEach(function (a) {
        var on = a === aba;
        a.setAttribute('aria-selected', String(on)); a.tabIndex = on ? 0 : -1;
        var painel = doc.getElementById(a.getAttribute('aria-controls')); painel.hidden = !on;
        if (on) { var ol = painel.querySelector('.passos'); ol.classList.remove('anim'); void ol.offsetWidth; ol.classList.add('anim'); }
      });
      if (foco) aba.focus();
    };
    abas.forEach(function (a, i) {
      a.addEventListener('click', function () { ativar(a); });
      a.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1;
        if (n >= 0) { e.preventDefault(); ativar(abas[(n + abas.length) % abas.length], true); }
      });
    });
  }

  // Carrossel de cenas
  var faixa = doc.querySelector('.exp__faixa');
  doc.querySelectorAll('.exp__ctl button').forEach(function (b) {
    b.addEventListener('click', function () { faixa.scrollBy({ left: Number(b.getAttribute('data-dir')) * faixa.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' }); });
  });

  // Contagem dos indicadores e revelação ao rolar (conteúdo sempre visível se algo falhar)
  var fmt = new Intl.NumberFormat('pt-BR');
  function contar(el) {
    var alvo = Number(el.getAttribute('data-contar')); if (!alvo || reduce) return;
    var t0 = performance.now(), dur = 900;
    (function passo(t) {
      var k = Math.min(1, (t - t0) / dur), v = Math.round(alvo * (1 - Math.pow(1 - k, 3)));
      el.textContent = '+' + fmt.format(v);
      if (k < 1) requestAnimationFrame(passo); else el.textContent = '+' + fmt.format(alvo);
    })(t0);
  }
  var vistos = {};
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        var el = en.target;
        if (!en.isIntersecting) { if (el.hasAttribute('data-reveal') && !el.classList.contains('is-in')) el.classList.add('pre'); return; }
        el.classList.remove('pre'); el.classList.add('is-in');
        var c = el.querySelector && el.querySelector('[data-contar]'); if (c && !vistos[c]) { vistos[c] = 1; contar(c); }
        var s = el.getAttribute && el.getAttribute('data-solucao'); if (s) track('solution_view', { solution_id: s });
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    doc.querySelectorAll('[data-reveal], [data-solucao]').forEach(function (el) { io.observe(el); });
    setTimeout(function () { doc.querySelectorAll('.pre').forEach(function (el) { el.classList.remove('pre'); }); }, 4000);
  }

  // Formulário
  var form = doc.getElementById('form-lead');
  if (form) {
    var comecou = false;
    form.addEventListener('input', function () { if (!comecou) { comecou = true; track('form_start', { form_id: 'home' }); } });
    var digitos = function (v) { return String(v || '').replace(/\D/g, ''); };
    var foneOk = function (v) { var d = digitos(v); if (d.indexOf('55') === 0 && d.length > 11) d = d.slice(2); return d.length === 10 || (d.length === 11 && d[2] === '9'); };
    var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim()); };
    var regras = [['f-nome', function (v) { return v.trim().length >= 2; }], ['f-org', function (v) { return v.trim().length >= 2; }], ['f-whats', foneOk], ['f-mail', emailOk]];
    var erroIds = { 'f-nome': 'e-nome', 'f-org': 'e-org', 'f-whats': 'e-whats', 'f-mail': 'e-mail' };
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var primeiro = null;
      regras.forEach(function (r) {
        var inp = doc.getElementById(r[0]), campo = inp.closest('.campo'), ok = r[1](inp.value);
        if (ok) { campo.removeAttribute('data-erro'); inp.removeAttribute('aria-invalid'); inp.removeAttribute('aria-describedby'); }
        else { campo.setAttribute('data-erro', ''); inp.setAttribute('aria-invalid', 'true'); inp.setAttribute('aria-describedby', erroIds[r[0]]); if (!primeiro) primeiro = inp; }
      });
      if (primeiro) { primeiro.focus(); return; }
      var tipo = doc.getElementById('f-tipo').value;
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Enviando…';
      var sucesso = function (mock) {
        track('generate_lead', { tipo: tipo });
        form.hidden = true;
        var ok = doc.getElementById('form-ok'); ok.hidden = false; ok.focus();
        if (mock) doc.getElementById('aviso-mock').hidden = false;
        if (tipo === 'condominio') doc.getElementById('ok-diag').hidden = false;
      };
      var falha = function () { btn.disabled = false; btn.textContent = 'Quero minha análise gratuita'; var a = doc.createElement('p'); a.className = 'campo__erro'; a.style.display = 'block'; a.setAttribute('role', 'alert'); a.textContent = 'Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp.'; form.appendChild(a); };
      if (!cfg.leadEndpoint) { if (cfg.mock) { setTimeout(function () { sucesso(true); }, 400); } else { falha(); } return; }
      var corpo = { type: 'lead', source: 'site-home', name: doc.getElementById('f-nome').value.trim(), organization: doc.getElementById('f-org').value.trim(), whatsapp: digitos(doc.getElementById('f-whats').value), email: doc.getElementById('f-mail').value.trim(), tipo: tipo };
      fetch(cfg.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(corpo) })
        .then(function (r) { if (r.ok) sucesso(false); else falha(); }, falha);
    });
  }

  // Altura do bloco (quando embedado no Wix; ver docs/fase-e-implementacao.md)
  if (embutido && 'ResizeObserver' in window) {
    var ult = 0;
    new ResizeObserver(function () {
      var h = Math.ceil(doc.documentElement.scrollHeight);
      if (h !== ult) { ult = h; window.parent.postMessage({ source: 'evolua-site', type: 'height', id: cfg.blockId || '', height: h }, '*'); }
    }).observe(doc.documentElement);
  }

  if (!embutido) track('page_view', {});
})();
