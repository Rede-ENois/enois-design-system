import type { UiMessages } from "../../types/messages/ui-messages.js";

export const uiMessages: UiMessages = {
  dialog: { close: "Fechar" },
  sheet: { close: "Fechar" },
  confirmDialog: { cancel: "Cancelar", pending: "Enviando..." },
  charCounter: {
    progress: (used, max) =>
      `${used.toLocaleString("pt-BR")} / ${max.toLocaleString("pt-BR")} caracteres`,
    left: (count) => (count === 1 ? "falta 1 caractere" : `faltam ${count} caracteres`),
    limitReached: "limite de caracteres atingido",
  },
  passwordInput: { show: "Mostrar senha", hide: "Ocultar senha" },
  emojiPicker: { search: "Buscar emoji", empty: "Nenhum emoji com esse nome." },
  readMore: { more: "Ler mais", less: "Mostrar menos" },
  toast: { region: "Avisos", dismiss: "Fechar aviso" },
  skeletonList: { loading: "Carregando..." },
  signal: {
    new: "Tem novidade",
    today: "hoje",
    count: (count) => (count === 1 ? "1 pendente" : `${count} pendentes`),
    messages: (count) => (count === 1 ? "1 mensagem não lida" : `${count} mensagens não lidas`),
  },
  dateTextInput: {
    placeholder: "dd/mm/aaaa",
    invalid: "Digite uma data válida no formato dd/mm/aaaa.",
    outOfRange: "Confira a data: ela está fora do intervalo permitido.",
  },
  timeTextInput: {
    placeholder: "hh:mm",
    invalid: "Digite um horário válido no formato hh:mm.",
  },
};
