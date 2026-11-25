/**
 * O que a pessoa pode fazer com uma figurinha SEGURADA no seletor. A view só desenha: quem decide o
 * que a figurinha é (do pacote oficial, de terceiros, da comunidade) é o app.
 */
export type EmoteActionDialogViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A figurinha segurada (o cabeçalho abre com a imagem; código quando não há). */
  item: { code: string; src?: string } | null;
  /**
   * `true` quando denunciar é uma ação possível para esta conta e esta figurinha. O pacote oficial
   * nunca é denunciável; quem já denunciou também não recebe a ação.
   */
  onReport?: () => void;
  /**
   * `true` quando a conta é admin: banir (e desbanir) direto, com motivo. Banir exige motivo; a
   * view não envia nada sem ele.
   */
  onBan?: (motivo: string) => void;
  /** Desfazer um banimento vigente (admin): a figurinha volta ao catálogo. */
  onUnban?: () => void;
  /** Estado da figurinha, quando o app já sabe: muda o rótulo de banir para desbanir. */
  banned?: boolean;
  /** Requisição em andamento: as ações ficam desabilitadas. */
  pending?: boolean;
};
