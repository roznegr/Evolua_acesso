/* Comportamento do site: roteador do protótipo, menu, abas do fluxo, contagem, revelação, formulários e tracking.
   Sem bibliotecas. Respeita prefers-reduced-motion. */
(function () {
  'use strict';
  var doc = document;
  var cfg = window.EVOLUA_CONFIG || {};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var embutido = window.parent && window.parent !== window;
  doc.documentElement.classList.add('js');

  // ---- Tracking: só parâmetros da lista; nada de dado pessoal
  var PARAMS = {
    page_view: ['page_id'], form_start: ['form_id'], generate_lead: ['tipo'], contact_click: ['contact_method'],
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
    if (el) track(el.getAttribute('data-evento'), { contact_method: el.getAttribute('data-metodo') || '' });
    var r = ev.target.closest && ev.target.closest('[data-rolar]');
    if (r) {
      ev.preventDefault();
      var alvo = doc.getElementById(r.getAttribute('data-rolar'));
      if (alvo) alvo.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  });

  // ---- Roteador do protótipo (cada página é uma <main data-pagina>)
  var paginas = [].slice.call(doc.querySelectorAll('[data-pagina]'));
  var menuBtn = doc.querySelector('.menu-btn'), menuMob = doc.getElementById('menu-mob');
  function fecharMenu() { if (menuMob) { menuMob.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Abrir menu'); } }
  function ir(id, manterRolagem) {
    var alvo = paginas.filter(function (p) { return p.getAttribute('data-pagina') === id; })[0] || paginas[0];
    var chave = alvo.getAttribute('data-pagina');
    paginas.forEach(function (p) { p.hidden = p !== alvo; });
    doc.title = alvo.getAttribute('data-titulo') || doc.title;
    doc.querySelectorAll('[data-nav]').forEach(function (a) { if (a.getAttribute('data-nav') === chave) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    fecharMenu();
    if (!manterRolagem) { window.scrollTo(0, 0); alvo.focus({ preventScroll: true }); }
    track('page_view', { page_id: chave });
  }
  if (paginas.length) {
    window.addEventListener('hashchange', function () { ir(location.hash.slice(1)); });
    var inicial = location.hash.slice(1);
    if (inicial && inicial !== paginas[0].getAttribute('data-pagina')) ir(inicial, true);
    else track('page_view', { page_id: paginas[0].getAttribute('data-pagina') });
  } else if (!embutido) {
    track('page_view', {});
  }

  // ---- Menu móvel
  if (menuBtn && menuMob) {
    menuBtn.addEventListener('click', function () {
      var aberto = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!aberto));
      menuBtn.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
      menuMob.hidden = aberto;
    });
  }

  // ---- Abas do fluxo (qualquer quantidade)
  doc.querySelectorAll('.fluxo__abas').forEach(function (tabs) {
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
  });

  // ---- Contagem dos indicadores e revelação ao rolar (conteúdo sempre visível se algo falhar)
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
  var vistos = [];
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        var el = en.target;
        if (!en.isIntersecting) { if (el.hasAttribute('data-reveal') && !el.classList.contains('is-in')) el.classList.add('pre'); return; }
        el.classList.remove('pre'); el.classList.add('is-in');
        var c = el.querySelector && el.querySelector('[data-contar]'); if (c && vistos.indexOf(c) < 0) { vistos.push(c); contar(c); }
        var s = el.getAttribute && el.getAttribute('data-solucao'); if (s) track('solution_view', { solution_id: s });
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    doc.querySelectorAll('[data-reveal], [data-solucao]').forEach(function (el) { io.observe(el); });
    setTimeout(function () { doc.querySelectorAll('.pre').forEach(function (el) { el.classList.remove('pre'); }); }, 4000);
  }

  // ---- Formulários (todos com [data-lead])
  var digitos = function (v) { return String(v || '').replace(/\D/g, ''); };
  var foneOk = function (v) { var d = digitos(v); if (d.indexOf('55') === 0 && d.length > 11) d = d.slice(2); return d.length === 10 || (d.length === 11 && d[2] === '9'); };
  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim()); };
  function valido(inp) {
    if (inp.name === 'whatsapp') return foneOk(inp.value);
    if (inp.type === 'email') return emailOk(inp.value);
    return inp.value.trim().length >= 2;
  }
  doc.querySelectorAll('form[data-lead]').forEach(function (form) {
    var id = form.getAttribute('data-lead'), comecou = false;
    var painel = form.parentNode, ok = painel.querySelector('.form__ok');
    form.addEventListener('input', function () { if (!comecou) { comecou = true; track('form_start', { form_id: id }); } });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var primeiro = null;
      form.querySelectorAll('input[required]').forEach(function (inp) {
        var campo = inp.closest('.campo'), erro = campo.querySelector('.campo__erro'), eid = inp.id + '-erro';
        if (valido(inp)) { campo.removeAttribute('data-erro'); inp.removeAttribute('aria-invalid'); inp.removeAttribute('aria-describedby'); }
        else { campo.setAttribute('data-erro', ''); erro.id = eid; inp.setAttribute('aria-invalid', 'true'); inp.setAttribute('aria-describedby', eid); if (!primeiro) primeiro = inp; }
      });
      if (primeiro) { primeiro.focus(); return; }
      var sel = form.querySelector('[name=tipo]');
      var tipo = sel ? sel.value : form.getAttribute('data-tipo');
      var btn = form.querySelector('button[type=submit]'), rotulo = btn.textContent; btn.disabled = true; btn.textContent = 'Enviando…';
      var sucesso = function (mock) {
        if (tipo !== 'candidato') track('generate_lead', { tipo: tipo });
        form.hidden = true; ok.hidden = false; ok.focus();
        var m = ok.querySelector('[data-mock]'); if (m && mock) m.hidden = false;
        var d = ok.querySelector('[data-diag]'); if (d && tipo === 'condominio') d.hidden = false;
      };
      var falha = function () {
        btn.disabled = false; btn.textContent = rotulo;
        var a = form.querySelector('.campo__erro[role=alert]');
        if (!a) { a = doc.createElement('p'); a.className = 'campo__erro'; a.setAttribute('role', 'alert'); form.appendChild(a); }
        a.style.display = 'block'; a.textContent = 'Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp.';
      };
      if (!cfg.leadEndpoint) { if (cfg.mock) setTimeout(function () { sucesso(true); }, 400); else falha(); return; }
      var corpo = { type: tipo === 'candidato' ? 'candidatura' : 'lead', source: 'site-' + id, tipo: tipo };
      form.querySelectorAll('input:not([type=file]),select').forEach(function (c) { corpo[c.name] = c.name === 'whatsapp' ? digitos(c.value) : c.value.trim(); });
      fetch(cfg.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(corpo) })
        .then(function (r) { if (r.ok) sucesso(false); else falha(); }, falha);
    });
  });

  // ---- Altura do bloco (quando embedado no Wix; ver docs/fase-e-implementacao.md)
  if (embutido && 'ResizeObserver' in window) {
    var ult = 0;
    new ResizeObserver(function () {
      var h = Math.ceil(doc.documentElement.scrollHeight);
      if (h !== ult) { ult = h; window.parent.postMessage({ source: 'evolua-site', type: 'height', id: cfg.blockId || '', height: h }, '*'); }
    }).observe(doc.documentElement);
  }
})();
