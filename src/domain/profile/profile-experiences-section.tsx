import { Briefcase, MapPin } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ProfileExperienceItem } from "../../types/domain/profile/profile-experience-item.js";
import type { ProfileExperiencesSectionProps } from "../../types/domain/profile/profile-experiences-section-props.js";

function ExperienceItem({ item }: { item: ProfileExperienceItem }) {
  const messages = useMessages().profileExperiencesSection;
  const period = item.startLabel
    ? `${item.startLabel} - ${
        item.currentlyHere || !item.endLabel ? messages.present : item.endLabel
      }`
    : item.currentlyHere || !item.endLabel
      ? messages.present
      : null;
  const duration = item.startLabel && item.months !== null ? messages.duration(item.months) : null;

  return (
    <li className="flex gap-3 border-t border-border-soft pt-4 first:border-t-0 first:pt-0">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary">
        <Briefcase className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="break-words font-medium text-text-strong">{item.title}</h3>

        <p className="break-words text-sm text-text-subtle">
          {item.company}
          {item.location ? (
            <>
              {" · "}
              <span className="inline-flex items-center gap-1">
                <MapPin className="inline h-3 w-3" />
                {item.location}
              </span>
            </>
          ) : null}
        </p>

        {(period || duration) && (
          <p className="mt-0.5 text-xs text-text-subtle">
            {[period, duration].filter(Boolean).join(" · ")}
          </p>
        )}

        {item.description && (
          <p className="mt-2 whitespace-pre-line break-words text-sm text-text-subtle">
            {item.description}
          </p>
        )}
      </div>
    </li>
  );
}

/**
 * Trajetória profissional abaixo dos projetos: cargo, empresa, local, período (com "atual" para
 * quem está lá) e a descrição de cada posição — o que o LinkedIn mostra, no perfil do Énóis.
 */
export function ProfileExperiencesSection({ experiences }: ProfileExperiencesSectionProps) {
  const messages = useMessages().profileExperiencesSection;

  if (experiences.length === 0) return null;

  return (
    <section className="border border-border-soft bg-surface-card">
      <div className="px-4 pb-3 pt-4 sm:px-6 sm:pt-6">
        <h2 className="text-base font-normal text-text-strong">{messages.title}</h2>
      </div>

      <ul className="space-y-4 px-4 pb-5 sm:px-6">
        {experiences.map((item) => (
          <ExperienceItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
