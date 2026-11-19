# Provas da navegação pelas citações

Escopo: views do design system e Storybook com mensagens fictícias. A integração,
a decifragem e a busca da original pertencem ao consumidor, cuja validação é separada.

## Contrato

- `MessageBubbleProps.onReplyQuoteClick?: () => void`: botão nativo com nome acessível,
  propagação do clique interrompida e ativação por Enter/Espaço. Sem callback, não há botão.
- O modo de seleção mantém a citação não interativa e deixa o clique selecionar o balão.
- `message.id?: string` expõe `message-{id}` na raiz, com `tabIndex={-1}`.
- `ConversationThreadProps.messagesScrollRef?: Ref<HTMLDivElement>` expõe o quadro
  de rolagem real, com suporte a objeto ref e limpeza de callback ref.
- `suppressAutoScroll?: boolean` consome IDs recentes sem rolar; encerrar a suspensão
  não reproduz uma rolagem atrasada.

## Composição atual sobre QA

A correção foi portada somente pelo delta WIP, sem os commits da feature antiga,
para a base oficial `93362943d567d9a15bbb28afa766961aac28c81c` de QA,
na branch local `fix/private-message-replies-qa`. A versão atual
`0.36.0-rc.1` foi preservada, sem bump, commit, push, tag ou publicação.

Ambiente: Windows 11, Node `v24.14.1`. As dependências foram copiadas fisicamente
do checkout de origem, sem junction, symlink ou caches `.vite`, `.vite-temp` e
`.vitest-cache`. Isso não equivale a uma instalação limpa pelo lockfile atual.
Os finais de linha introduzidos por `git apply` foram normalizados para LF somente
nos arquivos portados, sem reformatar a base QA.

Na composição atual passaram `npm run lint` (0 erros e 6 avisos de hooks),
`npm run typecheck`, `npm test` (1918 testes em 203 arquivos, sem falhas ou skips),
`npm --script-shell=bash run build`, `npm run test:dist` (quatro entrypoints)
e `npm run build-storybook` (aviso de chunks acima de 500 kB).

Os logs, os totais estruturados e o pacote desta composição são registrados em
`artifacts/message-replies/continuacao-qa/design-system-resultados.json`, fora do
repositório. As provas históricas abaixo não validam esta nova composição.
A inspeção de navegador não foi repetida nesta etapa; a prova no consumidor
com o novo tarball permanece na tarefa de integração.

## Evidência histórica da origem

Esta seção descreve a execução anterior no checkout de origem,
HEAD `a96578bec0aa5e5fe2f0644170c3f09aab42a9d8`, com a versão histórica
`0.33.0-rc.1`. Os números não são resultados da base QA atual.

Na origem passaram lint (0 erros e 6 avisos de hooks), typecheck,
1864 testes em 195 arquivos (sem falhas ou skips), build de produção,
os quatro entrypoints de `test:dist` e `build-storybook`, com aviso de chunk grande.
Não houve commit, push ou publicação nessa execução.

O relato de TDD da origem registrou ausência do botão de citação, alvo DOM e
scroll ref, além de rolagem indevida durante suspensão antes da implementação.
Os testes focados cobrem callback opcional, seleção, propagação, alvo de foco,
suspensão de rolagem, retomada e manutenção do ID mais recente.

A prova histórica de navegador passou duas vezes com servidor estático Node:
Chrome `157.0.8103.52`, larguras 390 e 1280, modos claro/escuro padrão e ambos os lados.
Cobriu mouse, Enter/Espaço, Tab/Shift+Tab, seleção, callback opcional, texto longo,
ausência de overflow horizontal e foco na original da story `Thread`, sem page errors.

O contraste histórico calculado com composição alfa foi de pelo menos 4.536:1
para texto e 5.395:1 para outline de 2px. A citação própria usa o token foreground
existente sem a antiga opacidade de 80%, sem alteração de paleta ou tokens.
Outros temas da galeria não foram inspecionados visualmente nessa prova.

## Reprodução da prova de navegador

Compile o Storybook, crie um diretório de saída e execute:

```bash
PLAYWRIGHT_MODULE="<caminho absoluto para playwright instalado>" \
BROWSER_EXECUTABLE="<executável Chrome/Chromium>" \
PROOF_DIR="<diretório de artefatos existente>" \
node docs/proof/message-replies/verify.mjs
```

O harness serve `storybook-static` em porta localhost efêmera e fecha seu navegador
e servidor. Playwright é dependência externa de prova, não adicionada ao pacote.
Grava `ds-browser-results.json` e capturas em `PROOF_DIR`.
O servidor Python anterior apresentou falhas intermitentes no carregamento de módulos;
o servidor Node removeu essa falha de preparação nas duas execuções históricas medidas.
