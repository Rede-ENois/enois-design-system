# Reconciliação local da PR #236 com QA

## Composição e limites

Verificação executada em 16/11/2026, na composição do head publicado
`a524861f86587660e679217ed2a578d54fbe3ef4` com QA canônica
`d602e27aaf0b691264ce4816faea62a06bf82a24`, por merge local, sem rebase, push ou publicação.

Foram conciliados `README.md`, `src/domain/moderation/index.ts`,
`src/messages/default-messages.ts` e `src/types/messages/messages.ts`, preservando os dois lados:
transparência de penalidades, exports administrativos, mensagens de todos os domínios e documentação
adicionados em QA. Implementação, testes, stories e contratos de `SanctionsView` permanecem iguais
aos do head publicado. Nenhum WIP de outro checkout foi incorporado.

O manifesto e o lockfile são os de QA, versão-base **0.37.5**, sem bump próprio ou caminho local.
Essa identificação no tarball não significa que a implementação reconciliada já esteja publicada.

## Gates executados

| Comando                                                                             | Resultado                                                  |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `npm run lint`                                                                      | Exit 0, nenhum erro e seis avisos de dependências de hooks |
| `npm run typecheck`                                                                 | Exit 0                                                     |
| `npm test -- --reporter=default --reporter=json --outputFile=<scratch>/tests.json`  | 2.118 testes em 231 arquivos, sem falha, pendência ou todo |
| `npm --script-shell=bash run build`                                                 | Exit 0                                                     |
| `npm run test:dist`                                                                 | Exit 0 nos quatro entrypoints                              |
| `npm run test:eslint-rules`                                                         | Exit 0                                                     |
| `node scripts/check-lint-suppressions.mjs d602e27aaf0b691264ce4816faea62a06bf82a24` | Exit 0, baseline sem crescimento                           |
| `npm run build-storybook`                                                           | Exit 0                                                     |
| `node docs/proof/moderation-transparency/verify.mjs`                                | Exit 0, nova prova descrita abaixo                         |

Os três arquivos de testes de sanções contêm 19 testes, incluídos na suíte completa acima.
Os seis avisos de lint estão em arquivos idênticos aos de QA: `game-reviews-section.tsx`,
`post-actions.tsx`, `reactions-dialog.tsx`, `healthy-usage-dialog.tsx`, `date-text-input.tsx` e
`time-text-input.tsx`. Não foram suprimidos nem tratados como erros aprovados.
O build do Storybook também avisa sobre tamanho dos chunks; nenhum controle foi flexibilizado.

A leitura do pacote compilado confirmou `SanctionsView`, `AdminProfileActionsSection`,
`AdminRemovePostAction`, `RecruitmentBoard`, `RecruitmentTable` e `NoticeModal`, além da mensagem
pública `sanctionsView.refresh`. A view não usa essa mensagem como botão no sucesso:
`onRetry` permanece restrito ao erro, desabilitado durante `refreshing`.

## Nova prova de navegador

Roteiro existente executado novamente com Playwright externo, Chrome headless e `PROOF_OUTPUT`
explícito. A tentativa inicial encontrou o caminho de Playwright anterior indisponível; a execução
válida usou outra instalação já existente no scratch, sem alterar dependências do pacote.

- 23 stories, 92 renderizações em 390/1280 px e claro/escuro padrão.
- Quatro percursos de teclado e quatro transições de prazo.
- Nenhum overflow horizontal, erro de página ou par de texto ativo abaixo de 4,5:1.
- Contraste mínimo medido nesta execução: **5,394629687883682:1**.
- Quatro capturas inspecionadas: conteúdo longo mobile e conta suspensa desktop, nos dois modos.
  Motivo sem espaços quebra linha, evidência indica corte, campo e links cabem na superfície.
  Não há botão de atualização manual no sucesso.

São stories com dados sintéticos, não E2E do aplicativo nem prova de sessão revogada. Não cobrem
todos os temas da galeria ou leitor de tela real. A prova do frontend com o novo tarball pertence
à integração coordenada do consumidor e deve ser repetida separadamente.

## Ambiente, artefatos e entrega

Node `v24.14.1`, npm `11.6.0`, Git Bash no Windows. Dependências foram copiadas fisicamente do
checkout de moderação, sem symlinks/junctions e sem caches de bundler. Isso não é `npm ci`.
Arquivos com CRLF foram normalizados somente quando os bytes resultantes coincidiam com o blob
no índice reconciliado; a árvore do índice foi preservada, sem mudar configuração Git compartilhada.

Logs completos, JSON da suíte, relatório de navegador e capturas foram gravados em
`<scratch>/moderation-conflicts/ds/`; o tarball local é gerado no mesmo diretório. Scratch tem retenção
temporária. Este documento preserva a composição e o resumo sanitizado dos resultados no Git.
O nome e o SHA-256 do tarball e o SHA do commit de merge constam no relatório de entrega ao integrador.

A integração local não publica pacote, não modifica PRs e não autoriza promoção. Publicação por
mantenedor, atualização coordenada da dependência/lockfile e instalação limpa da versão publicada
continuam pendentes, independentemente do sucesso destes gates locais.
