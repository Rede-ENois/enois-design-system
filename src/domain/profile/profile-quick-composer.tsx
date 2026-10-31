import { type ChangeEvent, useEffect, useRef, useState } from "react";

import { EyeOff, FilePenLine, Image, Send, Video, X } from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ProfileQuickComposerMediaItem } from "../../types/domain/profile/profile-quick-composer-media-item.js";
import type { ProfileQuickComposerProps } from "../../types/domain/profile/profile-quick-composer-props.js";
import { Button } from "../../ui/button.js";
import { Textarea } from "../../ui/textarea.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { SpoilerPreview } from "../post/media/spoiler-preview.js";

export function ProfileQuickComposer({
  profile,
  publishPending = false,
  uploadProgress,
  onPublish,
  onWriteArticle,
}: ProfileQuickComposerProps) {
  const messages = useMessages().profileQuickComposer;
  const { resolveMediaUrl } = useAdapters();
  const [content, setContent] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [media, setMedia] = useState<ProfileQuickComposerMediaItem[]>([]);
  const [mediaSpoiler, setMediaSpoiler] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingAccept = useRef<"image" | "video" | null>(null);

  const addMediaFiles = (files: File[], filter?: "image" | "video") => {
    for (const file of files) {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) continue;
      if (filter === "video" && !isVideo) continue;
      if (filter === "image" && !isImage) continue;

      const hasImages = media.some((m) => m.type === "image");
      const hasVideo = media.some((m) => m.type === "video");

      if (isVideo && (hasImages || hasVideo || media.length >= 1)) break;
      if (isImage && hasVideo) break;
      if (isImage && media.length >= 4) break;

      const preview = URL.createObjectURL(file);
      setMedia((prev) => [...prev, { type: isVideo ? "video" : "image", file, preview }]);
    }
  };

  const handleMediaSelect = (event: ChangeEvent<HTMLInputElement>) => {
    addMediaFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setMediaSpoiler(false);
      return next;
    });
  };

  const openWithMedia = (accept: "image" | "video") => {
    if (!isComposerOpen) {
      pendingAccept.current = accept;
      setIsComposerOpen(true);
    } else if (fileRef.current) {
      fileRef.current.accept = accept === "video" ? "video/*" : "image/*";
      fileRef.current.multiple = accept !== "video";
      fileRef.current.click();
    }
  };

  useEffect(() => {
    if (!isComposerOpen || !pendingAccept.current || !fileRef.current) return;
    const accept = pendingAccept.current;
    pendingAccept.current = null;
    fileRef.current.accept = accept === "video" ? "video/*" : "image/*";
    fileRef.current.multiple = accept !== "video";
    fileRef.current.click();
  }, [isComposerOpen]);

  const publish = async () => {
    const ok = await onPublish({
      content: content.trim(),
      files: media.map((m) => m.file),
      mediaSpoiler,
    });
    if (ok) {
      setContent("");
      media.forEach((m) => URL.revokeObjectURL(m.preview));
      setMedia([]);
      setMediaSpoiler(false);
      setIsComposerOpen(false);
    }
  };

  const reset = () => {
    setContent("");
    media.forEach((m) => URL.revokeObjectURL(m.preview));
    setMedia([]);
    setMediaSpoiler(false);
    setIsComposerOpen(false);
  };

  return (
    <section className="rounded-2xl border border-primary/20 bg-surface-card p-4 shadow-[0_20px_60px_-44px_color-mix(in_oklab,var(--primary)_95%,transparent)] sm:p-5">
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleMediaSelect}
      />

      {!isComposerOpen ? (
        <>
          <div className="flex items-center gap-3">
            <UserAvatar
              frame={profile.avatarFrame}
              src={resolveMediaUrl(profile.avatar)}
              alt={profile.name}
              className="h-10 w-10 shrink-0"
            />

            <button
              type="button"
              onClick={() => setIsComposerOpen(true)}
              className="flex h-11 flex-1 items-center rounded-full border border-border-soft bg-surface-1 px-5 text-left text-sm font-medium text-text-subtle transition hover:border-primary/40 hover:bg-surface-2 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {messages.start}
            </button>
          </div>

          <div
            className={`mt-3 grid ${onWriteArticle ? "grid-cols-3" : "grid-cols-2"} divide-x divide-border-soft border-t border-border-soft pt-3`}
          >
            <button
              type="button"
              onClick={() => openWithMedia("video")}
              className="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-text-subtle transition hover:bg-surface-2 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Video className="h-4 w-4 text-primary" />
              {messages.video}
            </button>

            <button
              type="button"
              onClick={() => openWithMedia("image")}
              className="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-text-subtle transition hover:bg-surface-2 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Image className="h-4 w-4 text-primary" />
              {messages.photo}
            </button>

            {onWriteArticle && (
              <button
                type="button"
                onClick={onWriteArticle}
                className="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-text-subtle transition hover:bg-surface-2 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <FilePenLine className="h-4 w-4 text-primary" />
                {messages.article}
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={messages.placeholder}
            rows={3}
            maxLength={1000}
            autoFocus
            className="min-h-[7rem] resize-none border-border-soft bg-surface-1 text-sm leading-relaxed shadow-inner"
          />

          {media.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {media.map((item, i) => (
                <div key={item.preview} className="relative">
                  <SpoilerPreview
                    active={mediaSpoiler}
                    label="Spoiler"
                    className="h-20 w-20 rounded-lg"
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.preview}
                        muted
                        className="h-20 w-20 rounded-lg border border-border-soft object-cover bg-surface-1"
                      />
                    ) : (
                      <img
                        src={item.preview}
                        alt=""
                        className="h-20 w-20 rounded-lg border border-border-soft object-cover"
                      />
                    )}
                  </SpoilerPreview>

                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-foreground text-background shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setMediaSpoiler((v) => !v)}
                className={`inline-flex h-8 items-center gap-1 self-end rounded-full px-2 text-xs transition ${
                  mediaSpoiler
                    ? "bg-primary text-primary-foreground"
                    : "border border-border-soft text-text-subtle hover:border-primary hover:text-primary"
                }`}
              >
                <EyeOff className="h-3.5 w-3.5" />

                {mediaSpoiler ? messages.mediaSpoilerActive : messages.mediaSpoiler}
              </button>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-border-soft pt-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.accept = "image/*,video/*";
                    fileRef.current.multiple = true;
                    fileRef.current.click();
                  }
                }}
                className="grid h-8 w-8 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-primary"
              >
                <Image className="h-4 w-4" />
              </button>

              {uploadProgress && <span className="text-xs text-text-subtle">{uploadProgress}</span>}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="rounded-full" onClick={reset}>
                {messages.cancel}
              </Button>

              <Button
                size="sm"
                className="shrink-0 gap-1.5 rounded-full"
                onClick={() => void publish()}
                disabled={!content.trim() || publishPending}
              >
                <Send className="h-3.5 w-3.5" />

                <>{publishPending ? messages.sending : messages.action}</>
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
