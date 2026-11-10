import { useMemo, useState } from "react";

import { Search } from "lucide-react";

import { THEME_COLLECTIONS } from "../../lib/theme/theme-collections.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CollectionGridProps } from "../../types/domain/appearance/collection-grid-props.js";
import type { ThemeCardProps } from "../../types/domain/appearance/theme-card-props.js";
import type { ThemeCategory } from "../../types/lib/theme/theme-category.js";
import type { ThemeCollection } from "../../types/lib/theme/theme-collection.js";

import { CollectionPreview } from "./collection-preview.js";

const CATEGORY_ORDER: readonly ThemeCategory[] = [
  "casa",
  "retro",
  "web2000",
  "jogos",
  "maquinas",
  "papel",
];

/**
 * Quantos cartões a galeria desenha de uma vez.
 *
 * O catálogo passou de 60 para 85 temas e cada cartão é uma miniatura de perfil:
 * desenhar todos de uma vez custa ~1,5 s de montagem e faz o diálogo abrir travado
 * em aparelho fraco — justamente o que o modo econômico existe para evitar. O
 * primeiro lote cobre o que cabe numa rolagem e o resto entra sob demanda.
 */
const PAGE_SIZE = 18;

/**
 * Galeria de temas, organizada por família.
 *
 * Cada cartão é uma amostra real do tema — uma miniatura de perfil com fundo,
 * superfície, destaque e o efeito que o define — com nome, categoria e uma linha
 * de descrição. Os dois botões separam o que antes era uma coisa só:
 *
 * - **Experimentar** aplica na hora e não grava. Quem fecha o diálogo sem aplicar
 *   volta ao tema que estava em uso (o app desfaz a prévia).
 * - **Aplicar** grava a escolha na conta, para o próximo dispositivo.
 *
 * O cartão da coleção aplicada carrega o selo "Em uso"; o que está em prévia
 * carrega "Em prévia" — sem isso, duas telas com cores diferentes pareciam um bug.
 */
export function CollectionGrid({ activeId, previewId, onPreview, onSelect }: CollectionGridProps) {
  const messages = useMessages().collectionGrid;

  const categoryLabels: Record<ThemeCategory, string> = {
    casa: messages.categoryCasa,
    jogos: messages.categoryJogos,
    maquinas: messages.categoryMaquinas,
    papel: messages.categoryPapel,
    retro: messages.categoryRetro,
    web2000: messages.categoryWeb2000,
  };

  const categories: { id: ThemeCategory | null; label: string }[] = [
    { id: null, label: messages.categoryAll },
    ...CATEGORY_ORDER.map((id) => ({ id, label: categoryLabels[id] })),
  ];

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ThemeCategory | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return THEME_COLLECTIONS.filter((collection) => {
      const catOk = !category || (collection.category ?? "retro") === category;
      const textOk =
        !needle ||
        collection.name.toLowerCase().includes(needle) ||
        collection.description.toLowerCase().includes(needle);
      return catOk && textOk;
    });
  }, [query, category]);

  // Buscar ou trocar de família devolve o lote ao começo: o resultado novo tem que
  // começar do primeiro tema, não continuar de onde a lista anterior parou.
  const search = (value: string) => {
    setQuery(value);
    setLimit(PAGE_SIZE);
  };
  const pickCategory = (value: ThemeCategory | null) => {
    setCategory(value);
    setLimit(PAGE_SIZE);
  };

  // O tema em uso e o em prévia sempre aparecem, mesmo fora do lote: quem abre a galeria
  // precisa ver o que está vestindo sem caçar no "Mostrar mais".
  const shown = filtered.filter(
    (collection, index) =>
      index < limit || collection.id === activeId || collection.id === previewId,
  );
  const remaining = filtered.length - shown.length;

  const categoryOf = (collection: ThemeCollection) =>
    categoryLabels[(collection.category ?? "retro") as ThemeCategory];

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-subtle" />
          <input
            value={query}
            onChange={(event) => search(event.target.value)}
            placeholder={messages.themeSearchPlaceholder}
            className="h-9 w-full rounded-full border border-border-soft bg-surface-1 pl-9 pr-3 text-base md:text-xs outline-none transition focus:border-primary"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => pickCategory(cat.id)}
              aria-pressed={category === cat.id}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                category === cat.id
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-soft text-text-subtle hover:text-text-strong",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <ThemeCard
          name={messages.defaultThemeName}
          description={messages.defaultThemeDescription}
          categoryLabel={null}
          active={activeId === null}
          previewing={previewId === null}
          labels={{
            tryTheme: messages.tryTheme,
            applyTheme: messages.applyTheme,
            inUse: messages.inUse,
            previewing: messages.previewing,
          }}
          onPreview={() => onPreview(null)}
          onApply={() => onSelect(null)}
          preview={
            <div
              className="flex h-20 w-full flex-col rounded-md border border-border-soft p-1.5"
              style={{ background: "linear-gradient(135deg, #f9f8ff, #ede8f5)" }}
            >
              <div className="flex items-center gap-1">
                <span className="h-3.5 w-3.5 rounded-full bg-primary" />
                <span className="h-1.5 w-1/2 rounded-full bg-primary" />
                <span className="ml-auto h-2 w-5 rounded-full bg-primary-soft" />
              </div>

              <div className="mt-1 flex flex-1 flex-col gap-1 rounded-sm border border-border-soft bg-white/70 p-1">
                <span className="h-1 w-full rounded-full bg-border-soft" />
                <span className="h-1 w-4/5 rounded-full bg-border-soft" />

                <span className="mt-auto inline-flex h-3 w-fit items-center self-start rounded-full bg-primary px-1.5 text-[8px] leading-none text-primary-foreground">
                  Aa
                </span>
              </div>
            </div>
          }
        />

        {shown.map((collection) => (
          <ThemeCard
            key={collection.id}
            name={collection.name}
            description={collection.description}
            categoryLabel={categoryOf(collection)}
            active={activeId === collection.id}
            previewing={previewId === collection.id}
            labels={{
              tryTheme: messages.tryTheme,
              applyTheme: messages.applyTheme,
              inUse: messages.inUse,
              previewing: messages.previewing,
            }}
            onPreview={() => onPreview(collection.id)}
            onApply={() => onSelect(collection.id)}
            preview={<CollectionPreview collection={collection} />}
          />
        ))}

        {filtered.length === 0 && (
          <p className="col-span-2 py-4 text-center text-xs text-text-subtle sm:col-span-3">
            {messages.themeSearchEmpty}
          </p>
        )}

        {remaining > 0 && (
          <button
            type="button"
            onClick={() => setLimit((value) => value + PAGE_SIZE)}
            className="col-span-2 rounded-xl border border-dashed border-border-soft px-2 py-2 text-xs font-medium text-text-subtle transition hover:border-primary hover:text-text-strong sm:col-span-3"
          >
            {messages.showMoreThemes(remaining)}
          </button>
        )}
      </div>
    </div>
  );
}

/** Um cartão da galeria: prévia clicável, identidade e as duas ações separadas. */
function ThemeCard({
  name,
  description,
  categoryLabel,
  active,
  previewing,
  labels,
  onPreview,
  onApply,
  preview,
}: ThemeCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-2 text-left",
        active
          ? "border-primary ring-1 ring-primary"
          : previewing
            ? "border-dashed border-primary/60"
            : "border-border-soft",
      )}
    >
      <button
        type="button"
        onClick={onPreview}
        aria-label={`${labels.tryTheme}: ${name}`}
        className="rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {preview}
      </button>

      <div className="mt-1.5 flex items-start gap-1">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-text-strong">{name}</p>

          {categoryLabel && (
            <p className="truncate text-[10px] uppercase tracking-wide text-text-subtle">
              {categoryLabel}
            </p>
          )}
        </div>

        {active ? (
          <span className="shrink-0 rounded-full bg-primary-soft px-1.5 py-0.5 text-[10px] font-medium text-primary">
            {labels.inUse}
          </span>
        ) : previewing ? (
          <span className="shrink-0 rounded-full border border-border-soft px-1.5 py-0.5 text-[10px] font-medium text-text-subtle">
            {labels.previewing}
          </span>
        ) : null}
      </div>

      <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-text-subtle">
        {description}
      </p>

      <div className="mt-1.5 flex gap-1">
        <button
          type="button"
          onClick={onPreview}
          className="flex-1 rounded-md border border-border-soft px-2 py-1 text-[11px] font-medium text-text-strong transition hover:border-primary"
        >
          {labels.tryTheme}
        </button>

        <button
          type="button"
          onClick={onApply}
          disabled={active}
          className="flex-1 rounded-md bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
        >
          {labels.applyTheme}
        </button>
      </div>
    </div>
  );
}
