import type { RepostCommunityOption } from "./repost-community-option.js";

export type RepostDialogProps = {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending?: boolean;
  /** O viewer já republicou este post; mostra opção de desfazer. */
  reposted?: boolean;
  /** Republica direto (`undefined`) ou com a opinião. */
  onRepost: (opinion?: string) => void;
  /** Desfaz o repost puro. */
  onUndoRepost?: () => void;
  /**
   * Comunidades em que o viewer pode republicar (`{ id, name }`); quando a lista chega, o
   * diálogo oferece a porta "republicar na comunidade". Quem busca é o chamador.
   */
  communities?: RepostCommunityOption[];
  /** Republica na comunidade escolhida (com opinião obrigatória no backend). */
  onRepostToCommunity?: (communityId: string, opinion: string) => void;
};
