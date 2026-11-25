import { createPortal } from "react-dom";

import type { ComposerStickerSuggestionsProps } from "../../types/domain/emotes/composer-sticker-suggestions-props.js";

const ALTURA = 240;
const LARGURA = 288;

/**
 * Menu do autocomplete de figurinhas do compositor.
 *
 * Nasce num portal preso ao campo (o campo do editor não deixa o menu transbordar, e um menu
 * absoluto dentro dele seria recortado). O `onMouseDown` com `preventDefault` mantém o foco no
 * texto — quem clica com o mouse continua digitando depois de escolher, e o clique não fecha o
 * menu antes de o item ser lido.
 *
 * A posição vem da caixa do campo em coordenadas de tela, assim o menu acompanha a rolagem sem
 * precisar medir texto.
 */
export function ComposerStickerSuggestions({
  id,
  opcoes,
  destaque,
  destaqueId,
  carregando = false,
  loadingLabel,
  listLabel,
  onEscolher,
  onDestacar,
  anchor,
}: ComposerStickerSuggestionsProps) {
  if (typeof document === "undefined") return null;
  const caixa = anchor.current?.getBoundingClientRect();
  if (!caixa) return null;

  const topo = Math.min(caixa.bottom + 4, window.innerHeight - ALTURA - 8);
  const esquerda = Math.min(caixa.left, Math.max(8, window.innerWidth - LARGURA - 8));

  if (opcoes.length === 0) {
    if (!carregando) return null;
    return createPortal(
      <div
        role="status"
        style={{
          "--menu-top": `${topo}px`,
          "--menu-left": `${esquerda}px`,
          "--menu-width": `${LARGURA}px`,
        }}
        className="fixed left-(--menu-left) top-(--menu-top) z-50 w-(--menu-width) rounded-md border border-border-soft bg-surface-1 px-3 py-2 text-xs text-text-subtle shadow-md"
      >
        {loadingLabel}
      </div>,
      document.body,
    );
  }

  return createPortal(
    <ul
      id={id}
      role="listbox"
      aria-label={listLabel}
      style={{
        "--menu-top": `${topo}px`,
        "--menu-left": `${esquerda}px`,
        "--menu-width": `${LARGURA}px`,
        "--menu-height": `${ALTURA}px`,
      }}
      className="fixed left-(--menu-left) top-(--menu-top) z-50 max-h-(--menu-height) w-(--menu-width) overflow-y-auto rounded-md border border-border-soft bg-surface-1 py-1 shadow-md"
    >
      {opcoes.map((opcao, indice) => (
        <li
          key={opcao.code}
          id={`${id}-opcao-${indice}`}
          role="option"
          aria-selected={destaqueId ? opcao.id === destaqueId : indice === destaque}
          className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm ${
            (destaqueId ? opcao.id === destaqueId : indice === destaque) ? "bg-surface-2" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()}
          onMouseEnter={() => onDestacar(indice)}
          onClick={() => onEscolher(opcao.code)}
        >
          <img src={opcao.src} alt="" className="h-6 w-6 shrink-0 object-contain" />

          <span className="shrink-0 truncate font-mono text-xs">:{opcao.code}:</span>
          {opcao.nome && opcao.nome !== opcao.code ? (
            <span className="truncate text-xs text-text-subtle">{opcao.nome}</span>
          ) : null}
          <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wide text-text-subtle">
            {opcao.origem}
          </span>
        </li>
      ))}
    </ul>,
    document.body,
  );
}

/**
 * Monta o menu no `body` (portal), preso ao campo por `anchorRef`. Fora do campo, ele não é
 * recortado pelo `overflow` do formulário e não some atrás de barras fixas.
 */

/**
 * Liga o menu ao campo para leitores de tela: devolve os atributos ARIA do `textarea`.
 * Vazio quando o menu está fechado — fora do modo combobox, sem `aria-controls` pendurado.
 */
export function composerSuggestionsAria(
  id: string,
  aberto: boolean,
  destaque: number,
): {
  "aria-autocomplete"?: "list";
  "aria-controls"?: string;
  "aria-expanded"?: true;
  "aria-activedescendant"?: string;
} {
  if (!aberto) return {};
  return {
    "aria-autocomplete": "list",
    "aria-controls": id,
    "aria-expanded": true,
    ...(destaque >= 0 ? { "aria-activedescendant": `${id}-opcao-${destaque}` } : {}),
  };
}
