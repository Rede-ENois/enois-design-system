import type { SupportUsMessages } from "../../types/messages/support-us-messages.js";

export const supportUsMessages: SupportUsMessages = {
  apoieBanner: {
    inviteBefore: "Ajude o Énóis a permanecer",
    inviteHighlight: "sempre gratuito e livre para todos",
    inviteAfter: " com uma doação.",
    show: "Apoiar com Pix",
    hide: "Ocultar Pix",
    dismiss: "Fechar convite",
    qrAlt: "QR Code Pix do Apoie o Énóis",
    qrCaption: "Apoie o Énóis",
    instructions:
      'Escaneia o QR no app do banco ou copia o código Pix abaixo e cola na opção "Pix copia e cola". A chave é o CNPJ do Apoie o Énóis.',
    copy: "Copiar",
    copied: "Copiado!",
    copySuccess: "Código Pix copiado. Cola no app do banco!",
    copyError: "Não deu para copiar. Seleciona o código e copia à mão.",
    keyLabel: "Chave (CNPJ): ",
    keyFooter: " · Apoie o Énóis · São Paulo. Qualquer valor ajuda. De coração, obrigado!",
  },
  apoieCard: {
    title: "Apoie o Énóis",
    textBefore: "O Énóis é ",
    textHighlight: "sempre gratuito e livre",
    textAfter: ". Quem puder, ajude a manter assim.",
    show: "Apoiar com Pix",
    hide: "Ocultar Pix",
    qrAlt: "QR Code Pix do Apoie o Énóis",
    copy: "Copiar código Pix",
    copied: "Copiado!",
    copySuccess: "Código Pix copiado. Cola no app do banco!",
    copyError: "Não deu para copiar. Seleciona o código e copia à mão.",
    keyLabel: "Chave (CNPJ): ",
    keyFooter: " · Apoie o Énóis",
  },
  apoieWise: {
    title: "Doar de fora do Brasil",
    description:
      "Está fora do Brasil, ou prefere pagar com cartão? A doação também pode ir pela Wise, em dólar: abra o link, informe o valor na página da Wise e pague em poucos passos.",
    suggestedValues: "Valores sugeridos em dólar",
    suggestedValue: (valor) => `US$ ${valor}`,
    otherValue: "Valor em dólar (US$)",
    open: "Abrir a página de pagamento da Wise",
    feeNote:
      "A taxa de envio fica com quem doa, e a Wise mostra o total antes de você confirmar — assim chega o valor inteiro.",
    noSeal:
      "A Wise não gera o comprovante que confirma a doação e libera o selo de apoiador — para isso, use o Pix.",
  },
};
