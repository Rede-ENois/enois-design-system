/** O resumo da vitrine que um post aponta: o título publicado (ou o nome) e a primeira frase. */
export type PortfolioPointerProps = {
  name: string;
  avatarUrl: string | null;
  /** O título da vitrine publicada; ausente ou null mostra o nome. */
  title?: string | null;
  /** A primeira frase da página; null mostra só o título. */
  headline: string | null;
  /** Endereço público da vitrine. */
  href: string;
  /** Ainda lendo a vitrine: mostra o quadro em espera no lugar do resumo. */
  loading?: boolean;
  /** Guardar a rolagem do feed antes de abrir a vitrine (o app decide quando há para onde voltar). */
  onNavigate?: () => void;
};
