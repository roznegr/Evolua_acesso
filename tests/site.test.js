import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { montar, coletarProvisorios, css } from '../scripts/build-site.mjs';

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

test('home tem um único H1 e imagens com alt', () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
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
    ['cinza', 'branco', 3],
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

test('build de produção não marca provisório nem traz aviso de protótipo', () => {
  const prod = montar({ sabor: 'producao' });
  const semEstilo = prod.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, '');
  assert.doesNotMatch(semEstilo, /prov-tag|class="proto"|class="[^"]*\bprov\b/);
  assert.ok(css().length > 1000);
});
