#!/usr/bin/env node
// Monta a home a partir de site/src (tokens, CSS, JS, seções) e site/data/facts.json.
// Uso: node scripts/build-site.mjs [--producao] [--aceitar-provisorio]
//  - sem flags: gera dist/preview/home.html e dist/artifact/home.html (marcando o que é provisório)
//  - --producao: falha se houver conteúdo provisório, salvo --aceitar-provisorio
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHome } from '../site/src/pages/home.mjs';

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

export function montar({ sabor }) {
  const facts = JSON.parse(ler('site/data/facts.json'));
  const logoPng = join(raiz, 'src/assets/logo-evolua.png');
  const logo = existsSync(logoPng) ? `data:image/png;base64,${readFileSync(logoPng).toString('base64')}` : '';
  const marcar = sabor !== 'producao';
  const corpo = renderHome(facts, { marcar, logo, links: sabor === 'producao' ? 'site' : 'ancora' });
  const js = ler('site/src/js/site.js');
  const cfg = sabor === 'producao' ? '' : '<script>window.EVOLUA_CONFIG={mock:true};</script>';
  const aviso = marcar
    ? '<aside class="proto" role="note"><span><strong>Protótipo para validação.</strong> Fotos são espaços reservados.</span><span>Conteúdo <mark>provisório</mark> aparece com contorno tracejado.</span><span>Formulário em simulação.</span></aside>'
    : '';
  const fontesGoogle = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500..800&family=Nunito+Sans:wght@400..800&display=swap">';
  const fontesLocais = '<style>@font-face{font-family:"Baloo 2";font-weight:500 800;font-display:swap;src:url(../../fonts/baloo-2-latin.woff2) format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:400 800;font-display:swap;src:url(../../fonts/nunito-sans-latin.woff2) format("woff2")}</style>';
  const titulo = 'Evolua Acesso Protegido | Portaria Remota e Reconhecimento Facial em Macaé, RJ';
  const desc = 'Portaria remota 24h, controle de acesso e reconhecimento facial para condomínios e empresas em Macaé e Rio das Ostras. Peça uma análise gratuita do acesso do seu condomínio.';
  if (sabor === 'artifact') return `<title>Home Evolua</title>\n${fontesGoogle}\n<style>${css()}</style>\n${corpo}\n${aviso}\n${cfg}\n<script>${js}</script>\n`;
  const fontes = sabor === 'producao' ? fontesGoogle : fontesLocais;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<meta name="description" content="${desc}">
${fontes}
<style>${css()}</style>
</head>
<body>
${corpo}
${aviso}
${cfg}
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
}
