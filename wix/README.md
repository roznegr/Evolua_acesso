# Publicar no Wix (evoluatech.com.br)

O Wix não executa um projeto Vite diretamente. Por isso `npm run build` gera **um único arquivo**
(`dist/index.html`, ~145 KB, logo incluído, com CSS e JS embutidos). Duas formas de publicar:

## Opção A (recomendada) — Incorporar código HTML
1. `npm ci && npm run build`. Abra o HTML gerado e preencha o bloco `window.EVOLUA_CONFIG` (endpoint do lead, WhatsApp,
   política de privacidade). Alternativa: variáveis `VITE_*` em `.env.production` antes do build.
2. No Wix Editor, crie a página da LP, adicione **Incorporar → Código HTML** (largura total da página).
3. Cole o conteúdo de `dist/index.html`. Ajuste a altura do elemento (referência: ~1100 px desktop /
   ~1400 px mobile; o conteúdo rola dentro do elemento se passar disso). Ajuste fino no editor.
4. Para atualizar a LP: novo build e colar de novo.

**SEO:** o conteúdo dentro de um iframe do Wix não é indexado como parte da página. Replique no próprio Wix
o `<title>`, a meta description, o H1 e um parágrafo de texto (Configurações de SEO da página). O HTML do
build já traz title, meta, canonical e JSON-LD para o caso de hospedagem estática direta.

## Opção B — hospedar o arquivo fora e incorporar por URL
Hospede `dist/` (Cloudflare Pages, Netlify, GitHub Pages…) num subdomínio (ex.: `diagnostico.evoluatech.com.br`)
e use **Incorporar → Site** apontando para ele. Mesma ponte de analytics e mesmo endpoint.

## Receber os leads (`VITE_LEAD_ENDPOINT`)
- **Velo:** habilite o modo desenvolvedor, crie a coleção `Leads` e use `wix/velo/http-functions.js`
  (referência não testada). A URL fica `https://www.evoluatech.com.br/_functions/lead`.
- **Alternativa:** qualquer webhook (Make, Zapier, n8n…) que aceite POST e responda 2xx.
O front envia dois tipos: `lead` (envio do formulário) e `lead_update` (resposta de timing, sem PII).
O `generate_lead` só é disparado após resposta 2xx.

## Resultado por e-mail (rozana.negreiros@evoluatech.com.br)
O endereço fica só no Wix (nunca no código do site). Sem programar:
1. No Wix → Automações → Nova automação: gatilho **"Novo item adicionado à coleção Leads"**.
2. Ação **Enviar e-mail** para `rozana.negreiros@evoluatech.com.br`.
3. No corpo, insira os campos do item: `name`, `whatsapp`, `email`, `condominium`, `city`, `routing` e
   **`salesSummary`** (já traz papel, estrutura atual, preocupações, nível das 4 dimensões e prioridade).
4. Opcional: segunda automação para `lead_update` (timing) ao alterar o campo `timing` do item.
O JSON completo (todas as respostas e scores) fica no campo `payload` da coleção.

## GA4 / GTM
- Instale o GTM no Wix (Marketing → Integrações) e cole `wix/parent-bridge.js` em
  Configurações → Custom Code (Body – end). Ele recebe os eventos do iframe e os coloca no `dataLayer`.
- No GTM, crie gatilhos de Evento personalizado para cada nome (`assessment_start`, `generate_lead`…) e tags GA4 de evento.
  Registre `primary_gap`, `unit_range`, `user_role`, `main_pain` como dimensões personalizadas.
- Nenhum evento contém nome, telefone, e-mail, condomínio ou cidade (garantido por allowlist em `src/lib/analytics.js`).

## Pendências para você definir
- `VITE_WHATSAPP_NUMBER` (sem ele, o botão de WhatsApp não aparece).
- `VITE_LEAD_ENDPOINT` (sem ele, em produção o formulário mostra erro de envio).
- URL da política de privacidade (`VITE_PRIVACY_URL`) e revisão jurídica do aviso de consentimento (LGPD).
