# Fase E — Implementação (etapa 1: protótipo da home para validação)

## O que existe

- `site/src/css/tokens.css`: único lugar com cores, tipografia, espaço, forma e movimento (Fase D).
- `site/src/css/base.css` e `secoes.css`: componentes e seções; sem cor literal (um teste garante).
- `site/src/pages/home.mjs`: as 14 seções da Fase C, geradas a partir de `site/data/facts.json`.
- `site/src/js/site.js`: menu, seletor Condomínios/Empresas, abas do fluxo, carrossel, contagem, formulário e tracking, sem bibliotecas.
- `site/data/facts.json`: números e textos; itens com `provisorio: true` bloqueiam a publicação em produção; `validar: true` apenas avisa.
- `site/fonts/`: Baloo 2 e Nunito Sans (latino, variáveis) para hospedagem própria.
- `scripts/build-site.mjs` e `tests/site.test.js`.

## Comandos

- `npm run site:build` gera `site/dist/preview/home.html` (abre direto no navegador) e `site/dist/artifact/home.html` (versão publicada como Artifact para validação).
- `npm run site:producao` falha enquanto houver conteúdo provisório; `--aceitar-provisorio` libera de propósito.
- `npm test` roda os testes do diagnóstico e os do site.

## O que os testes garantem

Um único H1 e `alt` em toda imagem; nenhum termo proibido no texto (Kiper, QR code, Hinfoluz, Grupo, "até 40%/50%"); nenhuma cor fora de `tokens.css`; contraste mínimo dos pares de cor do Design System; CTA primário padronizado; bloqueio de provisório em produção.

## Próxima etapa (depois da validação)

1. Ajustes pedidos no protótipo.
2. Blocos HTML individuais para colar no Wix (indicadores, caminhos, fluxo, soluções, experiência, formulário), cada um com `tokens.css` e a ponte `postMessage`.
3. Atualizar `wix/parent-bridge.js` para aceitar os eventos do site (`source: evolua-site`) e a altura do bloco.
4. Hubs de Condomínios e Empresas e páginas locais de Macaé e Rio das Ostras.

## Limitações conhecidas

- Fotos: ainda são espaços reservados (`data-slot`); nenhuma imagem de banco foi baixada.
- Altura automática do iframe no Wix **não é garantida**: o componente de HTML do Wix tem altura fixa. O bloco avisa a altura por `postMessage` e a ponte tenta aplicá-la; é preciso testar no Wix e, se falhar, fixar a altura por breakpoint.
- Logo: o PNG existente; faltam o vetor e a versão negativa (o rodapé usa uma versão branca por filtro, provisória).
