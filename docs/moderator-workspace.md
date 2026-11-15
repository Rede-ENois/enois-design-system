# Painel de moderação: composição e denúncias

As views `ModeratorWorkspace` e `ReportsSection` estão disponíveis no entrypoint
`@rede-enois/design-system/domain`, com seus contratos públicos. Não acessam rede,
rotas, autenticação ou stores. O consumidor mantém essas responsabilidades.

## `ModeratorWorkspace`

```tsx
<ModeratorWorkspace groups={groups} activeTab={activeTab} onTabChange={setActiveTab}>
  {conteudoDaAreaAtiva}
</ModeratorWorkspace>
```

- `groups: ModeratorWorkspaceGroup[]`, com `{ id, label, tabs: { id, label }[] }`.
- `activeTab: string` e `onTabChange(tab: string): void` formam uma seleção controlada.
- `children: ReactNode` contém a área ativa. O DS não mantém cache nem monta rotas.
- IDs de grupos e destinos devem ser únicos e estáveis.
- Em telas grandes, a navegação é uma coluna compacta com grupos visíveis. Em telas
  menores, um `select` rotulado mantém os grupos em `optgroup`, sem faixa horizontal.
- A busca local encontra nomes de áreas e grupos, anuncia a contagem ou ausência de
  resultados e oferece limpeza. Não muda a área ativa até a seleção de um destino.

## `ReportsSection`

```tsx
<ReportsSection
  reports={reports}
  admin={admin}
  loading={loading}
  error={error}
  pending={pending}
  actionError={actionError}
  onRetry={onRetry}
  onVote={onVote}
  onAdminAction={onAdminAction}
/>
```

`ModerationReportData` contém `reportId`, `reason`, `targetType`, `reporter`,
`author: string | null`, `canPenalize: boolean`, `content: string | null`,
`description: string | null`, `createdAtLabel`, `punishVotes`, `dismissVotes`,
`quorum`, `myVote: 'PUNISH' | 'DISMISS' | null` e `reviewHref`.
As demais propriedades textuais são `string`; contagens são `number`.

- `onVote(reportId, vote): void` solicita um voto coletivo, sem alterar o quórum.
- `onAdminAction(reportId, action): Promise<boolean>` recebe `ReportAdminAction`,
  união de `'penalize' | 'warn' | 'remove' | 'remove-company'`.
- Todas as ações administrativas exigem confirmação com alvo, responsável e
  referência da denúncia. Cancelar não chama o callback. `true` fecha o diálogo;
  `false` ou uma Promise rejeitada mantém o contexto e mostra erro dentro dele.
- `actionError?` permite erro controlado, junto à fila e à confirmação aberta. É opcional:
  a view já mantém a falha da tentativa atual a partir do resultado de `onAdminAction`.
  Não transportar o erro de uma mutação anterior para outra denúncia ou ação.
- `pending` deve cobrir a mutação e a atualização subsequente da fila. Bloqueia
  votos e ações em todos os cartões. A view também bloqueia envios repetidos
  enquanto aguarda a Promise administrativa, mesmo antes da próxima renderização.
- `admin` só controla apresentação. O servidor continua responsável por autorização.
  Perder permissão, elegibilidade ou o registro enquanto o diálogo está aberto
  impede confirmar uma ação obsoleta.
- `canPenalize` vem do container, derivado dos tipos suportados e da presença de
  autor identificável. Não inferir essa capacidade pelo rótulo `author`.
  `COMPANY` nunca oferece punição direta, mesmo com a flag verdadeira.
- A confirmação de punição explica a restrição da conta e a remoção de publicação
  ou comentário do feed quando aplicável. Não promete banimento, prazo ou duração.
- A remoção de publicação é oferecida para `POST`; `COMPANY` oferece remoção da
  empresa. A advertência mantém o contrato já existente do consumidor.
- Revisão administrativa usa `AppLink` com `reviewHref`, sem construir URLs no DS.
- Motivo, tipo de alvo e busca são combináveis, com contagem do recorte e limpeza
  do vazio filtrado. Carregamento, erro com retry e fila vazia são estados distintos.
- Cancelar, fechar ou pressionar Escape na confirmação devolve explicitamente o
  foco ao botão de origem conectado e habilitado. Sem origem utilizável, usa o
  título estável da fila; não depende de `DialogTrigger` do Radix.
- Votos também registram a origem antes de chamar `onVote` uma única vez. Se o
  callback ou a atualização posterior remove o cartão, o foco vai ao título
  estável quando estava perdido no documento. Não dispara mutação ou retry extra.
- Após sucesso administrativo, a mesma recuperação acompanha a remoção do cartão.
  Nos dois fluxos, se a pessoa moveu o foco para outro controle, a view não o rouba.

`ConfirmDialog` recebeu apenas propriedades opcionais e compatíveis:
`error?: string`, `disabled?: boolean` e `onCloseAutoFocus?: (event: Event) => void`.
Elas permitem erro acessível no diálogo e restauração de foco após remoção do alvo.

## `PanicModeSection`

```tsx
<PanicModeSection
  compact
  active={active}
  envLocked={envLocked}
  loading={loading}
  pending={pending}
  error={error}
  onRetry={onRetry}
  onActivate={onActivate}
  onDeactivate={onDeactivate}
/>
```

- `compact?: boolean` é opcional e tem padrão `false`. Os callers anteriores
  continuam expandidos, com os mesmos callbacks, mensagens e confirmação.
- Com `compact`, somente o estado inativo confirmado, sem erro, não travado, fora de carregamento e
  pendência usa `<details>` inicialmente recolhido. O `<summary>` recebe o título
  existente de `panicModeSection.title`, foco visível e chevron decorativo.
- Abrir o resumo apenas revela descrição e botão. Ativar continua exigindo a
  confirmação existente. Nenhuma operação ocorre por abrir ou fechar o resumo.
- `active`, `envLocked`, `loading`, `pending` ou `error` apresentam o bloco expandido.
  `error?: boolean` indica que o estado atual não pôde ser confirmado: mostra alerta,
  bloqueia alternância e confirmação e oferece nova consulta por `onRetry?: () => void`.
  O consumidor não deve interpretar erro como modo inativo, mesmo com dados antigos no cache.
- O consumidor opta por `compact` no seu container; autorização e política de
  emergência continuam fora do DS. Nenhuma API ou regra de moderação foi alterada.

## Mensagens e demonstrações

Textos fixos ficam nas chaves `moderatorWorkspace` e `reportsSection` de
`useMessages()`, com padrões pt-BR e tipos públicos `ModeratorWorkspaceMessages`
e `ReportsMessages`. Conteúdo das denúncias é texto React, nunca HTML executável.

As stories `Domain/Moderation/Espaço de trabalho` e
`Domain/Moderation/Denúncias` usam exclusivamente dados sintéticos e cobrem estados
principal, móvel, vazio, erro, carregamento e conteúdo longo. Denúncias também
inclui ausência de administração, pendência e falha confirmada de ação.

Os testes das duas views exercitam os contratos públicos, filtros combinados,
autorização de interface, confirmação/cancelamento, falha/retry, concorrência,
restauração de foco e navegação. A integração com backend real fica no consumidor.
