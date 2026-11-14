# Prova de navegador da transparência de penalidades

## Reproduzir

Após `npm run build-storybook`, execute na raiz do design system:

```bash
PLAYWRIGHT_MODULE="<caminho-absoluto>/node_modules/playwright-core" \
BROWSER_EXECUTABLE="<executável-do-Chrome-ou-Chromium>" \
PROOF_OUTPUT="<diretório-scratch>" \
node docs/proof/moderation-transparency/verify.mjs
```

O Playwright é uma ferramenta externa de verificação, não uma dependência adicionada ao pacote.
`PLAYWRIGHT_MODULE` pode apontar para `playwright` ou `playwright-core` já instalado em uma cópia
isolada. `BROWSER_EXECUTABLE` é opcional quando o navegador do Playwright já está instalado.
`PROOF_OUTPUT` deve ser explícito para não gravar artefatos no repositório nem depender da
interpretação de `TMPDIR` por um processo nativo Windows.

O roteiro serve o build estático em loopback, inicia um navegador headless e fecha ambos ao terminar.
Não usa conta, backend ou conteúdo real. Salva relatório JSON e quatro capturas em
`<diretório-scratch>/ds-231-proof/`.

## Cobertura e resultado observado

Verificação local em 14/11/2026, sobre a base `4f605ce` com a implementação da issue #231:

- 23 stories e 92 renderizações: cada story em 390px e 1280px, nos modos claro e escuro padrão.
- Nenhum overflow horizontal e nenhum erro de página.
- Quatro percursos de teclado: Tab até o campo, foco visível, digitação, Tab até **Recorrer**,
  Enter para envio fictício e confirmação de **Recurso em análise**, sem formulário duplicado.
- Quatro transições de horário recebido: último minuto até **Prazo encerrado**, sem afirmar
  liberação ou banimento automáticos.
- Contraste mínimo observado de texto ativo: **5,39:1**, acima de 4,5:1. O cálculo usa cores
  computadas no navegador e composição dos fundos. Controles desabilitados e texto exclusivo
  de leitor de tela são excluídos dessa medição.
- Capturas inspecionadas: conteúdo longo móvel nos dois modos e conta suspensa desktop nos dois
  modos. Motivo e sequências sem espaços quebram linha, a evidência indica seu corte e o
  formulário e os links permanecem dentro do cartão/página.

Isso comprova as stories nos dois modos padrão, não uma inspeção visual de cada tema da galeria,
leitor de tela assistivo real nem o fluxo de sessão revogada do aplicativo. A prova do consumidor
real, com o tarball instalado e o contêiner responsável por horário/autorização, pertence à
integração #875 e permanece separada da publicação por um mantenedor.
