# #553 — cabeçalho estoura a largura a 320px

Medido no Storybook do design system (story `Domain/Shell › AuthenticatedHeaderPhone`), com
Chrome headless em 320×700, 390×844 e 1280×900.

O botão do menu da conta tinha `pr-3` em todas as larguras, mas abaixo de `sm` o rótulo some e o
botão é só o avatar: o respiro da direita empurrava o fim da linha para fora da tela.

| Largura | Antes (`pr-3`) | Depois (`pr-0 sm:pr-3`) |
| --- | --- | --- |
| 320 | documento 331px, avatar cortado | documento 320px, avatar inteiro |
| 390 | cabe no lugar (avatar 12px mais à direita) | cabe, com o avatar 12px mais à esquerda |
| 1280 | igual | igual (rótulo volta, respiro de 12px mantido) |

- `antes-320.png` — a classe antiga aplicada na árvore viva (só o `pr-3`), para registrar o defeito.
- `depois-320.png` — o conserto: `scrollWidth` 320 e o círculo do avatar inteiro dentro da tela.
- `depois-390.png`, `depois-1280.png` — sem regressão nas outras larguras.

O decorator global do Storybook aplica `p-6` na moldura; a medida foi tirada com essa folga
zerada, que é como o app monta o cabeçalho.
