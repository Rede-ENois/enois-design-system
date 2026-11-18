import { Smile } from "lucide-react";

export { EmoteCell, EmotePageButton } from "./emote-cell.js";
export { EmotePickerDialogView, EmotePickerTriggerButton } from "./emote-picker-dialog-view.js";

/** Ícone do botão que abre o seletor (o botão é o `EmotePickerTriggerButton`). */
export function EmotePickerIcon() {
  return <Smile className="h-3.5 w-3.5" />;
}
