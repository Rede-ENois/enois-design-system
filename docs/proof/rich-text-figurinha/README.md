# Prova visual — figurinha inline (#388)

## Como foi gerada

Não é montagem: a página de prova carrega o **CSS real** de `src/styles.css` desta branch (o bloco
`.enois-figurinha` é extraído do arquivo, não recopado) e renderiza o **HTML que o `RichText`
produz** para a figurinha: um `<img alt="figurinha">` com a classe recebida.

- lado **esquerdo** (Antes): o desenho que o código aplicava antes desta PR — o `<img>` com as
  classes de mídia direta (`my-1 max-h-80 rounded-xl border border-border-soft object-contain`),
  que é o ramo que a figurinha caía;
- lado **direito** (Agora): o `<img>` com `class="enois-figurinha"`, desenhado pela regra nova.

Gerador: `scripts/prova-388.mjs` (roda `node scripts/prova-388.mjs`). Captura:
`google-chrome --headless --window-size=<largura>,<altura> --screenshot=…`.

Recortes: `figurinha-1280.png` (desktop) e `figurinha-390.png` (celular), com o console limpo —
a página não tem script.

## O que a imagem mostra

| | Antes (mídia direta) | Agora (`.enois-figurinha`) |
|---|---|---|
| No meio da frase | vira bloco: a figurinha sobe para a linha de cima, com moldura e cantos, e o texto recomeça embaixo | fica **na linha**, alinhada pelo meio, sem moldura |
| Parágrafo só com a figurinha | bloco de mais de 300 px de altura | 3em, proporcional à fonte |
| 390 px | a imagem ocupa quase toda a largura | cabe na linha, sem overflow horizontal |

A frase de teste é longa de propósito: é ela que revela a quebra de linha causada pelo bloco.

## Por que `em` e não pixel

`.enois-figurinha` mede `1.75em` de lado, então acompanha o tamanho da fonte de onde está: a mesma
classe desenha igual em publicação, comentário e mensagem, sem uma captura por tela. O recorte
`p:has(> .enois-figurinha:only-child)` dá `3em` quando a figurinha é o parágrafo inteiro — é o caso
de quem manda só o emote.