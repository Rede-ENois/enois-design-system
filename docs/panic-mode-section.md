# Modo pânico (moderação)

`PanicModeSection` (`@rede-enois/design-system/domain`) é o controle do botão de pânico: com o
modo ativo, toda escrita da aplicação responde 429; o login e o próprio botão continuam
acessíveis para desligar. O estado é do backend e chega por props.

## Contrato

```tsx
<PanicModeSection
  active={active}
  envLocked={envLocked} // travado pela variável PANIC_MODE
  loading={loading} // consulta do estado em andamento
  error={error} // não foi possível confirmar o estado atual
  onRetry={refetch} // reconsulta; nunca muta
  pending={pending} // ativação/desativação em andamento
  compact={false} // recolhe somente o estado inativo e disponível
  onActivate={onActivate}
  onDeactivate={onDeactivate}
/>
```

## Comportamento

- **Compacto só quando seguro.** `compact` recolhe os controles em um `<details>` rotulado pelo
  título quando o modo está inativo, sem trava de ambiente, sem carregamento, sem pendência e
  sem erro. Ativo, travado, carregando, pendente ou com falha permanecem **expandidos** — um
  estado incerto nunca aparece como "desligado".
- Abrir o resumo só revela os controles; ativar continua exigindo confirmação.
- **Falha explícita.** `error` troca a descrição pela mensagem de estado incerto
  (`role="alert"`), desabilita o alternador e oferece `Tentar novamente`, que chama somente
  `onRetry`.
- **Confirmação protegida.** A confirmação fica desabilitada quando o estado/permissão muda
  durante a revisão (`loading`, `envLocked`, `error`) ou quando já há operação pendente, e o
  próprio callback revalida antes de chamar `onActivate()`.
- Cancelar não muta; desativar chama `onDeactivate` direto, sem confirmação.

## Provas

`src/domain/moderation/panic-mode-section.test.tsx` cobre compacto recolhido, `compact`
ausente/falso expandido, cada estado que impede o recolhimento, abrir o resumo, confirmação e
cancelamento, falha em ativo e inativo com retry, bloqueio da confirmação aberta quando o estado
fica incerto, bloqueio quando a operação fica pendente e expansão imediata ao ativar.
`panic-mode-section.stories.tsx` demonstra expandido, compacto e cada estado que o mantém
expandido.
