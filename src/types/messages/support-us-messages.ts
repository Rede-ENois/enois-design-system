export type SupportUsMessages = {
  apoieBanner: {
    inviteBefore: string;
    inviteHighlight: string;
    inviteAfter: string;
    show: string;
    hide: string;
    dismiss: string;
    qrAlt: string;
    qrCaption: string;
    instructions: string;
    copy: string;
    copied: string;
    copySuccess: string;
    copyError: string;
    keyLabel: string;
    keyFooter: string;
  };
  apoieCard: {
    title: string;
    textBefore: string;
    textHighlight: string;
    textAfter: string;
    show: string;
    hide: string;
    qrAlt: string;
    copy: string;
    copied: string;
    copySuccess: string;
    copyError: string;
    keyLabel: string;
    keyFooter: string;
  };
  apoieWise: {
    title: string;
    description: string;
    suggestedValues: string;
    suggestedValue: (valor: string) => string;
    otherValue: string;
    open: string;
    feeNote: string;
    noSeal: string;
  };
};
