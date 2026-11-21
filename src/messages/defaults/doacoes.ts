import type { DoacoesMessages } from "../../types/messages/doacoes-messages.js";

export const doacoesMessages: DoacoesMessages = {
  doacaoPessoal: {
    titulo: "Apoie com o seu QR Code",
    descricao:
      "Com a sua conta, o QR Code é só seu: escolha o valor, pague e cole o comprovante para receber o selo de apoiador.",
    descricaoApoiador:
      "Você já é apoiador. Se quiser doar de novo, o caminho é o mesmo: escolha o valor, pague e cole o comprovante.",
    seloAtivo: "Apoiador",
    escolherValor: "Valor da doação",
    outroValor: "Ou digite outro valor",
    gerarCodigo: "Gerar QR Code",
    gerandoCodigo: "Gerando o código…",
    semObrigacao: "O selo não é assinatura: você doa quando quiser e o código vale 36 horas.",
    validade:
      "Pague exatamente esse valor. A confirmação depende do comprovante e, se ele não bater, a doação entra na fila do extrato.",
    copiar: "Copiar Pix copia e cola",
    copiado: "Copiado!",
    comprovanteTitulo: "Já pagou? Confirme com o comprovante",
    comprovanteAjuda:
      "Abra o extrato do seu banco, copie a linha do Pix desta doação e cole aqui. Ela precisa trazer o valor e o identificador fim a fim.",
    comprovantePlaceholder: "Cole aqui a linha do Pix do seu extrato",
    confirmar: "Confirmar e receber o selo",
    confirmando: "Confirmando…",
    mudarValor: "Mudar o valor",
    seloGanho: "Selo de apoiador ativo. Obrigado por manter o Énóis de pé!",
    erroConfirmar: "Não foi possível confirmar o comprovante.",
  },
};
