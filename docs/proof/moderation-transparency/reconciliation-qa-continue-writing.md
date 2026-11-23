# Reconciliação local com ContinueWriting

## Composição preservada

Em 16/11/2026, foi incorporada QA canônica
`2ab39ec66706ddefecc09f04661e3151708007a1` ao head local
`4eb2bc2cc2fae0a5d70651c9fd70a341b9dae228`, por merge, sem rebase do histórico publicado.
A referência canônica foi consultada e buscada antes dos gates. O fork continuava em
`a96578bec0aa5e5fe2f0644170c3f09aab42a9d8`; ele não foi usado como base canônica.

Os dez arquivos de ContinueWriting recebidos de QA foram preservados: view, quatro testes,
stories, tipos, exports de blog e mensagens. As duas sobreposições de mensagens foram mescladas
automaticamente, mantendo tanto `BlogDraftsMessages`/`blogDraftsMessages` quanto
`SanctionsMessages`/`sanctionsMessages`. A implementação de sanções, seus testes, stories,
contratos e exports administrativos não foram alterados. Manifesto, lockfile, estilos e
baseline de supressões continuam idênticos aos de QA. Não foi incorporado WIP do checkout original.

## Gates desta composição

| Gate                                                                                    | Resultado                                                     |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `npm run lint`                                                                          | Exit 0, sem erros, seis avisos de dependências de hooks       |
| `npm run typecheck`                                                                     | Exit 0                                                        |
| `npm test -- --reporter=default --reporter=json --outputFile=<gates-final2>/tests.json` | 2.122 testes em 232 arquivos; zero falhas, pendências ou todo |
| `npm --script-shell=bash run build`                                                     | Exit 0                                                        |
| `npm run test:dist`                                                                     | Exit 0, entrypoints compilados carregados em Node             |
| `npm run test:eslint-rules`                                                             | Exit 0                                                        |
| `node scripts/check-lint-suppressions.mjs 2ab39ec66706ddefecc09f04661e3151708007a1`     | Exit 0, baseline sem crescimento                              |
| `npm run build-storybook`                                                               | Exit 0                                                        |
| `node docs/proof/moderation-transparency/verify.mjs`                                    | Exit 0, 23 stories e 92 renderizações                         |

A suíte inclui os quatro testes novos de ContinueWriting e os 19 testes dos três arquivos de
sanções. A primeira tentativa de lint identificou somente CRLF introduzido pelo checkout dos dez
arquivos recebidos. Os bytes foram normalizados para LF após comparação exata com cada blob do
índice; a árvore do índice permaneceu igual. Toda a sequência de oito gates foi repetida depois.
A tentativa inicial foi preservada em `gates-attempt1.json` e `lint-attempt1.log`.
Não houve edição de regra, supressão, teste ou configuração para obter verde.

Os seis avisos de hooks estão em arquivos idênticos a QA: `game-reviews-section.tsx`,
`post-actions.tsx`, `reactions-dialog.tsx`, `healthy-usage-dialog.tsx`, `date-text-input.tsx` e
`time-text-input.tsx`. O Storybook também avisa sobre tamanho de chunks.

## Navegador e limites

O roteiro de sanções foi executado novamente no build estático final, em Chrome headless com
Playwright externo, usando dados sintéticos e `PROOF_OUTPUT` explícito:

- 390/1280 px, claro/escuro padrão: 23 stories, 92 renderizações.
- Quatro percursos de teclado e quatro transições de prazo.
- Zero erros de página, overflow horizontal ou pares de texto ativo abaixo de 4,5:1.
- Contraste mínimo medido: **5,394629687883682:1**.
- Quatro capturas novas inspecionadas: conteúdo longo mobile e conta suspensa desktop, nos dois modos.
  Texto sem espaços quebra linha, evidência informa corte, formulário cabe e não há atualização
  manual no sucesso.

Isso é prova de Storybook, não E2E do aplicativo, prova de sessão revogada, inspeção de todos os temas
ou leitor de tela real. A revisão de preservação e o scan estático são locais; revisão independente
e validação do consumidor permanecem com o integrador. Nenhum outro repositório foi testado.

## Artefato e proveniência

Os scripts e relatórios antigos, inclusive `delivery.json` e `gates-final`, permanecem históricos.
Os novos resultados ficam em `<scratch>/moderation-conflicts/ds/gates-final2/` e `delivery-final2.json`.
Antes de substituir o tarball de mesmo nome, o pacote anterior e seu manifesto foram arquivados com
seu SHA. O pacote novo foi gerado por `npm pack --json`, com versão-base **0.37.5**, sem publicação.
A identidade exata está no SHA-256, não somente no número de versão compartilhado com o anterior.
A entrega pós-commit verifica todos os arquivos do tarball contra o checkout e registra hashes de
fontes, pacote e manifestos. Uma cópia durável fica em `artifacts/moderation-conflicts/ds-final2/` no
workspace do integrador; os logs brutos em scratch têm retenção temporária.

Dependências físicas independentes já preparadas foram reutilizadas, sem nova cópia ou alteração
do `node_modules` original. Isso não equivale a `npm ci`. Não houve push, alteração de PR, tag,
publicação ou promoção. O frontend ainda deve incorporar sua QA e instalar o tarball exato para
provar ContinueWriting e sanções juntos. Publicação por mantenedor e instalação limpa da versão
publicada continuam sendo etapas separadas.
