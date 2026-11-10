import type { CSSProperties } from "react";

import type { CollectionPreviewProps } from "../../types/domain/appearance/collection-preview-props.js";

/**
 * Miniatura de um tema da coleção: uma MINIATURA DE PERFIL desenhada com os dados
 * do próprio tema — fundo, superfície, destaque, borda e o efeito que o define
 * (relevo, vidro, gloss, pixel, néon).
 *
 * Mostrar um perfil, e não só um retângulo de cor, é o que deixa a decisão honesta:
 * a pessoa vê como o nome, o selo e o cartão de post ficariam antes de aplicar.
 *
 * É o lugar único onde estilo inline é permitido aqui: a galeria existe para
 * *mostrar os valores do tema*, e cada tema tem os seus.
 */
export function CollectionPreview({ collection }: CollectionPreviewProps) {
  const preview = collection.preview;

  const effect: CSSProperties =
    preview.effect === "bevel"
      ? {
          boxShadow:
            "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
        }
      : preview.effect === "glass"
        ? {
            backdropFilter: "blur(6px) saturate(1.15)",
            boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.7)",
          }
        : preview.effect === "glossy"
          ? { boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.8)" }
          : preview.effect === "neumorph"
            ? {
                boxShadow: "4px 4px 8px #c5cad3, -4px -4px 8px #ffffff",
                borderColor: "transparent",
              }
            : preview.effect === "terminal"
              ? { textShadow: "0 0 6px currentColor" }
              : preview.effect === "pixel"
                ? { boxShadow: `2px 2px 0 ${preview.border}`, borderWidth: 2 }
                : {};

  return (
    <div
      className="h-20 w-full rounded-md border p-1.5"
      style={{ background: preview.background, borderColor: preview.border }}
    >
      <div
        className="flex h-full w-full flex-col gap-1 rounded-sm p-1.5"
        style={{ background: preview.surface, border: `1px solid ${preview.border}`, ...effect }}
      >
        {/* Cabeçalho de perfil: avatar, nome e selo. */}
        <div className="flex items-center gap-1">
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-full"
            style={{ background: preview.primary, opacity: 0.9 }}
          />
          <span
            className="h-1.5 w-1/2 rounded-full"
            style={{ background: preview.primary, opacity: 0.75 }}
          />
          <span
            className="ml-auto h-2 w-5 rounded-full"
            style={{ background: preview.primary, opacity: 0.35 }}
          />
        </div>

        {/* Cartão de post do perfil. */}
        <div
          className="flex flex-1 flex-col gap-1 rounded-sm p-1"
          style={{ background: preview.background, border: `1px solid ${preview.border}` }}
        >
          <span className="h-1 w-full rounded-full" style={{ background: preview.border }} />
          <span className="h-1 w-4/5 rounded-full" style={{ background: preview.border }} />

          <span
            className="mt-auto inline-flex h-3 w-fit items-center self-start px-1.5 text-[8px] leading-none"
            style={{ background: preview.primary, color: preview.onPrimary }}
          >
            Aa
          </span>
        </div>
      </div>
    </div>
  );
}
