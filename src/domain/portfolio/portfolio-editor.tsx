import { useState } from "react";

import { AlertCircle, ArrowDown, ArrowUp, Globe, PenLine, Plus, Trash2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import { HtmlEditor } from "../../patterns/editor/html-editor.js";
import type { PortfolioBlockKind } from "../../types/domain/portfolio/portfolio-block-kind.js";
import type { PortfolioBlockValues } from "../../types/domain/portfolio/portfolio-block-values.js";
import type { PortfolioEditorBlock } from "../../types/domain/portfolio/portfolio-editor-block.js";
import type { PortfolioEditorProps } from "../../types/domain/portfolio/portfolio-editor-props.js";
import type { PortfolioOutro } from "../../types/domain/portfolio/portfolio-outro.js";
import { Badge } from "../../ui/badge.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { LoadingState } from "../../ui/loading-state.js";
import { PageHeader } from "../../ui/page-header.js";
import { PillRow } from "../../ui/pill-row.js";
import { Pill } from "../../ui/pill.js";
import { Select } from "../../ui/select.js";
import { Textarea } from "../../ui/textarea.js";

/** Os limites do backend (PortfolioService e SafeHtml): passar deles é 400 na hora de gravar. */
const MAX_PAGE_HTML = 200_000;
const MAX_TITLE = 160;
const MAX_TEXT = 4_000;
const MAX_LINK = 1_000;

const KINDS: PortfolioBlockKind[] = ["PROJECT", "TEXT", "MEDIA", "PDF", "LINK"];

const EMPTY_VALUES: PortfolioBlockValues = {
  kind: "TEXT",
  title: "",
  text: "",
  projectId: "",
  mediaId: "",
  linkUrl: "",
};

/**
 * O editor do dono: a página em HTML/CSS com a mesma prévia do render final, a lista ordenada de
 * peças e a publicação.
 *
 * O editor não grava sozinho: cada ação é um botão (salvar a página, salvar a peça, publicar) e o
 * app responde com a peça recarregada. O que entra na gravação é só o campo do tipo escolhido, para
 * trocar o tipo de uma peça não levar junto um dado do tipo anterior.
 */
export function PortfolioEditor({
  state,
  html,
  publishedVersion,
  publishedAt,
  blocks,
  outros,
  error,
  pending,
  renderHtmlFrame,
  onDraftChange,
  onSaveDraft,
  onSaveBlock,
  onRemoveBlock,
  onReorder,
  onPublish,
}: PortfolioEditorProps) {
  const messages = useMessages().portfolioEditor;
  const [form, setForm] = useState<{ blockId: string | null; values: PortfolioBlockValues } | null>(
    null,
  );

  if (state === "loading") {
    return <LoadingState label={messages.loading} />;
  }

  if (state === "error") {
    return <EmptyState icon={AlertCircle} title={messages.error} />;
  }

  const neverPublished = publishedVersion === 0;
  const altered = blocks.some((block) => block.unpublished);

  const move = (index: number, step: -1 | 1) => {
    const target = index + step;
    if (target < 0 || target >= blocks.length) return;
    const order = blocks.map((block) => block.id);
    [order[index], order[target]] = [order[target], order[index]];
    onReorder(order);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={messages.title}
        description={messages.description}
        icon={PenLine}
        actions={
          <>
            <Badge variant={neverPublished ? "outline" : altered ? "secondary" : "default"}>
              {neverPublished
                ? messages.neverPublished
                : altered
                  ? messages.unpublished
                  : messages.published}
            </Badge>

            <Button
              type="button"
              onClick={onPublish}
              disabled={pending || (blocks.length === 0 && !html.trim())}
            >
              <Globe className="h-4 w-4" aria-hidden />

              <>{pending ? messages.publishing : messages.publish}</>
            </Button>
          </>
        }
      >
        {!neverPublished && publishedAt && (
          <p className="mt-2 text-xs font-normal text-text-subtle">
            {messages.publishedOn(publishedAt)}
          </p>
        )}

        <p className="mt-1 text-xs font-normal text-text-subtle">{messages.publishHint}</p>

        {error && (
          <p
            role="alert"
            className="mt-2 flex items-start gap-1.5 text-sm font-normal text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />

            <>{error}</>
          </p>
        )}
      </PageHeader>

      <section className="surface-card p-4 sm:p-6">
        <HtmlEditor
          id="portfolio-page"
          value={html}
          onChange={onDraftChange}
          label={messages.pageTitle}
          description={messages.pageDescription}
          placeholder={messages.pagePlaceholder}
          emptyPreview={messages.emptyPreview}
          maxLength={MAX_PAGE_HTML}
          previewClassName="h-72"
          preview={renderHtmlFrame({
            html,
            title: messages.pageTitle,
            className: "h-full w-full border-0",
            autoHeight: false,
          })}
        />

        <div className="mt-3 flex justify-end">
          <Button type="button" variant="outline" onClick={onSaveDraft} disabled={pending}>
            {pending ? messages.saving : messages.savePage}
          </Button>
        </div>
      </section>

      <section className="surface-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-text-strong">{messages.blocksTitle}</h2>

          <Button
            type="button"
            size="sm"
            onClick={() => setForm({ blockId: null, values: EMPTY_VALUES })}
            disabled={pending || form !== null}
          >
            <Plus className="h-4 w-4" aria-hidden />

            <>{messages.addBlock}</>
          </Button>
        </div>

        {blocks.length === 0 ? (
          <EmptyState icon={Plus} title={messages.blocksEmpty} />
        ) : (
          <ol className="mt-3 space-y-2">
            {blocks.map((block, index) => (
              <li key={block.id} className="rounded-xl border border-border-soft p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 basis-48">
                    <p className="text-xs font-normal uppercase tracking-wide text-text-subtle">
                      {messages.kinds[block.kind]}
                    </p>

                    <p className="break-words text-sm font-semibold text-text-strong">
                      {block.title || kindSummary(block)}
                    </p>

                    {block.unpublished && (
                      <p className="mt-0.5 text-xs font-normal text-primary">
                        {messages.unpublished}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={messages.moveUp}
                      disabled={pending || index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp className="h-4 w-4" aria-hidden />
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={messages.moveDown}
                      disabled={pending || index === blocks.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown className="h-4 w-4" aria-hidden />
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={pending}
                      onClick={() =>
                        setForm({
                          blockId: block.id,
                          values: {
                            kind: block.kind,
                            title: block.title,
                            text: block.text,
                            projectId: block.projectId ?? "",
                            mediaId: block.mediaId ?? "",
                            linkUrl: block.linkUrl ?? "",
                          },
                        })
                      }
                    >
                      <PenLine className="h-4 w-4" aria-hidden />

                      <>{messages.editBlock}</>
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={messages.removeBlock(block.title || messages.kinds[block.kind])}
                      disabled={pending}
                      onClick={() => onRemoveBlock(block.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
                    </Button>
                  </div>
                </div>

                {form?.blockId === block.id && (
                  <BlockForm
                    initial={form.values}
                    outros={outros}
                    pending={pending}
                    onCancel={() => setForm(null)}
                    onSubmit={(values) => {
                      onSaveBlock(values, block.id);
                      setForm(null);
                    }}
                  />
                )}
              </li>
            ))}
          </ol>
        )}

        {form && form.blockId === null && (
          <div className="mt-3">
            <BlockForm
              initial={form.values}
              outros={outros}
              pending={pending}
              onCancel={() => setForm(null)}
              onSubmit={(values) => {
                onSaveBlock(values, null);
                setForm(null);
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
}

/** A segunda linha da peça na lista: o texto dela, o projeto, a mídia ou o link. */
function kindSummary(block: PortfolioEditorBlock): string {
  if (block.kind === "TEXT") return block.text;
  if (block.kind === "LINK") return block.linkUrl ?? "";
  if (block.kind === "PROJECT") return block.projectId ?? "";
  return block.mediaId ?? "";
}

function BlockForm({
  initial,
  outros,
  pending,
  onCancel,
  onSubmit,
}: {
  initial: PortfolioBlockValues;
  outros: PortfolioOutro[];
  pending: boolean;
  onCancel: () => void;
  onSubmit: (values: PortfolioBlockValues) => void;
}) {
  const messages = useMessages().portfolioEditor;
  const [values, setValues] = useState(initial);

  const set = <K extends keyof PortfolioBlockValues>(key: K, value: PortfolioBlockValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  /** Só o campo do tipo conta na gravação; os outros voltam vazios. */
  const only = (kind: PortfolioBlockKind): PortfolioBlockValues => ({
    ...EMPTY_VALUES,
    kind,
    title: values.title.trim(),
    text: kind === "TEXT" ? values.text.trim() : "",
    projectId: kind === "PROJECT" ? values.projectId : "",
    mediaId: kind === "MEDIA" || kind === "PDF" ? values.mediaId.trim() : "",
    linkUrl: kind === "LINK" ? values.linkUrl.trim() : "",
  });

  const invalid =
    values.kind === "PROJECT"
      ? !values.projectId
      : values.kind === "LINK"
        ? !values.linkUrl.trim()
        : values.kind === "TEXT"
          ? !values.text.trim()
          : !values.mediaId.trim();

  const projectOptions = outros.map((outro) => (
    <option key={outro.id} value={outro.id} disabled={outro.state !== "available"}>
      {`${outro.title} — ${messages.outroState[outro.state]}`}
    </option>
  ));

  return (
    <form
      className="mt-3 space-y-3 border-t border-border-soft pt-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (pending || invalid) return;
        onSubmit(only(values.kind));
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="portfolio-block-kind">{messages.blockFields.kind}</Label>

        <PillRow label={messages.blockFields.kind}>
          {KINDS.map((kind) => (
            <Pill
              key={kind}
              size="sm"
              active={values.kind === kind}
              onClick={() => set("kind", kind)}
            >
              <>{messages.kinds[kind]}</>
            </Pill>
          ))}
        </PillRow>
      </div>

      <div className="space-y-1">
        <Label htmlFor="portfolio-block-title">{messages.blockFields.title}</Label>

        <Input
          id="portfolio-block-title"
          value={values.title}
          maxLength={MAX_TITLE}
          placeholder={messages.blockPlaceholders.title}
          onChange={(event) => set("title", event.target.value)}
        />
      </div>

      {values.kind === "TEXT" && (
        <div className="space-y-1">
          <Label htmlFor="portfolio-block-text">{messages.blockFields.text}</Label>

          <Textarea
            id="portfolio-block-text"
            value={values.text}
            maxLength={MAX_TEXT}
            placeholder={messages.blockPlaceholders.text}
            onChange={(event) => set("text", event.target.value)}
          />
        </div>
      )}

      {values.kind === "LINK" && (
        <div className="space-y-1">
          <Label htmlFor="portfolio-block-link">{messages.blockFields.linkUrl}</Label>

          <Input
            id="portfolio-block-link"
            type="url"
            value={values.linkUrl}
            maxLength={MAX_LINK}
            placeholder={messages.blockPlaceholders.linkUrl}
            onChange={(event) => set("linkUrl", event.target.value)}
          />
        </div>
      )}

      {values.kind === "PROJECT" && (
        <div className="space-y-1">
          <Label htmlFor="portfolio-block-project">{messages.blockFields.project}</Label>

          <Select
            id="portfolio-block-project"
            value={values.projectId}
            onChange={(event) => set("projectId", event.target.value)}
          >
            <option value="">—</option>

            {projectOptions}
          </Select>
        </div>
      )}

      {(values.kind === "MEDIA" || values.kind === "PDF") && (
        <div className="space-y-1">
          <Label htmlFor="portfolio-block-media">{messages.blockFields.mediaId}</Label>

          <Input
            id="portfolio-block-media"
            value={values.mediaId}
            placeholder={messages.blockPlaceholders.mediaId}
            onChange={(event) => set("mediaId", event.target.value)}
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {messages.cancel}
        </Button>

        <Button type="submit" disabled={pending || invalid}>
          {messages.saveBlock}
        </Button>
      </div>
    </form>
  );
}
