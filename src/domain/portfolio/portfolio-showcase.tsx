import { ExternalLink, FileText, ImageOff, Link2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { PortfolioBlock } from "../../types/domain/portfolio/portfolio-block.js";
import type { PortfolioShowcaseProps } from "../../types/domain/portfolio/portfolio-showcase-props.js";
import { StyledName } from "../name/styled-name.js";

/**
 * A vitrine profissional como qualquer pessoa a vê: a página em HTML/CSS no quadro isolado e as
 * peças publicadas, na ordem do autor.
 *
 * O que abre em outra aba (PDF, link, repositório) é âncora com `rel="noopener noreferrer"`: a
 * peça não ganha acesso à janela de quem lê. A imagem do card é só a página renderizada do PDF; o
 * arquivo inteiro só abre pelo botão.
 */
export function PortfolioShowcase({
  author,
  profileHref,
  html,
  blocks,
  publishedAt,
  renderHtmlFrame,
  unavailable = false,
}: PortfolioShowcaseProps) {
  const messages = useMessages().portfolioShowcase;

  if (unavailable) {
    return (
      <div className="surface-card p-10 text-center">
        <p className="text-base font-normal text-text-strong">{messages.unavailable}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <a href={profileHref} className="flex items-center gap-3">
          <StyledName name={author.name} className="text-lg font-semibold text-text-strong" />
        </a>

        {publishedAt && (
          <p className="text-xs font-normal text-text-subtle">
            {messages.publishedOn(publishedAt)}
          </p>
        )}
      </header>

      {html && (
        <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface-card">
          {renderHtmlFrame({
            html,
            title: author.name,
            className: "min-h-64 w-full border-0",
            autoHeight: false,
          })}
        </div>
      )}

      {blocks.length === 0 && !html ? (
        <p className="surface-card p-8 text-center text-sm font-normal text-muted-foreground">
          {messages.empty}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {blocks.map((block) => (
            <li key={block.id}>
              <ShowcaseCard block={block} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ShowcaseCard({ block }: { block: PortfolioBlock }) {
  const messages = useMessages().portfolioShowcase;
  const kindLabel = messages.kinds[block.kind];

  return (
    <article className="surface-card flex h-full flex-col overflow-hidden">
      {block.imageUrl ? (
        <img
          src={block.imageUrl}
          alt={block.title ?? kindLabel}
          className="aspect-[16/10] w-full object-cover"
          loading="lazy"
        />
      ) : block.mediaKind ? (
        <div className="flex aspect-[16/10] w-full items-center justify-center bg-surface-1 text-text-subtle">
          <ImageOff className="h-6 w-6" aria-hidden />

          <span className="sr-only">{messages.mediaUnavailable}</span>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-normal uppercase tracking-wide text-text-subtle">{kindLabel}</p>

        {block.project ? (
          <ProjectDetails project={block.project} />
        ) : (
          <>
            {block.title && (
              <h2 className="break-words text-base font-semibold text-text-strong">
                {block.title}
              </h2>
            )}

            {block.text && (
              <p className="whitespace-pre-line break-words text-sm font-normal text-muted-foreground">
                {block.text}
              </p>
            )}
          </>
        )}

        {block.mediaKind === "PDF" && block.fileUrl && (
          <a
            href={block.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 text-sm font-normal text-primary hover:underline"
          >
            <FileText className="h-4 w-4" aria-hidden />

            <>{messages.openPdf}</>
          </a>
        )}

        {block.kind === "LINK" && block.linkUrl && (
          <a
            href={block.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 break-all text-sm font-normal text-primary hover:underline"
          >
            <Link2 className="h-4 w-4 shrink-0" aria-hidden />

            <>{messages.openLink}</>
          </a>
        )}
      </div>
    </article>
  );
}

const MAX_STACK = 6;

function ProjectDetails({ project }: { project: NonNullable<PortfolioBlock["project"]> }) {
  return (
    <>
      <h2 className="break-words text-base font-semibold text-text-strong">{project.title}</h2>

      {project.description && (
        <p className="line-clamp-3 break-words text-sm font-normal text-muted-foreground">
          {project.description}
        </p>
      )}

      {project.stack.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, MAX_STACK).map((skill) => (
            <li
              key={skill}
              className={cn(
                "rounded-full border border-border-soft px-2 py-0.5 text-xs font-normal text-text-subtle",
              )}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}

      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 break-all text-sm font-normal text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />

          <>{project.repoUrl}</>
        </a>
      )}
    </>
  );
}
