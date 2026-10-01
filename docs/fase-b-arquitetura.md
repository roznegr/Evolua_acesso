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
| `/diagnostico-acesso` | LP do diagnóstico | CTA secundário de Condomínios | MANTER |
| `/blog` + 2 posts | genérico | **Conteúdos** (arquitetura em §6) | MELHORAR |
| `/contato` | formulário | contato + análise | MELHORAR |
| `/trabalhe-conosco`, `/politica-de-privacidade` | menu | **rodapé** | REORGANIZAR |
| `/inquiry-services-page` | resíduo de template | **301 → `/contato`** | REMOVER |
| Solid Invent, PPA, Zelo | em `/servicos` | removidos | REMOVER |
| Depoimentos, equipe, "Kiper" | espalhados | removidos até haver registro | REMOVER |

Páginas novas (opcionais, fase posterior): `/portaria-remota-em-macae`, `/controle-de-acesso-em-macae` (landing local com conteúdo útil, sem keyword stuffing); categorias do blog.

## 3. Header e navegação

Menu atual: 12 itens em até 3 níveis (HOME, Sobre, Nossos Indicadores, PORTARIA REMOTA ▸ 5 subitens, SOLUÇÕES ▸ 3, BLOG, TRABALHE CONOSCO, CONTATO, Inquiry Services Page, Login).

**Proposto (sticky, um nível, 6 itens + CTA):**

`Logo` · Soluções · Condomínios · Empresas · Sobre · Conteúdos · Contato · **[Evolua a sua portaria]**

- *Soluções* abre um submenu curto: Portaria remota · Controle de acesso · App Evolua · Evolua Loker · Automação.
- "Login" (área do cliente) é mantido em posição discreta se for um link que funciona [VALIDAR para onde aponta].
- Telefone/WhatsApp fixos: no mobile, botão flutuante de WhatsApp (mantém a conversão de Ads já configurada).
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

**CTAs (dois, consistentes):**
- **Primário:** *Evolua a sua portaria* → formulário curto ou WhatsApp. (Difere do brief original, que sugeria "Conheça nossas soluções" como primário: um CTA de exploração no topo enfraquece a conversão; "Conheça as soluções" fica como secundário, ancorado.)
- **Secundário:** *Conheça as soluções* (navegação) e, em Condomínios, *Faça o diagnóstico* (gratuito).

**Formulário:** Nome · Condomínio/Empresa · WhatsApp · E-mail · Tipo (Condomínio/Empresa). Cinco campos no máximo; endpoint compatível com marketing/CRM (Velo, Make ou Zapier).

**Eventos de tracking** (sobre o GTM `GTM-MN8N8BZ` existente; nada de IDs novos): `cta_whatsapp` (mantém a conversão Google Ads atual), `cta_contact`, `form_start`, `form_submit`, `solution_view`, `condominio_view`, `empresa_view`; UTMs preservadas nos links internos.

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
| Atendimentos mensais | +46.000 (indicadores) | o "17.000" do texto Sobre sai do texto; pendente validar |
| Usuários cadastrados | +7.000 | |
| Acessos mensais | +500.000 | |
| Economia | "até 40%" (Condomínios/Empresas) e "até 50%" (pilar) | mantidos como estão; economia é benefício **secundário**, nunca o título |
| Início | "desde 2017" | (cadastro e DS) em vez de "mais de 4 anos" |
| Contato | (22) 2142-6561 · comercial@evoluatech.com.br · endereço atual | |

## 9. Leitura facial como motivo visual

Permitido pelo cliente, com limites para não virar o clichê "hacker/futurista":
- **Uma** composição por página, só no hero ou no fluxo "Reconhecimento".
- Traduzida no vocabulário do DS: **moldura de câmera** (cantoneiras) e **poucos pontos de referência** em lima (`evolua-sinal`) sobre petróleo, com pílula de status ("acesso liberado") — sem malha completa, sem rosto verde-neon, sem brilho.
- Foto de pessoa real (banco de imagem por ora), natural e sem pose.
- **Não afirmar** que a Evolua faz reconhecimento facial até validar: o site atual descreve QR code, TAG, controle veicular e app, e menciona biometria só em texto genérico do blog. O texto fala em "identificação" e "autorização" [VALIDAR].

## 10. Fotografia temporária (banco de imagem)

Critério para escolher e depois substituir: cenas reais de chegada, portão, portaria, central/operador, morador com celular, entregas; sem sorriso posado, sem hacker/cadeado/escudo, sem IA generativa de pessoas ou prédios "da Evolua". Cada slot terá `data-slot` e `alt` descritivo, proporção fixa e arquivo único para trocar sem mexer no layout. Tratamento: cor natural, levemente fria nas cenas de central e quente nas de condomínio.

## 11. Pendências

1. Aprovar a arquitetura em camadas (§1) e o CTA primário "Evolua a sua portaria" (§5).
2. Para onde aponta o "Login" do menu atual.
3. Se o app nas lojas usa a marca do fornecedor.
4. Confirmar o texto "identificação" × "reconhecimento facial".
5. Quais URLs locais novas criar (§2).
