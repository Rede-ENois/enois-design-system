import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button.js";
import { ConfirmDialog } from "./confirm-dialog.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet.js";

const meta: Meta = {
  title: "UI/Overlays",
};

export default meta;

export const DialogStory: StoryObj = {
  name: "Dialog",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Abrir</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>

          <DialogDescription>Atualize suas informações públicas.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirm: StoryObj = {
  render: function ConfirmStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
          Excluir post
        </Button>

        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Excluir post?"
          description="Essa ação não pode ser desfeita."
          confirmLabel="Excluir"
          destructive
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

export const SheetStory: StoryObj = {
  name: "Sheet",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">Abrir menu</Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const PopoverStory: StoryObj = {
  name: "Popover",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          Detalhes
        </Button>
      </PopoverTrigger>

      <PopoverContent>Conteúdo do popover.</PopoverContent>
    </Popover>
  ),
};
