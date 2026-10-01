# Fase B — Arquitetura (ATUAL → PROPOSTO)

Decisões do cliente (01/10/2026): plataforma **Wix**; números mantidos como estão no site até validação; CTA de marca **"Evolua a sua portaria"**; serviços de terceiros (Solid Invent, PPA, Zelo) **fora**; **sem depoimentos, sem equipe nominal e sem menção ao fornecedor Kiper** por enquanto; **fotos de banco de imagem**, a trocar por fotos reais; leitura facial permitida como motivo visual (ver §8).

## 1. Wix + HTML embedado: o que dá e o que não dá

O "Incorporar código HTML" do Wix cria um **iframe**. Funciona, mas tem custos que precisam orientar o desenho:

| Aspecto | Efeito do iframe | Como tratar |
|---|---|---|
| SEO | O conteúdo do iframe **não é indexado** como parte da página | H1, texto introdutório, FAQ e schema ficam **nativos no Wix** |
| Altura | O iframe tem altura fixa e rola por dentro | Redimensionamento automático via `postMessage` (a ponte do repositório já faz isso para GTM; estendo para altura) |
| Header sticky | Não pode viver dentro do iframe | Header e footer **nativos do Wix**, estilizados com os tokens do DS |
| Links | Abrem dentro do iframe | `target="_top"` em todos os links internos |
| Core Web Vitals | O iframe carrega depois da página; LCP e CLS pioram se o hero estiver nele | Hero e primeira dobra **nativos** ou com altura reservada; embeds abaixo da dobra, `loading="lazy"` |
| Tracking | O iframe não enxerga o GTM do pai | Ponte `postMessage` → `dataLayer` (já existe em `wix/parent-bridge.js`) |
| Formulário | Precisa de endpoint | Velo HTTP function (já há referência) ou webhook; alternativa: formulário nativo do Wix |
| Edição | Atualizar = novo build e colar de novo | Um embed por **seção** e dados em um único `config` |

**Recomendação: arquitetura em camadas.** Wix nativo para o que o Google e o usuário precisam ver primeiro (header, H1, parágrafo de resposta, FAQ, footer, schema em *SEO → Marcação estruturada*); **blocos HTML embedados, um por seção**, para o que o Wix não faz bem (indicadores animados, fluxo do acesso, seletor Condomínios/Empresas, cards de solução). O blog continua nativo no Wix.

Resposta curta: sim, dá para fazer em HTML e embedar, **desde que o texto que ranqueia fique nativo**. Uma página inteira dentro de um único iframe perderia a indexação do conteúdo e pioraria os Core Web Vitals.

## 2. Sitemap: ATUAL → PROPOSTO

URLs existentes são **preservadas** (zero perda de SEO). Só muda o conteúdo, o papel e o menu.

| URL | Hoje | Proposto | Ação |
|---|---|---|---|
| `/` | home com H1 de palavras-chave | home nova (§4) | MELHORAR |
| `/servicos` | mistura Evolua + Solid Invent + PPA + Zelo | hub **Soluções** (só Evolua) | REORGANIZAR |
| `/portaria-remota-condominial` | LP condominial | hub **Condomínios** | MELHORAR |
| `/portaria-remota-empresarial` | LP empresarial | hub **Empresas** | MELHORAR |
| `/portaria-remota` | página-mãe longa | pilar "O que é, como funciona" + FAQ (AEO) | REORGANIZAR |
| `/acesso` | Evolua Access/Monitoring | Controle de acesso | MANTER + refinar |
| `/automacao` | "Módulo IoT Kiper" | Automação do condomínio (sem nome de fornecedor) | MELHORAR |
| `/app-evolua` | app | App Evolua | MANTER + refinar |
| `/evolua-loker` | armários | Evolua Loker | MANTER + refinar |
| `/qualidade` | missão e qualidade | **Sobre** (rótulo novo, URL mantida) | REORGANIZAR |
| `/diagnostico-acesso` | LP do diagnóstico | **MVP do Motor 4** (Análise de Segurança Condominial): principal destino de conversão de Condomínios | MANTER |
| `/blog` + 2 posts | genérico | **Conteúdos** (arquitetura em §6) | MELHORAR |
| `/contato` | formulário | contato + análise | MELHORAR |
| `/trabalhe-conosco`, `/politica-de-privacidade` | menu | **rodapé** | REORGANIZAR |
| `/inquiry-services-page` | resíduo de template | **301 → `/contato`** | REMOVER |
| Solid Invent, PPA, Zelo | em `/servicos` | removidos | REMOVER |
| Depoimentos, equipe, "Kiper" | espalhados | removidos até haver registro | REMOVER |

**Páginas locais novas (aprovadas):** `/portaria-remota-em-macae`, `/controle-de-acesso-em-macae`, `/seguranca-condominial-em-macae` (conteúdo útil e específico da cidade e região, sem keyword stuffing; linkadas a partir de Condomínios, Empresas e rodapé); categorias do blog. Bairros e municípios de atuação a confirmar com a Evolua antes de citar [VALIDAR].

## 3. Header e navegação

Menu atual: 12 itens em até 3 níveis (HOME, Sobre, Nossos Indicadores, PORTARIA REMOTA ▸ 5 subitens, SOLUÇÕES ▸ 3, BLOG, TRABALHE CONOSCO, CONTATO, Inquiry Services Page, Login).

**Proposto (sticky, um nível, 6 itens + CTA):**

`Logo` · Soluções · Condomínios · Empresas · Sobre · Conteúdos · Contato · **[Quero minha análise gratuita]**

- *Soluções* abre um submenu curto: Portaria remota · Controle de acesso · App Evolua · Evolua Loker · Automação.
- "Login" **removido** do menu (decisão do cliente, 01/10).
- WhatsApp = o próprio telefone fixo, (22) 2142-6561 (confirmado pelo cliente). No mobile, botão de WhatsApp **discreto** (pílula pequena, cores do DS), para não competir com a marca.
- Footer: Evolua · Soluções · Condomínios · Empresas · Conteúdos · Contato · Trabalhe conosco · Política de Privacidade · telefone · e-mail · endereço · redes.

## 4. Home — estrutura (ATUAL → PROPOSTO)

| # | Seção proposta | Hoje | Mudança |
|---|---|---|---|
| 1 | Header sticky | menu de 12 itens | simplificado |
| 2 | **Hero** "Evolua a sua portaria." | H1 de palavras-chave + pouca explicação | clareza: o quê, para quem, o quê muda |
| 3 | **Indicadores** | "Sobre" + seção de números separada | faixa de confiança logo após o hero |
| 4 | **Mensagem de valor** | "Evolua a sua portaria!" + texto institucional | "acesso protegido é mais do que abrir portas" |
| 5 | **Dois caminhos** Condomínios / Empresas | dois cartões com uma frase | seletor com composições distintas |
| 6 | **Como funciona** (visitante) | texto longo em `/portaria-remota` | fluxo visual de 5 passos |
| 7 | **Soluções** (problema → solução → benefício) | lista em `/servicos` | linhas alternadas com mídia |
| 8 | **Experiência Evolua** | não existe | morador, visitante, administração, central |
| 9 | **Por que a Evolua** | blocos "operação 100% própria" etc. | argumentos demonstráveis |
| 10 | **Sobre** (curto) | texto repetido em 3 páginas | 1 parágrafo + dimensão |
| 11 | **Conteúdos** | blog solto | 3 cards de artigos |
| 12 | **FAQ** curto | 6 perguntas duplicadas | 5 perguntas, nativo no Wix, com `FAQPage` |
| 13 | **CTA final** + formulário curto | formulário em `/contato` | fechamento na própria home |
| 14 | Footer | extenso | simplificado |

## 5. Jornadas e conversão

**Condomínio (síndico, conselho, morador):** Home → Condomínios → (como funciona · custos · app · loker) → CTA "Evolua a sua portaria" → formulário/WhatsApp. Atalho secundário: **Diagnóstico de acesso** (captura qualificada, já existente).
**Empresa (gestor, RH, facilities):** Home → Empresas → (registro de colaboradores, visitantes, prestadores, relatórios) → "Evolua a sua portaria" → formulário/WhatsApp.

**CTAs (dois, consistentes) — revisado em 01/10:**
- **Marca:** *Evolua a sua portaria* é o título e a assinatura, não o botão.
- **Primário (botão em todo o site):** *Quero minha análise gratuita* → `/diagnostico-acesso` (MVP do Motor 4) em Condomínios; em Empresas, o mesmo rótulo leva a um formulário de análise de acessos [VALIDAR se a análise gratuita existe para empresas; senão, "Falar com um especialista"].
- **Secundário:** *Conhecer as soluções* (navegação por âncora) e o WhatsApp como contato direto.
- O objetivo do funil condominial é armar o síndico para levar a decisão à assembleia (kit de apresentação como entrega pós-formulário).

**Formulário:** Nome · Condomínio/Empresa · WhatsApp · E-mail · Tipo (Condomínio/Empresa). Cinco campos no máximo; endpoint compatível com marketing/CRM (Velo, Make ou Zapier).

**Eventos de tracking** (sobre o GTM `GTM-MN8N8BZ` existente; nada de IDs novos). Alinhados aos nomes que o time já definiu: `page_view`, `generate_lead` (único evento-chave), `file_download` (kit para assembleia), `contact_click` (WhatsApp/telefone); e, para o site novo, `form_start`, `solution_view`, `condominio_view`, `empresa_view`. UTMs preservadas nos links internos. A conta de Google Ads está cancelada: não depender do evento de conversão antigo de WhatsApp. Antes de ligar mídia paga, conferir os eventos na propriedade GA4 da Evolua.

## 6. Conteúdo e SEO/AEO

- **H1 próprio por página.** O H1 de palavras-chave repetido em todas as páginas sai; "Macaé" permanece em `<title>`, meta description, texto e `LocalBusiness`. Títulos atuais (que já são bons) são preservados.
- **Schema:** `LocalBusiness` (mantido) + `Organization`, `Service` por solução, `BreadcrumbList`, `FAQPage` (só onde o FAQ for visível), `Article` nos posts. Configurado em *SEO → Marcação estruturada* do Wix, por página.
- **FAQ único e curto** na home; FAQs específicos em Condomínios e Empresas, sem duplicar.
- **Arquitetura de conteúdo** (a escrever com pesquisa de palavras-chave antes): *O que é portaria remota*, *Como funciona*, *Portaria remota × controle de acesso*, *Controle de visitantes*, *Portaria remota é segura?*, categorias: Segurança condominial · Gestão de acesso · Portaria · Administração · Tecnologia.
- Posts atuais (2) são genéricos: reescrever ou manter com redirecionamento.
- **Redirecionamentos 301:** `/inquiry-services-page` → `/contato`; qualquer URL removida (nenhuma, por ora).

## 7. Conteúdo que fica de fora (por decisão)

Solid Invent, PPA, Zelo Protege/Combate · depoimentos · galeria "Conheça nossa equipe" · menções a "Kiper"/"Riper" · links de lojas de apps com marca do fornecedor [VALIDAR: se o app Evolua é distribuído com a marca do fornecedor nas lojas, o botão "baixar" depende disso].
O relato "Tecnologia presente em mais de 1000/2000 condomínios no Brasil" **sai** (é número do fornecedor e contradiz o princípio de marca).

## 8. Dados mantidos e como serão tratados

Todos em **um único arquivo de dados** (`data/facts.json`) com flag `validar: true`, para trocar em um lugar quando a Evolua confirmar:

| Dado | Valor mantido | Observação |
|---|---|---|
| Atendimentos mensais | +46.000 (indicadores) | **mantido por decisão do cliente (01/10)**; o "17.000" do texto Sobre sai do texto; [VALIDAR] enquanto houver divergência interna |
| Usuários cadastrados | +7.000 | mantido |
| Acessos mensais | +500.000 | mantido |
| Economia | **sem percentual** | decisão do cliente (01/10): nenhum número de economia sem validação do Comercial. "Até 40%/50%" sai de textos e meta descriptions; usar linguagem qualitativa; sem calculadora por ora |
| Início | "desde 2017" | (cadastro e DS) em vez de "mais de 4 anos" |
| Contato | (22) 2142-6561 · comercial@evoluatech.com.br · endereço atual | |

## 9. Reconhecimento facial

**Decisão do cliente (01/10):** os sistemas da Evolua **têm reconhecimento facial** e **não trabalham mais com QR code**. Consequências:
- O reconhecimento facial passa a ser **funcionalidade real e protagonista** do fluxo de acesso e do hero (não só metáfora visual).
- **QR code sai de todo o conteúdo**: convites por QR, "237 bilhões de combinações", Evolua Loker com retirada por QR, app "substitui o molho de chaves por QR Code". Os textos dessas páginas serão reescritos para o fluxo atual [VALIDAR com a operação: como o morador, o visitante e o prestador se cadastram e são reconhecidos; como funciona o convite de visitante sem QR; como o Loker libera a retirada].
- TAG e controle veicular: **não confirmados**; só entram se a Evolua confirmar que continuam.
- Evitar promessas técnicas não verificadas (precisão, tempo de reconhecimento, "100% seguro"), e tratar a imagem facial com cuidado de LGPD no texto de privacidade [VALIDAR com o jurídico: base legal e política de dados biométricos].

Tratamento visual (mantido, para não virar o clichê "hacker/futurista"):
- **Uma** composição por página, só no hero ou no fluxo "Reconhecimento".
- Traduzida no vocabulário do DS: **moldura de câmera** (cantoneiras) e **poucos pontos de referência** em lima (`evolua-sinal`) sobre petróleo, com pílula de status ("acesso liberado") — sem malha completa, sem rosto verde-neon, sem brilho.
- Foto de pessoa real (banco de imagem por ora), natural e sem pose.
- Texto: "reconhecimento facial" pode ser dito com clareza; detalhes técnicos só após validação.
- **Chamariz (decisão de 01/10):** o reconhecimento facial é o principal gancho de atenção da home e de Condomínios. A funcionalidade está em uso real (a própria equipe trabalha em um prédio atendido pela Evolua com reconhecimento facial).
- Regras de copy: não prometer entrada automática (o acesso segue as regras de cada condomínio); não inventar funcionalidades do app; dado técnico da equipe nunca aparece como fala de cliente.

## 9.1 Regras permanentes de conteúdo (revisão 01/10)

- Nenhuma menção a Kiper; **conferir os vídeos de benefícios de `/portaria-remota`** antes de reaproveitá-los.
- Co-branding: sem Hinfoluz nem "Grupo" na home, em Condomínios e no rodapé. Remover o link do rodapé e o "Empresa do Grupo… mais de 10 anos" de `/qualidade`. Em Empresas, só com validação do Comercial.
- Não expor a lógica interna das modalidades de portaria.
- Tamanho do condomínio não segmenta o conteúdo.
- Cidades: páginas locais de Macaé e Rio das Ostras; Rio de Janeiro e Belo Horizonte só com prova de atuação [VALIDAR].
- Prioridade de SEO: `/app-evolua` (título, descrição e botões das lojas do app novo, white label com a logo da Evolua); endereço e telefone idênticos ao perfil do Google Meu Negócio.
- Blog refeito com resposta direta no início, FAQ, links internos e dúvidas reais de síndicos. Primeiro tema sugerido: "Portaria remota é segura se a internet cair?" (exige validar a afirmação do site de que "não usamos internet").
- Automação (`/automacao`): [VALIDAR se o módulo continua depois da descontinuação da Kiper] antes de manter a página e o card.

## 10. Fotografia temporária (banco de imagem)

Critério para escolher e depois substituir: cenas reais de chegada, portão, portaria, central/operador, morador com celular, entregas; sem sorriso posado, sem hacker/cadeado/escudo, sem IA generativa de pessoas ou prédios "da Evolua". Cada slot terá `data-slot` e `alt` descritivo, proporção fixa e arquivo único para trocar sem mexer no layout. Tratamento: cor natural, levemente fria nas cenas de central e quente nas de condomínio.

## 11. Pendências

Resolvidas em 01/10: arquitetura em camadas aprovada; "Login" removido; app novo **white label com a logo da Evolua** (nada de marca de fornecedor; links das lojas e nome oficial do app a informar); reconhecimento facial confirmado e QR code descontinuado; páginas locais aprovadas.

Em aberto:
1. Nome oficial, links das lojas (Google Play / App Store) e funcionalidades atuais do app novo.
2. Como funciona hoje o cadastro e o convite de visitante e prestador, e a retirada no Loker, sem QR.
3. TAG e controle veicular continuam?
4. Política de privacidade atualizada para dado biométrico (jurídico).
5. Bairros/cidades atendidos para as páginas locais.
