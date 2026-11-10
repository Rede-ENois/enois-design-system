import { useEffect, useRef, useState } from "react";

import { RotateCcw } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { LookKey } from "../../types/domain/appearance/look-key.js";
import type { ProfileLookDialogProps } from "../../types/domain/appearance/profile-look-dialog-props.js";
import type { ProfileLookPair } from "../../types/lib/theme/profile-look-pair.js";
import { EMPTY_PROFILE_LOOK } from "../../types/lib/theme/profile-look.js";
import type { ProfileLook } from "../../types/lib/theme/profile-look.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Label } from "../../ui/label.js";
import { Switch } from "../../ui/switch.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.js";

import { CollectionGrid } from "./collection-grid.js";

const SELECT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm";

const LOOK_KEYS: readonly LookKey[] = ["social", "professional"];

/**
 * Aparência da vitrine: um tema e alguns ajustes finos para o perfil social e outros para o
 * profissional.
 *
 * O rascunho vive aqui até o "Salvar" — mexer na galeria deste diálogo não muda o app de quem
 * está editando, porque o tema do perfil é para quem visita, não para quem edita. "Restaurar
 * original" limpa o lado que está aberto e devolve o padrão da plataforma.
 */
export function ProfileLookDialog({
  open,
  onOpenChange,
  value,
  onSave,
  onDraftChange,
  saving,
}: ProfileLookDialogProps) {
  const messages = useMessages().profileLookDialog;
  const [draft, setDraft] = useState<ProfileLookPair>(value);
  const [tab, setTab] = useState<LookKey>("social");
  const wasOpen = useRef(false);

  // Só reabastece o rascunho na ABERTURA: salvar/refazer a consulta não pode apagar o que a
  // pessoa acabou de escolher enquanto o diálogo está aberto.
  useEffect(() => {
    if (open && !wasOpen.current) {
      setDraft(value);
      setTab("social");
    }
    wasOpen.current = open;
  }, [open, value]);

  const look = draft[tab];

  /**
   * Toda mudança passa por aqui: atualiza o rascunho e avisa quem estiver pré-visualizando.
   * A notificação usa o estado novo calculado a partir do anterior, não o `draft` capturado
   * no render — duas mudanças no mesmo tick não podem se sobrescrever.
   */
  function change(next: (previous: ProfileLookPair) => ProfileLookPair) {
    setDraft((previous) => {
      const updated = next(previous);
      onDraftChange?.(updated);
      return updated;
    });
  }

  function patchLook(key: LookKey, patch: Partial<ProfileLook>) {
    change((previous) => ({ ...previous, [key]: { ...previous[key], ...patch } }));
  }

  function restore(key: LookKey) {
    change((previous) => ({ ...previous, [key]: { ...EMPTY_PROFILE_LOOK } }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">{messages.title}</DialogTitle>

          <DialogDescription>{messages.description}</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(next) => setTab(next as LookKey)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="social">{messages.tabSocial}</TabsTrigger>

            <TabsTrigger value="professional">{messages.tabProfessional}</TabsTrigger>
          </TabsList>

          {LOOK_KEYS.map((key) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">{messages.presetsTitle}</p>

                <p className="text-xs text-muted-foreground">{messages.presetsHint}</p>
              </div>

              <CollectionGrid
                activeId={draft[key].theme}
                onPreview={(collectionId) => patchLook(key, { theme: collectionId })}
                onSelect={(collectionId) => patchLook(key, { theme: collectionId })}
              />

              <section className="space-y-3 rounded-xl border border-border-soft p-4">
                <p className="text-sm font-medium">{messages.advancedTitle}</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`profile-look-font-${key}`}>{messages.fontLabel}</Label>

                    <select
                      id={`profile-look-font-${key}`}
                      className={SELECT_CLASS}
                      value={look.font ?? ""}
                      onChange={(event) =>
                        patchLook(key, {
                          font: (event.target.value || null) as ProfileLook["font"],
                        })
                      }
                    >
                      <option value="">{messages.fontTheme}</option>

                      <option value="sans">{messages.fontSans}</option>

                      <option value="serif">{messages.fontSerif}</option>

                      <option value="mono">{messages.fontMono}</option>

                      <option value="rounded">{messages.fontRounded}</option>

                      <option value="display">{messages.fontDisplay}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`profile-look-header-${key}`}>{messages.headerLabel}</Label>

                    <select
                      id={`profile-look-header-${key}`}
                      className={SELECT_CLASS}
                      value={look.header ?? ""}
                      onChange={(event) =>
                        patchLook(key, {
                          header: (event.target.value || null) as ProfileLook["header"],
                        })
                      }
                    >
                      <option value="">{messages.headerTheme}</option>

                      <option value="clean">{messages.headerClean}</option>

                      <option value="gradient">{messages.headerGradient}</option>

                      <option value="solid">{messages.headerSolid}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`profile-look-borders-${key}`}>{messages.bordersLabel}</Label>

                    <select
                      id={`profile-look-borders-${key}`}
                      className={SELECT_CLASS}
                      value={look.borders ?? ""}
                      onChange={(event) =>
                        patchLook(key, {
                          borders: (event.target.value || null) as ProfileLook["borders"],
                        })
                      }
                    >
                      <option value="">{messages.bordersTheme}</option>

                      <option value="rounded">{messages.bordersRounded}</option>

                      <option value="square">{messages.bordersSquare}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`profile-look-decoration-${key}`}>
                      {messages.decorationLabel}
                    </Label>

                    <select
                      id={`profile-look-decoration-${key}`}
                      className={SELECT_CLASS}
                      value={look.decoration === null ? "" : String(look.decoration)}
                      onChange={(event) =>
                        patchLook(key, {
                          decoration:
                            event.target.value === ""
                              ? null
                              : (Number(event.target.value) as 0 | 1 | 2),
                        })
                      }
                    >
                      <option value="">{messages.decorationTheme}</option>

                      <option value="0">{messages.decorationNone}</option>

                      <option value="1">{messages.decorationSoft}</option>

                      <option value="2">{messages.decorationStrong}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`profile-look-accent-${key}`}>{messages.accentLabel}</Label>

                  <div className="flex items-center gap-2">
                    <input
                      id={`profile-look-accent-${key}`}
                      type="color"
                      aria-label={messages.accentLabel}
                      value={look.accent ?? "#7c3aed"}
                      onChange={(event) => patchLook(key, { accent: event.target.value })}
                      className="h-9 w-14 cursor-pointer rounded-md border border-input bg-transparent"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => patchLook(key, { accent: null })}
                    >
                      {messages.accentTheme}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <Label htmlFor={`profile-look-textures-${key}`}>{messages.texturesLabel}</Label>

                    <p className="text-xs text-muted-foreground">{messages.texturesHint}</p>
                  </div>

                  <Switch
                    id={`profile-look-textures-${key}`}
                    checked={look.textures !== false}
                    onCheckedChange={(checked) =>
                      patchLook(key, { textures: checked ? null : false })
                    }
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => restore(key)}
                >
                  <RotateCcw className="h-4 w-4" />

                  {messages.restore}
                </Button>
              </section>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {messages.cancel}
          </Button>

          <Button onClick={() => onSave(draft)} disabled={saving}>
            {messages.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
