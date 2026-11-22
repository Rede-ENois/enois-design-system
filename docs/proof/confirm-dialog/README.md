# Prova visual — ConfirmDialog (#387)

## Como foi gerada

A página é montada por `scripts/prova-387.mjs`, que reproduz **a árvore que o componente desenha**
— overlay e conteúdo com as classes de `src/ui/dialog.tsx`, o alerta e o rodapé de
`src/ui/confirm-dialog.tsx` — e a desenha com o **CSS compilado do próprio design system**
(o `styles.css` do build do Storybook, que é o Tailwind do DS, não uma cópia à mão).

O CSS é real (build do Storybook), mas a **árvore HTML é uma cópia** das classes de
`dialog.tsx`/`confirm-dialog.tsx`. Se um dos dois mudar de classe, esta prova continua mostrando o
desenho antigo sem avisar: atualize o script junto com o componente. O script escreve as páginas
neste diretório (`prova-387-*.html`), não na raiz do repositório.

Captura: `google-chrome --headless --window-size=<largura>,<altura> --screenshot=…`. Console
limpo (a página não tem script). As larguras são as do gate: 1280 px e 390 px.

## Estados

| arquivo                                          | estado                                                               |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| `confirm-1280.png` / `confirm-390.png`           | diálogo normal, ação destrutiva                                      |
| `indisponivel-1280.png` / `indisponivel-390.png` | `disabled` + `error`: o confirmar nasce bloqueado e o motivo aparece |
| `erroLongo-1280.png` / `erroLongo-390.png`       | descrição e erro longos: é o caso que estourava a largura            |

## O que as imagens mostram

- **390 px:** o rodapé empilha (Cancelar embaixo, Excluir em cima) e o diálogo cabe com a margem de
  1rem de cada lado (`w-[calc(100vw-2rem)]`). Nada de overflow horizontal.
- **Erro longo:** descrição e mensagem quebram dentro do diálogo (`break-words` na descrição e no
  texto do alerta). Antes da mudança, uma mensagem de API sem espaços empurrava o `DialogContent`.
- **`disabled`:** o botão sai esmaecido e não recebe clique (`disabled:opacity-50`), e continua
  bloqueado mesmo quando `pending` volta a falso — as duas props são um OR no mesmo botão.
- **Cor do erro:** texto normal (`text-text-strong`), não vermelho. Quem já está no fluxo de uma ação
  destrutiva não precisa de mais um sinal de perigo para uma frase de validação; o vermelho fica nas
  ações do rodapé, onde ele significa "isto apaga".

## Por que o erro vazio não aparece

`{error ? … : null}` com `error = ""` renderizaria um `<p role="alert">` vazio. Leitor de tela
anuncia um alerta sem texto e a leitura fica sem o "o quê". Vazio (ausente, `null` ou `""`) não
desenha nada — há teste para os três casos (`confirm-dialog.test.tsx`).
