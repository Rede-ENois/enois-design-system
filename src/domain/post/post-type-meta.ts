import type { PostTypeMeta } from "../../types/domain/post/post-type-meta.js";
import type { PostType } from "../../types/domain/post/post-type.js";

/** Badge and avatar fallback colors per post type; the labels live in `postCard.types`. */
export const POST_TYPE_META: Record<PostType, PostTypeMeta> = {
  INSIGHT: {
    className: "bg-highlight-insight text-highlight-insight-text",
    classAvatar: "bg-user-insight text-highlight-insight-text",
  },
  QUESTION: {
    // Fundo é o secundário translúcido sobre o cartão: o foreground cheio do secundário
    // (que contrasta com o secundário sólido) fica ilegível em temas de tom claro no escuro.
    className: "bg-secondary/30 text-text-strong",
    classAvatar: "",
  },
  PROJECT: {
    className: "bg-highlight-project text-highlight-project-text",
    classAvatar: "bg-user-project text-user-project-text",
  },
  OPPORTUNITY: {
    className: "bg-opportunity/20 text-opportunity-foreground",
    classAvatar: "",
  },
  ARTICLE: {
    className: "bg-highlight-article text-highlight-article-text",
    classAvatar: "bg-user-article text-user-article-text",
  },
  NEWS: {
    className: "bg-highlight-article text-highlight-article-text",
    classAvatar: "",
  },
  TUTORIAL: {
    className: "bg-highlight-insight text-highlight-insight-text",
    classAvatar: "",
  },
  REVIEW: {
    className: "bg-opportunity/20 text-opportunity-foreground",
    classAvatar: "",
  },
  MOMENT: {
    // O fundo é o secundário a 30% (um tom pálido sobre a página): o texto do secundário
    // cheio não vale aqui; o texto forte garante contraste nos dois modos de todos os temas.
    className: "bg-secondary/30 text-text-strong",
    classAvatar: "",
  },
  DIVERTIDO: {
    className: "bg-accent text-accent-foreground",
    classAvatar: "",
  },
  PAGE: {
    className: "bg-surface-2 text-text-strong",
    classAvatar: "",
  },
  BLOG: {
    className: "bg-highlight-article text-highlight-article-text",
    classAvatar: "bg-user-article text-user-article-text",
  },
  POLL: {
    className: "bg-secondary/30 text-text-strong",
    classAvatar: "",
  },
  BUSINESS: {
    // Destaque próprio do contexto profissional (o mesmo par usado pelos demais tipos).
    className: "bg-highlight-news text-highlight-news-text",
    classAvatar: "bg-user-news text-user-news-text",
  },
};
