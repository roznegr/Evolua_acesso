# Fase D — Direção visual

Fonte única: Design System **Evolua Editorial** (`tokens.json` e README do sistema). Esta fase traduz o DS, pensado para peças de 1080 px, para um site responsivo. Regra: **nenhum valor visual é escrito direto em componente**; tudo vem de variáveis CSS (`tokens.css`), que o Wix (estilos globais) e cada embed repetem.

Legenda: **DS** = vem do Design System sem alteração · **DERIVADO** = adaptado para web, para aprovação · **NOVO** = o DS não cobre; proposto e verificado.

## 1. Como o DS vira site

| Princípio do DS | Aplicação no site |
|---|---|
| Três universos (Claro 40% · Petróleo 30% · Verde 20% · grafite 7% · sinal 3%) | Cada seção declara `data-universo="claro | petroleo | verde"`; as variáveis semânticas (`--fundo`, `--texto`, `--destaque`…) mudam sozinhas |
| Claro é o padrão; escuro só em apoio | Hero, valor, soluções, Sobre, conteúdos e FAQ em Claro/Broto; Petróleo só para números, experiência e rodapé; Verde só no fechamento |
| Contraste de peso 500 → 800 em vez de caixa-alta | Títulos em 500/600 com a palavra-chave em 800 e cor `--destaque` |
| Uma faceta de 16° por composição | `--faceta-angulo: 16deg`; no máximo uma por tela visível |
| Moldura de câmera enquadra o assunto, nunca o texto | Cantoneiras só em foto (hero e passo "reconhecido") |
| Status só para estado real do serviço | Pílula com ponto lima apenas em `Acesso liberado`, `Registrado` e no indicador de atendimentos |
| Prova por gente e operação, não por adjetivo | Rótulos grandes ("24h", "Registro") e fotos reais quando existirem |
| Sem gradiente, sem brilho, sem rede de pontos | Cores chapadas; o único brilho é o halo do ponto de status |

## 2. Cores (tokens)

Valores do DS. Pares de texto verificados (WCAG 2.2, razão calculada em 01/10/2026).

| Token | Hex | Uso | Verificação |
|---|---|---|---|
| `--verde` (evolua-verde) | `#7BBE00` | Superfície, botão primário, fio do fluxo | texto petróleo sobre ele 5,33:1; **nunca** texto branco nem texto verde sobre branco |
| `--petroleo` | `#0B3954` | Fundo escuro; texto sobre verde | branco sobre ele 12,16:1 |
| `--grafite` | `#3A3A3A` | Texto no Claro | 11,37:1 no branco · 10,49:1 no broto |
| `--broto` | `#EFFADB` | Fundo alternativo e cards | |
| `--sinal` | `#AFDE12` | Ponto de status | só sobre petróleo (7,69:1) |
| `--folha` | `#4F6B1F` | Links e destaque em texto no Claro | 6,08:1 branco · 5,61:1 broto |
| `--petroleo-tinta` | `#124A6A` | Cards no Petróleo | branco 9,49:1 |
| `--cinza` | `#858683` | Borda de campo de formulário, fios | 3,66:1 no branco (≥ 3:1 para componentes) |
| `--texto-suave` | `#666765` · `#A9BCC8` | Legenda no Claro · no Petróleo | 5,24:1 no broto · 6,20:1 no petróleo |

**Tokens NOVOS (web), verificados:**

| Token | Hex | Uso | Verificação |
|---|---|---|---|
| `--verde-hover` | `#8CCB1A` | Botão primário em hover | petróleo 6,18:1 |
| `--erro` | `#B3261E` | Mensagem e borda de erro em formulário | 6,54:1 no branco · 6,03:1 no broto |
| `--foco` | `{folha}` no Claro · `{verde}` no Petróleo/Verde | Anel de foco 3 px com recuo 2 px | ≥ 3:1 em cada universo |

Estado pressionado do botão: mesmo verde com leve redução de escala (`0.98`); não foi criado verde mais escuro porque `#6FAE00` fica abaixo de 4,5:1 com texto petróleo (4,47:1).

Regras duras: sem texto branco sobre verde; sem verde como texto sobre branco ou broto (2,10:1); lima só sobre petróleo, no máximo **um** elemento por tela; logo colorido sobre Claro, negativo sobre Petróleo, mono branco sobre foto, mono petróleo sobre Verde (colorido nunca sobre petróleo).

## 3. Tipografia

Famílias do DS: **Baloo 2** (títulos) e **Nunito Sans** (texto). Escala do DS convertida de 1080 px para fluida (`clamp`), sem breakpoints de fonte.

| Estilo | Famílias e peso | Mobile → desktop | Entrelinha | Uso |
|---|---|---|---|---|
| `titulo-1` (H1) | Baloo 2 500; palavra-chave 800 | 2,75 rem → 5 rem | 0,98 | Hero |
| `titulo-2` (H2) | Baloo 2 600; palavra-chave 800 | 2 rem → 3,5 rem | 1,02 | Título de seção |
| `titulo-3` (H3) | Baloo 2 600 | 1,5 rem → 2,25 rem | 1,1 | Cards e blocos |
| `subtitulo` | Nunito Sans 400 | 1,125 rem → 1,5 rem | 1,3 | Texto de apoio abaixo do título |
| `corpo` | Nunito Sans 400 | 1 rem → 1,125 rem | **1,55** (web; o DS usa 1,4 em peça curta) | Texto corrido, máximo 68 caracteres por linha |
| `legenda` | Nunito Sans 400, `--texto-suave` | 0,875 rem | 1,45 | Fonte de dado, crédito |
| `rotulo` | Nunito Sans 800 caixa alta, espaçamento 0,12em | 0,8125 rem | 1,2 | Eyebrow e status |
| `botao` | Nunito Sans 700 | 1 rem | 1,2 | Botões |
| `numero` | Baloo 2 800, algarismos tabulares | 3 rem → 6 rem | 0,9 | Indicadores |

Regras: títulos em caixa alta e baixa (nunca frase inteira em caixa alta); contraste de peso 500 → 800 na palavra-chave; sem itálico decorativo; `text-wrap: balance` em títulos.
**Carregamento:** fontes variáveis, subconjunto latino, WOFF2 próprio (não do Google em tempo de execução), `font-display: swap`, **pré-carregar só a fonte do H1**. Fallback: Nunito, Segoe UI, Arial.
**Wix:** conferir no editor se Baloo 2 e Nunito Sans estão na lista de fontes; se não estiverem, enviar os arquivos em *Design do site → Fontes → Enviar* [VALIDAR].

## 4. Grid, containers e espaçamento

Mobile first.

| Item | Valor |
|---|---|
| Breakpoints (largura mínima) | base 360 · 640 · 768 · 1024 · 1280 · 1536 |
| Colunas | 4 (base) · 8 (≥ 768) · 12 (≥ 1024) |
| Container de conteúdo | máx. 1200 px; largo (fotos, faixas) 1320 px |
| Margem lateral | `clamp(16px, 5vw, 80px)` (o DS usa 80 px a 1080 px; o piso de 16 px é o gutter mobile) |
| Gutter | 16 (base) · 24 (≥ 768) · 32 (≥ 1280) |
| Espaçamento (escala de 8 px, do DS) | `--espaco-1` 8 · `-2` 16 · `-3` 24 · `-4` 32 · `-6` 48 · `-12` 96 |
| **NOVO** `--espaco-8` | 64 px (preenche o salto entre 48 e 96) |
| Respiro vertical de seção | `clamp(64px, 10vw, 128px)` |

## 5. Forma: raios, cantos, faceta, moldura, status

| Elemento | Especificação |
|---|---|
| Raios (DS) | `--raio-sm` 12 · `--raio-md` 24 · `--raio-lg` 48 · `--raio-pill` 999 |
| **DERIVADO** raio de painel grande | `clamp(24px, 4vw, 48px)` (48 px fixo ocuparia demais em 360 px) |
| Faceta | ângulo 16°, sobe da esquerda para a direita; corta foto ou painel, nunca texto. Em CSS: `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 28.67cqw), 0 100%)` dentro de um contêiner com `container-type: inline-size` (28,67% = tangente de 16°) |
| Moldura de câmera | 4 cantoneiras em L: traço 3 px, perna `clamp(20px, 6cqw, 40px)`, em branco sobre foto; enquadram o rosto no hero. Uma por tela |
| Pontos de reconhecimento | 3 a 5 pontos de 6 px em `--sinal`, ligados a nada (sem linhas, sem malha) |
| Pílula de status | raio-pill, fundo petróleo, texto branco `rotulo`, ponto de 8 px em `--sinal` com halo `0 0 0 6px rgba(175,222,18,.22)` (único brilho do sistema) |
| Sombra | `--sombra-suave: 0 20px 48px rgba(11,57,84,.16)` só em card elevado e foto sobre painel; nunca em texto |

## 6. Componentes

**Botão**
- Primário: fundo `--verde`, texto `--petroleo`, `--raio-pill`, altura mínima 48 px, padding horizontal 28 px, seta `→` que avança 4 px no hover. Hover `--verde-hover`; foco com anel; pressionado `scale(.98)`; desabilitado 40% de opacidade com `aria-disabled`.
- Secundário: contorno de 2 px em `--petroleo` (Claro) ou branco (Petróleo), fundo transparente, texto igual à borda.
- Link: texto `--folha` sublinhado (Claro) ou branco sublinhado (Petróleo).
- Um único botão primário por tela visível. O texto do primário é sempre **Quero minha análise gratuita**.

**Card**
- Fundo `--fundo-card` (broto no Claro, branco a 8% no Petróleo), borda de 1 px `--borda-card`, `--raio-md`, padding `--espaco-4`.
- Sem faixa colorida lateral, sem ícone redondo decorativo, sem gradiente.
- Hover: sobe 4 px e aparece `--sombra-suave` (200 ms); em toque, sem hover.

**Linha de solução (problema → solução → benefício):** mídia 5/12 colunas e texto 7/12, alternando o lado a cada linha; três rótulos pequenos ("Problema", "Solução", "Benefício") em `rotulo`; um único CTA de link.

**Faixa de indicadores:** três colunas (empilhadas no celular), `numero` em branco, rótulo em `#A9BCC8`, um ponto lima no primeiro item.

**Fluxo "Como funciona":** nós circulares de 40 px, fio de 3 px em `--verde`, rótulo abaixo (desktop) ou à direita (celular); o nó "reconhecido" usa a moldura de câmera; o último recebe a pílula `Registrado`.

**Formulário**
- Rótulo sempre visível acima do campo (nunca só placeholder); campo com 52 px de altura, borda 1,5 px `--cinza`, `--raio-sm`; foco com anel; erro em `--erro` com ícone e texto ("Informe um WhatsApp válido"), ligado por `aria-describedby`.
- Tipos corretos (`tel`, `email`), `autocomplete`, `inputmode`; checkbox de consentimento com link para a política de privacidade.
- Botão de envio mostra estado de carregamento; sucesso e erro no mesmo lugar do formulário, com foco movido para a mensagem.

**Ícones:** poucos e de função (seta, mais/menos do FAQ, telefone, WhatsApp, menu, fechar). Traço único de 2 px em 24 px (equivalente ao `icone-traco` do DS), pontas retas, SVG inline, sem biblioteca de ícones. Nada de ícones decorativos em cards.

## 7. Fotografia (banco de imagem agora, fotos reais depois)

- Critério de escolha: cenas reais e espontâneas (chegada a portão, portaria, central/operador, morador com celular, entregas, edifícios contemporâneos); sem sorriso posado, sem hacker, cadeado ou escudo, sem imagem gerada por IA de pessoas ou prédios "da Evolua". Cor natural, levemente fria na central, quente no condomínio; sem filtro, sem grão.
- Proporções por slot: hero 4:5 (celular) e 16:9 (desktop); cards 4:3; experiência 3:4; Sobre 3:2. Arte dirigida com `<picture>`.
- Formatos: AVIF com WebP de reserva; `srcset` em larguras 480 · 768 · 1200 · 1800; hero de celular ≤ 120 KB; abaixo da dobra `loading="lazy"` e `decoding="async"`; dimensões sempre declaradas (sem salto de layout).
- Texto nunca fica sobre foto; o texto vai em painel chapado ao lado ou abaixo.
- Slots: `data-slot="hero|central|portaria|…"`, `alt` real e descritivo, e arquivo único por slot, para trocar por fotos reais sem mexer no layout.
- Reconhecimento facial: pessoa real fotografada de forma natural, com a moldura e os pontos aplicados em CSS/SVG por cima (nunca embutidos na imagem), para poderem ser removidos se necessário.

## 8. Seções e fundos: ritmo da home

| # | Seção | Universo |
|---|---|---|
| 02 | Hero | Claro |
| 03 | Indicadores | Petróleo |
| 04 | Mensagem de valor | Claro |
| 05 | Dois caminhos | Claro + Petróleo (um painel de cada) |
| 06 | Como funciona | Broto |
| 07 | Soluções | Claro e Broto alternando por linha |
| 08 | Experiência | Petróleo |
| 09 | Por que a Evolua | Broto |
| 10 | Sobre | Claro |
| 11 | Conteúdos | Claro |
| 12 | FAQ | Claro |
| 13 | CTA final | Verde com painel Petróleo |
| 14 | Rodapé | Petróleo |

Aproximadamente 55% Claro/Broto, 35% Petróleo, 10% Verde, em linha com a proporção do DS (o Verde é maior no DS por incluir peças de feed; no site, a moderação vale mais). Divisores entre seções: borda reta ou **uma** faceta; nada de ondas.

## 9. Movimento

Movimento só quando explica algo. Todas as animações respeitam `prefers-reduced-motion` (estado final, sem transição).

| Token | Valor |
|---|---|
| Durações | 150 ms (microinteração) · 250 ms (hover) · 400 ms (aparecer) · 900–1200 ms (contagem, fio do fluxo) |
| Curva | `cubic-bezier(.2, .7, .2, 1)` |
| Aparecer ao rolar | opacidade 0→1 e `translateY(16px→0)`, uma vez, por `IntersectionObserver`; sem efeito em conteúdo acima da dobra |
| Indicadores | contagem uma única vez ao entrar na tela |
| Fluxo | o fio se desenha e cada nó acende em sequência; trocar de aba reinicia |
| Hero | camada de reconhecimento surge depois do carregamento da imagem (fade 400 ms, uma vez) |
| Seletor Condomínios/Empresas | troca de painel por cross-fade de 250 ms |
| Proibido | parallax, movimento contínuo, brilho pulsante, *scroll-jacking*, cursor customizado |

JavaScript: **sem bibliotecas**; no máximo ~6 KB por bloco embedado (CSS preferido para animação).

## 10. Orçamentos de desempenho e acessibilidade

| Métrica | Meta |
|---|---|
| LCP | ≤ 2,5 s (hero nativo, imagem otimizada, altura reservada) |
| CLS | ≤ 0,1 |
| INP | ≤ 200 ms |
| Peso por embed | ≤ 40 KB (HTML+CSS+JS, comprimido), `tokens.css` embutido em cada um |
| Fontes | 2 arquivos variáveis, subconjunto latino |

Acessibilidade: contraste ≥ 4,5:1 para texto e ≥ 3:1 para componentes (verificado na §2); alvo de toque ≥ 48 px; foco visível em todo elemento interativo; navegação por teclado (menu, abas, acordeão, carrossel); link de pular para o conteúdo; `lang="pt-BR"`; ordem de títulos correta (um H1); alt real nas imagens; abas e acordeão com papéis ARIA corretos; sem informação só por cor; texto redimensionável até 200% sem perda.

## 11. Sincronia Wix ↔ embed

- `tokens.css` é a única fonte de valores. No Wix, as mesmas cores, estilos de texto e botões são cadastrados em *Design do site* com **os mesmos valores** (lista na §2 e na §3). Se algo mudar, muda-se em `tokens.css` e no Wix.
- Cada embed inclui `tokens.css` e a ponte `postMessage` (altura, eventos de tracking).
- `facts.json` guarda números e textos provisórios, com `provisorio: true`.

## 12. O que evitar (resumo)

Sem glassmorphism, gradientes, glow, 3D, rede de pontos, malha facial completa, ícone em círculo decorativo, cards com faixa lateral, dashboards ou mockups de aplicativo inexistentes, números ou depoimentos inventados, foto de equipe falsa, parallax. Menos de dez ícones no site inteiro.

## 13. Pendências

1. Aprovar os tokens **DERIVADO** e **NOVO** (raio de painel fluido, `--espaco-8`, `--verde-hover`, `--erro`, `--foco`).
2. Confirmar no editor do Wix as fontes Baloo 2 e Nunito Sans (ou enviar os arquivos).
3. Logo vetorial (SVG/AI/PDF) para uso nítido; hoje só há PNG 888×318.
4. Escolha das fotos de banco de imagem para cada slot (posso listar critérios e termos de busca na Fase E).
