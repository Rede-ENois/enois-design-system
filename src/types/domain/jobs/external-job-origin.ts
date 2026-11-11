/**
 * De onde a vaga externa veio e quão fresca ela está.
 *
 * `lastSeenAt` é a última vez que a fonte confirmou a vaga, não a data em que ela foi publicada:
 * são coisas diferentes e a tela diz qual é qual. `removedAt` preenchido significa que a fonte já
 * não a lista; a vaga não deve aparecer como disponível.
 */
export type ExternalJobOrigin = {
  /** Nome da plataforma de origem, como a fonte se chama. */
  platform: string;
  /** Link da publicação original, para quem quiser conferir na fonte. */
  sourceUrl: string | null;
  /** Data de publicação informada pela fonte (ISO 8601) ou `null` quando ela não informa. */
  publishedAt: string | null;
  /** Última vez que a fonte confirmou a vaga (ISO 8601). */
  lastSeenAt: string | null;
  /** Quando a fonte deixou de listar a vaga (ISO 8601), ou `null` se ainda está no ar. */
  removedAt: string | null;
  /** Quando a vaga expira pela própria fonte (ISO 8601), ou `null`. */
  expiresAt: string | null;
};
