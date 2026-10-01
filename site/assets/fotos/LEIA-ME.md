# Fotos do site

Coloque aqui as fotos aprovadas, com estes nomes (webp, jpg ou png). O build converte, reduz e incorpora sozinho.

| Arquivo | Onde aparece | Observação |
|---|---|---|
| `hero.*` | Hero da home e seção de reconhecimento facial | Imagem ilustrativa; a foto atual já traz a camada de reconhecimento facial e o cartão "Autorizado" |
| `central.*` | Portaria remota, Sobre e seção da central | Imagem ilustrativa até haver foto real da central da Evolua |

Sem o arquivo, o site mostra um espaço reservado com a descrição da foto.

## Situação atual (01/10)

- `hero.webp`: foto do rosto com a camada de reconhecimento facial, **cortada** para retirar o cartão "Autorizado" com nome de pessoa. Imagem ilustrativa. No hero da home ela ocupa a lateral direita e dissolve no fundo, sem moldura; o fundo do hero usa as cores de borda da foto (`--foto-topo`, `--foto-meio`, `--foto-base` em `tokens.css`). Ao trocar a foto, ajuste essas três cores.
- `central.webp`: central de atendimento. Imagem ilustrativa; trocar por foto real da central da Evolua quando houver.
