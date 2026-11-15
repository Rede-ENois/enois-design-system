# Preparação independente na QA atual

Medição local em 14/11/2026 (UTC-03:00), referente ao escopo da issue
`Rede-ENois/enois-design-system#245`, coordenado com `enois-backend#729` e
`enois-frontend#891`. Nenhum commit, push, PR, release ou publicação foi realizado.

## Composição

- Worktree isolado: `enois-design-system-admin-review`.
- Branch: `feat/admin-workspace-review`.
- Base consultada por `git fetch upstream`: `upstream/qa` em
  `93362943d567d9a15bbb28afa766961aac28c81c`.
- Versão preservada da base: `0.36.0-rc.1`. Manifestos, lockfile e workflows intactos.
- Origem do WIP: `enois-design-system-moderation`, HEAD
  `a524861f86587660e679217ed2a578d54fbe3ef4`.
- Portado somente o diff não commitado do painel e os arquivos novos de
  workspace, denúncias, modo compacto, tipos, mensagens, testes, stories e docs.
- `git diff --binary HEAD` aplicado por `git apply --3way`. Os cinco conflitos de
  contexto foram reconciliados preservando a base QA e acrescentando somente o
  painel. Os exports, mensagens e documentação de transparência da PR #236 não
  foram transportados. Não há commits adicionais em relação à QA.
- A implementação e a aparência aprovadas foram preservadas. Quórum e votos
  coletivos continuam distintos das ações administrativas. O DS só apresenta;
  autorização, dados, rotas e mutações continuam no consumidor/servidor.

## Gates executados nesta composição

| Gate | Resultado |
| --- | --- |
| `npm run lint` | Código 0, 0 erros e 6 avisos em arquivos não alterados |
| `npm run typecheck` | Código 0 |
| `npm test -- --reporter=default --reporter=json --outputFile=<scratch>/vitest-qa.json` | 205 arquivos, 1958 testes aprovados, 0 falhas, 0 pendentes |
| `npm --script-shell=bash run build` | Código 0, `dist/` regenerado |
| `npm run test:dist` | Código 0 |
| `npm --script-shell=bash run build-storybook` | Código 0 |
| `npm pack --ignore-scripts --json --pack-destination <scratch>/admin-ux/publicacao` | Código 0 |
| `git diff --check` | Código 0 |

As suítes do escopo têm 47 testes: workspace (6), denúncias (28) e modo de
pânico (13). O Storybook avisa sobre chunks grandes e a suíte emite avisos de
`act(...)`; os gates terminaram sem falhas. Nenhum controle foi enfraquecido.

As dependências foram copiadas fisicamente do worktree de origem para um
`node_modules` próprio, sem junction/symlink compartilhado e sem caches locais.
Não houve instalação limpa por registro nem busca de credenciais. Isso não
substitui a validação de instalação limpa pelo mantenedor/CI.

## Artefato local para integração

- Arquivo: `rede-enois-design-system-0.36.0-rc.1.tgz`.
- SHA-256: `87b5c88361810a6bb152a04cb239b8bb3d7a674528825b4801783284fb6cfc09`.
- 2577 entradas no pacote, das quais 2574 arquivos de `dist` comparados byte a
  byte com o build local, sem divergências.
- Sem arquivos de testes, stories, fixtures, caches ou `.env` no tarball.
- Imports Node confirmaram `ModeratorWorkspace`, `ReportsSection`,
  `PanicModeSection`, `NetworkNodesSection` e `NetworkProvisionTokenDialog` como
  funções. `SanctionsView`, do escopo separado #236, não está presente.
- Uma checagem auxiliar inicial usou o nome inexistente `NetworkSection` e falhou.
  O nome foi conferido no entrypoint QA e a checagem foi repetida com os exports
  reais, sem alteração de implementação para acomodar a checagem.

Logs integrais, JSON da suíte, inventário e tarball estão em
`scratch/admin-ux/publicacao/`, na raiz de trabalho que contém os worktrees.
O inventário `design-system-preparacao.json` registra o caminho absoluto, os
hashes e os resultados para o consumidor coordenado. Scratch pode ser limpo
posteriormente; este resumo permanece junto das fontes.

## Proveniência e limites

O [relatório anterior](README.md) é histórico de outra composição. Suas capturas,
contraste, testes e integração antiga não são provas desta QA. Nesta preparação
não foi repetida a inspeção visual no navegador nem instalada a biblioteca no
consumidor: essa continuação pertence ao frontend coordenado, com capturas QA e
comparações antigas identificadas por proveniência.

## Continuação no consumidor

O consumidor coordenado concluiu lint, tipos, 1443 testes em 249 arquivos e build com
este tarball. Os 2574 arquivos de `dist` instalados foram conferidos contra o pacote,
sem divergências. O navegador concluiu 54 checks, com API simulada e dados fictícios,
390px/1280px e claro/escuro; contraste mínimo inspecionado de 6,25:1. As capturas
atuais e o relatório estão em `docs/proof/painel-admin/qa/` do frontend#891.

A primeira tentativa de navegador parou após 52 checks por timeout de foco no celular;
quatro repetições focadas e a segunda rodada integral passaram sem alteração funcional.
A causa não foi estabelecida e o percurso continua a exigir revalidação antes da liberação.
O sucesso posterior não é anunciado como correção da instabilidade.

O tarball é um artefato local com WIP, não a versão publicada com o mesmo número.
A integração e o merge continuam dependentes de prova no consumidor, revisão,
publicação de uma RC pelo mantenedor e atualização coordenada da dependência e
lockfile. A instalação por tarball não comprova instalação limpa de uma RC
publicada. Nenhuma publicação está autorizada nesta tarefa.
