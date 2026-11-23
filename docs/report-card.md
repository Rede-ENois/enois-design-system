# Cartão de denúncia (moderação)

`ReportCard` (`@rede-enois/design-system/domain`) é a unidade de leitura e voto de uma
denúncia da moderação. Ele desenha **um** relato; quem compõe a fila, filtra, busca,
confirma ações administrativas ou decide a política de punição é o chamador (app).

## Contrato

```tsx
<ReportCard
  report={report}
  admin={admin} // mostra "Abrir revisão"; a autorização continua no servidor
  pending={pendente} // bloqueia os dois botões de voto
  onVote={(reportId, vote) => {}} // "PUNISH" | "DISMISS"
/>
```

- `report` (`ModerationReportData`): referência, motivo, alvo, data já formatada, denunciante,
  autor (nulo quando não identificado), conteúdo (nulo quando indisponível), relato, contagens,
  quórum, voto da pessoa e `reviewHref`.
- O elemento raiz é um `<li>`: o cartão nasce dentro da lista da fila.
- Motivo, alvo e os textos vêm de `reportCard` em `Messages`; identificador desconhecido cai no
  valor bruto em vez de sumir.

## Comportamento

- Conteúdo denunciado é **texto**: `whitespace-pre-wrap`, quebra de palavra e região rolável
  focável (`role="region"`, `aria-label`), sem interpretar HTML.
- O voto é coletivo: os botões mostram `aria-pressed` do voto atual e emitem o callback; nada é
  confirmado no cartão e nenhuma ação administrativa direta é exposta aqui.
- `admin` falso esconde o link de revisão e mantém o voto coletivo.
- `pending` desabilita os dois botões sem mudar o voto registrado.
- A quebra de texto e o `min-w-0` mantêm nomes, referências e relatos longos dentro do cartão
  no mobile; ver `docs/visual-language.md`.

## Provas

`src/domain/moderation/report-card.test.tsx` cobre apresentação completa, ausências, motivo/alvo
desconhecidos, texto longo, contagens e voto atual, callback de voto, bloqueio por `pending`,
link de revisão e ausência de ação administrativa direta.
`report-card.stories.tsx` demonstra voto registrado, sem ação administrativa, dados ausentes,
enviando e texto longo.
