import type { ReactNode } from "react";

import type { ConfessionarioFeedState } from "./confessionario-feed-state.js";
import type { ConfissaoPostView } from "./confissao-post-view.js";

/** A linha do tempo do Confessionário: cronológica, sem ranking e sem destaque — toda história
 * vale a mesma coisa aqui. Cada card é montado por quem usa, via `renderCard`. */
export type ConfessionarioFeedProps = {
  posts: ConfissaoPostView[];
  state: ConfessionarioFeedState;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  renderCard: (post: ConfissaoPostView) => ReactNode;
};
