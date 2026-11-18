import type { ReactNode } from "react";

/** Botão que abre o seletor (`EmotePickerTriggerButton`): conteúdo visual e rótulo acessível. */
export type EmotePickerTriggerButtonProps = {
  /** Id do seletor que este botão abre (`EmotePickerDialogView`): liga o botão ao diálogo. */
  id: string;
  /** Ícone do botão (o app passa o seu; o padrão é o `EmotePickerIcon`). */
  trigger: ReactNode;
  /** Rótulo acessível e `title`. */
  label: string;
};
