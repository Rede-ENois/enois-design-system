import { useMessages } from "../../messages/messages-context.js";
import type { NavigationDrawerProps } from "../../types/patterns/navigation-drawer-props.js";
import { Sheet, SheetContent, SheetTitle } from "../../ui/sheet.js";

export function NavigationDrawer({ open, onClose, brand, children }: NavigationDrawerProps) {
  const messages = useMessages().navigationDrawer;

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <SheetContent
        side="left"
        overlayClassName="bg-black/55 backdrop-blur-sm lg:hidden"
        // A floating soft panel, not a list glued to the screen edge: it reads as a place you
        // opened, and the rounded corners match the rest of the app's tables.
        className="inset-y-2.5 left-2.5 flex h-auto w-[19.5rem] max-w-[calc(100vw-1.25rem)] flex-col rounded-[2rem] border-0 bg-background bg-[image:var(--lamp)] bg-no-repeat p-0 shadow-[var(--shadow-float)] lg:hidden [&>button]:right-3 [&>button]:top-3 [&>button]:grid [&>button]:h-10 [&>button]:w-10 [&>button]:place-items-center [&>button]:rounded-full [&>button]:text-text-subtle [&>button]:opacity-100 [&>button]:transition [&>button:hover]:bg-surface-2 [&>button:hover]:text-text-strong"
      >
        <SheetTitle className="sr-only">{messages.title}</SheetTitle>

        <div className="flex h-16 shrink-0 items-center px-4">{brand}</div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 pb-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
