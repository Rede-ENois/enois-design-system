# Transparência de penalidades

Implementação da issue #231, sem alteração de política de moderação. `SanctionsView` é uma view
controlada, exportada por `@rede-enois/design-system/domain`, para `mode="history"` e
`mode="suspended"`. Não consulta APIs, importa DTOs, lê stores, define rotas nem autentica a pessoa.
Os dois modos preservam os mesmos dados e estados; o modo muda a apresentação do título.
Sanções removidas preservam o histórico e a evidência, mas não exibem contador ativo nem aviso de
possível banimento. O prazo histórico recebido não é apresentado como uma nova obrigação de recorrer.

## API pública

Os tipos abaixo são exportados pelo entrypoint `domain`, cada qual em seu arquivo canônico em
`src/types/domain/moderation/`.

```ts
interface SanctionDeadline {
  kind: "APPEAL" | "END" | "NONE";
  at: string | null;
}
interface SanctionEvidence {
  kind: "TEXT" | "MEDIA" | "BEHAVIOR" | "UNAVAILABLE";
  text: string | null;
}
interface SanctionData {
  id: string;
  type: "RESTRICTION" | "SUSPENDED" | "BAN" | "PERMABAN";
  status: "ACTIVE" | "REMOVED";
  reason: string | null;
  createdAt: string;
  deadline: SanctionDeadline;
  evidence: SanctionEvidence;
  canAppeal: boolean;
}
interface SanctionAppealData {
  id: string;
  sanctionId: string;
  message: string;
  status: "PENDING" | "APPROVED" | "DENIED";
  createdAt: string;
}
interface SanctionsViewProps {
  mode: "history" | "suspended";
  sanctions: SanctionData[];
  appeals: SanctionAppealData[];
  now: number;
  loading: boolean;
  error: boolean;
  refreshing: boolean;
  appealMessage: string;
  onAppealMessageChange: (value: string) => void;
  onAppeal: () => void;
  appealSubmitting: boolean;
  appealError: boolean;
  onRetry: () => void;
  backHref?: string;
  loginHref?: string;
  appealSanctionId?: string;
  onAppealSanctionChange?: (sanctionId: string) => void;
}
```

### Alvo e envio do recurso

- `canAppeal` vem do servidor. A view não acrescenta condições por tipo, status ou vencimento.
- O formulário pertence a `appealSanctionId`; sem a prop, pertence à primeira sanção com
  `canAppeal=true`, na ordem recebida. Um ID explícito ausente ou não elegível não gera formulário
  para outra sanção. O consumidor deve passar o ID explicitamente quando houver vários alvos.
- Com mais de uma sanção elegível e `onAppealSanctionChange`, a view oferece um seletor controlado.
  O consumidor atualiza `appealSanctionId` e limpa/troca o rascunho e o erro ao trocar de alvo.
  Sem callback, o consumidor controla a seleção externamente.
- `onAppeal()` não recebe argumentos: o consumidor já possui o alvo e a mensagem controlados.
  A validação e o contador usam `appealMessage.trim().length`, entre 10 e 1.000, inclusive.
  O callback de edição preserva o texto digitado; o contêiner envia `appealMessage.trim()`.
- `appealSubmitting` desabilita campo, seletor e envio. Um bloqueio síncrono impede duplo envio
  antes de o contêiner atualizar as props. O contêiner deve sinalizar cada tentativa por
  `appealSubmitting`, passando `appealError` em caso de falha e conciliando `appeals` no sucesso.
  A falha mantém a mensagem disponível para nova tentativa.
- Qualquer recurso `PENDING` da mesma sanção oculta seu formulário e mostra **Recurso em análise**.
  Pendências de outra sanção não bloqueiam o alvo. Aprovação/negação e remoção da sanção aparecem
  somente quando informadas nas props; não são inferidas uma da outra.

### Horário e confirmação

- `now` é o instante em milissegundos ajustado pelo servidor no contêiner. Não há relógio interno,
  chamadas ao servidor nem leitura de `Date.now()` na view. Cada atualização de prop recalcula o
  prazo com minutos arredondados para cima, sem valores negativos.
- `deadline.at` e `createdAt` devem ser datas ISO com fuso explícito. A exibição fixa pt-BR e UTC,
  incluindo segundos e identificação de fuso, para não depender do ambiente de renderização.
- `END` significa **Término da punição**, **Faltam [horas/minutos]** e **Término previsto**.
  `APPEAL` significa **Prazo para recorrer**, sem prometer liberação automática. A explicação
  aprovada sobre possível banimento acompanha esse prazo quando o tipo é `SUSPENDED`.
- `NONE` significa **Sem prazo definido**. `BAN` e `PERMABAN` são explicitamente permanentes.
  Prazo ausente/inválido e horário atual inválido recebem mensagens próprias, não contadores
  inventados. Ao zerar, aparece **Prazo encerrado** e o aviso de que o vencimento não confirma
  liberação nem banimento.
- A view não oferece botão de atualização manual. O contêiner consulta a decisão ao entrar na página
  e entrega as atualizações confirmadas; `refreshing` anuncia **Atualizando...** sem criar uma ação.
- `onRetry` é usado somente em **Tentar novamente**, após falha de consulta. O botão fica desabilitado
  durante a nova tentativa. A chave pública de mensagem `refresh` permanece por compatibilidade,
  mas não é renderizada como botão.

### Evidência e privacidade

`TEXT` recebe um trecho seguro; `MEDIA` recebe apenas uma descrição segura. `BEHAVIOR` informa
explicitamente que a punição não corresponde necessariamente a uma única publicação. A descrição
comportamental pode ser ausente. `UNAVAILABLE` ignora qualquer texto e mostra indisponibilidade.
O trecho/descrição é limitado a 600 unidades de texto, com indicação de corte. Todo conteúdo é
renderizado como texto React, sem HTML ativo, URLs clicáveis, player ou reprodução da mídia.

O servidor/contêiner deve fornecer conteúdo já redigido e autorizado para a própria pessoa, sem
identidade do denunciante, relatos privados ou detalhes internos do classificador. O limite visual
não substitui autorização, redação nem tratamento de conteúdo perigoso no servidor.

### Estados, mensagens e navegação

`loading` tem precedência; depois vêm `error`, vazio e dados. Falha não é tratada como lista vazia.
A falha de consulta usa exatamente **Não foi possível carregar suas penalidades.**, com
**Tentar novamente**. Erro de envio é separado. `backHref` e `loginHref` são opcionais, renderizados
por `AppLink`, sem criar caminhos internos. O contêiner cuida do acesso limitado à própria decisão
e ao recurso quando a sessão normal não está disponível; a view não restaura privilégios.

A microcopy está em `sanctionsView`, via `useMessages()`, com defaults pt-BR em
`src/messages/defaults/sanctions.ts`. O tipo `SanctionsMessages` também é exportado pela raiz.
Tokens e controles são os existentes, sem paleta, dependência ou regra de negócio nova.

## Verificação

- Testes de componente cobrem o entrypoint público, estados, segurança textual, prazo, relógio
  controlado, limites do recurso, pendência por sanção, alvo explícito, falha e duplo envio.
- `Domain/Moderation/Sanctions` tem 23 stories, incluindo conteúdo longo, ambas as semânticas de
  prazo, transição ao zero, verificação, indisponibilidade, decisão permanente e acompanhamento.
- O [roteiro de navegador](proof/moderation-transparency/README.md) verifica 390px e desktop,
  claro/escuro, teclado/foco, ausência de overflow e contraste dos textos renderizados.
- A instalação do tarball e a prova do contêiner no frontend são uma etapa separada da integração
  #875. A publicação continua sob responsabilidade de um mantenedor; o tarball local não comprova
  uma versão publicada nem uma instalação limpa por lockfile.
