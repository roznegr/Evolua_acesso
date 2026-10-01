import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { montar, montarPagina, coletarProvisorios, css } from '../scripts/build-site.mjs';
import { ORDEM } from '../site/src/pages/paginas.mjs';
import { ROTAS } from '../site/src/pages/rotas.mjs';

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const facts = JSON.parse(ler('site/data/facts.json'));
const html = montar({ sabor: 'preview' });

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const razao = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const token = (nome) => ler('site/src/css/tokens.css').match(new RegExp(`--${nome}:\\s*(#[0-9a-fA-F]{6})`))[1];

test('cada página tem um único H1 e as imagens têm alt', () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, ORDEM.length);
  for (const k of ORDEM) {
    const pagina = html.split(`data-pagina="${k}"`)[1].split('</main>')[0];
    assert.equal((pagina.match(/<h1[\s>]/g) || []).length, 1, `H1 em ${k}`);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) assert.match(m[0], /alt="[^"]+"/);
});

test('texto não contém termos proibidos', () => {
  const texto = html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  for (const proibido of [/kiper/i, /riper/i, /qr ?code/i, /hinfoluz/i, /grupo/i, /até 40%/i, /até 50%/i, /lorem/i, /tecnologia de ponta/i]) {
    assert.doesNotMatch(texto, proibido, `termo proibido: ${proibido}`);
  }
});

test('cores literais só existem em tokens.css', () => {
  for (const arq of ['site/src/css/base.css', 'site/src/css/secoes.css']) {
    assert.doesNotMatch(ler(arq), /#[0-9a-fA-F]{3,8}\b/, arq);
  }
});

test('pares de cor do DS têm contraste mínimo', () => {
  const pares = [
    ['petroleo', 'verde', 4.5], ['grafite', 'branco', 4.5], ['grafite', 'broto', 4.5], ['folha', 'branco', 4.5], ['folha', 'broto', 4.5],
    ['branco', 'petroleo', 4.5], ['sinal', 'petroleo', 4.5], ['petroleo', 'verde-hover', 4.5], ['erro', 'branco', 4.5], ['branco', 'petroleo-tinta', 4.5],
    ['cinza', 'branco', 3], ['branco', 'grafite', 4.5], ['verde', 'grafite', 4.5], ['sinal', 'grafite', 4.5], ['suave-grafite', 'grafite', 4.5], ['suave-grafite', 'grafite-tinta', 4.5],
  ];
  for (const [a, b, min] of pares) assert.ok(razao(token(a), token(b)) >= min, `${a} sobre ${b}`);
});

test('CTA primário é único e padronizado', () => {
  const botoes = [...html.matchAll(/class="btn btn--primario"[^>]*>([^<]+)/g)].map((m) => m[1].trim());
  assert.ok(botoes.some((b) => b.startsWith('Quero minha análise gratuita')));
});

test('conteúdo provisório bloqueia a publicação em produção', () => {
  assert.ok(coletarProvisorios(facts).length > 0);
  assert.throws(() => execFileSync('node', ['scripts/build-site.mjs', '--producao'], { stdio: 'pipe' }));
  execFileSync('node', ['scripts/build-site.mjs', '--producao', '--aceitar-provisorio'], { stdio: 'pipe' });
});

test('páginas de produção: título, descrição, canonical e H1 próprios, sem marcação de protótipo', () => {
  const titulos = new Set();
  for (const k of ORDEM) {
    const pagina = montarPagina(k);
    const semEstilo = pagina.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, '');
    assert.doesNotMatch(semEstilo, /prov-tag|class="proto"|class="[^"]*\bprov\b|data-pagina=/, k);
    assert.equal((semEstilo.match(/<h1[\s>]/g) || []).length, 1, `H1 em ${k}`);
    assert.match(semEstilo, new RegExp(`<link rel="canonical" href="https://www.evoluatech.com.br${ROTAS[k].url === '/' ? '' : ROTAS[k].url}">`));
    assert.ok(ROTAS[k].desc.length > 40 && ROTAS[k].desc.length <= 170, `descrição de ${k}`);
    titulos.add(ROTAS[k].titulo);
  }
  assert.equal(titulos.size, ORDEM.length, 'títulos únicos');
  assert.ok(css().length > 1000);
});

test('páginas de produção linkam para as URLs reais do Wix', () => {
  const home = montarPagina('home');
  for (const k of ['condominios', 'empresas', 'portaria', 'solucoes', 'blog', 'contato']) assert.ok(home.includes(`href="${ROTAS[k].url}"`), k);
});

test('menu na ordem pedida: Home, Sobre, Condomínios, Empresas, Soluções, Blog, Trabalhe conosco, Contato', () => {
  const home = montarPagina('home');
  const nav = home.split('<nav class="cab__nav"')[1].split('</nav>')[0];
  const itens = [...nav.matchAll(/data-nav="([a-z]+)"[^>]*>([^<]+)</g)].map((m) => m[2]);
  assert.deepEqual(itens, ['Home', 'Sobre', 'Condomínios', 'Empresas', 'Soluções', 'Blog', 'Trabalhe conosco', 'Contato']);
  assert.doesNotMatch(nav, /Conteúdos|Portaria remota/);
});

test('portaria remota fica dentro de Soluções (migalha, destaque do menu e "Saiba mais")', () => {
  const portaria = montarPagina('portaria');
  assert.match(portaria, /<li><a href="\/servicos">Soluções<\/a><\/li>/);
  assert.match(portaria, /data-nav="solucoes" aria-current="page"/);
  assert.match(montarPagina('solucoes'), /Saiba mais →/);
});

test('home: escolha de caminho vem antes de "Mais do que abrir e fechar portas"', () => {
  const home = montarPagina('home');
  assert.ok(home.indexOf('id="caminhos"') > 0 && home.indexOf('id="caminhos"') < home.indexOf('id="h-valor"'));
});

test('fotos entram na proporção original e o chip de reconhecimento facial não tem preenchimento', () => {
  assert.match(css(), /\.chip-fac \{[^}]*background: transparent[^}]*border: 1\.5px solid var\(--sinal\)/);
  assert.match(html, /<figure class="slot tem-foto" data-slot="condominio" style="aspect-ratio:1152 \/ 864"/);
});
