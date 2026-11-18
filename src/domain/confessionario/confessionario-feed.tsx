import type { ReactNode } from "react";

import { Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ConfessionarioFeedProps } from "../../types/domain/confessionario/confessionario-feed-props.js";
import { Button } from "../../ui/button.js";

/**
 * A linha do tempo do Confessionário: cronológica, do mais recente ao mais antigo, sem ranking
 * e sem destaque — toda história vale a mesma coisa aqui. Estados de carga e vazio e o botão de
 * carregar mais são desenhados aqui; cada card é montado por quem usa, via `renderCard`.
 */
export function ConfessionarioFeed({
  posts,
  state,
  hasMore,
  loadingMore,
  onLoadMore,
  renderCard,
}: ConfessionarioFeedProps) {
  const messages = useMessages().confessionarioFeed;

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
