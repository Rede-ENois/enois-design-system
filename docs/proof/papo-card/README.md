# Prova visual — card responsivo do Papo Reto (#397)

Monta o **`PapoPanel` real** (não um mock de markup) com o stylesheet real do design system
(Tailwind v4 + `src/styles.css`, os mesmos de `.storybook/storybook.css`) e captura em Chrome
headless via CDP. O objetivo é a pergunta do revisor: a grade de métricas **estoura** a coluna em
tela larga (1280) ou no celular (390)?

## Como reproduzir

```bash
# 1. Monta o bundle da prova (Tailwind gera as classes a partir do src real).
#    O bundle vai para /tmp/papo-proof-build (fora do repo: não entra em git nem no lint).
npx vite build --config docs/proof/papo-card/vite.config.ts

# 2. Serve o bundle (script precisa de http:// — módulo ES não roda em file://).
( cd /tmp/papo-proof-build && python3 -m http.server 8791 & )

# 3. Captura 1280 e 390, com conteúdo e vazio; mede overflow e coleta console.
node docs/proof/papo-card/shot.mjs
```

O `shot.mjs` escreve `com-conteudo-{1280,390}.png`, `vazio-{1280,390}.png` e `resultado.json`.

## O que foi medido

Cenários: **com conteúdo** (dois assuntos — um com crescimento, um "Novo em alta") e **vazio**
("Sem assunto em alta"). Em cada um, em 1280×900 e 390×844, com `deviceScaleFactor: 2`.

| cenário | largura | overflow da página | overflow da seção | erros de console |
|---|---|---|---|---|
| com conteúdo | 1280 | 0 | 0 | nenhum |
| vazio | 1280 | 0 | 0 | nenhum |
| com conteúdo | 390 | 0 | 0 | nenhum |
| vazio | 390 | 0 | 0 | nenhum |

`overflow = scrollWidth − clientWidth`. Zero significa que nada passa da coluna: o pé de cada card
(e a pílula de crescimento) fica inteiro dentro do card nos dois extremos.

## O que as capturas mostram

- **1280**: a grade das métricas vai a 4 colunas (`min-[380px]:grid-cols-4`), cada par número+rótulo
  no mesmo `<li>`, sem separar.
- **390**: a grade fica em 2 colunas por padrão e sobe para 4 a partir de 380px — o par número+rótulo
  continua junto, e o número grande não quebra a linha.
- A pílula (`+38%`) e a frase (`Subiu 38% nas últimas 24 horas`) mostram **o mesmo** número — a
  formatação do crescimento passa por um único ponto de arredondamento (`crescimentoArredondado`).

## Limite honesto

A prova roda o componente isolado no seu próprio frame de página, não dentro da aplicação com o
painel lateral da tela do Papo. Ela responde "a grade cabe na largura que receber?", que é o que a
correção muda. O que depende do container da tela (quanto de largura o painel recebe) é definido pelo
app, fora deste componente.
