import { MoreVertical } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { RichTextToolbarMenuProps } from "../../types/patterns/rich-text-toolbar-menu-props.js";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover.js";

import { RichTextToolbar } from "./rich-text-toolbar.js";

/**
 * Barra de formatação recolhida atrás do botão de três pontos.
 *
 * O campo de escrita compacto não gasta uma linha com nove botões: o "⋮" no canto superior
 * direito abre a mesma barra num popover. A seleção do texto continua no textarea enquanto o
 * menu está aberto — os botões não roubam o foco (`onMouseDown` com `preventDefault`).
 */
export function RichTextToolbarMenu({
  onFormat,
  onEmoji,
  label,
  className,
}: RichTextToolbarMenuProps) {
  const messages = useMessages().richTextToolbar;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={messages.menu}
          title={messages.menu}
          className={cn(
            "grid h-7 w-7 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-primary data-[state=open]:bg-surface-2 data-[state=open]:text-primary",
            className,
          )}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={4}
        collisionPadding={8}
        className="w-[min(15.5rem,calc(100vw-1rem))] rounded-2xl border-border-soft p-2"
      >
        <RichTextToolbar label={label} onFormat={onFormat} onEmoji={onEmoji} />
      </PopoverContent>
    </Popover>
  );
}
