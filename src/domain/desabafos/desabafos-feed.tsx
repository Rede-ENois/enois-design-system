import type { ReactNode } from "react";

import { Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { DesabafoPostView } from "../../types/domain/desabafos/desabafo-post-view.js";
import type { DesabafosFeedState } from "../../types/domain/desabafos/desabafos-feed-state.js";
import { Button } from "../../ui/button.js";

/**
 * A linha do tempo dos Desabafos: cronológica, do mais recente ao mais antigo, sem ranking e
 * sem destaque — todos os desabafos valem a mesma coisa aqui. Estados de carga e vazio e o
 * botão de carregar mais são desenhados aqui; cada card é montado por quem usa, via `renderCard`.
 */
export function DesabafosFeed({
  posts,
  state,
  hasMore,
  loadingMore,
  onLoadMore,
  renderCard,
}: {
  posts: DesabafoPostView[];
  state: DesabafosFeedState;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  renderCard: (post: DesabafoPostView) => ReactNode;
}) {
  const messages = useMessages().desabafosFeed;

  if (state.kind === "loading") {
    return (
      <p className="flex items-center justify-center gap-2 py-10 text-sm text-text-subtle">
        <Loader2 className="h-4 w-4 animate-spin" /> {messages.loading}
      </p>
    );
  }
  if (state.kind === "error") {
    return <p className="py-10 text-center text-sm text-text-subtle">{messages.error}</p>;
  }
  if (state.kind === "empty") {
    return <p className="py-10 text-center text-sm text-text-subtle">{messages.empty}</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => renderCard(post))}

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onLoadMore}>
            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : messages.loadMore}
          </Button>
        </div>
      )}
    </div>
  );
}
