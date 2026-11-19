import { Loader2 } from "lucide-react";

import { safeHref } from "../../lib/safe-href.js";
import { useMessages } from "../../messages/messages-context.js";
import type { GithubOrgImportDialogProps } from "../../types/domain/profile/github-org-import-dialog-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Input } from "../../ui/input.js";
import { MetaLine } from "../../ui/meta-line.js";
import { PillRow } from "../../ui/pill-row.js";
import { Pill } from "../../ui/pill.js";
import { Skeleton } from "../../ui/skeleton.js";

/**
 * Organizações do GitHub como empresa da comunidade: cada uma que a pessoa administra (ou é
 * membro) vira — ou reaproveita — uma empresa, e os repositórios marcados entram como projetos
 * dela. É um diálogo à parte do `GithubImportDialog`, que só conhece repositórios e README; quem
 * não tem organização não vê nada (o app não abre o diálogo).
 */
export function GithubOrgImportDialog({
  open,
  onOpenChange,
  title,
  hint,
  chooseLabel,
  orgs,
  selectedOrg,
  onSelectOrg,
  activeOrg,
  repos,
  selected,
  onToggle,
  onSelectAll,
  onClear,
  importing,
  onImport,
}: GithubOrgImportDialogProps) {
  const messages = useMessages().githubImportDialog;
  const openOnGithub = activeOrg ? safeHref(activeOrg.htmlUrl) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{hint}</DialogDescription>
        </DialogHeader>

        {orgs.loading ? (
          <span className="block space-y-2" role="status" aria-label={messages.orgsLoading}>
            <Skeleton className="h-8 w-full rounded-full" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </span>
        ) : orgs.error ? (
          <p className="text-sm text-destructive">{messages.error}</p>
        ) : orgs.items.length === 0 ? (
          <EmptyState title={messages.empty} description={messages.emptyOrgs} />
        ) : (
          <>
            <PillRow label={chooseLabel}>
              {orgs.items.map((org) => (
                <Pill
                  key={org.login}
                  active={org.login === selectedOrg}
                  size="md"
                  onClick={() => onSelectOrg(org.login)}
                >
                  {org.name || org.login}
                </Pill>
              ))}
            </PillRow>

            {openOnGithub && selectedOrg && (
              <AppLink
                href={openOnGithub}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                {messages.orgOpenOnGithub(selectedOrg)}
              </AppLink>
            )}

            {repos.loading ? (
              <div className="space-y-2" role="status" aria-label={messages.loading}>
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : repos.error ? (
              <p className="text-sm text-destructive">{messages.reposError}</p>
            ) : repos.rows.length === 0 ? (
              <p className="text-sm text-text-subtle">{messages.empty}</p>
            ) : (
              <>
                <PillRow label={messages.selectAll}>
                  <Pill size="md" onClick={onSelectAll}>
                    {messages.selectAll}
                  </Pill>

                  <Pill size="md" onClick={onClear}>
                    {messages.clear}
                  </Pill>
                </PillRow>

                <ul className="space-y-2">
                  {repos.rows.map((repo) => {
                    const checked = selected.includes(repo.fullName);

                    return (
                      <li key={repo.fullName} className="flex items-start gap-3">
                        <Input
                          type="checkbox"
                          aria-label={repo.fullName}
                          checked={checked}
                          onChange={() => onToggle(repo.fullName)}
                          className="mt-1 h-4 w-4 shrink-0"
                        />

                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-text-strong">
                              {repo.name}
                            </span>

                            {repo.fork && <Pill size="sm">{messages.fork}</Pill>}
                            {repo.archived && <Pill size="sm">{messages.archived}</Pill>}
                          </span>

                          {repo.description && <MetaLine>{repo.description}</MetaLine>}

                          <MetaLine>
                            {[
                              repo.language,
                              messages.stars(repo.stars),
                              messages.forks(repo.forks),
                              repo.updatedAtLabel ? messages.updated(repo.updatedAtLabel) : null,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </MetaLine>
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <Button
                  className="rounded-full gap-1.5"
                  disabled={selected.length === 0 || importing}
                  onClick={onImport}
                >
                  {importing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />

                      {messages.importing}
                    </>
                  ) : (
                    messages.import(selected.length)
                  )}
                </Button>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
