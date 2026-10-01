// Páginas do site. Estrutura: docs/fase-b-arquitetura.md (revisada em 01/10) e docs/fase-c-wireframe-home.md.
import { ROTAS } from './rotas.mjs';
import {
  CTA, cab, cartoes, lista, foto, heroInterno, linhaSolucao, fluxo, faq, FAQ, PORQUE, ctaFinal, formLead, solucoesCards, migalha,
  FLUXO_MORADOR, FLUXO_VISITANTE, FLUXO_COLABORADOR, FLUXO_VISITANTE_EMP,
} from './comp.mjs';

const sec = (uni, id, corpo, extra = '') => `
<section class="secao" data-universo="${uni}"${id ? ` id="${id}"` : ''}${extra}>
  <div class="container">${corpo}
  </div>
</section>`;

const secao2 = (uni, p, rotulo, titulo, corpo, sub = '') => `
<section class="secao" data-universo="${uni}" aria-labelledby="h-${p}">
  <div class="container">${cab({ rotulo, titulo, sub, id: `h-${p}` })}${corpo}
  </div>
</section>`;

const porQue = (ctx, p, uni = 'broto') => secao2(uni, `${p}-porque`, 'Por que a Evolua', 'O que você pode <strong>verificar.</strong>', cartoes(PORQUE, { cols: 'cols-4' }));

// Dados de cada solução (texto do site atual, sem QR code, sem fornecedores)
export function solucoes(ctx) {
  const { app, loker } = ctx.facts;
  return {
    portaria: { rota: 'portaria', id: 'portaria-remota', slot: 'central', foto: 'operadores na central de atendimento (4:3).', titulo: 'Portaria <strong>remota</strong>',
      problema: 'Portaria que depende de turnos e de controle manual.',
      solucao: 'Central da Evolua na mesma cidade, supervisionada 24h, que atende visitantes e entregadores com conversa, imagens e registro gravados.',
      beneficio: 'Mais controle e mais segurança sem depender de uma equipe de plantão.' },
    acesso: { rota: 'acesso', id: 'controle-de-acesso', slot: 'acesso', foto: 'leitor de acesso em uma entrada (4:3).', titulo: 'Controle de <strong>acesso</strong>',
      problema: 'Não saber quem entrou, por onde e quando.',
      solucao: 'Evolua Access, com reconhecimento facial, gestão por cloud e monitoramento de eventos como arrombamento, pânico, porta que não fechou e emergência.',
      beneficio: 'Histórico de acessos e alerta em tempo real.' },
    app: { rota: 'app', id: 'app-evolua', slot: 'app', foto: 'morador usando o celular na entrada (4:3). Sem tela de aplicativo.', titulo: app.nome, prov: app.provisorio,
      problema: 'Depender de chaves e de ligações para liberar visitas.',
      solucao: 'Aplicativo exclusivo da Evolua para acompanhar e autorizar acessos.',
      beneficio: lista(app.funcoes) },
    loker: { rota: 'loker', id: 'evolua-loker', slot: 'loker', foto: 'armário inteligente de encomendas (4:3).', titulo: 'Evolua <strong>Loker</strong>', prov: loker.provisorio,
      problema: 'Encomendas sem controle de quem recebe e retira.',
      solucao: 'Armário inteligente que recebe as encomendas do condomínio ou da empresa.',
      beneficio: loker.texto },
    automacao: { rota: 'automacao', id: 'automacao', slot: 'automacao', foto: 'área comum de condomínio (4:3).', titulo: '<strong>Automação</strong> do condomínio',
      problema: 'Rotinas do condomínio que dependem de zelador ou porteiro.',
      solucao: 'Módulo de automação integrado à portaria: bomba d\'água, nível da caixa d\'água, área das lixeiras e exaustor da churrasqueira.',
      beneficio: 'O síndico acompanha tudo no aplicativo.' },
  };
}

/* ---------- HOME (geral e sucinta) ---------- */
export function home(ctx) {
  const { e } = ctx;
  const temFoto = Boolean(ctx.fotos.hero);
  const itens = ctx.facts.indicadores.itens.map((i) => `
        <div class="ind__item" data-reveal>
          <dt class="ind__rot">${i.rotulo}${i.status ? '<span class="status">Em operação</span>' : ''}</dt>
          <dd class="numero" data-contar="${i.valor}">+${new Intl.NumberFormat('pt-BR').format(i.valor)}</dd>
        </div>`).join('');
  const fonte = ctx.facts.indicadores.fonte;
  const textoHero = `
      <p class="rotulo">Acesso protegido em ${ctx.cidades}</p>
      <span class="chip-fac"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M9 10v1M15 10v1M9.5 15c1.5 1.2 3.5 1.2 5 0"/></svg>Com reconhecimento facial</span>
      <h1 class="t1" id="h1-home">Evolua <strong>a sua portaria.</strong></h1>
      <p class="sub corpo">Reconhecimento facial, central de atendimento 24h e registro de cada acesso, para condomínios e empresas em ${ctx.cidades}.</p>
      <div class="grupo-cta">
        <a class="btn btn--primario" href="${ctx.href('contato')}" data-evento="contact_click" data-metodo="cta_hero">${CTA} <span class="seta" aria-hidden="true">→</span></a>
        <a class="btn btn--secundario" ${ctx.rolar('caminhos')}>Escolher meu caminho</a>
      </div>
      <ul class="hero__conf legenda"><li>Desde ${e.desde}</li><li>Central de atendimento 24h</li><li>${ctx.cidades}</li></ul>`;
  const hero = temFoto ? `
<section class="secao hero hero--foto" data-universo="grafite" aria-labelledby="h1-home">
  <div class="container hero__in"><div class="hero__txt">${textoHero}
    </div></div>
  <img class="hero__foto" src="${ctx.fotos.hero}" alt="Pessoa sorrindo sendo reconhecida por reconhecimento facial na entrada" decoding="async">
  <span class="hero__legenda">Imagem ilustrativa</span>
</section>` : `
<section class="secao hero" data-universo="grafite" aria-labelledby="h1-home">
  <div class="container hero__in">
    <div class="hero__txt">${textoHero}
    </div>
    <div class="hero__media" data-universo="petroleo">
      <div class="slot" data-slot="hero" data-rotulo="Foto provisória: pessoa chegando ao portão de um condomínio (4:5). Será trocada por foto real."></div>
      <div class="moldura" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <span class="ponto-ref" aria-hidden="true"></span><span class="ponto-ref" aria-hidden="true"></span><span class="ponto-ref" aria-hidden="true"></span><span class="ponto-ref" aria-hidden="true"></span><span class="ponto-ref" aria-hidden="true"></span>
      <span class="status">Acesso liberado</span><span class="legenda">Ilustração do fluxo de acesso</span>
    </div>
  </div>
</section>`;
  return `${hero}

<section class="secao ind" data-universo="claro" aria-labelledby="h-ind">
  <div class="container">
    <h2 class="rotulo" id="h-ind">A Evolua em números</h2>
    <dl class="ind__lista">${itens}</dl>
    <p class="legenda ind__fonte${ctx.prov(fonte.provisorio)}">${fonte.texto}${ctx.tag(fonte.provisorio)}</p>
  </div>
</section>

<section class="secao" data-universo="broto" aria-labelledby="h-valor">
  <div class="container">
    ${cab({ rotulo: 'Acesso protegido', titulo: 'Mais do que abrir e fechar <strong>portas.</strong>', id: 'h-valor',
      sub: 'Acesso protegido é saber <strong>quem</strong> entra, <strong>quando</strong> entra e <strong>como</strong> entra, com cada interação registrada e acompanhada por uma central de atendimento.' })}
    ${solucoesCards(ctx, ['portaria', 'acesso', 'app', 'loker', 'automacao'])}
    <p class="legenda" style="margin-top:var(--espaco-3)"><a class="link" href="${ctx.href('solucoes')}">Ver todas as soluções →</a></p>
  </div>
</section>

<section class="secao cam" id="caminhos" data-universo="grafite" aria-labelledby="h-cam">
  <div class="container">
    ${cab({ rotulo: 'Para quem', titulo: 'Escolha o seu <strong>caminho.</strong>', id: 'h-cam' })}
    <div class="cam__grade">
      <article class="cam__card card--hover" data-universo="claro">
        ${foto(ctx, 'condominio', 'portão ou portaria de condomínio residencial (16:9).', { aspecto: '16 / 9', ilustrativa: false })}
        <div class="sol__txt"><h3 class="t3">Para <strong>condomínios</strong></h3>
        <p class="sub">Segurança, autonomia e praticidade para moradores, visitantes e administração.</p>
        <a class="btn btn--primario" href="${ctx.href('condominios')}" data-evento="condominio_view">Conhecer soluções para condomínios <span class="seta" aria-hidden="true">→</span></a></div>
      </article>
      <article class="cam__card card--hover" data-universo="petroleo">
        ${foto(ctx, 'empresa', 'entrada de empresa com controle de acesso (16:9).', { aspecto: '16 / 9', ilustrativa: false })}
        <div class="sol__txt"><h3 class="t3">Para <strong>empresas</strong></h3>
        <p class="sub">Mais controle e visibilidade sobre o acesso de colaboradores, visitantes e prestadores.</p>
        <a class="btn btn--primario" href="${ctx.href('empresas')}" data-evento="empresa_view">Conhecer soluções para empresas <span class="seta" aria-hidden="true">→</span></a></div>
      </article>
    </div>
  </div>
</section>

${secao2('claro', 'home-blog', 'Conteúdos', 'Respostas para quem decide sobre a <strong>portaria.</strong>', cartoes([
    { rotulo: 'Segurança', titulo: 'Portaria remota é segura se a internet cair?', texto: 'Artigo em preparação.', href: ctx.href('blog'), linkTxt: 'Ver conteúdos' },
    { rotulo: 'Gestão de acesso', titulo: 'Como funciona o controle de visitantes', texto: 'Artigo em preparação.', href: ctx.href('blog'), linkTxt: 'Ver conteúdos' },
    { rotulo: 'Portaria', titulo: 'Portaria remota ou controle de acesso: qual a diferença?', texto: 'Artigo em preparação.', href: ctx.href('blog'), linkTxt: 'Ver conteúdos' },
  ], { cols: 'cols-3' }))}

${ctaFinal(ctx, { p: 'home', titulo: 'Vamos entender como os acessos funcionam hoje no seu condomínio ou empresa?', texto: 'Peça uma análise gratuita e receba um retorno de um especialista da Evolua.' })}`;
}

/* ---------- CONDOMÍNIOS ---------- */
export function condominios(ctx) {
  const reconhecimentoFoto = ctx.fotos.hero ? 'hero' : 'reconhecimento';
  return `
${heroInterno(ctx, { p: 'condominios', migalhas: [['condominios', 'Condomínios']], rotulo: 'Para condomínios',
    h1: 'Mais segurança e autonomia para o <strong>seu condomínio.</strong>',
    sub: `Reconhecimento facial, central de atendimento 24h e registro de cada acesso, para moradores, visitantes e administração em ${ctx.cidades}.`,
    secundario: `<a class="btn btn--secundario" ${ctx.rolar('cond-como')}>Ver como funciona</a>`, slot: 'condominio', descricao: 'portão ou portaria de condomínio residencial (4:3).' })}

${secao2('broto', 'cond-quem', 'Quem ganha', 'Cada pessoa do condomínio, <strong>com o que precisa.</strong>', cartoes([
    { titulo: 'O síndico', texto: 'Mais controle e informação para decidir: histórico de acessos e relatórios mensais.' },
    { titulo: 'Os moradores', texto: 'Recebem visitas sem descer e acompanham os acessos pelo aplicativo.' },
    { titulo: 'A administração', texto: 'Processos claros: autorização conforme as regras do condomínio, com tudo registrado.' },
  ], { cols: 'cols-3' }))}

<section class="secao fluxo" id="cond-como" data-universo="claro" aria-labelledby="h-cond-como">
  <div class="container">${cab({ rotulo: 'Como funciona', titulo: 'Cada acesso passa pelo <strong>mesmo caminho.</strong>', id: 'h-cond-como' })}
    ${fluxo(ctx, 'cond', { primeiro: FLUXO_MORADOR, segundo: FLUXO_VISITANTE })}
  </div>
</section>

<section class="secao sol-sec" data-universo="grafite" aria-labelledby="h-cond-rec">
  <div class="container sol">
    ${foto(ctx, reconhecimentoFoto, 'pessoa sendo reconhecida na entrada (4:3).', { alt: 'Pessoa sendo reconhecida por reconhecimento facial' })}
    <div class="sol__txt"><p class="rotulo">Reconhecimento facial</p><h2 class="t2" id="h-cond-rec">O morador chega e é <strong>reconhecido.</strong></h2>
      <p class="sub">Em condomínios com reconhecimento facial, o morador cadastrado é reconhecido ao chegar e o acesso é liberado conforme as regras definidas pelo condomínio, com registro.</p>
      <a class="link" href="${ctx.href('acesso')}">Conhecer o controle de acesso →</a></div>
  </div>
</section>

${secao2('claro', 'cond-sol', 'Soluções para condomínios', 'Tudo o que o condomínio <strong>pode ter.</strong>', solucoesCards(ctx, ['portaria', 'acesso', 'app', 'loker', 'automacao']))}

${porQue(ctx, 'cond')}

${secao2('claro', 'cond-faq', 'Dúvidas', 'Perguntas <strong>frequentes</strong>', faq([FAQ.encomendas, FAQ.energia, FAQ.panico, FAQ.portao, FAQ.evacuacao]))}

${ctaFinal(ctx, { p: 'cond', titulo: 'Vamos entender como os acessos funcionam hoje no seu condomínio?', texto: 'Peça uma análise gratuita e receba um retorno de um especialista da Evolua.', tipo: 'condominio' })}`;
}

/* ---------- EMPRESAS ---------- */
export function empresas(ctx) {
  return `
${heroInterno(ctx, { p: 'empresas', migalhas: [['empresas', 'Empresas']], rotulo: 'Para empresas', uni: 'petroleo',
    h1: 'Controle e visibilidade sobre quem <strong>acessa a sua empresa.</strong>',
    sub: 'Colaboradores, visitantes e prestadores com acesso registrado e acompanhado por uma central 24h, com histórico detalhado para os gestores.',
    secundario: `<a class="btn btn--secundario" ${ctx.rolar('emp-como')}>Ver como funciona</a>`, slot: 'empresa', descricao: 'entrada de empresa com controle de acesso (4:3).' })}

${secao2('claro', 'emp-dores', 'O problema', 'Quando o acesso ainda é <strong>manual.</strong>', cartoes([
    { titulo: 'Registros manuais', texto: 'Controles em papel sujeitos a erro e difíceis de auditar.' },
    { titulo: 'Dificuldade para gerir acessos', texto: 'Sem visão de quem entra, quando e por onde.' },
    { titulo: 'Riscos de segurança e de responsabilidade', texto: 'Sem registro confiável, fica difícil saber quem esteve onde.' },
  ], { cols: 'cols-3' }))}

<section class="secao fluxo" id="emp-como" data-universo="broto" aria-labelledby="h-emp-como">
  <div class="container">${cab({ rotulo: 'Como funciona', titulo: 'Cada acesso passa pelo <strong>mesmo caminho.</strong>', id: 'h-emp-como' })}
    ${fluxo(ctx, 'emp', { primeiro: FLUXO_COLABORADOR, segundo: FLUXO_VISITANTE_EMP })}
  </div>
</section>

<section class="secao sol-sec" data-universo="claro" aria-labelledby="h-emp-gest">
  <div class="container sol">
    ${foto(ctx, 'gestao', 'gestor consultando o histórico de acessos (4:3).')}
    <div class="sol__txt"><p class="rotulo">Gestão de colaboradores</p><h2 class="t2" id="h-emp-gest">Rastreabilidade para <strong>quem gere pessoas.</strong></h2>
      ${lista(['Controle de acessos com envio de dados aos gestores', 'Restrição de horários por colaborador', 'Apoio a admissões, desligamentos e identificação de atrasos', 'Histórico detalhado de acessos', 'Gestores acompanham pelo aplicativo'])}
    </div>
  </div>
</section>

${secao2('broto', 'emp-sol', 'Soluções para empresas', 'O que a sua empresa <strong>pode ter.</strong>', solucoesCards(ctx, ['portaria', 'acesso', 'app', 'loker']))}

${porQue(ctx, 'emp', 'claro')}

${secao2('broto', 'emp-faq', 'Dúvidas', 'Perguntas <strong>frequentes</strong>', faq([FAQ.encomendas, FAQ.energia, FAQ.panico, FAQ.portao, FAQ.evacuacao]))}

${ctaFinal(ctx, { p: 'emp', titulo: 'Vamos entender como os acessos funcionam hoje na sua empresa?', texto: 'Peça uma análise e receba um retorno de um especialista da Evolua.', tipo: 'empresa' })}`;
}

/* ---------- PORTARIA REMOTA ---------- */
export function portaria(ctx) {
  return `
${heroInterno(ctx, { p: 'portaria', migalhas: [['portaria', 'Portaria remota']], rotulo: 'Portaria remota',
    h1: 'Portaria remota com <strong>atendimento humano 24h.</strong>',
    sub: 'A central da Evolua atende visitantes e entregadores, consulta o morador e libera o acesso, com conversa, imagens e registro gravados.',
    secundario: `<a class="btn btn--secundario" ${ctx.rolar('por-como')}>Ver como funciona</a>`, slot: 'central', descricao: 'operadores na central de atendimento (4:3).' })}

${secao2('broto', 'por-oque', 'O que é', 'Uma portaria atendida por <strong>uma central.</strong>', `<div class="corpo sub">${FAQ.oque[1]}<br><br>A central da Evolua é supervisionada 24 horas, na mesma cidade dos moradores e clientes, em ${ctx.cidades.split(' e ')[0]}.</div>`)}

<section class="secao fluxo" id="por-como" data-universo="claro" aria-labelledby="h-por-como">
  <div class="container">${cab({ rotulo: 'Como funciona', titulo: 'Cada acesso passa pelo <strong>mesmo caminho.</strong>', id: 'h-por-como' })}
    ${fluxo(ctx, 'por', { primeiro: FLUXO_MORADOR, segundo: FLUXO_VISITANTE })}
  </div>
</section>

${secao2('broto', 'por-benef', 'Benefícios', 'O que muda na <strong>rotina.</strong>', cartoes([
    { titulo: 'Autorização antes da entrada', texto: 'O visitante só entra depois que o morador ou o responsável autoriza.' },
    { titulo: 'Tudo gravado', texto: 'Conversa, imagens e registro de cada atendimento ficam gravados.' },
    { titulo: 'Assistência técnica 24h', texto: 'Inclusa na solução, para portões, câmeras e alarmes.' },
    { titulo: 'Preparada para emergências', texto: 'Botão de pânico silencioso, bancos de bateria e evacuação conforme a NBR 9077.' },
    { titulo: 'Relatórios mensais', texto: 'Informação para o síndico ou gestor decidir com segurança.' },
  ], { cols: 'cols-3' }))}

${secao2('claro', 'por-para', 'Para quem', 'A mesma portaria, <strong>dois caminhos.</strong>', cartoes([
    { titulo: 'Para condomínios', texto: 'Segurança, autonomia e praticidade para moradores, visitantes e administração.', href: ctx.href('condominios'), linkTxt: 'Conhecer soluções para condomínios' },
    { titulo: 'Para empresas', texto: 'Mais controle e visibilidade sobre colaboradores, visitantes e prestadores.', href: ctx.href('empresas'), linkTxt: 'Conhecer soluções para empresas' },
  ], { cols: 'cols-2' }))}

${secao2('broto', 'por-faq', 'Dúvidas', 'Perguntas <strong>frequentes</strong>', faq([FAQ.oque, FAQ.visitante, FAQ.energia, FAQ.panico, FAQ.encomendas, FAQ.portao]))}

${ctaFinal(ctx, { p: 'por', titulo: 'Quer entender como a portaria remota funcionaria no seu local?', texto: 'Peça uma análise gratuita e receba um retorno de um especialista da Evolua.' })}`;
}

/* ---------- SOLUÇÕES (hub) ---------- */
export function hubSolucoes(ctx) {
  const S = solucoes(ctx);
  const rows = ['portaria', 'acesso', 'app', 'loker', 'automacao'].map((k, i) => linhaSolucao(ctx, S[k], i + 1)).join('');
  return `
<section class="secao hero-int" data-universo="claro" aria-labelledby="h1-solucoes">
  <div class="container">${migalha(ctx, [['solucoes', 'Soluções']])}
    <div class="secao__cab" style="margin:0"><p class="rotulo">Soluções</p>
      <h1 class="t1 t1--int" id="h1-solucoes">Soluções para um <strong>acesso protegido.</strong></h1>
      <p class="sub corpo">Cada solução funciona sozinha e todas se integram à central de atendimento da Evolua. Escolha uma para ver os detalhes.</p></div>
  </div>
</section>
${rows}
${ctaFinal(ctx, { p: 'sol', titulo: 'Qual solução faz sentido para o seu caso?', texto: 'Peça uma análise gratuita e um especialista indica o caminho.' })}`;
}

/* ---------- Páginas de solução ---------- */
const DETALHES = {
  acesso: {
    p: 'acesso', h1: 'Controle de acesso com <strong>reconhecimento facial.</strong>',
    sub: 'O Evolua Access controla entradas e saídas de forma rápida e simples, com monitoramento de eventos e gestão por cloud.',
    feats: ['Reconhecimento facial', 'Controle de acesso monitorado', 'Monitoramento de eventos: arrombamento, pânico, porta que não fechou e emergência', 'Gestão de usuários pela cloud e pelo aplicativo', 'Notificações de acesso e linha do tempo de acessos'],
    blocos: [['Evolua Monitoring', 'Operado via cloud, é responsável pela gestão e operação do sistema: cadastro de informações do condomínio ou da empresa e dos usuários, e monitoramento dos eventos.'],
      ['Módulo de Segurança', 'Dispositivo que garante a segurança do controle de acesso: automatiza portas, executa comandos, verifica o status da porta e detecta arrombamentos.']],
    foto: 'hero', fotoDesc: 'pessoa sendo reconhecida na entrada (4:3).',
  },
  app: {
    p: 'app', h1: 'O <strong>App Evolua</strong> no seu celular.',
    sub: 'Acompanhe e autorize os acessos do seu condomínio ou empresa de onde estiver.',
    foto: 'app', fotoDesc: 'morador usando o celular na entrada (4:3). Sem tela de aplicativo.',
  },
  loker: {
    p: 'loker', h1: 'Encomendas <strong>seguras e organizadas.</strong>',
    sub: 'O Evolua Loker foi desenvolvido para dar mais tranquilidade e rapidez às entregas.',
    feats: ['Depósito e retirada de encomendas no condomínio ou na empresa', 'Integração com o App Evolua e com a central de atendimento', 'Avisos de encomenda', 'Experiência fácil, intuitiva e rápida'],
    foto: 'loker', fotoDesc: 'armário inteligente de encomendas (4:3).',
  },
  automacao: {
    p: 'automacao', h1: 'Rotinas do condomínio <strong>no automático.</strong>',
    sub: 'O módulo de automação assume tarefas do dia a dia e é integrado à portaria remota, com informações direto no aplicativo.',
    feats: ['Controlar e acionar a bomba d\'água', 'Controlar o nível da caixa d\'água', 'Configurar a abertura do acesso da área das lixeiras', 'Programar o funcionamento do exaustor da churrasqueira'],
    foto: 'automacao', fotoDesc: 'área comum de condomínio (4:3).',
  },
};

export function paginaSolucao(ctx, id) {
  const S = solucoes(ctx)[id];
  const D = DETALHES[id];
  const feats = id === 'app' ? ctx.facts.app.funcoes : D.feats;
  const provFeats = id === 'app' ? ctx.facts.app.provisorio : false;
  const outros = ['portaria', 'acesso', 'app', 'loker', 'automacao'].filter((k) => k !== id);
  const lojas = id === 'app' ? `
      <div class="grupo-cta" style="margin-top:var(--espaco-3)">
        <span class="btn btn--secundario" aria-disabled="true">Google Play</span><span class="btn btn--secundario" aria-disabled="true">App Store</span>
        ${ctx.tag(true)}</div>
      <p class="legenda">Links das lojas serão informados pela Evolua.</p>` : '';
  return `
${heroInterno(ctx, { p: id, migalhas: [['solucoes', 'Soluções'], [id, S.titulo.replace(/<[^>]+>/g, '')]], rotulo: 'Solução', h1: D.h1, sub: D.sub,
    secundario: `<a class="btn btn--secundario" ${ctx.rolar(`${id}-psb`)}>Ver detalhes</a>`, slot: D.foto, descricao: D.fotoDesc,
    chip: id === 'acesso' ? '<span class="chip-fac" style="width:fit-content">Com reconhecimento facial</span>' : '' })}

${secao2('broto', `${id}-psb`, 'Problema, solução, benefício', S.titulo, `<dl class="sol__ps sol__ps--larga"><div><dt>Problema</dt><dd>${S.problema}</dd></div><div><dt>Solução</dt><dd>${S.solucao}</dd></div><div class="${ctx.prov(S.prov).trim()}"><dt>Benefício${ctx.tag(S.prov)}</dt><dd>${S.id === 'app-evolua' ? 'Acompanhe tudo pelo celular.' : S.beneficio}</dd></div></dl>${lojas}`)}

<section class="secao" data-universo="claro" aria-labelledby="h-${id}-feat">
  <div class="container">${cab({ rotulo: 'O que oferece', titulo: id === 'app' ? 'Funções do <strong>aplicativo.</strong>' : 'Principais <strong>recursos.</strong>', id: `h-${id}-feat` })}
    <div class="${ctx.prov(provFeats).trim()}" style="padding:${provFeats && ctx.marcar ? 'var(--espaco-2)' : '0'}">${ctx.tag(provFeats)}${lista(feats)}</div>
    ${D.blocos ? cartoes(D.blocos.map(([t, x]) => ({ titulo: t, texto: x })), { cols: 'cols-2' }) : ''}
  </div>
</section>

${secao2('broto', `${id}-para`, 'Para quem', 'Para <strong>condomínios</strong> e <strong>empresas.</strong>', cartoes([
    { titulo: 'Condomínios', texto: 'Mais tranquilidade e controle nos acessos ao prédio, praticidade e automação no dia a dia.', href: ctx.href('condominios'), linkTxt: 'Ver soluções para condomínios' },
    { titulo: 'Empresas', texto: 'Histórico detalhado de acessos dos colaboradores, visitantes e prestadores.', href: ctx.href('empresas'), linkTxt: 'Ver soluções para empresas' },
  ], { cols: 'cols-2' }))}

${secao2('claro', `${id}-outras`, 'Outras soluções', 'Combine com <strong>outras soluções.</strong>', solucoesCards(ctx, outros))}

${ctaFinal(ctx, { p: id, titulo: 'Quer ver essa solução funcionando no seu local?', texto: 'Peça uma análise gratuita e receba um retorno de um especialista da Evolua.' })}`;
}

/* ---------- Institucionais ---------- */
export function sobre(ctx) {
  return `
<section class="secao hero-int" data-universo="claro" aria-labelledby="h1-sobre">
  <div class="container">${migalha(ctx, [['sobre', 'Sobre']])}
    <div class="hero-int__grade"><div class="secao__cab" style="margin:0"><p class="rotulo">Sobre a Evolua</p>
      <h1 class="t1 t1--int" id="h1-sobre">Acesso protegido <strong>desde ${ctx.e.desde}.</strong></h1>
      <p class="sub corpo">A Evolua atua com portaria remota e controle de acesso para condomínios e empresas em ${ctx.cidades}. Nosso propósito é melhorar a segurança, a convivência e a qualidade de vida de moradores e colaboradores, com tecnologia e atendimento próximo.</p></div>
      ${foto(ctx, 'central', 'operadores na central de atendimento (3:2).', { aspecto: '3 / 2' })}</div>
  </div>
</section>
${secao2('broto', 'sobre-missao', 'Missão e qualidade', 'O que <strong>nos guia.</strong>', cartoes([
    { titulo: 'Missão', texto: 'Atender com agilidade, respeito e profissionalismo todos os nossos clientes, tornando-se referência em portaria remota e controle de acesso.' },
    { titulo: 'Política da qualidade', texto: 'Atender com alta capacidade de personalização e humanização. A segurança é o principal pilar da operação diária e o nosso objetivo é elevar a segurança dos acessos que monitoramos.' },
  ], { cols: 'cols-2' }))}
${ctaFinal(ctx, { p: 'sobre', titulo: 'Vamos conversar sobre os acessos do seu local?', texto: 'Peça uma análise gratuita e receba um retorno de um especialista da Evolua.' })}`;
}

export function blog(ctx) {
  const cats = ['Segurança condominial', 'Gestão de acesso', 'Portaria', 'Administração', 'Tecnologia'];
  return `
<section class="secao hero-int" data-universo="claro" aria-labelledby="h1-blog">
  <div class="container">${migalha(ctx, [['blog', 'Conteúdos']])}
    <div class="secao__cab" style="margin:0"><p class="rotulo">Conteúdos</p>
      <h1 class="t1 t1--int" id="h1-blog">Respostas para quem decide sobre <strong>portaria e acesso.</strong></h1>
      <p class="sub corpo">Artigos sobre portaria remota, controle de acesso e segurança condominial e empresarial.</p></div>
    <ul class="chips" aria-label="Categorias">${cats.map((c) => `<li>${c}</li>`).join('')}</ul>
  </div>
</section>
${secao2('broto', 'blog-lista', 'Artigos', 'Em <strong>preparação.</strong>', cartoes([
    { rotulo: 'Segurança', titulo: 'Portaria remota é segura se a internet cair?', texto: 'Artigo em preparação.' },
    { rotulo: 'Gestão de acesso', titulo: 'Como funciona o controle de visitantes', texto: 'Artigo em preparação.' },
    { rotulo: 'Portaria', titulo: 'Portaria remota ou controle de acesso: qual a diferença?', texto: 'Artigo em preparação.' },
    { rotulo: 'Administração', titulo: 'O que o síndico precisa saber antes de trocar a portaria', texto: 'Artigo em preparação.' },
    { rotulo: 'Tecnologia', titulo: 'Reconhecimento facial no condomínio: o que mudou no dia a dia', texto: 'Artigo em preparação.' },
    { rotulo: 'Segurança', titulo: 'Como registrar acessos de prestadores e visitantes', texto: 'Artigo em preparação.' },
  ], { cols: 'cols-3' }), 'Os artigos serão publicados aqui, com respostas diretas, perguntas frequentes e links para as soluções.')}
${ctaFinal(ctx, { p: 'blog', titulo: 'Ficou com alguma dúvida?', texto: 'Fale com um especialista da Evolua.' })}`;
}

export function trabalhe(ctx) {
  return `
<section class="secao hero-int" data-universo="claro" aria-labelledby="h1-trabalhe">
  <div class="container">${migalha(ctx, [['trabalhe', 'Trabalhe conosco']])}
    <div class="final__in"><div class="secao__cab" style="margin:0"><p class="rotulo">Carreira</p>
      <h1 class="t1 t1--int" id="h1-trabalhe">Trabalhe com a <strong>Evolua.</strong></h1>
      <p class="sub corpo">Venha fazer parte dessa história de inovação, confiança e prosperidade. Envie seu currículo e conte um pouco sobre você.</p></div>
      <div class="painel" data-universo="petroleo">
        <form class="form" data-lead="trabalhe" data-tipo="candidato" novalidate>
          <div class="campo"><label for="f-trab-nome">Nome</label><input id="f-trab-nome" name="nome" autocomplete="name" required><span class="campo__erro">Informe seu nome.</span></div>
          <div class="campo"><label for="f-trab-mail">E-mail</label><input id="f-trab-mail" name="email" type="email" autocomplete="email" required><span class="campo__erro">Informe um e-mail válido.</span></div>
          <div class="campo"><label for="f-trab-whats">WhatsApp</label><input id="f-trab-whats" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" required><span class="campo__erro">Informe um WhatsApp válido com DDD.</span></div>
          <div class="campo"><label for="f-trab-cv">Currículo (PDF)</label><input id="f-trab-cv" name="curriculo" type="file" accept=".pdf,.doc,.docx"></div>
          <button class="btn btn--primario" type="submit">Enviar candidatura</button>
          <p class="lgpd">Ao enviar, você concorda com a <a href="${ctx.href('privacidade')}">Política de Privacidade</a>.</p>
        </form>
        <div class="form__ok" role="status" tabindex="-1" hidden><h3 class="t3">Recebemos a sua candidatura.</h3><p>Entraremos em contato se houver uma vaga compatível.</p><p class="lgpd" data-mock hidden>Simulação do protótipo: nenhum dado foi enviado.</p></div>
      </div></div>
  </div>
</section>`;
}

export function contato(ctx) {
  const { e } = ctx;
  return `
<section class="secao hero-int" data-universo="claro" aria-labelledby="h1-contato">
  <div class="container">${migalha(ctx, [['contato', 'Contato']])}
    <div class="final__in"><div class="secao__cab" style="margin:0"><p class="rotulo">Contato</p>
      <h1 class="t1 t1--int" id="h1-contato">Fale com a <strong>Evolua.</strong></h1>
      <p class="sub corpo">Peça uma análise gratuita do acesso do seu condomínio ou empresa, ou tire suas dúvidas com um especialista.</p>
      <dl class="contato-lista">
        <div><dt>Telefone e WhatsApp</dt><dd><strong>${e.telefone}</strong> · <a class="link" href="${e.whatsapp_href}" data-evento="contact_click" data-metodo="whatsapp">Abrir o WhatsApp</a></dd></div>
        <div><dt>E-mail</dt><dd><strong>${e.email}</strong></dd></div>
        <div><dt>Endereço</dt><dd>${e.endereco}</dd></div>
      </dl></div>
      <div class="painel" data-universo="petroleo">${formLead(ctx, 'contato')}</div></div>
  </div>
</section>`;
}

export const PAGINAS = {
  home, condominios, empresas, portaria, solucoes: hubSolucoes,
  acesso: (c) => paginaSolucao(c, 'acesso'), app: (c) => paginaSolucao(c, 'app'), loker: (c) => paginaSolucao(c, 'loker'), automacao: (c) => paginaSolucao(c, 'automacao'),
  sobre, blog, trabalhe, contato,
};
export const ORDEM = Object.keys(PAGINAS);
export { ROTAS };
