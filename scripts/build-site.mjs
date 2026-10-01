#!/usr/bin/env node
// Monta a home a partir de site/src (tokens, CSS, JS, seções) e site/data/facts.json.
// Uso: node scripts/build-site.mjs [--producao] [--aceitar-provisorio]
//  - sem flags: gera dist/preview/home.html e dist/artifact/home.html (marcando o que é provisório)
//  - --producao: falha se houver conteúdo provisório, salvo --aceitar-provisorio
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { corpoPrototipo, corpoPagina } from '../site/src/pages/layout.mjs';
import { criarCtx } from '../site/src/pages/comp.mjs';
import { ROTAS } from '../site/src/pages/rotas.mjs';
import { ORDEM } from '../site/src/pages/paginas.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (p) => readFileSync(join(raiz, p), 'utf8');
const args = new Set(process.argv.slice(2));

export function coletarProvisorios(obj, caminho = '', saida = []) {
  if (obj && typeof obj === 'object') {
    if (obj.provisorio === true) saida.push({ caminho, motivo: obj.motivo || '' });
    for (const [k, v] of Object.entries(obj)) coletarProvisorios(v, caminho ? `${caminho}.${k}` : k, saida);
  }
  return saida;
}

export function coletarAValidar(obj, caminho = '', saida = []) {
  if (obj && typeof obj === 'object') {
    if (obj.validar === true) saida.push({ caminho, motivo: obj.motivo || '' });
    for (const [k, v] of Object.entries(obj)) coletarAValidar(v, caminho ? `${caminho}.${k}` : k, saida);
  }
  return saida;
}

export function css() {
  return ['site/src/css/tokens.css', 'site/src/css/base.css', 'site/src/css/secoes.css'].map(ler).join('\n');
}

const fontesGoogle = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500..800&family=Nunito+Sans:wght@400..800&display=swap">';
const fontesLocais = '<style>@font-face{font-family:"Baloo 2";font-weight:500 800;font-display:swap;src:url(../../fonts/baloo-2-latin.woff2) format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:400 800;font-display:swap;src:url(../../fonts/nunito-sans-latin.woff2) format("woff2")}</style>';

// Fotos aprovadas em site/assets/fotos/<slot>.(webp|jpg|png): reduzidas e incorporadas. Sem arquivo, o slot fica reservado.
export function carregarFotos() {
  const dir = join(raiz, 'site/assets/fotos');
  const fotos = {};
  if (!existsSync(dir)) return fotos;
  for (const nome of readdirSync(dir)) {
    const m = nome.match(/^([a-z0-9-]+)\.(webp|jpe?g|png)$/i);
    if (!m) continue;
    const saida = join(tmpdir(), `evolua-foto-${m[1]}.webp`);
    try {
      execFileSync('convert', [join(dir, nome), '-resize', '1400x1400>', '-strip', '-quality', '78', saida], { stdio: 'pipe' });
      fotos[m[1]] = `data:image/webp;base64,${readFileSync(saida).toString('base64')}`;
    } catch { console.warn(`foto ignorada (falha ao converter): ${nome}`); }
  }
  return fotos;
}

function contexto(sabor) {
  const facts = JSON.parse(ler('site/data/facts.json'));
  const logoPng = join(raiz, 'src/assets/logo-evolua.png');
  const logo = existsSync(logoPng) ? `data:image/png;base64,${readFileSync(logoPng).toString('base64')}` : '';
  return criarCtx(facts, { marcar: sabor !== 'producao', modo: sabor === 'producao' ? 'site' : 'prototipo', logo, fotos: carregarFotos() });
}

const AVISO = '<aside class="proto" role="note"><span><strong>Protótipo para validação.</strong> Fotos sem arquivo são espaços reservados.</span><span>Conteúdo <mark>provisório</mark> aparece com contorno tracejado.</span><span>Formulários em simulação.</span></aside>';

// Protótipo navegável (arquivo único) em dois sabores: 'preview' (documento completo) e 'artifact' (fragmento).
export function montar({ sabor }) {
  const ctx = contexto(sabor);
  const js = ler('site/src/js/site.js');
  const corpo = corpoPrototipo(ctx);
  const cfg = '<script>window.EVOLUA_CONFIG={mock:true};</script>';
  if (sabor === 'artifact') return `<title>Site Evolua</title>\n${fontesGoogle}\n<style>${css()}</style>\n${corpo}\n${AVISO}\n${cfg}\n<script>${js}</script>\n`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${ROTAS.home.titulo}</title>
<meta name="description" content="${ROTAS.home.desc}">
${fontesLocais}
<style>${css()}</style>
</head>
<body>
${corpo}
${AVISO}
${cfg}
<script>${js}</script>
</body>
</html>
`;
}

// Site real: um arquivo HTML por página, com title, descrição e canonical próprios.
export function montarPagina(k, ctx = contexto('producao')) {
  const r = ROTAS[k];
  const js = ler('site/src/js/site.js');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${r.titulo}</title>
<meta name="description" content="${r.desc}">
<link rel="canonical" href="https://www.evoluatech.com.br${r.url === '/' ? '' : r.url}">
${fontesGoogle}
<style>${css()}</style>
</head>
<body>
${corpoPagina(ctx, k)}
<script>${js}</script>
</body>
</html>
`;
}

function gravar(rel, conteudo) {
  const destino = join(raiz, rel);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, conteudo);
  console.log(`gerado ${rel} (${Buffer.byteLength(conteudo)} bytes)`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const facts = JSON.parse(ler('site/data/facts.json'));
  const prov = coletarProvisorios(facts);
  const validar = coletarAValidar(facts);
  if (args.has('--producao') && prov.length && !args.has('--aceitar-provisorio')) {
    console.error('Publicação bloqueada: há conteúdo provisório.');
    prov.forEach((p) => console.error(` - ${p.caminho}: ${p.motivo}`));
    console.error('Substitua em site/data/facts.json (provisorio: false) ou use --aceitar-provisorio.');
    process.exit(1);
  }
  prov.forEach((p) => console.warn(`provisório: ${p.caminho} (${p.motivo})`));
  validar.forEach((p) => console.warn(`a validar: ${p.caminho} (${p.motivo})`));
  gravar('site/dist/preview/home.html', montar({ sabor: 'preview' }));
  gravar('site/dist/artifact/home.html', montar({ sabor: 'artifact' }));
  if (args.has('--producao')) {
    const ctx = contexto('producao');
    for (const k of ORDEM) gravar(`site/dist/site/${ROTAS[k].url === '/' ? 'index' : ROTAS[k].url.slice(1)}.html`, montarPagina(k, ctx));
  }
}
