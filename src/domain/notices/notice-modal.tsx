import { useCallback, useEffect, useState } from "react";

import { X } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import { SandboxedHtmlFrame } from "../../patterns/html-frame/sandboxed-html-frame.js";
import type { NoticeModalProps } from "../../types/domain/notices/notice-modal-props.js";
import type { NoticeTheme } from "../../types/domain/notices/notice-theme.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";

import { extractNoticeTheme, readableTextOn } from "./notice-theme.js";

/**
 * The notice dialog: one surface whose identity comes from the published HTML.
 *
 * The frame document declares `--notice-*` custom properties (the integration contract); this
 * container reads them as soon as the frame loads and paints header, footer, background and
 * confirm button with them. Anything the HTML does not declare falls back to the platform tokens
 * through the `var(--notice-*, <token>)` chain, so a notice without its own identity keeps the
 * platform look — and the container never imposes a palette on the content. The published HTML is
 * never modified: it renders inside the sandboxed frame untouched, no scripts, no forced padding,
 * and the only scroll lives in the content area (the frame grows to its content; the area around
 * it scrolls once, never nested).
 */
export function NoticeModal({
  open,
  onOpenChange,
  title,
  html,
  theme,
  themeStyleElementId,
  publishedAtLabel,
  onConfirm,
}: NoticeModalProps) {
  const messages = useMessages().notices;
  const [declared, setDeclared] = useState<NoticeTheme>({});

  // New notice content can declare a new identity: drop the previous one before the next frame
  // load delivers the document, so the old identity never flashes over the new content.
  useEffect(() => {
    setDeclared({});
  }, [html]);

  const handleFrameDocument = useCallback((doc: Document | null) => {
    setDeclared(extractNoticeTheme(doc));
  }, []);

  const confirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  // The confirm button text resolves here: the declared button text wins; with a primary declared
  // and no button text, the color with readable contrast on it takes the same custom property —
  // the button class stays static either way.
  const buttonText = declared.buttonText ?? readableTextOn(declared.primary) ?? undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        style={{
          "--notice-primary": declared.primary,
          "--notice-background": declared.background,
          "--notice-surface": declared.surface,
          "--notice-text": declared.text,
          "--notice-muted": declared.muted,
          "--notice-border": declared.border,
          "--notice-button-text": buttonText,
        }}
        className="flex w-[calc(100vw-24px)] max-w-[680px] flex-col gap-0 overflow-hidden border-0 bg-[var(--notice-background,var(--background))] p-0 text-[var(--notice-text,var(--foreground))] max-h-[92dvh] sm:max-h-[85vh]"
      >
        <DialogHeader className="shrink-0 flex-row items-start justify-between gap-2 space-y-0 border-b border-[var(--notice-border,var(--border))] bg-[var(--notice-surface,transparent)] px-4 py-3 text-left sm:px-5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--notice-muted,var(--muted-foreground))]">
              {messages.label}
            </p>

            <DialogTitle className="mt-0.5 truncate text-base font-semibold leading-snug tracking-normal">
              {title}
            </DialogTitle>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={messages.close}
            className="shrink-0 rounded-full p-2.5 text-[var(--notice-muted,var(--muted-foreground))] transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--notice-primary,var(--ring))] motion-reduce:transition-none"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>

          <DialogDescription className="sr-only">{messages.description}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <SandboxedHtmlFrame
            html={html}
            title={title}
            theme={theme}
            themeStyleElementId={themeStyleElementId}
            innerPadding={false}
            onFrameDocument={handleFrameDocument}
          />
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--notice-border,var(--border))] bg-[var(--notice-surface,transparent)] px-4 py-3 sm:px-5">
          <p className="min-w-0 truncate text-xs text-[var(--notice-muted,var(--muted-foreground))]">
            {publishedAtLabel}
          </p>

          <button
            type="button"
            onClick={confirm}
            className="shrink-0 rounded-full bg-[var(--notice-primary,var(--primary))] px-5 py-2.5 text-sm font-semibold text-[var(--notice-button-text,var(--primary-foreground))] transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--notice-primary,var(--ring))] motion-reduce:transition-none"
          >
            {messages.confirm}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
