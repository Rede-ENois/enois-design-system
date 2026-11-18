import {
  Bold,
  Code,
  EyeOff,
  Heading2,
  Italic,
  Link2,
  List,
  Quote,
  Strikethrough,
} from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { RichTextFormat } from "../../types/lib/rich-text/rich-text-format.js";
import type { RichTextToolbarProps } from "../../types/patterns/rich-text-toolbar-props.js";
import { EmojiPicker } from "../../ui/emoji-picker.js";

const ACTIONS: { format: RichTextFormat; icon: typeof Bold }[] = [
  { format: "bold", icon: Bold },
  { format: "italic", icon: Italic },
  { format: "strike", icon: Strikethrough },
  { format: "heading", icon: Heading2 },
  { format: "bulletList", icon: List },
  { format: "quote", icon: Quote },
  { format: "code", icon: Code },
  { format: "link", icon: Link2 },
  { format: "spoiler", icon: EyeOff },
];

/**
 * Barra de formatacao do campo de escrita.
 *
 * `onMouseDown` com `preventDefault` mantem o foco (e a selecao) no textarea: sem isso o clique
 * no botao levaria o cursor embora e a formatacao cairia no lugar errado — ou em nada.
 */
export function RichTextToolbar({
  onFormat,
  onEmoji,
  extraActions,
  label,
  className,
}: RichTextToolbarProps) {
  const messages = useMessages().richTextToolbar;

  return (
    <div role="toolbar" aria-label={label} className={cn("flex flex-wrap gap-0.5", className)}>
      {ACTIONS.map(({ format, icon: Icon }) => (
        <button
          key={format}
          type="button"
          title={messages.actions[format]}
          aria-label={messages.actions[format]}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onFormat(format)}
          className="grid h-7 w-7 place-items-center rounded-lg text-text-subtle transition hover:bg-surface-2 hover:text-primary"
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}

      {/* O emoji entra por último na barra: é o único que não é formatação, e fica longe dos
          botões de marcação para não ser clicado por engano. */}
      {onEmoji && (
        <EmojiPicker
          onPick={onEmoji}
          buttonTitle={messages.emoji}
          buttonClassName="grid h-7 w-7 place-items-center rounded-lg text-text-subtle transition hover:bg-surface-2 hover:text-primary"
        />
      )}

      {/* Depois do emoji, pelo mesmo motivo: o que não formata fica no fim da barra. */}
      {extraActions}
    </div>
  );
}
