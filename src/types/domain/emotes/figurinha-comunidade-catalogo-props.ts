import type { FigurinhaComunidadeItem } from "./figurinha-comunidade-item.js";

/** A página do catálogo da comunidade: a grade, a busca e o rodapé de páginas, sem markup no app. */
export type FigurinhaComunidadeCatalogoProps = {
  /** Cartões já prontos (o app decide as ações de cada um). */
  cartoes: FigurinhaComunidadeItem[];
  /** O que a busca está pedindo agora (contador, vazio, erro). */
  total: number | null;
  termo: string;
  onTermoChange: (termo: string) => void;
  page: number;
  totalPages: number;
  state: "loading" | "error" | "empty" | "ready";
  title: string;
  intro: string;
  searchPlaceholder: string;
  labels: {
    loading: string;
    empty: string;
    error: string;
    count: (total: number) => string;
    page: (page: number, totalPages: number) => string;
    previous: string;
    next: string;
  };
  onPageChange: (page: number) => void;
  onRetry?: () => void;
  retryLabel: string;
};
