# Fase A — Discovery (renovação evolutiva do site Evolua)

Fontes: site publicado (coletado em 01/10/2026 via HTTP), Design System "Evolua Editorial", repositório e print da página da GARD enviado pelo usuário.

## 1. Tecnologia e infraestrutura atuais

- **Plataforma:** Wix (gerador "Wix.com Website Builder"), versão publicada 1348. Reconstruir "em HTML próprio" exige decisão de plataforma (ver §9).
- **Sitemap:** índice Wix com `pages-sitemap.xml`, `blog-posts-sitemap.xml`, `blog-categories-sitemap.xml`. `robots.txt` padrão Wix (`Allow: /`; bloqueia PetalBot).
- **Tracking existente:** Google Tag Manager `GTM-MN8N8BZ`; evento de conversão Google Ads de clique em WhatsApp (conta `AW-578947525`). Sem GA4 direto, sem Pixel Meta detectado. Verificação do Search Console por meta tag (preservar).
- **Schema existente:** só na home (`LocalBusiness` com endereço/telefone, `WebSite`) e nos 2 posts (`BlogPosting`). Sem `Service`, `FAQPage`, `BreadcrumbList`, `Organization` na home.
- **Contatos:** (22) 2142-6561 (também é o WhatsApp, `552221426561`, com mensagem pré-preenchida); comercial@evoluatech.com.br; Rua Vereador Senísio Vieira, 44, sala 701, Praia Campista, Macaé-RJ, 27923-100. Redes: Instagram @evolua_tech, Facebook /Evoluatech, YouTube (canal). Link para hinfoluz.com.br no rodapé.
- **Formulários:** `/contato` (orçamento/"Solicitar uma análise" + candidatura), `/portaria-remota-empresarial` (cadastro p/ contato de especialista). Destino dos leads: a validar.

## 2. Mapa de URLs (18, todas 200)

| URL | Title | Observação |
|---|---|---|
| `/` | Evolua Acesso Protegido \| Portaria Remota em Macaé, RJ | home |
| `/portaria-remota` | Portaria Remota em Macaé \| Evolua Acesso Protegido | página-mãe: o que é, como funciona, FAQ, depoimentos |
| `/portaria-remota-condominial` | Portaria Remota Condominial \| Evolua | LP de conversão |
| `/portaria-remota-empresarial` | Portaria Remota Empresarial \| Evolua | LP de conversão com formulário |
| `/acesso` | CONTROLE DE ACESSO \| … | Evolua Access, Monitoring, Módulo de Segurança |
| `/automacao` | Função de Inteligência e Automação \| Evolua | módulo IoT |
| `/app-evolua` | App Evolua \| Controle sua Portaria pelo Celular | |
| `/evolua-loker` | Evolua Loker \| Armários Inteligentes | |
| `/servicos` | Soluções em Segurança e Acesso | mistura Evolua + Solid Invent + PPA + Zelo |
| `/qualidade` | Sobre a Evolua … Missão e Qualidade | institucional |
| `/diagnostico-acesso` | Diagnóstico de acesso condominial \| Evolua | **a LP deste repositório já está publicada aqui** |
| `/contato`, `/trabalhe-conosco`, `/politica-de-privacidade` | | |
| `/blog` + 2 posts | | só 2 artigos |
| `/inquiry-services-page` | Inquiry Services Page | **resíduo de template Wix** ("Configuração de Sites"), sem meta description |

Menu atual: HOME · Sobre · Nossos Indicadores · PORTARIA REMOTA (O que é? / Como funciona? / Benefícios / **APP KIPER-EVOLUA** / Depoimentos) · SOLUÇÕES (Função de inteligência e automação / Controle de acesso / Evolua Loker) · BLOG · TRABALHE CONOSCO · CONTATO · Inquiry Services Page.

## 3. SEO — achados

1. **H1 idêntico em TODAS as páginas** e igual à meta keywords: "Portaria Remota em Macaé, Segurança para Condomínios em Macaé, Portaria em Macaé, Porteiro em Macaé, Administradora de Condomínios em Macaé". Keyword stuffing; página sem H1 próprio (as de post têm um segundo H1). Ironia: "Administradora de Condomínios" e "Porteiro" não são o serviço.
2. Titles e descriptions por página são bons e únicos (preservar a lógica; reescrever onde fraco). Posts sem meta description; `/inquiry-services-page` sem description.
3. Poucos H2/H3 descritivos na home (os H2 são rótulos de indicador: "+ de 46.000").
4. Alt: home 16 de 22 imagens com alt vazio; `/portaria-remota` 16 de 23.
5. Canonical da home sem barra e com `www`; consistente. Sem hreflang (desnecessário).
6. FAQ existe com seis perguntas em H3, nas três páginas de portaria, mas **sem `FAQPage` schema** e duplicadas entre páginas (conteúdo repetido).
7. URLs de post com acentos e vírgula implícita (`/post/benefícios-do-controle-de-acesso-segurança-em-macaé`). Preservar ou redirecionar 301.
8. Home com ~716 KB de HTML e 22 imagens; páginas de LP passam de 1,2 MB de HTML. Performance a medir (Lighthouse não rodado neste ambiente).

## 4. Inconsistências de conteúdo [VALIDAR COM A EVOLUA]

| # | Tema | Valores no site | Onde |
|---|---|---|---|
| 1 | Atendimentos mensais | "mais de **17.000**" × "+ de **46.000**" (e 34 mil em diretório externo) | home: texto "Sobre" × indicadores |
| 2 | Economia de custo | "até **50%**" × "até **40%**" | `/portaria-remota`, `/qualidade` × `/…-condominial`, `/…-empresarial` |
| 3 | Tempo de empresa | "mais de **4 anos**" × "mais de **10 anos**" (Grupo Hinfoluz) × fundação em **2017** (cadastro) | home/LPs × `/qualidade`. DS: usar "desde 2017" |
| 4 | Alcance da tecnologia | "mais de **1000** condomínios e empresas no Brasil" × "mais de **2000** condomínios no Brasil" | `/portaria-remota` × `/…-condominial`. Parece contagem do fornecedor da plataforma, não da Evolua |
| 5 | Nome do app | "APP **KIPER**-EVOLUA" (menu), "APP **RIPER** EVOLUA" (erro de digitação), "App Evolua" | menu, `/portaria-remota` |
| 6 | "Solução própria" × fornecedor | "desenvolvimento, engenharia, componentes, softwares e base própria" × "Módulo IoT **Kiper**", links para a loja de apps Kiper | `/portaria-remota`, `/automacao`, `/app-evolua` |
| 7 | "Não usamos internet" | afirmado no FAQ e nos benefícios; mas Evolua Monitoring é "operado via cloud" e o app envia notificações | FAQ × `/acesso`. Afirmação técnica forte: validar com engenharia |
| 8 | "Operação 100% própria" × parceria "com os melhores fabricantes" | convivem na mesma página | LPs condominial/empresarial |
| 9 | "Uma solução para cada **condomínio**" | aparece no bloco da LP **empresarial** | copy copiada |
| 10 | "mais de 250 eventos de segurança" e "237 bilhões de combinações" (QR code) | sem fonte | `/portaria-remota` |
| 11 | Depoimentos | 3 depoimentos (Sr. Paulo, Sr. Cícero, Phelipe Barbosa) em formato de vídeo/imagem; sobrenome e condomínio ausentes | validar autorização de uso |
| 12 | Texto "Sobre" duplicado | quase idêntico em home, condominial, empresarial; propósito difere entre eles | |
| 13 | Ortografia | "seguimento" (segmento), "tornandose", "evolua" minúsculo em caixa, "DEPOIMENOS", "Mais caso" | `/qualidade`, `/portaria-remota` |
| 14 | Escopo da marca | `/servicos` mistura Evolua com **Solid Invent**, **PPA**, **Zelo Protege/Zelo Combate** ("equipamento de guerra" para vitrines) | contradiz o posicionamento de acesso protegido |
| 15 | Cor | site usa verde `#9DC456`; DS e logo `#7BBE00` | DS pede migração |

## 5. Classificação do conteúdo

**MANTER (refinar visualmente)**
- Endereço, telefone, e-mail, WhatsApp, redes, Política de Privacidade (LGPD).
- Fluxo "Como funciona: moradores / visitantes" (é a espinha da seção de experiência; está tecnicamente descrito).
- FAQ de seis perguntas (energia, pânico silencioso, queda de link, portão parado, incêndio NBR 9077, encomendas): objeções reais de vendas.
- Evolua Access / Monitoring / Módulo de Segurança (`/acesso`).
- Evolua Loker e App Evolua (funcionalidades já descritas: convites QR, timeline, mural, câmeras, encomendas, gestão de usuários).
- Equipe de portaria remota (galeria com nome e cargo) e depoimentos, **desde que validados**.
- Blog e títulos/descriptions por página (lógica boa).
- Diagnóstico de acesso (`/diagnostico-acesso`): já alinhado ao funil de conversão.

**MELHORAR**
- Home: o hero hoje é um H1 de palavras-chave; falta explicar o que a Evolua faz, para quem e qual transformação.
- Indicadores: unificar números e dar contexto de fonte.
- Mensagem de valor: "mais do que abrir e fechar portas" (hoje é "reduz até 50%" como argumento principal; trocar o foco de custo por controle + atendimento + registro; manter economia como benefício secundário com valor validado).
- Cards de solução: hoje lista de títulos; passar a problema → solução → benefício.
- Páginas condominial/empresarial: copy repetida entre si; separar jornadas (síndico/morador × gestor/RH/facilities).
- Benefícios da portaria: lista de ~20 itens sem hierarquia; agrupar em 4–5 (autorização, registro, continuidade, assistência 24h, relatórios).
- Posts do blog: texto genérico ("controle de acesso segurança") com cara de conteúdo gerado; reescrever com especificidade local e fonte.
- Alt text e semântica de headings.

**REORGANIZAR**
- Menu: sair de 5 níveis para Soluções · Condomínios · Empresas · Sobre · Conteúdos · Contato (+ CTA).
- "Qualidade/Missão" → bloco "Sobre" e "Por que Evolua".
- Indicadores: de seção isolada para faixa logo após o hero.
- FAQ: um FAQ único e curto na home/hub, FAQs específicos nas páginas de condomínio e empresa (sem duplicar).
- Solid Invent, PPA, Zelo: sair de `/servicos` para uma página "Projetos e instalações" (ou ser removido), fora da narrativa principal. [VALIDAR]
- Trabalhe conosco e Login: para o rodapé / utilitários.

**REMOVER**
- `/inquiry-services-page` (template residual, 301 para `/servicos` ou `/contato`).
- H1 repetido em todas as páginas (substituir por H1 próprio; manter os termos locais em title, meta e corpo).
- "APP KIPER-EVOLUA" / "APP RIPER EVOLUA" / "Módulo IoT Kiper" como protagonista: trocar por "App Evolua" e "Módulo de automação". [VALIDAR se alguma menção ao fornecedor é exigida pela licença]
- Zelo Combate ("equipamento de guerra", "criminosos e vândalos"): fora do tom da marca. [VALIDAR]
- Metatag `keywords` (ignorada por buscadores).
- Textos duplicados do bloco "Sobre" entre páginas.

## 6. Design System: o que se aplica ao site

(Ver resumo no relatório da sessão.) Principais pontos: Claro 40% / Petróleo 30% / Verde 20%; Baloo 2 + Nunito Sans; faceta de 16°, moldura de câmera, pílula de status; raios 12/24/48/pill; fotografia real da central e da equipe; sem números inventados. Lacunas: tokens de web (breakpoints, container, botões, formulários, foco) não existem.
O repositório já tem uma paleta própria (`src/styles/main.css`: areia/argila, `#78bc00`, sem petróleo) que **diverge** do DS e deve ser alinhada.

## 7. Referência GARD (análise do print enviado pelo usuário)

O Behance e o site da GARD não são acessíveis deste ambiente (429 / política de rede); a análise vem do print de página inteira (baixa resolução: textos pequenos podem estar imprecisos).

**Estrutura, de cima para baixo**
1. Hero escuro: título em 3 linhas com a palavra-chave em verde, subtítulo curto, CTA único, rosto com malha biométrica e chip "Autorizado" sobreposto.
2. Faixa de prova com 3 colunas (selo "10 anos", prédio, chip), em ícone + frase.
3. "Serviços especializados": 4 linhas alternadas texto/mídia (Portaria Remota, Portaria Local Inteligente, Portaria Autônoma, Armários Inteligentes), cada uma com título, parágrafo, CTA e miniaturas de vídeo ou foto.
4. "Tudo em um app": lista de funcionalidades em linhas finas ao lado de celulares e relógio em recortes circulares.
5. "Por que escolher": 3 argumentos curtos (sem investimento inicial, biometria facial, assistência 24h).
6. "Onde estamos": mapa com 3 números (cidades, condomínios, moradores).
7. Formulário curto (nome, e-mail, telefone) sobre foto de celular; rodapé enxuto.

**O que funciona (aprender)**
- Ritmo: alternância de fundo escuro/claro com divisores orgânicos e de lado do texto/mídia nas soluções; a página nunca repete a mesma composição duas vezes seguidas.
- Um único CTA, com o mesmo texto em todas as seções ("Quero a GARD no meu condomínio"): consistência de conversão.
- Faixa de prova logo após o hero e um bloco de números com contexto geográfico.
- Cada solução tem mídia própria (vídeo/foto) e uma ação, em vez de só ícone + parágrafo.
- Formulário com 3 campos.
- Fluxo de storytelling simples: promessa → prova → serviços → app → razões → alcance → ação.

**O que NÃO aproveitar (conflita com o brief e o DS)**
- Visual neon sobre preto com malha facial: é o "futurista sem função" e o cliché de reconhecimento facial que o brief proíbe; o DS também desaconselha fundo escuro dominante e rede de pontos.
- Chip "Autorizado" sobre a foto do rosto: UI fictícia decorativa.
- Texto corrido pequeno e de baixo contraste sobre verde-escuro (fere os critérios de acessibilidade do DS).
- Banco de imagem de pessoas sorrindo; selo "10 anos de liderança" e números sem fonte (a Evolua só pode usar números validados).
- Identidade (verde-água, tipografia condensada, ícones, textos): não copiar.

**Tradução para a Evolua (hipótese para a Fase B)**
- Mesmo ritmo e mesma lógica de seções, em Claro + Petróleo + Verde do DS, com foto real da central e da equipe.
- Solução em linhas alternadas (problema → solução → benefício) com mídia real ou slot de foto.
- Faixa de indicadores após o hero (números só após validação) e CTA único repetido.
- Fluxo do visitante representado com faceta, moldura de câmera e pílula de status, sem rosto com malha biométrica e sem app fictício.

## 8. Oportunidades

1. Duas jornadas claras (Condomínios × Empresas) onde hoje há dois cartões na home.
2. A central 24h na mesma cidade, com gravação de conversa/imagem/registro, é o diferencial demonstrável que quase nenhum concorrente regional mostra.
3. FAQ real e rico (já escrito) → `FAQPage` + conteúdo para AEO.
4. Termos locais ("Macaé") mantidos em title/meta/corpo e `LocalBusiness`, sem H1 artificial.
5. Eventos de tracking sobre GTM e WhatsApp já existentes.
6. Diagnóstico de acesso como CTA de captura qualificada.

## 9. Decisões pendentes

1. **Plataforma:** (a) reconstruir no Wix (nativo, SEO íntegro, menos liberdade visual/performance); (b) migrar para site estático próprio com 301 de todas as URLs acima; (c) híbrido (home e LPs próprias, blog no Wix). O guia atual do repositório (iframe) **não indexa**.
2. Números oficiais (itens 1–4 do §4).
3. Posicionamento: "Evolua seu acesso" × "Evolua a sua portaria" (DS).
4. Serviços de terceiros em `/servicos` (Solid Invent, PPA, Zelo).
5. Menções a fornecedores tecnológicos (Kiper) por exigência contratual ou licenciamento?
6. Autorização dos depoimentos e das fotos da equipe.
