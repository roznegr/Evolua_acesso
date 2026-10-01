// Home: gera o HTML das 14 seções a partir de data/facts.json. Texto conforme docs/fase-c-wireframe-home.md.
const fmt = (n) => new Intl.NumberFormat('pt-BR').format(n);

export function renderHome(facts, opts = {}) {
  const { marcar = false, links = 'ancora', logo = '' } = opts;
  const e = facts.empresa;
  const url = (anchor, site) => (links === 'site' ? site : anchor);
  const U = {
    sol: url('#solucoes', '/servicos'),
    cond: url('#caminhos', '/portaria-remota-condominial'),
    emp: url('#caminhos', '/portaria-remota-empresarial'),
    sobre: url('#sobre', '/qualidade'),
    cont: url('#conteudos', '/blog'),
    contato: url('#contato', '/contato'),
    diag: url('#contato', '/diagnostico-acesso'),
    portaria: url('#solucoes', '/portaria-remota'),
    acesso: url('#solucoes', '/acesso'),
    app: url('#solucoes', '/app-evolua'),
    loker: url('#solucoes', '/evolua-loker'),
    auto: url('#solucoes', '/automacao'),
    priv: url('#contato', '/politica-de-privacidade'),
    trab: url('#contato', '/trabalhe-conosco'),
  };
  const prov = (cond) => (marcar && cond ? ' prov' : '');
  const tag = (cond) => (marcar && cond ? '<span class="prov-tag">provisório</span>' : '');
  const CTA = 'Quero minha análise gratuita';
  const logoImg = (extra = '') => logo
    ? `<img src="${logo}" alt="Evolua Acesso Protegido" width="111" height="40" style="height:40px;width:auto;${extra}">`
    : '<span class="cab__logo">evolu<b>a</b></span>';


  const solucoes = [
    { id: 'portaria-remota', slot: 'portaria', titulo: 'Portaria <strong>remota</strong>', foto: 'Foto provisória: portaria de condomínio (slot 4:3).', href: U.portaria,
      problema: 'Portaria que depende de turnos e de controle manual.',
      solucao: 'Central da Evolua na mesma cidade, supervisionada 24h, que atende visitantes e entregadores com conversa, imagens e registro gravados.',
      beneficio: 'Mais controle e mais segurança sem depender de uma equipe de plantão no condomínio.' },
    { id: 'controle-de-acesso', slot: 'acesso', titulo: 'Controle de <strong>acesso</strong>', foto: 'Foto provisória: leitor de acesso em uma entrada (slot 4:3).', href: U.acesso,
      problema: 'Não saber quem entrou, por onde e quando.',
      solucao: 'Evolua Access, com gestão por cloud e monitoramento de eventos como arrombamento, pânico, porta que não fechou e emergência.',
      beneficio: 'Histórico de acessos e alerta em tempo real.' },
    { id: 'app-evolua', slot: 'app', titulo: facts.app.nome, foto: 'Foto provisória: morador usando o celular na entrada (slot 4:3). Sem tela de aplicativo.', href: U.app, prov: facts.app.provisorio,
      problema: 'Depender de chaves e de ligações para liberar visitas.',
      solucao: 'Aplicativo exclusivo da Evolua para acompanhar e autorizar acessos.',
      beneficio: `<ul>${facts.app.funcoes.map((f) => `<li>${f}</li>`).join('')}</ul>` },
    { id: 'evolua-loker', slot: 'loker', titulo: 'Evolua <strong>Loker</strong>', foto: 'Foto provisória: armário inteligente de encomendas (slot 4:3).', href: U.loker, prov: facts.loker.provisorio,
      problema: 'Encomendas sem controle de quem recebe e retira.',
      solucao: 'Armário inteligente que recebe as encomendas do condomínio.',
      beneficio: facts.loker.texto },
    { id: 'automacao', slot: 'automacao', titulo: '<strong>Automação</strong> do condomínio', foto: 'Foto provisória: área comum de condomínio (slot 4:3).', href: U.auto,
      problema: 'Rotinas do condomínio que dependem de zelador ou porteiro.',
      solucao: "Módulo de automação integrado à portaria: bomba d'água, nível da caixa d'água, área das lixeiras e exaustor da churrasqueira.",
      beneficio: 'O síndico acompanha tudo no aplicativo.' },
  ];

  const indic = facts.indicadores.itens.map((i) => `
        <div class="ind__item" data-reveal>
          <dt class="ind__rot">${i.rotulo}${i.status ? '<span class="status">Em operação</span>' : ''}</dt>
          <dd class="numero" data-contar="${i.valor}">+${fmt(i.valor)}</dd>
        </div>`).join('');

  return `
<a class="pular" href="#principal">Pular para o conteúdo</a>

<header class="cab">
  <div class="container cab__in">
    <a href="#topo" aria-label="Evolua Acesso Protegido, início">${logoImg()}</a>
    <nav class="cab__nav" aria-label="Principal">
      <a href="${U.sol}">Soluções</a><a href="${U.cond}">Condomínios</a><a href="${U.emp}">Empresas</a>
      <a href="${U.sobre}">Sobre</a><a href="${U.cont}">Conteúdos</a><a href="${U.contato}">Contato</a>
    </nav>
    <div class="cab__acoes">
      <a class="btn btn--primario" href="${U.diag}" data-evento="contact_click" data-metodo="cta_header">Análise gratuita</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-mob" aria-label="Abrir menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
  <nav id="menu-mob" class="menu-mob" aria-label="Menu" hidden>
    <div class="container">
      <a href="${U.sol}">Soluções</a><a href="${U.cond}">Condomínios</a><a href="${U.emp}">Empresas</a>
      <a href="${U.sobre}">Sobre</a><a href="${U.cont}">Conteúdos</a><a href="${U.contato}">Contato</a>
      <p class="legenda">Telefone e WhatsApp: ${e.telefone}</p>
    </div>
  </nav>
</header>

<main id="principal">
<!-- 02 Hero -->
<section class="secao hero" id="topo" data-universo="claro" aria-labelledby="h1">
  <div class="container hero__in">
    <div class="hero__txt">
      <p class="rotulo">Acesso protegido em ${e.cidades.join(' e ')}</p>
      <span class="chip-fac"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M9 10v1M15 10v1M9.5 15c1.5 1.2 3.5 1.2 5 0"/></svg>Com reconhecimento facial</span>
      <h1 class="t1" id="h1">Evolua <strong>a sua portaria.</strong></h1>
      <p class="sub corpo">Reconhecimento facial, central de atendimento 24h e registro de cada acesso, para condomínios e empresas em ${e.cidades.join(' e ')}.</p>
      <div class="grupo-cta">
        <a class="btn btn--primario" href="${U.diag}" data-evento="contact_click" data-metodo="cta_hero">${CTA} <span class="seta" aria-hidden="true">→</span></a>
        <a class="btn btn--secundario" href="#solucoes">Conhecer as soluções</a>
      </div>
      <ul class="hero__conf legenda"><li>Desde ${e.desde}</li><li>Central de atendimento 24h</li><li>${e.cidades.join(' e ')}</li></ul>
    </div>
    <div class="hero__media" data-universo="petroleo">
      <div class="slot" data-slot="hero" data-rotulo="Foto provisória do banco de imagem: pessoa chegando ao portão de um condomínio (slot hero, 4:5). Será trocada por foto real."></div>
      <div class="moldura" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <span class="ponto-ref" aria-hidden="true"></span><span class="ponto-ref" aria-hidden="true"></span><span class="ponto-ref" aria-hidden="true"></span><span class="ponto-ref" aria-hidden="true"></span><span class="ponto-ref" aria-hidden="true"></span>
      <span class="status">Acesso liberado</span>
      <span class="legenda">Ilustração do fluxo de acesso</span>
    </div>
  </div>
</section>

<!-- 03 Indicadores -->
<section class="secao ind" data-universo="petroleo" aria-labelledby="h-ind">
  <div class="container">
    <div class="secao__cab"><p class="rotulo">A Evolua em números</p><h2 class="t2" id="h-ind">Operação em escala, <strong>acesso por acesso.</strong></h2></div>
    <dl class="ind__lista">${indic}</dl>
    <p class="legenda ind__fonte${prov(facts.indicadores.fonte.provisorio)}">${facts.indicadores.fonte.texto}${tag(facts.indicadores.fonte.provisorio)}</p>
  </div>
</section>

<!-- 04 Mensagem de valor -->
<section class="secao valor" id="valor" data-universo="claro" aria-labelledby="h-valor">
  <div class="container valor__in">
    <div class="secao__cab" style="margin:0">
      <p class="rotulo">Acesso protegido</p>
      <h2 class="t2" id="h-valor">Mais do que abrir e fechar portas.</h2>
      <p class="sub corpo">Acesso protegido é saber <strong>quem</strong> entra, <strong>quando</strong> entra e <strong>como</strong> entra, com cada interação registrada e acompanhada por uma central de atendimento. A Evolua combina reconhecimento facial, atendimento humano e registro para o seu condomínio ou empresa.</p>
      <p><a class="link" href="#como-funciona">Ver como funciona ↓</a></p>
    </div>
    <div class="slot faceta" data-slot="central" data-rotulo="Foto provisória: operador na central de atendimento (slot central, 4:3)."></div>
  </div>
</section>

<!-- 05 Dois caminhos -->
<section class="secao cam" id="caminhos" data-universo="broto" aria-labelledby="h-cam">
  <div class="container">
    <div class="secao__cab"><p class="rotulo">Para quem</p><h2 class="t2" id="h-cam">Escolha o seu <strong>caminho.</strong></h2></div>
    <div class="cam__sel" role="group" aria-label="Escolher público">
      <button type="button" aria-pressed="true" data-alvo="cond">Condomínios</button>
      <button type="button" aria-pressed="false" data-alvo="emp">Empresas</button>
    </div>
    <div class="cam__grade">
      <article class="cam__card card--hover" data-universo="claro" data-painel="cond">
        <div class="slot" data-slot="condominio" data-rotulo="Foto provisória: portão ou portaria de condomínio residencial (slot 16:9)."></div>
        <div class="sol__txt"><h3 class="t3">Para <strong>condomínios</strong></h3>
        <p class="sub">Segurança, autonomia e praticidade para moradores, visitantes e administração.</p>
        <a class="btn btn--primario" href="${U.cond}" data-evento="condominio_view">Conhecer soluções para condomínios <span class="seta" aria-hidden="true">→</span></a></div>
      </article>
      <article class="cam__card card--hover" data-universo="petroleo" data-painel="emp" hidden>
        <div class="slot" data-slot="empresa" data-rotulo="Foto provisória: entrada de empresa com controle de acesso (slot 16:9)."></div>
        <div class="sol__txt"><h3 class="t3">Para <strong>empresas</strong></h3>
        <p class="sub">Mais controle e visibilidade sobre o acesso de colaboradores, visitantes e prestadores.</p>
        <a class="btn btn--primario" href="${U.emp}" data-evento="empresa_view">Conhecer soluções para empresas <span class="seta" aria-hidden="true">→</span></a></div>
      </article>
    </div>
  </div>
</section>

<!-- 06 Como funciona -->
<section class="secao fluxo" id="como-funciona" data-universo="claro" aria-labelledby="h-fluxo">
  <div class="container">
    <div class="secao__cab"><p class="rotulo">Como funciona</p><h2 class="t2" id="h-fluxo">Cada acesso passa pelo <strong>mesmo caminho.</strong></h2></div>
    <div class="fluxo__abas" role="tablist" aria-label="Fluxo de acesso">
      <button role="tab" id="aba-mor" aria-selected="true" aria-controls="p-mor" type="button">Morador</button>
      <button role="tab" id="aba-vis" aria-selected="false" aria-controls="p-vis" tabindex="-1" type="button">Visitante</button>
    </div>
    <div role="tabpanel" id="p-mor" aria-labelledby="aba-mor">
      <ol class="passos anim">
        <li class="passo"><span class="passo__no">1</span><div class="passo__t"><h3>Chega ao portão ou à porta</h3><p class="legenda">O morador se aproxima do ponto de acesso.</p></div></li>
        <li class="passo"><span class="passo__no fac">2</span><div class="passo__t"><h3>É reconhecido pelo rosto</h3><p class="legenda">Ou usa o TAG ou o controle.</p></div></li>
        <li class="passo"><span class="passo__no">3</span><div class="passo__t"><h3>Acesso liberado</h3><p class="legenda">Conforme as regras do condomínio, com registro.</p><span class="status">Registrado</span></div></li>
      </ol>
    </div>
    <div role="tabpanel" id="p-vis" aria-labelledby="aba-vis" hidden>
      <ol class="passos">
        <li class="passo"><span class="passo__no">1</span><div class="passo__t"><h3>Chega e aciona o atendimento</h3></div></li>
        <li class="passo"><span class="passo__no">2</span><div class="passo__t"><h3>A central o identifica</h3><p class="legenda">Pelas câmeras da portaria.</p></div></li>
        <li class="passo"><span class="passo__no">3</span><div class="passo__t"><h3>Pede autorização ao morador</h3></div></li>
        <li class="passo"><span class="passo__no">4</span><div class="passo__t"><h3>O morador autoriza</h3><p class="legenda">Mesmo fora do condomínio.</p></div></li>
        <li class="passo"><span class="passo__no">5</span><div class="passo__t"><h3>Acesso liberado</h3><p class="legenda">Conversa, imagens e registro gravados.</p><span class="status">Registrado</span></div></li>
      </ol>
    </div>
    <p class="legenda fluxo__nota">O acesso segue sempre as regras definidas por cada condomínio ou empresa.</p>
  </div>
</section>

<!-- 07 Soluções -->
<section class="secao" id="solucoes" data-universo="claro" aria-labelledby="h-sol" style="padding-bottom:var(--espaco-6)">
  <div class="container">
    <div class="secao__cab" style="margin:0"><p class="rotulo">Soluções</p><h2 class="t2" id="h-sol">Tudo o que o acesso precisa, <strong>em um só lugar.</strong></h2></div>
  </div>
</section>
${solucoes.map((s, i) => `
<section class="secao sol-sec${i % 2 ? ' sol-sec--inv' : ''}" data-universo="${i % 2 ? 'broto' : 'claro'}" data-solucao="${s.id}" aria-labelledby="h-${s.id}">
  <div class="container sol">
    <div class="slot" data-slot="${s.slot}" data-rotulo="${s.foto}"${i % 2 ? ' style="background:var(--branco)"' : ''}></div>
    <div class="sol__txt"><h3 class="t3" id="h-${s.id}">${s.titulo}</h3>
      <dl class="sol__ps"><div><dt>Problema</dt><dd>${s.problema}</dd></div>
      <div><dt>Solução</dt><dd>${s.solucao}</dd></div>
      <div class="${prov(s.prov).trim()}"><dt>Benefício${tag(s.prov)}</dt><dd>${s.beneficio}</dd></div></dl>
      <a class="link" href="${s.href}">Conhecer a solução →</a></div>
  </div>
</section>`).join('')}

<!-- 08 Experiência -->
<section class="secao exp" data-universo="petroleo" aria-labelledby="h-exp">
  <div class="container">
    <div class="secao__cab"><p class="rotulo">Na prática</p><h2 class="t2" id="h-exp">Quem usa, <strong>vê assim.</strong></h2></div>
    <div class="exp__faixa" tabindex="0" aria-label="Cenas de uso">
      <article class="exp__cena"><div class="slot" data-slot="exp-morador" data-rotulo="Foto provisória: morador recebendo alguém sem descer (3:4)."></div><h3>O morador</h3><p>Recebe uma pessoa sem precisar descer.</p></article>
      <article class="exp__cena"><div class="slot" data-slot="exp-visitante" data-rotulo="Foto provisória: visitante na entrada (3:4)."></div><h3>O visitante</h3><p>É identificado e autorizado antes de entrar.</p></article>
      <article class="exp__cena"><div class="slot" data-slot="exp-adm" data-rotulo="Foto provisória: síndico consultando o histórico (3:4)."></div><h3>A administração</h3><p>Acompanha quem acessa e consulta o histórico.</p></article>
      <article class="exp__cena"><div class="slot" data-slot="exp-central" data-rotulo="Foto provisória: operador na central (3:4)."></div><h3>A central</h3><p>Atende e registra cada interação, 24h.</p><span class="status">Registrado</span></article>
    </div>
    <div class="exp__ctl"><button type="button" data-dir="-1" aria-label="Cena anterior">←</button><button type="button" data-dir="1" aria-label="Próxima cena">→</button></div>
  </div>
</section>

<!-- 09 Por que a Evolua -->
<section class="secao por" data-universo="broto" aria-labelledby="h-por">
  <div class="container">
    <div class="secao__cab"><p class="rotulo">Por que a Evolua</p><h2 class="t2" id="h-por">O que você pode <strong>verificar.</strong></h2></div>
    <div class="por__grade">
      <article class="card por__item"><p class="numero">Em Macaé</p><h3 class="t3">Central própria</h3><p>Atendimento supervisionado 24h, na mesma cidade dos moradores e clientes.</p></article>
      <article class="card por__item"><p class="numero">Registro</p><h3 class="t3">Tudo gravado</h3><p>Conversa, imagens e registro de cada atendimento ficam gravados.</p></article>
      <article class="card por__item"><p class="numero">24h</p><h3 class="t3">Assistência técnica</h3><p>Inclusa na solução, com motores de propriedade da Evolua para agilizar reparos.</p></article>
      <article class="card por__item"><p class="numero">NBR 9077</p><h3 class="t3">Emergências</h3><p>Botão de pânico silencioso, bancos de bateria e sistema de evacuação conforme a norma.</p></article>
    </div>
  </div>
</section>

<!-- 10 Sobre -->
<section class="secao sobre" id="sobre" data-universo="claro" aria-labelledby="h-sobre">
  <div class="container sobre__in">
    <div class="secao__cab" style="margin:0"><p class="rotulo">Sobre a Evolua</p><h2 class="t2" id="h-sobre">Acesso protegido <strong>desde ${e.desde}.</strong></h2>
      <p class="corpo">A Evolua atua com portaria remota e controle de acesso para condomínios e empresas em ${e.cidades.join(' e ')}. Nosso propósito é melhorar a segurança, a convivência e a qualidade de vida de moradores e colaboradores, com tecnologia e atendimento próximo.</p>
      <p><a class="link" href="${U.sobre}">Conheça a Evolua →</a></p></div>
    <div class="slot" data-slot="sobre" data-rotulo="Foto provisória: central de atendimento ou fachada (slot 3:2)."></div>
  </div>
</section>

<!-- 11 Conteúdos -->
<section class="secao cont" id="conteudos" data-universo="claro" aria-labelledby="h-cont" style="padding-top:0">
  <div class="container">
    <div class="secao__cab"><p class="rotulo">Conteúdos</p><h2 class="t2" id="h-cont">Respostas para quem decide sobre a <strong>portaria.</strong></h2></div>
    <div class="cont__grade">
      <a class="card card--hover cont__card" href="${U.cont}"><span class="rotulo">Segurança</span><h3 class="t3">Portaria remota é segura se a internet cair?</h3><span class="legenda">Artigo em preparação</span></a>
      <a class="card card--hover cont__card" href="${U.cont}"><span class="rotulo">Gestão de acesso</span><h3 class="t3">Como funciona o controle de visitantes</h3><span class="legenda">Artigo em preparação</span></a>
      <a class="card card--hover cont__card" href="${U.cont}"><span class="rotulo">Portaria</span><h3 class="t3">Portaria remota ou controle de acesso: qual a diferença?</h3><span class="legenda">Artigo em preparação</span></a>
    </div>
    <p style="margin-top:var(--espaco-4)"><a class="link" href="${U.cont}">Ver todos os conteúdos →</a></p>
  </div>
</section>

<!-- 12 FAQ -->
<section class="secao" data-universo="broto" aria-labelledby="h-faq">
  <div class="container">
    <div class="secao__cab"><p class="rotulo">Dúvidas</p><h2 class="t2" id="h-faq">Perguntas <strong>frequentes</strong></h2></div>
    <div class="faq">
      <details open><summary>O que é portaria remota?</summary><p>É o atendimento da portaria feito por uma central de monitoramento, que recebe visitantes e entregadores pelas câmeras e interfone, consulta o morador e libera o acesso, com tudo registrado.</p></details>
      <details><summary>Como o visitante entra?</summary><p>Ele aciona o atendimento, a central o identifica, pede autorização ao morador e só então libera a entrada.</p></details>
      <details><summary>E se faltar energia?</summary><p>A solução conta com bancos de bateria para manter portões, comunicação e sistemas de emergência funcionando, e a central acompanha a autonomia em tempo real.</p></details>
      <details><summary>Como o morador pede ajuda em situação de risco?</summary><p>Pelo botão de pânico silencioso, disponível no aplicativo, no TAG e no controle, que aciona a central e a segurança local.</p></details>
    </div>
  </div>
</section>

<!-- 13 CTA final -->
<section class="secao final" id="contato" data-universo="verde" aria-labelledby="h-final">
  <div class="container final__in">
    <div class="secao__cab" style="margin:0">
      <p class="rotulo" style="color:var(--petroleo)">Fale com a Evolua</p>
      <h2 class="t2" id="h-final">Vamos entender como os acessos funcionam hoje no seu condomínio ou empresa?</h2>
      <p class="sub">Peça uma análise gratuita e receba um retorno de um especialista da Evolua.</p>
      <p class="alt-contato">Prefere falar agora? Ligue ou chame no WhatsApp: <strong>${e.telefone}</strong></p>
      <p class="alt-contato"><a class="link" style="color:var(--petroleo)" href="${e.whatsapp_href}" data-evento="contact_click" data-metodo="whatsapp">Abrir o WhatsApp</a></p>
    </div>
    <div class="painel" data-universo="petroleo">
      <form class="form" id="form-lead" novalidate>
        <div class="campo"><label for="f-nome">Nome</label><input id="f-nome" name="nome" autocomplete="name" required><span class="campo__erro" id="e-nome">Informe seu nome.</span></div>
        <div class="campo"><label for="f-org">Condomínio ou empresa</label><input id="f-org" name="organizacao" autocomplete="organization" required><span class="campo__erro" id="e-org">Informe o nome do condomínio ou da empresa.</span></div>
        <div class="campo"><label for="f-whats">WhatsApp</label><input id="f-whats" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" placeholder="(22) 90000-0000" required><span class="campo__erro" id="e-whats">Informe um WhatsApp válido com DDD.</span></div>
        <div class="campo"><label for="f-mail">E-mail</label><input id="f-mail" name="email" type="email" autocomplete="email" required><span class="campo__erro" id="e-mail">Informe um e-mail válido.</span></div>
        <div class="campo"><label for="f-tipo">Você é de</label><select id="f-tipo" name="tipo"><option value="condominio">Condomínio</option><option value="empresa">Empresa</option></select></div>
        <button class="btn btn--primario" type="submit">${CTA}</button>
        <p class="lgpd">Ao enviar, você concorda com a <a href="${U.priv}">Política de Privacidade</a>.</p>
      </form>
      <div class="form__ok" id="form-ok" role="status" tabindex="-1" hidden>
        <h3 class="t3">Recebemos o seu pedido.</h3>
        <p>Um especialista da Evolua vai falar com você.</p>
        <p class="lgpd" id="aviso-mock" hidden>Simulação do protótipo: nenhum dado foi enviado.</p>
        <a class="btn btn--primario" id="ok-diag" href="${U.diag}" hidden>Continuar para o diagnóstico</a>
      </div>
    </div>
  </div>
</section>
</main>

<footer class="secao rod" data-universo="petroleo">
  <div class="container">
    <div class="rod__grade">
      <div>${logo ? `<img src="${logo}" alt="Evolua Acesso Protegido" width="111" height="40" style="height:40px;width:auto;filter:brightness(0) invert(1)">` : '<span class="rod__logo">evolu<b>a</b></span>'}
        <p class="legenda" style="margin-top:var(--espaco-2)">Acesso protegido para condomínios e empresas em ${e.cidades.join(' e ')}.</p></div>
      <div><h2>Navegação</h2><ul><li><a href="${U.sol}">Soluções</a></li><li><a href="${U.cond}">Condomínios</a></li><li><a href="${U.emp}">Empresas</a></li><li><a href="${U.cont}">Conteúdos</a></li><li><a href="${U.contato}">Contato</a></li></ul></div>
      <div><h2>Institucional</h2><ul><li><a href="${U.sobre}">Sobre</a></li><li><a href="${U.trab}">Trabalhe conosco</a></li><li><a href="${U.priv}">Política de Privacidade</a></li></ul></div>
      <div><h2>Contato</h2><ul><li>${e.telefone}</li><li>${e.email}</li><li>${e.endereco}</li></ul></div>
    </div>
    <p class="legenda rod__fim">Instagram @evolua_tech · Facebook /Evoluatech · YouTube</p>
  </div>
</footer>
`;
}
