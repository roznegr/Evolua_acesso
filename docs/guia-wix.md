# Guia Wix: o que fazer e o que eu consigo fazer

## 1. Eu consigo editar o Wix pelo navegador?

Testei: este ambiente alcança `wix.com`, `users.wix.com`, `manage.wix.com` e `editor.wix.com`, e tem Chromium e Playwright. Mesmo assim, **não recomendo nem vou fazer o login pelo navegador**:

- O login pede senha e, normalmente, verificação em duas etapas. Eu não devo receber sua senha no chat, e a sessão é remota e não interativa: você não consegue "assumir" o navegador dela para digitar o código.
- O Editor do Wix é uma interface de arrastar e soltar. Automatizá-la é frágil (um clique errado pode alterar ou apagar uma página publicada, e o site está no ar), e eu não consigo conferir o resultado visual com a segurança que uma publicação pede.

**O que eu consigo fazer com segurança:**

| Tarefa | Como | Preciso de |
|---|---|---|
| Gerar todos os blocos HTML (um por seção) já prontos para colar | arquivos em `embed/` no repositório | nada |
| Textos, títulos, meta, schema JSON-LD, FAQ, redirecionamentos | documento por página, pronto para copiar e colar | nada |
| Criar rascunhos de posts no Blog Wix | API do Wix | uma **chave de API** (ver abaixo) |
| Receber leads (formulário) | função Velo/webhook do repositório | você cria a coleção e cola o código |
| Conferir o site depois de publicado (títulos, H1, links, schema, performance) | `curl`/Playwright, só leitura | nada |

**Chave de API (se quiser que eu crie rascunhos de blog):** no Wix, *Configurações da conta → Chaves de API*, crie uma chave só com permissão de Blog. **Não cole a chave no chat.** Cadastre-a como segredo do ambiente (menu do ambiente na barra da sessão → Edit → variáveis/segredos). Posts ficam como **rascunho**; você publica.

## 2. O que você faz no Wix (roteiro)

Faça em um **site duplicado ou página em rascunho** antes de mexer no que está no ar (*Painel → Configurações → Duplicar site*).

1. **Backup:** exporte a lista de páginas e SEO (*Marketing e SEO → Ferramentas de SEO → Redirecionamentos* e os títulos atuais já estão salvos em `docs/fase-a-discovery.md`). Anote a versão publicada atual.
2. **Design global:** *Design do site → Cores e texto*: cadastre as cores do Design System (`#7BBE00`, `#0B3954`, `#3A3A3A`, `#EFFADB`, `#FFFFFF`) e as fontes **Baloo 2** (títulos) e **Nunito Sans** (texto).
3. **Header:** deixe com 6 itens + botão "Evolua a sua portaria"; fixo ao rolar (*Configurações do cabeçalho → Fixo*); retire "Login", "Inquiry Services Page", "Nossos Indicadores", "Trabalhe conosco".
4. **Footer:** simplifique conforme a Fase B.
5. **Para cada seção em HTML:** *Adicionar → Incorporar código → Código HTML* (largura total) → colar o conteúdo do arquivo de `embed/` → ajustar altura inicial; os blocos redimensionam sozinhos pela ponte `postMessage`.
6. **Texto nativo (o que ranqueia):** H1, parágrafo de resposta e FAQ como elementos de texto do Wix, com o título correto (H1/H2/H3 em *Editar texto → Tag de título*).
7. **SEO por página:** *Marketing e SEO → Ferramentas de SEO → Páginas*: title, description, URL; *Marcação estruturada*: colar o JSON-LD do documento da página.
8. **Redirecionamento 301:** `/inquiry-services-page` → `/contato` (*Ferramentas de SEO → Redirecionamentos*).
9. **GTM/Ads:** nada a mudar; só conferir que o botão de WhatsApp continua disparando a conversão.
10. **Publicar, testar no celular, e me avisar:** eu confiro título, H1, schema, links e peso das páginas publicadas.

## 3. Ordem sugerida de entrega

Home → Condomínios → Empresas → Soluções (hub) → páginas de solução → páginas locais → blog.
