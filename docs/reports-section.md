# Fila de denúncias (moderação)

`ReportsSection` (`@rede-enois/design-system/domain`) compõe a fila de denúncias: cabeçalho,
recorte (motivo, alvo e busca) e os cartões `ReportCard`. Quem busca os dados, vota na API e
decide a política de punição é o chamador (app).

## Contrato

```tsx
<ReportsSection
  reports={denuncias}
  admin={admin} // repassa ao cartão: mostra o link de revisão
  loading={carregando}
  error={falhou}
  pending={enviando} // votos bloqueados enquanto a fila envia uma mutação
  onRetry={() => refazer()}
  onVote={(reportId, vote) => {}} // "PUNISH" | "DISMISS"
/>
```

- O elemento raiz é um `<section>` com `aria-labelledby` próprio e `aria-busy` quando carrega
  ou envia.
- Textos vêm de `reportsSection` (seção e filtros) e de `reportCard` (cartão e nomes de motivo e
  alvo) em `Messages`; identificador desconhecido cai no valor bruto.

## Estados

- `loading`: esqueleto com `role="status"` e rótulo acessível; nunca vira "fila vazia".
- `error`: alerta com o texto de falha e o botão de nova tentativa (só o callback `onRetry`).
- `reports` vazio sem falha: estado vazio ("nenhuma denúncia aguardando análise").
- `pending`: cartões desabilitados, nova tentativa desabilitada e a guarda de voto segura o envio.

## Recorte (filtros e busca)

- Motivo e alvo são listas derivadas do lote atual, sem repetição, com o nome legível; a opção
  vazia mostra o lote inteiro.
- A seleção que sai do lote (por atualização da fila) continua representada no seletor para não
  esconder o recorte ativo; ao limpar, a lista recaptura as opções do lote.
- A busca ignora caixa, espaços nas pontas e varre referência, autor, denunciante, conteúdo e
  relato.
- A contagem anuncia "X de Y denúncia(s) neste recorte"; com algum recorte ativo aparece o atalho
  de limpar, e o recorte vazio mostra o aviso com o mesmo atalho em vez de parecer fila vazia.
- Filtrar e buscar acontecem só no componente: nenhuma consulta, voto ou mutação.

## Foco

- Ao votar, o foco fica no gatilho; quando o cartão sai da fila (callback ou atualização), o foco
  vai para o título estável da seção — a menos que a pessoa já tenha movido o foco para outro
  lugar da tela.

## Provas

`src/domain/moderation/reports-section.test.tsx` e
`src/domain/moderation/reports-section-filters.test.tsx` cobrem estados, bloqueio por `pending`,
foco no voto, combinação de filtros, contagem, vazio filtrado, atalho de limpar, busca em todos os
campos, opções sem repetição, seleção fora do lote e ausência de consultas ao filtrar.
