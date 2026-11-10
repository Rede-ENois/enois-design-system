# Compositor de comentários a 390 px

Storybook do DS (`Domain/Post` → `Comments`), Chrome headless, DPR 1.

| | Campo de escrita | Botão de enviar |
|---|---|---|
| Antes | 208 px | 36×36 na mesma linha, à direita |
| Depois | 250 px | 310×36 na linha de baixo |

A 1280 px nada muda: campo de 474 px e enviar de 36×36 ao lado dele.

- `antes-390.png` — `+`, campo e enviar dividindo a linha.
- `depois-390.png` — campo com a largura da linha; enviar abaixo, de largura inteira.
- `depois-1280.png` — desktop inalterado.
