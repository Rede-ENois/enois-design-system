import { useEffect, useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { IdentitySectionProps } from "../../types/domain/security/identity-section-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { BadgeSelection } from "../badges/badge-selection.js";

/**
 * Nome e identidade: nome social (substitui o de cadastro para todo mundo), apelido
 * (entra entre parênteses depois do nome), pronomes (só no perfil) e até 5 emblemas
 * (o primeiro acompanha o nome por todo o app; todos aparecem no perfil). O nome de
 * cadastro continua existindo para o dono da conta e para a empresa que recebe a
 * candidatura — que vê os dois nomes, um abaixo do outro.
 */
export function IdentitySection({
  identity,
  onSave,
  savePending = false,
  badges,
  onAddBadge,
  onRemoveBadge,
  badgeKits,
  onApplyBadgeKit,
  badgesPending = false,
  uploading = false,
  kitsLoading = false,
}: IdentitySectionProps) {
  const messages = useMessages().identitySection;

  const [socialName, setSocialName] = useState("");
  const [nickname, setNickname] = useState("");
  const [pronouns, setPronouns] = useState("");

  useEffect(() => {
    if (!identity) return;
    setSocialName(identity.socialName ?? "");
    setNickname(identity.nickname ?? "");
    setPronouns(identity.pronouns ?? "");
  }, [identity]);

  return (
    <section className="surface-card space-y-3 p-4">
      <div>
        <h2 className="text-base font-medium">{messages.title}</h2>

        <p className="mt-0.5 text-sm text-muted-foreground">{messages.hint}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{messages.socialName}</Label>

          <Input
            value={socialName}
            onChange={(event) => setSocialName(event.target.value)}
            maxLength={160}
            placeholder={messages.placeholderOptional}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{messages.nickname}</Label>

          <Input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            maxLength={60}
            placeholder={messages.placeholderOptional}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{messages.pronouns}</Label>

          <Input
            value={pronouns}
            onChange={(event) => setPronouns(event.target.value)}
            maxLength={60}
            placeholder={messages.pronounsPlaceholder}
          />
        </div>
      </div>

      <Button
        variant="outline"
        className="rounded-full"
        disabled={savePending}
        onClick={() => onSave({ socialName, nickname, pronouns })}
      >
        {messages.save}
      </Button>

      {/* Emblemas: até 5, com o histórico dos últimos 3 kits ao lado. Aqui cada troca salva na
          hora (endpoint próprio), diferente do diálogo de editar perfil que aplica no "Salvar". */}
      <div className="space-y-2 border-t border-border-soft pt-3">
        <p className="text-xs font-medium text-text-strong">{messages.badgesTitle}</p>

        <BadgeSelection
          badges={badges}
          onAddBadge={onAddBadge}
          onRemoveBadge={onRemoveBadge}
          badgeKits={badgeKits}
          onApplyBadgeKit={onApplyBadgeKit}
          uploading={uploading}
          badgesPending={badgesPending}
          kitsLoading={kitsLoading}
        />
      </div>
    </section>
  );
}
