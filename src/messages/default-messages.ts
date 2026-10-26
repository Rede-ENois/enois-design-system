import type { Messages } from "../types/messages/messages.js";

export const defaultMessages: Messages = {
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
  dateTextInput: {
    placeholder: "dd/mm/aaaa",
    invalid: "Digite uma data válida no formato dd/mm/aaaa.",
    outOfRange: "Confira a data: ela está fora do intervalo permitido.",
  },
};
