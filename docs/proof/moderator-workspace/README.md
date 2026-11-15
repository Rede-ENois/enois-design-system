# Evidência histórica do painel de moderação

> Histórico da composição anterior: os resultados, contagens, capturas e tarball
> abaixo pertencem ao worktree `enois-design-system-moderation`, baseado em
> `a524861f86587660e679217ed2a578d54fbe3ef4` com WIP. Essa composição incluía
> transparência de penalidades da PR #236, que não integra esta preparação.
> Não são provas da branch `feat/admin-workspace-review` na QA atual.
> A medição independente da nova composição está em [preparacao-qa.md](preparacao-qa.md).

Verificação local histórica realizada em 14/11/2026, sem publicação, alteração de versão ou
modificação do consumidor frontend naquela primeira rodada.

## Gates da árvore implementada

| Comando                                       | Resultado                                            |
| --------------------------------------------- | ---------------------------------------------------- |
| `npm run lint`                                | Sucesso: 0 erros, 6 avisos em arquivos não alterados |
| `npm run typecheck`                           | Sucesso                                              |
| `npm test`                                    | 201 arquivos, 1909 testes aprovados                  |
| `npm --script-shell=bash run build`           | Sucesso, `dist/` regenerado                          |
| `npm run test:dist`                           | Sucesso nos entrypoints raiz, ui, patterns e domain  |
| `npm --script-shell=bash run build-storybook` | Sucesso, `storybook-static/` gerado                  |
| `git diff --check`                            | Sucesso                                              |

As duas novas suítes têm 25 testes: 19 em `reports-section.test.tsx` e 6 em
`moderator-workspace.test.tsx`. Nenhum teste anterior foi removido ou enfraquecido.
A suíte completa ainda emite avisos de `act(...)` em testes não alterados. O build
do Storybook avisa sobre chunks grandes; concluiu com código de saída 0.

Foram observados ciclos vermelho/verde reais para:

- Mudança de `canPenalize` com a confirmação aberta: o botão permanecia habilitado;
  o teste falhou com `expected false to be true`. A view agora revalida a capacidade
  atual antes de confirmar, além da autorização e existência do registro.
- Navegação sem grupos: o estado não tinha anúncio acessível e ficava no bloco
  exclusivo de desktop; o teste falhou com `expected undefined to be
'Nenhuma área encontrada.'`. O estado agora é visível nos dois layouts e usa
  `role="status"`.

A cobertura inicial foi executada sobre as views implementadas. Não há prova
vermelho/verde para todos os comportamentos anteriores; os ciclos comprovados
estão discriminados acima e nas regressões abaixo.

## Navegador real

Chromium executou as 15 stories novas em 390px e 1280px, nos modos claro e escuro
do tema padrão. Incluindo o diálogo com erro, foram 64 inspeções renderizadas:

- Nenhum overflow horizontal de documento.
- Nenhum erro JavaScript de página.
- Contraste mínimo medido nos textos inspecionados: **5,39:1**.
- Navegação por botão e seletor com grupos, busca, foco por teclado, filtros
  combinados e limpeza de vazio, cancelamento, bloqueio pendente, sucesso com
  remoção do cartão e foco no título, falha dentro do diálogo exercitados.
- Capturas de workspace e confirmação em ambos os tamanhos/modos foram produzidas;
  a inspeção visual confirmou separação de voto coletivo e ação administrativa,
  controles completos e erro legível na confirmação móvel.

A prova usa o Storybook estático e dados sintéticos. Não comprova integração com
API real, autorização do servidor nem todas as paletas da galeria. O consumidor
real é responsabilidade da integração coordenada no frontend.

## Artefato local

`npm pack --ignore-scripts --json --pack-destination <diretório-de-prova>` gerou
`rede-enois-design-system-0.34.1.tgz`, mantendo a versão existente. A listagem do
pacote confirmou ausência de arquivos de teste, story ou fixture. Os dois exports
novos foram importados diretamente de `dist/domain/index.js` no Node e ambos
retornaram `function`.

Logs integrais, `report.json`, capturas e tarball ficam no diretório local de prova
informado no relatório de entrega. Nenhum servidor ou teste ficou pendente.

## Continuação da integração em 14/11/2026

Após a rodada acima, a apresentação compacta de `PanicModeSection` recebeu estados
explícitos de consulta pendente/erro, retry e bloqueio de confirmação com estado
incerto. Dois casos novos reproduziram falha antes da correção; a suíte focada passou
com 13 testes. `ReportsSection.actionError` tornou-se opcional para que o consumidor
não transporte o erro de uma mutação anterior para uma nova confirmação.

Na árvore corrigida, a cadeia `lint`, `typecheck`, `test`, `build`, `test:dist`,
`pack` e `build-storybook` voltou a terminar com código 0. Os números da primeira
tabela são históricos daquela rodada, não a contagem da suíte ampliada.

O tarball final foi instalado localmente no consumidor sem modificar manifesto ou
lockfile. A comparação de 2558 arquivos de `dist` entre pacote e instalação não
mostrou divergências. O frontend passou seus gates com 1450 testes, zero falhas ou
testes pendentes. Sua prova de navegador final registrou 54 checks, 28 inspeções
renderizadas em 390px/1280px e claro/escuro, sem overflow ou erros inesperados;
contraste mínimo dos textos inspecionados de 6,25:1. API simulada e dados fictícios,
não integração com backend real. Quatro capturas e o relatório estruturado ficam em
`docs/proof/painel-admin/` do frontend coordenado.

A publicação do DS e a atualização coordenada da dependência continuam pendentes;
a instalação por tarball não prova instalação limpa pela versão publicada.
