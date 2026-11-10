import type { ReactNode } from "react";

import type { PostCardData } from "./post-card-data.js";
import type { PostCardHrefs } from "./post-card-hrefs.js";
import type { PostMediaGridProps } from "./post-media-grid-props.js";
import type { PostRichTextProps } from "./post-rich-text-props.js";
import type { PostSealCount } from "./post-seal-count.js";
import type { RenderAuthorTrigger } from "./render-author-trigger.js";
import type { RenderLinkPreview } from "./render-link-preview.js";

export type PostCardProps = {
  post: PostCardData;
  hrefs: PostCardHrefs;
  /** Tempo relativo da publicação. */
  timeLabel: string;
  /** Tempo relativo da última edição (quando `post.editedAt`). */
  editedTimeLabel?: string | null;
  /** Rótulo do assunto (categoria) do post, quando o autor classificou. */
  topicLabel?: string | null;
  /** Card de lista do feed: ganha a âncora `feed-post-{id}` para a volta da rolagem. */
  anchored?: boolean;
  /**
   * O card É a página do post (não um item de lista): mostra o texto inteiro e não oferece "Ler
   * mais" — o link levaria para a página em que a pessoa já está.
   */
  fullPost?: boolean;
  /**
   * The list virtualizes (mounts only the cards near the viewport and measures each one). The
   * card then drops `content-visibility: auto`: a skipped card reports the 360px placeholder, the
   * virtualizer stores that size and the list jumps when the real height paints.
   */
  virtualized?: boolean;
  /** É o post fixado no topo da comunidade (mostra o selo "Fixado"). */
  pinned?: boolean;
  /** Presente para quem administra a comunidade: mostra o botão de fixar/desafixar. */
  onTogglePin?: () => void;
  pinPending?: boolean;
  /** Quem escreveu o post vê o menu de editar/excluir. */
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  /** Contagem dos selos do post (topo do card). */
  seals?: PostSealCount[] | null;
  /** Selos que quem lê já deu (ficam com anel). */
  mySeals: string[];
  /** Abre a lista de quem marcou. */
  onShowSeals: () => void;
  onFollowCommunity?: () => void;
  followPending?: boolean;
  /** Bio ou headline do autor (exibe na segunda linha do header). */
  authorHeadline?: string | null;
  authorBio?: string | null;
  /** Grau de conexão do autor (ex: "2º"). */
  authorConnectionDegree?: string | null;
  /** Seguir o autor do post. */
  onFollowAuthor?: () => void;
  followAuthorPending?: boolean;
  isFollowingAuthor?: boolean;
  /** Contexto social opcional (ex: "Deyse Paiva gostou" com avatar no topo). */
  socialContext?: {
    avatar?: string | null;
    text: string;
    href?: string | null;
  } | null;
  /** Botão 'X' para descartar/ocultar post. */
  onDismiss?: () => void;
  /** Botão '...' de mais opções. */
  onOptionsClick?: () => void;
  /** Chamado ao abrir o post pelo "Ler mais" ou pelo convite do artigo. */
  onOpenPost?: () => void;
  /** Prévia de vídeo dos links toca sozinha (muda) quando entra na tela. */
  autoplayLinks?: boolean;
  /** HTML da mini página (do post ou já buscado); vazio quando não há. */
  pageHtml?: string;
  /** A página ainda está chegando (requisição própria). */
  pageLoading?: boolean;
  mediaSpoiler?: boolean;
  /** A mini página do post (o app monta o quadro). */
  page?: ReactNode;
  /** A enquete do post (alternativas + voto); o app monta — o DS não conhece a API de voto. */
  poll?: ReactNode;
  /** Resumo de reações. */
  reactionsSummary?: ReactNode;
  /** Notas de rodapé da comunidade (logo antes da fileira de ações). */
  notes?: ReactNode;
  /** Fileira de ações (reagir, comentar, compartilhar...). */
  actions?: ReactNode;
  /** Diálogos de edição e exclusão do autor. */
  ownerDialogs?: ReactNode;
  /** Comentários, quando abertos. */
  comments?: ReactNode;
  renderRichText: (props: PostRichTextProps) => ReactNode;
  renderMediaGrid: (props: PostMediaGridProps) => ReactNode;
  /** Avatar e nome abrem o gatilho do app (mini cartão) em vez do link do perfil. */
  renderAuthorTrigger?: RenderAuthorTrigger;
  /** O cartão de cada link de página (miniatura, título, descrição); sem ele, o cartão simples. */
  renderLinkPreview?: RenderLinkPreview;
};
