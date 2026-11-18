# Falha de envio no recorte de imagem

Storybook do DS (`Patterns/Editor` → `ImageCropUploadError`), Chrome headless, DPR 1.
A story abre o `ImageCropDialog` com um `onCropComplete` que rejeita. Capturas de página inteira,
depois de clicar em Salvar.

|        | Recorte | Salvar       | Aviso                                              |
| ------ | ------- | ------------ | -------------------------------------------------- |
| Antes  | some    | desabilitado | imagem incompatível                                |
| Depois | mantido | habilitado   | Não foi possível enviar a imagem. Tente novamente. |

Medido em cada captura (`role="alert"` presente, recorte presente, Salvar habilitado):

| Viewport | Tema   | Salvar (px) | Overflow horizontal | Contraste do aviso | Console |
| -------- | ------ | ----------- | ------------------- | ------------------ | ------- |
| 1280×900 | claro  | 226×38      | não                 | 6,00:1             | limpo   |
| 390×844  | claro  | 149×38      | não                 | 6,00:1             | limpo   |
| 1280×900 | escuro | 226×38      | não                 | 6,93:1             | limpo   |
| 390×844  | escuro | 149×38      | não                 | 6,93:1             | limpo   |

O contraste compara a cor computada do aviso (`text-muted-foreground`) com o fundo do diálogo:
`rgb(91, 93, 105)` sobre `rgb(247, 244, 251)` no claro e `rgb(156, 157, 171)` sobre
`rgb(21, 17, 28)` no escuro.

- `depois-1280-light.png`, `depois-1280-dark.png` — desktop.
- `depois-390-light.png`, `depois-390-dark.png` — mobile; o aviso quebra em duas linhas.
