import type { PatternsMessages } from "../../types/messages/patterns-messages.js";

export const patternsMessages: PatternsMessages = {
  appSidebar: { expandMenu: "Expandir menu", collapseMenu: "Recolher menu" },
  navigationDrawer: { title: "Menu de navegação" },
  themeToggle: { light: "Tema claro", dark: "Tema escuro" },
  errorBanner: {
    show: "Mostrar detalhes",
    hide: "Ocultar detalhes",
    copied: "Copiado!",
    copy: "Copiar detalhes",
    error: (message) => `Erro: ${message}`,
    suggestion: (hint) => `Sugestão: ${hint}`,
  },
  cityStateField: {
    legend: "Localização",
    cityLabel: "Cidade",
    cityPlaceholder: "Ex.: Belo Horizonte",
    stateLabel: "Estado",
    statePlaceholder: "Selecione",
    hint: "Opcional. Se preencher, informe a cidade e o estado.",
    errors: {
      CITY_STATE_INCOMPLETE: "Informe a cidade e o estado juntos, ou deixe os dois em branco.",
      INVALID_STATE: "Escolha um estado da lista.",
      CITY_TOO_LONG: "O nome da cidade pode ter até 80 caracteres.",
    },
  },
  moduleDisabledView: {
    title: "Esta área está desativada nas suas preferências",
    body: "Você desativou este módulo em Uso saudável. Nada foi apagado: os dados continuam guardados e voltam quando você reativar.",
    reenable: "Reativar esta área",
    backToFeed: "Voltar ao feed",
  },
};
