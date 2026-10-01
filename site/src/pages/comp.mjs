// Componentes reutilizáveis das páginas. Texto vem das fases B e C (docs/); números e textos provisórios vêm de facts.json.
import { ROTAS, PRIVACIDADE } from './rotas.mjs';

export const CTA = 'Quero minha análise gratuita';

export function criarCtx(facts, { marcar = false, modo = 'prototipo', logo = '', fotos = {} } = {}) {
  const proto = modo === 'prototipo';
  const ctx = {
    facts, marcar, modo, logo, fotos,
    e: facts.empresa,
    cidades: facts.empresa.cidades.join(' e '),
    href: (k) => (k === 'privacidade' ? (proto ? '#contato' : PRIVACIDADE) : proto ? `#${k}` : ROTAS[k].url),
    // Âncora dentro da página: no protótipo (uma só página) é tratada por script; no site real é âncora comum.
    rolar: (id) => (proto ? `href="#" data-rolar="${id}"` : `href="#${id}"`),
    prov: (c) => (marcar && c ? ' prov' : ''),
    tag: (c) => (marcar && c ? '<span class="prov-tag">provisório</span>' : ''),
  };
  return ctx;
}

export const cab = ({ rotulo, titulo, sub = '', id = '' }) => `
    <div class="secao__cab"><p class="rotulo">${rotulo}</p><h2 class="t2"${id ? ` id="${id}"` : ''}>${titulo}</h2>${sub ? `<p class="sub corpo">${sub}</p>` : ''}</div>`;

export const migalha = (ctx, itens) => `
<nav class="migalha" aria-label="Você está em"><ol>${[['home', 'Início'], ...itens].map(([k, t], i, a) => (i < a.length - 1 ? `<li><a href="${ctx.href(k)}">${t}</a></li>` : `<li aria-current="page">${t}</li>`)).join('')}</ol></nav>`;

export function foto(ctx, slot, descricao, { alt = '', aspecto = '', ilustrativa = true } = {}) {
  const src = ctx.fotos[slot];
  const estilo = aspecto ? ` style="aspect-ratio:${aspecto}"` : '';
  if (!src) return `<div class="slot" data-slot="${slot}" data-rotulo="Foto provisória: ${descricao}"${estilo}></div>`;
  return `<figure class="slot tem-foto" data-slot="${slot}"${estilo}><img src="${src}" alt="${alt || descricao}" loading="lazy" decoding="async">${ilustrativa ? '<figcaption>Imagem ilustrativa</figcaption>' : ''}</figure>`;
}

export function heroInterno(ctx, { p, uni = 'claro', migalhas, rotulo, h1, sub, secundario = '', slot, descricao, aspecto = '4 / 3', chip = '' }) {
  return `
<section class="secao hero-int" data-universo="${uni}" aria-labelledby="h1-${p}">
  <div class="container">
    ${migalha(ctx, migalhas)}
    <div class="hero-int__grade">
      <div class="hero__txt">
        <p class="rotulo">${rotulo}</p>${chip}
        <h1 class="t1 t1--int" id="h1-${p}">${h1}</h1>
        <p class="sub corpo">${sub}</p>
        <div class="grupo-cta">
          <a class="btn btn--primario" href="${ctx.href('contato')}" data-evento="contact_click" data-metodo="cta_${p}">${CTA} <span class="seta" aria-hidden="true">→</span></a>
          ${secundario}
        </div>
      </div>
      ${foto(ctx, slot, descricao, { aspecto })}
    </div>
  </div>
</section>`;
}

export const cartoes = (itens, { cols = '' } = {}) => `
    <div class="grade-cartoes ${cols}">${itens.map((c) => `
      <${c.href ? 'a' : 'article'} class="card ${c.href ? 'card--hover cartao-link' : ''}"${c.href ? ` href="${c.href}"` : ''}>
        ${c.rotulo ? `<span class="rotulo">${c.rotulo}</span>` : ''}${c.numero ? `<p class="numero numero--m">${c.numero}</p>` : ''}
        <h3 class="t3">${c.titulo}</h3><p>${c.texto}</p>${c.href ? `<span class="link">${c.linkTxt || 'Conhecer'} →</span>` : ''}
      </${c.href ? 'a' : 'article'}>`).join('')}
    </div>`;

export const lista = (itens) => `<ul class="lista-check">${itens.map((i) => `<li>${i}</li>`).join('')}</ul>`;

export function linhaSolucao(ctx, s, i) {
  return `
<section class="secao sol-sec${i % 2 ? ' sol-sec--inv' : ''}" data-universo="${i % 2 ? 'broto' : 'claro'}" data-solucao="${s.id}" aria-labelledby="h-${s.id}">
  <div class="container sol">
    ${foto(ctx, s.slot, s.foto)}
    <div class="sol__txt"><h2 class="t3" id="h-${s.id}">${s.titulo}</h2>
      <dl class="sol__ps"><div><dt>Problema</dt><dd>${s.problema}</dd></div>
      <div><dt>Solução</dt><dd>${s.solucao}</dd></div>
      <div class="${ctx.prov(s.prov).trim()}"><dt>Benefício${ctx.tag(s.prov)}</dt><dd>${s.beneficio}</dd></div></dl>
      <a class="link" href="${ctx.href(s.rota)}">Conhecer a solução →</a></div>
  </div>
</section>`;
}

export function fluxo(ctx, p, { primeiro, segundo }) {
  const passos = (def, anim) => `<ol class="passos${anim ? ' anim' : ''}">${def.passos.map((s, i) => `
        <li class="passo"><span class="passo__no${s.fac ? ' fac' : ''}">${i + 1}</span><div class="passo__t">${s.a ? `<span class="ator">${s.a}</span>` : ''}<h3>${s.t}</h3>${s.d ? `<p class="legenda">${s.d}</p>` : ''}</div></li>`).join('')}</ol>
      <p class="trilho"><span class="status">Registrado</span><span>${def.registro}</span></p>`;
  return `
    <div class="fluxo__abas" role="tablist" aria-label="Fluxo de acesso">
      <button role="tab" id="aba-${p}-1" aria-selected="true" aria-controls="pn-${p}-1" type="button">${primeiro.nome}</button>
      <button role="tab" id="aba-${p}-2" aria-selected="false" aria-controls="pn-${p}-2" tabindex="-1" type="button">${segundo.nome}</button>
    </div>
    <div role="tabpanel" id="pn-${p}-1" aria-labelledby="aba-${p}-1">${passos(primeiro, true)}</div>
    <div role="tabpanel" id="pn-${p}-2" aria-labelledby="aba-${p}-2" hidden>${passos(segundo, false)}</div>
    <p class="legenda fluxo__nota">O acesso segue sempre as regras definidas por cada condomínio ou empresa.</p>`;
}

export const FLUXO_MORADOR = { nome: 'Morador', registro: 'Cada acesso fica registrado, com data e hora.', passos: [
  { a: 'Morador', t: 'Chega ao portão ou à porta', d: 'Aproxima-se do ponto de acesso.' },
  { a: 'Reconhecimento', t: 'É reconhecido pelo rosto', d: 'Ou usa o TAG ou o controle.', fac: true },
  { a: 'Portão', t: 'Acesso liberado', d: 'Conforme as regras do condomínio.' },
] };
export const FLUXO_VISITANTE = { nome: 'Visitante', registro: 'Conversa, imagens e registro do atendimento ficam gravados.', passos: [
  { a: 'Visitante', t: 'Chega e aciona o atendimento' },
  { a: 'Central', t: 'Identifica o visitante', d: 'Pelas câmeras da portaria.' },
  { a: 'Central → morador', t: 'Pede autorização' },
  { a: 'Morador', t: 'Autoriza', d: 'Mesmo fora do condomínio.' },
  { a: 'Portão', t: 'Acesso liberado' },
] };
export const FLUXO_COLABORADOR = { nome: 'Colaborador', registro: 'Cada acesso fica registrado e disponível para os gestores.', passos: [
  { a: 'Colaborador', t: 'Chega à entrada' },
  { a: 'Reconhecimento', t: 'É reconhecido pelo rosto', d: 'Ou usa o TAG ou o controle.', fac: true },
  { a: 'Entrada', t: 'Acesso liberado', d: 'Conforme horários e regras definidos pela empresa.' },
] };
export const FLUXO_VISITANTE_EMP = { nome: 'Visitante e prestador', registro: 'Conversa, imagens e registro do atendimento ficam gravados.', passos: [
  { a: 'Visitante', t: 'Chega e aciona o atendimento' },
  { a: 'Central', t: 'Identifica a pessoa', d: 'Pelas câmeras da entrada.' },
  { a: 'Central → responsável', t: 'Pede autorização' },
  { a: 'Responsável', t: 'Autoriza' },
  { a: 'Entrada', t: 'Acesso liberado' },
] };

export const faq = (itens, aberto = true) => `
    <div class="faq">${itens.map(([q, a], i) => `
      <details${aberto && i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}
    </div>`;

export const FAQ = {
  encomendas: ['Como funciona o recebimento de encomendas?', 'A portaria atende prontamente ao interfone e comunica o responsável, para garantir o recebimento seguro da encomenda.'],
  energia: ['E se faltar energia?', 'A solução conta com bancos de bateria para manter portões, comunicação e sistemas de emergência funcionando, e a central acompanha a autonomia em tempo real.'],
  panico: ['Como pedir ajuda em situação de risco?', 'Pelo botão de pânico silencioso, disponível no aplicativo, no TAG e no controle, que aciona a central e a segurança local.'],
  portao: ['E se o portão parar no fim de semana ou de madrugada?', 'A assistência técnica 24 horas faz parte da solução, e os motores são de propriedade da Evolua, o que agiliza qualquer reparo.'],
  evacuacao: ['O que acontece em caso de incêndio ou evacuação?', 'A solução contempla sistema de evacuação em conformidade com a NBR 9077. Em caso de necessidade, o acionamento abre as portas e a central recebe o evento e atua conforme o procedimento estabelecido.'],
  oque: ['O que é portaria remota?', 'É o atendimento da portaria feito por uma central de monitoramento, que recebe visitantes e entregadores pelas câmeras e interfone, consulta o morador e libera o acesso, com tudo registrado.'],
  visitante: ['Como o visitante entra?', 'Ele aciona o atendimento, a central o identifica, pede autorização ao morador e só então libera a entrada.'],
};

export const PORQUE = [
  { numero: 'Em Macaé', titulo: 'Central própria', texto: 'Atendimento supervisionado 24h, na mesma cidade dos moradores e clientes.' },
  { numero: 'Registro', titulo: 'Tudo gravado', texto: 'Conversa, imagens e registro de cada atendimento ficam gravados.' },
  { numero: '24h', titulo: 'Assistência técnica', texto: 'Inclusa na solução, com motores de propriedade da Evolua para agilizar reparos.' },
  { numero: 'NBR 9077', titulo: 'Emergências', texto: 'Botão de pânico silencioso, bancos de bateria e sistema de evacuação conforme a norma.' },
];

export function formLead(ctx, p, { tipo = 'condominio', mostrarTipo = true } = {}) {
  return `
      <form class="form" data-lead="${p}" data-tipo="${tipo}" novalidate>
        <div class="campo"><label for="f-${p}-nome">Nome</label><input id="f-${p}-nome" name="nome" autocomplete="name" required><span class="campo__erro">Informe seu nome.</span></div>
        <div class="campo"><label for="f-${p}-org">Condomínio ou empresa</label><input id="f-${p}-org" name="organizacao" autocomplete="organization" required><span class="campo__erro">Informe o nome do condomínio ou da empresa.</span></div>
        <div class="campo"><label for="f-${p}-whats">WhatsApp</label><input id="f-${p}-whats" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" placeholder="(22) 90000-0000" required><span class="campo__erro">Informe um WhatsApp válido com DDD.</span></div>
        <div class="campo"><label for="f-${p}-mail">E-mail</label><input id="f-${p}-mail" name="email" type="email" autocomplete="email" required><span class="campo__erro">Informe um e-mail válido.</span></div>
        ${mostrarTipo ? `<div class="campo"><label for="f-${p}-tipo">Você é de</label><select id="f-${p}-tipo" name="tipo"><option value="condominio"${tipo === 'condominio' ? ' selected' : ''}>Condomínio</option><option value="empresa"${tipo === 'empresa' ? ' selected' : ''}>Empresa</option></select></div>` : ''}
        <button class="btn btn--primario" type="submit">${CTA}</button>
        <p class="lgpd">Ao enviar, você concorda com a <a href="${ctx.href('privacidade')}">Política de Privacidade</a>.</p>
      </form>
      <div class="form__ok" role="status" tabindex="-1" hidden>
        <h3 class="t3">Recebemos o seu pedido.</h3>
        <p>Um especialista da Evolua vai falar com você.</p>
        <p class="lgpd" data-mock hidden>Simulação do protótipo: nenhum dado foi enviado.</p>
        <a class="btn btn--primario" data-diag href="${ctx.href('contato')}" hidden>Continuar para o diagnóstico</a>
      </div>`;
}

export function ctaFinal(ctx, { p, titulo, texto, tipo = 'condominio', uni = 'grafite' }) {
  return `
<section class="secao final" id="contato-${p}" data-universo="${uni}" aria-labelledby="h-final-${p}">
  <div class="container final__in">
    <div class="secao__cab" style="margin:0">
      <p class="rotulo">Fale com a Evolua</p>
      <h2 class="t2" id="h-final-${p}">${titulo}</h2>
      <p class="sub">${texto}</p>
      <p class="alt-contato">Prefere falar agora? Ligue ou chame no WhatsApp: <strong>${ctx.e.telefone}</strong></p>
      <p class="alt-contato"><a class="link" href="${ctx.e.whatsapp_href}" data-evento="contact_click" data-metodo="whatsapp">Abrir o WhatsApp</a></p>
    </div>
    <div class="painel" data-universo="claro">${formLead(ctx, p, { tipo })}</div>
  </div>
</section>`;
}

export const solucoesCards = (ctx, ids) => cartoes(ids.map((id) => ({ ...SOL_RESUMO[id], href: ctx.href(id) })));

export const SOL_RESUMO = {
  portaria: { titulo: 'Portaria remota', texto: 'Central 24h que atende visitantes e entregadores, com conversa, imagens e registro gravados.', linkTxt: 'Conhecer a portaria remota' },
  acesso: { titulo: 'Controle de acesso', texto: 'Reconhecimento facial, monitoramento de eventos e gestão por cloud.', linkTxt: 'Conhecer o controle de acesso' },
  app: { titulo: 'App Evolua', texto: 'O aplicativo exclusivo da Evolua para acompanhar e autorizar acessos.', linkTxt: 'Conhecer o app' },
  loker: { titulo: 'Evolua Loker', texto: 'Armários inteligentes para receber encomendas com segurança.', linkTxt: 'Conhecer o Loker' },
  automacao: { titulo: 'Automação', texto: 'Rotinas do condomínio integradas à portaria e acompanhadas pelo app.', linkTxt: 'Conhecer a automação' },
};
