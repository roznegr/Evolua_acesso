// Cabeçalho, rodapé e montagem de páginas (protótipo em arquivo único ou páginas separadas para o Wix).
import { ROTAS } from './rotas.mjs';
import { CTA } from './comp.mjs';
import { PAGINAS, ORDEM } from './paginas.mjs';

const NAV = [['condominios', 'Condomínios'], ['empresas', 'Empresas'], ['portaria', 'Portaria remota'], ['solucoes', 'Soluções'], ['blog', 'Conteúdos'], ['contato', 'Contato']];

const logoHtml = (ctx, filtro = '') => (ctx.logo
  ? `<img src="${ctx.logo}" alt="Evolua Acesso Protegido" width="111" height="40" style="height:40px;width:auto;${filtro}">`
  : '<span class="cab__logo">evolu<b>a</b></span>');

export function cabecalho(ctx, atual = '') {
  const links = NAV.map(([k, t]) => `<a href="${ctx.href(k)}" data-nav="${k}"${k === atual ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  return `
<a class="pular" href="#principal">Pular para o conteúdo</a>
<header class="cab">
  <div class="container cab__in">
    <a href="${ctx.href('home')}" aria-label="Evolua Acesso Protegido, início">${logoHtml(ctx)}</a>
    <nav class="cab__nav" aria-label="Principal">${links}</nav>
    <div class="cab__acoes">
      <a class="btn btn--primario" href="${ctx.href('contato')}" data-evento="contact_click" data-metodo="cta_header">Análise gratuita</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-mob" aria-label="Abrir menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
  <nav id="menu-mob" class="menu-mob" aria-label="Menu" hidden>
    <div class="container">${links}<a href="${ctx.href('home')}">Início</a><p class="legenda">Telefone e WhatsApp: ${ctx.e.telefone}</p></div>
  </nav>
</header>`;
}

export function rodape(ctx) {
  const { e } = ctx;
  const li = (k, t) => `<li><a href="${ctx.href(k)}">${t}</a></li>`;
  return `
<footer class="secao rod" data-universo="petroleo">
  <div class="container">
    <div class="rod__grade">
      <div>${logoHtml(ctx, 'filter:brightness(0) invert(1)')}<p class="legenda" style="margin-top:var(--espaco-2)">Acesso protegido para condomínios e empresas em ${ctx.cidades}.</p></div>
      <div><h2>Atendimento</h2><ul>${li('condominios', 'Condomínios')}${li('empresas', 'Empresas')}${li('portaria', 'Portaria remota')}</ul></div>
      <div><h2>Soluções</h2><ul>${li('acesso', 'Controle de acesso')}${li('app', 'App Evolua')}${li('loker', 'Evolua Loker')}${li('automacao', 'Automação')}${li('solucoes', 'Todas as soluções')}</ul></div>
      <div><h2>Evolua</h2><ul>${li('sobre', 'Sobre')}${li('blog', 'Conteúdos')}${li('trabalhe', 'Trabalhe conosco')}${li('contato', 'Contato')}${li('privacidade', 'Política de Privacidade')}</ul></div>
      <div><h2>Contato</h2><ul><li>${e.telefone}</li><li>${e.email}</li><li>${e.endereco}</li></ul></div>
    </div>
    <p class="legenda rod__fim">Instagram @evolua_tech · Facebook /Evoluatech · YouTube</p>
  </div>
</footer>`;
}

// Protótipo: todas as páginas no mesmo arquivo, trocadas por script (hash da URL).
export function corpoPrototipo(ctx) {
  const paginas = ORDEM.map((k, i) => `
<main class="pagina" id="principal${k === 'home' ? '' : `-${k}`}" data-pagina="${k}" data-titulo="${ROTAS[k].titulo}"${i ? ' hidden' : ''} tabindex="-1">${PAGINAS[k](ctx)}
</main>`).join('');
  return `${cabecalho(ctx, 'home')}${paginas}${rodape(ctx)}`;
}

// Site real: uma página por arquivo.
export function corpoPagina(ctx, k) {
  return `${cabecalho(ctx, k)}
<main id="principal">${PAGINAS[k](ctx)}
</main>${rodape(ctx)}`;
}
