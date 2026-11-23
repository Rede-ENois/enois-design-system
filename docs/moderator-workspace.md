# Navegação do painel de moderação: `ModeratorWorkspace`

Primeira unidade entregue da decomposição de #245/#246 (#353). A view vive em
`@rede-enois/design-system/domain` e não acessa rede, rotas, autenticação ou stores: o
consumidor carrega a área ativa e decide quem pode entrar em cada destino.

```tsx
<ModeratorWorkspace groups={groups} activeTab={activeTab} onTabChange={setActiveTab}>
  {conteudoDaAreaAtiva}
</ModeratorWorkspace>
```

- `groups: ModeratorWorkspaceGroup[]`, com `{ id, label, tabs: { id, label }[] }`.
  IDs de grupos e áreas precisam ser únicos e estáveis — destino fora da lista é recusado
  sem chamar `onTabChange`.
- `activeTab: string` e `onTabChange(tab: string): void` formam uma seleção controlada. A view
  nunca troca a área ativa sozinha: só emite o callback e, em caso de destino válido, limpa
  o texto da busca.
- `children: ReactNode` é a área ativa. O DS não mantém cache, não monta rotas e não some com
  o conteúdo enquanto a busca não encontra nada.

## Navegação

- Telas grandes: coluna compacta com os grupos visíveis e o destino ativo marcado por
  `aria-current="page"` — botão de verdade, com foco visível e alvo de 40 px.
- Telas menores: um `select` rotulado mantém os grupos em `optgroup`, sem faixa horizontal
  nem `tablist` artificial.
- Nenhum grupo com área aberta significa seletor na opção neutra: "Escolha uma área".

## Busca

- Compara o texto digitado (sem espaços nas pontas, sem distinguir maiúsculas) com o nome da
  área ou do grupo.
- Enquanto há busca, anuncia a contagem do recorte em `role="status"` ou "Nenhuma área
  encontrada.", oferece "Limpar busca" e mantém o conteúdo ativo na tela.
- A área ativa fora do recorte continua na tela, mas não fica marcada como selecionada no
  seletor — o texto buscado é o que está em foco.

## O que ainda não está aqui

Fila de denúncias, voto coletivo, filtros, modo pânico e ações administrativas vêm nas próximas
unidades (#354–#359) e não fazem parte deste contrato.
