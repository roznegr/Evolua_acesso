# Arquitetura — LP Evolua (diagnóstico guiado)

Projeto novo (repositório estava vazio): Vite + JavaScript puro (ES modules), sem framework — a LP é uma
página única e o fluxo é uma máquina de estados pequena; evita peso e dependências dentro do Wix.

```
index.html              LP estática (hero, como funciona, FAQ, SEO/JSON-LD) + ponto de montagem #assessment
src/data/questions      perguntas e opções (+ pergunta de timing pós-captura)
src/data/scoring        pesos, limiares, desempate, afinidade dor→dimensão, qualificação comercial
src/data/results        todos os textos (níveis, dimensões, dores, papéis, insights, checklist, disclaimer)
src/engine              diagnosis (motor), qualification (comercial), report (modelo p/ PDF), payload, economy
src/config              site.js (endpoint, WhatsApp, GTM), economy.js (enabled=false)
src/lib                 analytics (dataLayer + sanitização PII), leadClient, storage, validate
src/ui                  app.js (estados: intro→pergunta→processando→pré-resultado→form→resultado), printReport
wix/                    guia, ponte GTM (postMessage) e função Velo de referência
tests/                  node --test (motor, copy, analytics/PII, envio, economia)
```

Decisões principais
- Diagnóstico e qualificação comercial são motores independentes; dor/papel/porte nunca alteram `scores`.
- Dimensões: nível por percentual normalizado (<40 atenção, 40–69 melhoria, ≥70 estruturado); o número nunca é exibido.
- Pré-resultado mostra os 4 níveis; detalhes só após a captura. Timing é perguntado após a captura (`lead_update`).
- Relatório: `buildReport()` gera um modelo neutro; hoje renderizado como HTML imprimível, no futuro alimenta PDF.
- Economia: `economyCalculator.enabled=false`, valores `null`; mesmo habilitada permanece off enquanto houver `null`.
