import { Award } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ProfileSealsProps } from "../../types/domain/profile/profile-seals-props.js";

/**
 * Selos oficiais de contribuição no perfil. Só chegam aqui evidências validadas; notas internas e
 * suspeitas nunca são projetadas pela API pública. O nível exibido já vem calculado do backend.
 */
export function ProfileSeals({ seals, renderEvidence }: ProfileSealsProps) {
  const messages = useMessages().profileSeals;

  if (seals.length === 0) return null;

  return (
    <section aria-labelledby="profile-seals-title" className="surface-card space-y-4 p-4 sm:p-5">
      <h2
        id="profile-seals-title"
        className="text-xs font-semibold uppercase tracking-widest text-text-subtle"
      >
        {messages.title}
      </h2>

      {seals.map((seal) => (
        <article
          key={seal.type}
          className="space-y-2 border-t border-border-soft pt-3 first:border-0 first:pt-0"
        >
          <div className="flex flex-wrap items-center gap-2">
            {seal.emblemSrc ? (
              <img
                src={seal.emblemSrc}
                alt=""
                width={48}
                height={48}
                loading="lazy"
                className="h-12 w-12 shrink-0"
              />
            ) : (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <Award className="h-5 w-5" aria-hidden />
              </span>
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-strong">{seal.name}</p>

              <p className="text-xs text-text-subtle">
                {seal.categoryName}
                {" · "}
                {messages.tierRange(seal.minCount, seal.maxCount)}
                {" · "}
                {messages.verified(seal.evidenceCount)}
              </p>

              <p className="text-xs text-text-subtle">
                {messages.grantedAt} {seal.grantedAtLabel}
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{seal.description}</p>

          {renderEvidence(seal)}
        </article>
      ))}
    </section>
  );
}
