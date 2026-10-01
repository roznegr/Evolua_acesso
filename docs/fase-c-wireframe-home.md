# Fase C — Wireframe textual da home

Convenções: **[N]** = texto nativo do Wix (indexável); **[E]** = bloco HTML embedado (um por seção); **[VALIDAR]** = depende de confirmação da Evolua. Todos os valores visuais vêm de tokens do Design System (`docs/fase-b-arquitetura.md` §§1, 9, 10; Fase D detalha). Imagens são de banco de imagem, em *slots* trocáveis por fotos reais.

Regras aplicadas em todo o texto: sem percentual de economia, sem Kiper, sem QR code, sem Hinfoluz/"Grupo", sem depoimentos nem equipe nominal, sem prometer entrada automática, sem função de app não confirmada, "desde 2017" no lugar de "há X anos". Números mantidos por decisão do cliente: +46.000 atendimentos mensais [VALIDAR], +7.000 usuários cadastrados, +500.000 acessos mensais.

**CTA primário (único botão do site):** *Quero minha análise gratuita*. **Secundário:** *Conhecer as soluções*. **Assinatura de marca:** *Evolua a sua portaria.*

**Metadados da home**
- Title: `Evolua Acesso Protegido | Portaria Remota e Reconhecimento Facial em Macaé, RJ`
- Description: `Portaria remota 24h, controle de acesso e reconhecimento facial para condomínios e empresas em Macaé e região. Peça uma análise gratuita do acesso do seu condomínio.`
- H1 (uma vez, na página): "Evolua a sua portaria." Os termos locais ficam no title, no parágrafo de apoio e no `LocalBusiness`.

---

## 01 · HEADER [N]

**Objetivo:** orientar sem competir com o hero.
**Copy:** Logo · Soluções ▾ (Portaria remota · Controle de acesso · App Evolua · Evolua Loker · Automação [VALIDAR]) · Condomínios · Empresas · Sobre · Conteúdos · Contato · botão **Quero minha análise gratuita**.
**Visual:** fundo branco, logo colorido, links em grafite, botão verde `#7BBE00` com texto petróleo (nunca branco). Foco visível em `evolua-folha`.
**UX:** fixo ao rolar, encolhe levemente; submenu abre por teclado e toque; link ativo sublinhado.
**Mobile:** logo + botão "Análise gratuita" + menu hambúrguer em tela cheia; telefone no fim do menu.

## 02 · HERO [N texto + imagem; sem iframe]

**Objetivo:** em 5 segundos, dizer o que a Evolua faz, para quem e qual a diferença.
**Eyebrow:** Acesso protegido em Macaé e região
**Headline (H1):** Evolua a sua portaria.
**Apoio:** Reconhecimento facial, central de atendimento 24h e registro de cada acesso, para condomínios e empresas. [VALIDAR a lista de cidades antes de citar Rio das Ostras no apoio]
**Chip (chamariz):** `Com reconhecimento facial`
**CTAs:** [Quero minha análise gratuita] · [Conhecer as soluções]
**Linha de confiança (microtexto):** Desde 2017 · Central de atendimento 24h · Macaé e região
**Visual:** foto grande de pessoa chegando a portão ou portaria de condomínio (sem pose, luz natural). Sobre ela, uma única camada discreta: **moldura de câmera** (cantoneiras) no rosto e **3 a 5 pontos de referência** em lima `#AFDE12`, mais a pílula `Acesso liberado` com o ponto de status. Faceta de 16° na borda inferior da imagem. Legenda pequena: "Ilustração do fluxo de acesso". Nenhuma malha, nenhum brilho, nenhuma tela de aplicativo.
**UX:** a camada de reconhecimento aparece depois da imagem carregar (fade de 400 ms, uma vez); sem movimento contínuo; `prefers-reduced-motion` mostra estático.
**Mobile:** imagem em proporção 4:5 acima do texto; H1 em 2 linhas; botão primário em largura total; secundário como link. A moldura mantém proporção.
**Desempenho:** é o elemento de LCP. Imagem AVIF/WebP com `srcset`, altura reservada, sem `lazy`; fonte Baloo 2 com `font-display: swap`.

## 03 · INDICADORES [E, com texto fallback]

**Objetivo:** prova imediata e verificável.
**Eyebrow:** A Evolua em números
**Itens:** **+46.000** atendimentos mensais [VALIDAR] · **+7.000** usuários cadastrados · **+500.000** acessos mensais.
**Visual:** faixa em Universo Petróleo (`#0B3954`), números em Baloo 2 800 branco, rótulos em `#A9BCC8`; um ponto lima `Status` no item de atendimentos. Fonte do dado em legenda: "Dados operacionais da Evolua". [VALIDAR período]
**UX:** contagem sobe uma vez ao entrar na tela (~900 ms); com redução de movimento, valores estáticos. Valores vêm de `facts.json` (troca em um lugar).
**Mobile:** os três itens empilham; números 48 px; sem carrossel.
**SEO/acessibilidade:** os mesmos números também existem como texto nativo oculto visualmente ao leitor de tela dentro do embed; sem H2 no embed (o H2 é nativo acima: "A Evolua em números").

## 04 · MENSAGEM DE VALOR [N]

**Objetivo:** diferenciar a Evolua de quem só instala equipamento.
**Eyebrow:** Acesso protegido
**Headline (H2):** Mais do que abrir e fechar portas.
**Texto:** Acesso protegido é saber quem entra, quando entra e como entra, com cada interação registrada e acompanhada por uma central de atendimento. A Evolua combina reconhecimento facial, atendimento humano e registro para o seu condomínio ou empresa.
**CTA (link):** Ver como funciona ↓
**Visual:** texto à esquerda, com destaque de peso 800 em "quem", "quando" e "como"; à direita, foto de central/operador (slot) com faceta.
**UX:** revelação suave dos três destaques, em sequência.
**Mobile:** coluna única; foto abaixo do texto.

## 05 · DOIS CAMINHOS [E]

**Objetivo:** dividir a audiência em dois fluxos de venda diferentes.
**Eyebrow:** Para quem
**Headline (H2):** Escolha o seu caminho.
**Card Condomínios:** *Segurança, autonomia e praticidade para moradores, visitantes e administração.* · Link: **Conhecer soluções para condomínios** → `/portaria-remota-condominial`.
**Card Empresas:** *Mais controle e visibilidade sobre o acesso de colaboradores, visitantes e prestadores.* · Link: **Conhecer soluções para empresas** → `/portaria-remota-empresarial`.
**Visual:** dois painéis grandes. Condomínios em Universo Claro com foto residencial (portão/portaria); Empresas em Universo Petróleo com foto de entrada corporativa. Raio 48 px, faceta em um deles.
**UX:** seletor em abas no mobile; no desktop os dois cards lado a lado; hover levanta 4 px e sublinha o link; envia `condominio_view`/`empresa_view` ao clicar.
**Mobile:** abas "Condomínios | Empresas" com troca de imagem e texto; área de toque mínima de 48 px.

## 06 · COMO FUNCIONA [E]

**Objetivo:** mostrar que há um sistema organizado por trás do acesso.
**Eyebrow:** Como funciona
**Headline (H2):** Cada acesso passa pelo mesmo caminho.
**Abas:** **Morador** · **Visitante**
**Morador (3 passos):** 1 Chega ao portão ou à porta · 2 É reconhecido pelo rosto · 3 Acesso liberado conforme as regras do condomínio, com registro.
**Visitante (5 passos):** 1 Chega e aciona o atendimento · 2 A central o identifica pelas câmeras · 3 A central pede autorização ao morador · 4 O morador autoriza, mesmo fora do condomínio · 5 Acesso liberado, com conversa, imagens e registro gravados.
(Fonte: fluxo descrito hoje em `/portaria-remota`; trocar passo 1 do morador se TAG/controle continuarem [VALIDAR].)
**Visual:** linha de 3 ou 5 nós conectados por um fio verde; o nó 2 do morador usa a moldura de câmera com o ponto lima; o último nó recebe a pílula `Registrado`. Sem tela de aplicativo.
**UX:** ao entrar na tela, o fio se desenha em 1,2 s e cada nó acende em sequência; trocar de aba reinicia. Reduzir movimento: tudo visível e estático.
**Mobile:** passos na vertical, fio vertical à esquerda, cada passo com título curto e uma linha.

## 07 · SOLUÇÕES [E]

**Objetivo:** apresentar soluções como problema → solução → benefício.
**Eyebrow:** Soluções
**Headline (H2):** Tudo o que o acesso precisa, em um só lugar.
**Linhas alternadas (texto/mídia), cada uma com CTA "Conhecer a solução":**
1. **Portaria remota** — *Problema:* portaria que depende de turnos e de controle manual. *Solução:* central da Evolua na mesma cidade, supervisionada 24h, que atende visitantes e entregadores com conversa, imagens e registro gravados. *Benefício:* mais controle e mais segurança sem depender de uma equipe de plantão no condomínio. → `/portaria-remota`
2. **Controle de acesso** — *Problema:* não saber quem entrou e quando. *Solução:* Evolua Access, com gestão por cloud e monitoramento de eventos (arrombamento, pânico, porta que não fechou, emergência). *Benefício:* histórico de acessos e alerta em tempo real. → `/acesso`
3. **App Evolua** — *Problema:* depender de chaves e de ligação para liberar visitas. *Solução:* aplicativo exclusivo da Evolua para acompanhar acessos. *Benefício:* [lista de funções do app a confirmar com a operação] → `/app-evolua`
4. **Evolua Loker** — *Problema:* encomendas sem controle. *Solução:* armário inteligente que recebe as encomendas, com aviso ao morador pelo app. *Benefício:* entrega segura e retirada organizada. [retirada sem QR a validar] → `/evolua-loker`
5. **Automação** [VALIDAR se continua] — rotinas do condomínio integradas à portaria. → `/automacao`
**Visual:** mídia em foto/slot ou vídeo curto sem marca de terceiros [conferir vídeos]; nunca ícone isolado. Fundo alterna Claro/Broto.
**UX:** cada linha revela ao rolar; hover no card destaca o CTA; envia `solution_view` com o nome da solução.
**Mobile:** mídia sobre o texto, uma solução por tela, CTA em largura total.

## 08 · EXPERIÊNCIA EVOLUA [E]

**Objetivo:** transformar tecnologia abstrata em situações reais.
**Eyebrow:** Na prática
**Headline (H2):** Quem usa, vê assim.
**Quatro cenas (cartões com foto):**
- **O morador** recebe uma pessoa sem precisar descer.
- **O visitante** é identificado e autorizado antes de entrar.
- **A administração** acompanha quem acessa e consulta o histórico.
- **A central** atende e registra cada interação, 24h.
**Visual:** quatro fotos reais (slot), legenda curta, status `Registrado` apenas no cartão da central.
**UX:** carrossel horizontal com *scroll-snap* (sem biblioteca); setas e teclado.
**Mobile:** deslizar com 1,15 cartões visíveis.

## 09 · POR QUE A EVOLUA [N + E]

**Objetivo:** argumentos demonstráveis, sem adjetivos.
**Eyebrow:** Por que a Evolua
**Headline (H2):** O que você pode verificar.
**Quatro blocos (fatos já publicados no site; [VALIDAR] cada um):**
1. **Central própria, na mesma cidade.** Atendimento supervisionado 24h, em Macaé.
2. **Tudo registrado.** Conversa, imagens e registro de cada atendimento ficam gravados.
3. **Assistência técnica 24h.** Inclusa na solução, com motores de propriedade da Evolua para agilizar reparos.
4. **Preparada para emergências.** Botão de pânico silencioso, bancos de bateria e sistema de evacuação conforme a NBR 9077.
**Visual:** quatro painéis em Universo Broto com um número ou rótulo grande ("24h", "Registro", "Em Macaé", "NBR 9077"). Sem ícones genéricos.
**Mobile:** lista vertical, rótulo grande acima do texto.

## 10 · SOBRE [N]

**Objetivo:** quem somos, onde atuamos, o que fazemos, por que existimos, em poucas linhas.
**Eyebrow:** Sobre a Evolua
**Headline (H2):** Acesso protegido desde 2017.
**Texto:** A Evolua atua com portaria remota e controle de acesso para condomínios e empresas em Macaé e região. Nosso propósito é melhorar a segurança, a convivência e a qualidade de vida de moradores e colaboradores, com tecnologia e atendimento próximo. [VALIDAR: onde mais atua]
**CTA (link):** Conheça a Evolua → `/qualidade`
**Visual:** texto à esquerda, foto da central ou da fachada à direita (slot). Sem menção ao Grupo.
**Mobile:** coluna única.

## 11 · CONTEÚDOS [N]

**Objetivo:** autoridade e aquisição orgânica.
**Eyebrow:** Conteúdos
**Headline (H2):** Respostas para quem decide sobre a portaria.
**Cards (3, dinâmicos do blog):** título, categoria e tempo de leitura. Primeiros temas planejados: *Portaria remota é segura se a internet cair?* · *Como funciona o controle de visitantes* · *Portaria remota × controle de acesso: qual a diferença?* [conteúdo a escrever]
**CTA (link):** Ver todos os conteúdos → `/blog`
**Mobile:** cartões empilhados.

## 12 · FAQ [N, com `FAQPage`]

**Objetivo:** resposta direta para pessoas e mecanismos de resposta.
**Headline (H2):** Perguntas frequentes
1. **O que é portaria remota?** É o atendimento da portaria feito por uma central de monitoramento, que recebe visitantes e entregadores pelas câmeras e interfone, consulta o morador e libera o acesso, com tudo registrado.
2. **Como funciona o reconhecimento facial?** [resposta curta a validar com a operação: quem é cadastrado, como o cadastro é feito, o que acontece quando o rosto não é reconhecido] O acesso segue as regras definidas por cada condomínio ou empresa.
3. **Como o visitante entra?** Ele aciona o atendimento, a central o identifica, pede autorização ao morador e só então libera a entrada.
4. **E se faltar energia?** A solução conta com bancos de bateria para manter portões, comunicação e sistemas de emergência funcionando, e a central acompanha a autonomia em tempo real.
5. **E se a conexão cair?** [VALIDAR a afirmação "não usamos internet" antes de publicar; resposta a reescrever]
6. **Como o morador pede ajuda em situação de risco?** Pelo botão de pânico silencioso, que aciona a central e a segurança local. [VALIDAR dispositivos atuais]
(O texto final exclui afirmações pendentes; só as respostas validadas entram no schema.)
**Visual:** acordeão semântico (`details/summary`), um aberto por padrão.
**Mobile:** largura total, alvos de 48 px.

## 13 · CTA FINAL + FORMULÁRIO [E]

**Objetivo:** converter.
**Eyebrow:** Fale com a Evolua
**Headline (H2):** Vamos entender como os acessos funcionam hoje no seu condomínio ou empresa?
**Texto:** Peça uma análise gratuita e receba um retorno de um especialista da Evolua.
**Formulário:** Nome · Condomínio/Empresa · WhatsApp · E-mail · Tipo (Condomínio | Empresa). Botão: **Quero minha análise gratuita**. Aviso de privacidade com link para `/politica-de-privacidade`. Ao enviar, a pessoa segue para a etapa do diagnóstico em `/diagnostico-acesso` (síndicos).
**Alternativa:** WhatsApp / telefone (22) 2142-6561.
**Visual:** Universo Verde com painel Petróleo para o formulário; texto petróleo sobre verde.
**UX:** `form_start` no primeiro campo; `generate_lead` apenas após resposta 2xx do endpoint; erros em linha, sem alert; foco visível.
**Mobile:** campos empilhados, teclado correto por campo (`tel`, `email`).

## 14 · FOOTER [N]

**Copy:** logo negativo · Soluções · Condomínios · Empresas · Conteúdos · Contato · Trabalhe conosco · Política de Privacidade · (22) 2142-6561 · comercial@evoluatech.com.br · Rua Vereador Senísio Vieira, 44, sala 701, Praia Campista, Macaé/RJ, 27923-100 · Instagram · Facebook · YouTube.
**Visual:** Universo Petróleo, logo negativo (colorido nunca sobre petróleo). Sem link para a Hinfoluz.

---

## Camadas Wix (resumo)

| Seção | Camada |
|---|---|
| 01, 02, 04, 09 (texto), 10, 11, 12, 14 | **Nativo** (indexável) |
| 03, 05, 06, 07, 08, 13 | **Embed HTML**, um por seção, altura automática |

## Schema da home
`LocalBusiness` (mantido, com telefone/endereço idênticos ao Google Meu Negócio), `Organization`, `WebSite`, `FAQPage` (somente com as respostas validadas), `BreadcrumbList` nas páginas internas.

## Pendências para fechar a Fase C
1. Respostas do FAQ marcadas [VALIDAR] (reconhecimento facial, conexão, pânico).
2. Funções reais do app novo e nome oficial.
3. Se a automação continua; se TAG/controle continuam.
4. Cidades a citar além de Macaé.
5. Período e fonte dos indicadores.
