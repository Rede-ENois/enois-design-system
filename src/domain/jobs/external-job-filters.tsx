import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ExternalJobFilterValues } from "../../types/domain/jobs/external-job-filter-values.js";
import type { ExternalJobFiltersProps } from "../../types/domain/jobs/external-job-filters-props.js";
import type { ExternalJobPublishedChoice } from "../../types/domain/jobs/external-job-published-choice.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { PillRow } from "../../ui/pill-row.js";
import { Pill } from "../../ui/pill.js";
import { Switch } from "../../ui/switch.js";

const LEVELS = ["JUNIOR", "MID", "SENIOR", "LEAD"] as const;
const WORK_MODELS = ["REMOTE", "HYBRID", "ONSITE"] as const;
const EMPLOYMENT_TYPES = [
  "CLT",
  "PJ",
  "INTERNSHIP",
  "FREELANCE",
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "TEMPORARY",
] as const;
const SORTS = ["recent", "salary", "relevance"] as const;

/** Janelas de publicação oferecidas na tela, em dias. */
const PUBLISHED_WINDOWS = [7, 30] as const;

/** Qual janela do menu corresponde à data que o app mandou (o app pode ter vindo de uma URL). */
function choiceOf(publishedAfter: string | null): ExternalJobPublishedChoice {
  if (publishedAfter === null) return "any";
  const days = (Date.now() - new Date(publishedAfter).getTime()) / 86_400_000;
  // Tolerância de um dia: a data gravada é o instante do clique, não a meia-noite.
  return days > 8 ? "30" : "7";
}

const SELECT_CLASS =
  "h-9 rounded-md border border-border-soft bg-surface-1 px-2 text-sm text-text-strong";

/**
 * Barra de filtros da busca de vagas externas.
 *
 * É uma view: não busca nada, não guarda estado de resultado. Cada mudança sai por `onChange` com
 * só o campo que mudou, e quem decide recarregar a lista é o app.
 *
 * Os campos de texto (cidade, estado, país, salário) só avisam ao sair do campo ou apertar Enter.
 * Avisando a cada tecla, cada letra digitada virava uma busca nova no servidor.
 *
 * A janela de publicação é escolha de tela ("últimos 7 dias"), mas o app recebe a data ISO que ela
 * significa: o servidor não precisa saber que existe um menu de 7 e 30 dias.
 */
export function ExternalJobFilters({
  value,
  onChange,
  onClear,
  activeCount,
  busy = false,
}: ExternalJobFiltersProps) {
  const messages = useMessages().externalJobFilters;

  const [city, setCity] = useState(value.city);
  const [uf, setUf] = useState(value.state);
  const [country, setCountry] = useState(value.country);
  const [salaryMin, setSalaryMin] = useState(
    value.salaryMin === null ? "" : String(value.salaryMin),
  );
  const [published, setPublished] = useState<ExternalJobPublishedChoice>(() =>
    choiceOf(value.publishedAfter),
  );

  // O app pode limpar os filtros por fora (botão de limpar, URL): o rascunho acompanha.
  useEffect(() => {
    setCity(value.city);
    setUf(value.state);
    setCountry(value.country);
    setSalaryMin(value.salaryMin === null ? "" : String(value.salaryMin));
    setPublished(choiceOf(value.publishedAfter));
  }, [value.city, value.state, value.country, value.salaryMin, value.publishedAfter]);

  const commitText = () => {
    const patch: Partial<ExternalJobFilterValues> = {};
    if (city.trim() !== value.city) patch.city = city.trim();
    if (uf.trim() !== value.state) patch.state = uf.trim();
    if (country.trim() !== value.country) patch.country = country.trim();
    const parsed = Number(salaryMin.replace(/[^\d]/g, ""));
    const nextSalary = salaryMin.trim() === "" || Number.isNaN(parsed) ? null : parsed;
    if (nextSalary !== value.salaryMin) patch.salaryMin = nextSalary;
    if (Object.keys(patch).length > 0) onChange(patch);
  };

  const toggleLevel = (code: string) => onChange({ level: value.level === code ? null : code });
  const toggleWorkModel = (code: string) =>
    onChange({ workModel: value.workModel === code ? null : code });
  const toggleEmploymentType = (code: string) =>
    onChange({ employmentType: value.employmentType === code ? null : code });

  const choosePublished = (choice: ExternalJobPublishedChoice) => {
    setPublished(choice);
    if (choice === "any") {
      onChange({ publishedAfter: null });
      return;
    }
    const days = Number(choice);
    onChange({ publishedAfter: new Date(Date.now() - days * 86_400_000).toISOString() });
  };

  return (
    <section aria-label={messages.title} aria-busy={busy} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-text-subtle">
          {activeCount > 0 ? messages.activeCount(activeCount) : messages.title}
        </p>

        {activeCount > 0 && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 gap-1.5 rounded-full text-text-subtle"
            onClick={onClear}
          >
            <X className="h-3.5 w-3.5" />
            {messages.clear}
          </Button>
        )}
      </div>

      <PillRow label={messages.level}>
        <span className="shrink-0 pr-1 text-xs font-medium text-text-subtle">{messages.level}</span>

        {LEVELS.map((code) => (
          <Pill
            key={code}
            size="sm"
            active={value.level === code}
            onClick={() => toggleLevel(code)}
          >
            {messages.levels[code] ?? code}
          </Pill>
        ))}
      </PillRow>

      <PillRow label={messages.workModel}>
        <span className="shrink-0 pr-1 text-xs font-medium text-text-subtle">
          {messages.workModel}
        </span>

        {WORK_MODELS.map((code) => (
          <Pill
            key={code}
            size="sm"
            active={value.workModel === code}
            onClick={() => toggleWorkModel(code)}
          >
            {messages.workModels[code] ?? code}
          </Pill>
        ))}
      </PillRow>

      <PillRow label={messages.employmentType}>
        <span className="shrink-0 pr-1 text-xs font-medium text-text-subtle">
          {messages.employmentType}
        </span>

        {EMPLOYMENT_TYPES.map((code) => (
          <Pill
            key={code}
            size="sm"
            active={value.employmentType === code}
            onClick={() => toggleEmploymentType(code)}
          >
            {messages.employmentTypes[code] ?? code}
          </Pill>
        ))}
      </PillRow>

      <PillRow label={messages.sort}>
        <span className="shrink-0 pr-1 text-xs font-medium text-text-subtle">{messages.sort}</span>

        {SORTS.map((code) => (
          <Pill
            key={code}
            size="sm"
            active={value.sort === code}
            onClick={() => onChange({ sort: code })}
          >
            {code === "recent"
              ? messages.sortRecent
              : code === "salary"
                ? messages.sortSalary
                : messages.sortRelevance}
          </Pill>
        ))}
      </PillRow>

      <form
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          commitText();
        }}
      >
        <div className="space-y-1">
          <Label htmlFor="external-job-city" className="text-xs font-normal text-text-subtle">
            {messages.city}
          </Label>

          <Input
            id="external-job-city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            onBlur={commitText}
            placeholder={messages.cityPlaceholder}
            className="h-9 bg-surface-1"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="external-job-state" className="text-xs font-normal text-text-subtle">
            {messages.state}
          </Label>

          <Input
            id="external-job-state"
            value={uf}
            onChange={(event) => setUf(event.target.value)}
            onBlur={commitText}
            placeholder={messages.statePlaceholder}
            className="h-9 bg-surface-1"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="external-job-country" className="text-xs font-normal text-text-subtle">
            {messages.country}
          </Label>

          <Input
            id="external-job-country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            onBlur={commitText}
            placeholder={messages.countryPlaceholder}
            className="h-9 bg-surface-1"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="external-job-salary" className="text-xs font-normal text-text-subtle">
            {messages.salaryMin}
          </Label>

          <Input
            id="external-job-salary"
            value={salaryMin}
            onChange={(event) => setSalaryMin(event.target.value)}
            onBlur={commitText}
            inputMode="numeric"
            placeholder={messages.salaryMinPlaceholder}
            className="h-9 bg-surface-1"
          />
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="inline-flex items-center gap-2 text-sm text-text-strong">
          <Switch
            checked={value.remoteOnly}
            aria-label={messages.remoteOnly}
            onCheckedChange={(checked) => onChange({ remoteOnly: checked })}
          />

          <span>{messages.remoteOnly}</span>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-text-strong">
          <span className="text-xs font-medium text-text-subtle">{messages.publishedAfter}</span>

          <select
            aria-label={messages.publishedAfter}
            value={published}
            onChange={(event) => choosePublished(event.target.value as ExternalJobPublishedChoice)}
            className={SELECT_CLASS}
          >
            <option value="any">{messages.publishedAny}</option>

            {PUBLISHED_WINDOWS.map((days) => (
              <option key={days} value={String(days)}>
                {days === 7 ? messages.publishedLast7 : messages.publishedLast30}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
