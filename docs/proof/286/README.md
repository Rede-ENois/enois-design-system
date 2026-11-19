# Anexos mistos na grade de mídia

Storybook do DS (`Domain/Post` → `MixedCommentMedia`), Chrome headless, 720 px, DPR 1.
A story renderiza `MediaGrid` com `[imagem, áudio, imagem]`.

|        | Players de áudio | Fonte do player           | Imagens |
| ------ | ---------------- | ------------------------- | ------- |
| Antes  | 1                | `tree-03.webp` (a imagem) | 0       |
| Depois | 1                | `t-rex-roar.mp3`          | 2       |

- `antes-720.png` — um único player, apontando para a imagem; os outros anexos somem.
- `depois-720.png` — imagem, player e imagem, na ordem de envio.
