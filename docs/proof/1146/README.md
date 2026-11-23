# Prova visual — #1146 (faixa de abas do feed)

Duas versões **do mesmo código**, com a diferença de apenas o `TabsList`: a `qa` (sem o conserto) e
a branch desta PR. Mesma faixa de seis abas do feed, mesma coluna de largura realista (a largura útil
de um cartão no celular: 390 px menos o padding lateral), mesmo CSS.

## Como foi gerado

1. `git archive origin/qa` → `/tmp/prova1146/antes`; `git archive <head>` → `/tmp/prova1146/depois`.
2. Para cada versão, um bundle com o `TabsList` real (`esbuild`) renderizado por `renderToStaticMarkup`
   dentro da mesma página (`/tmp/prova1146/gerar.mjs`).
3. CSS do Tailwind compilado a partir do `src/styles.css` da versão, com `@source` em `./index.html`
   e no `src` da versão — as classes que só existem na versão nova (`overflow-x-auto`,
   `scrollbar-on-hover`) são geradas a partir do próprio código novo.
4. Capturas com Playwright (Chromium headless). Em cada imagem, o retângulo com borda vermelha é a
   **área do documento** (`document.documentElement.scrollWidth`); se ele passa da borda da janela,
   a página rola para o lado.

## Medições (390 px de viewport)

| versão | `document.scrollWidth` | página rola para o lado | faixa: clientWidth | faixa: scrollWidth | `overflow-x` |
| --- | --- | --- | --- | --- | --- |
| antes | **636 px** | **sim** | 360 | 621 | `visible` |
| depois | **390 px** | não | 360 | 621 | `auto` |

Nas duas versões a faixa tem 360 px de largura; a diferença é que sem `overflow-x: auto` os botões
escapam da faixa até 636 px e levam o documento junto. Com o conserto o conteúdo fica contido e a
faixa rola internamente.

A 1280 px ambas renderizam as seis abas inteiras sem rolagem de página (não havia regressão nesse
tamanho, e continua não havendo).

## Interpretação das capturas

- `antes-390.png`: a faixa corta na borda e o documento é mais largo que a tela (borda vermelha fora
  da janela). A sexta aba empurra a página.
- `depois-390.png`: o documento termina na borda da janela e a borda vermelha aparece dentro dela;
  a faixa corta no próprio limite e rola.
- As capturas a 390 px foram tiradas em `deviceScaleFactor: 2`.
- O Chromium headless não desenha barras de rolagem finas do sistema, então a rolagem interna é provada
  por medição (`scrollWidth > clientWidth` com `overflow-x: auto`), não visualmente.
- Console limpo nos quatro cenários.

## Arquivos

Os scripts ficam fora do repositório (`/tmp/prova1146/`) por serem descartáveis; a receita acima
permite reproduzir a partir de `origin/qa` e do head desta PR.
