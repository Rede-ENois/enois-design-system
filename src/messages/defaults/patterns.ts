import type { PatternsMessages } from "../../types/messages/patterns-messages.js";

export const patternsMessages: PatternsMessages = {
  tokenInput: {
    hint: "Aperte Enter ou digite uma vírgula para adicionar.",
    full: "Você chegou ao limite de itens.",
    count: (count, max) => `${count} de ${max}`,
    remove: (token) => `Remover ${token}`,
    suggestions: "Sugestões",
    tooLong: (maxLength) => `Cada item pode ter até ${maxLength} caracteres.`,
    tooMany: (max) => `Adicione no máximo ${max} itens.`,
    singleItem: "Adicione um item por vez.",
  },
  appSidebar: { expandMenu: "Expandir menu", collapseMenu: "Recolher menu" },
  navigationDrawer: { title: "Menu de navegação" },
  mobileDock: { label: "Navegação principal" },
  themeToggle: { light: "Tema claro", dark: "Tema escuro" },
  themeSwitch: { label: "Tema", light: "Claro", dark: "Escuro" },
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
