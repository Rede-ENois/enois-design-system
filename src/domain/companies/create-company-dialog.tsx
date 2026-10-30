import { useState } from "react";

import { Loader2 } from "lucide-react";

import { safeHref } from "../../lib/safe-href.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CreateCompanyDialogProps } from "../../types/domain/companies/create-company-dialog-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { Textarea } from "../../ui/textarea.js";

import { FormField } from "./form-field.js";

/** The same ceilings the API and the `companies` columns accept. */
const LIMITS = { name: 160, description: 4000, sector: 80, location: 160, website: 300 } as const;

const EMPTY = { name: "", description: "", sector: "", size: "", location: "", website: "" };

/** A site the page can link to: an absolute http(s) address that `safeHref` lets through. */
const isWebsite = (value: string) => /^https?:\/\/\S+\.\S+/i.test(value) && !!safeHref(value);

/** Creating a company page: only the name is required, the rest can be filled in later. */
export function CreateCompanyDialog({
  open,
  onOpenChange,
  pending,
  error,
  sizeOptions,
  onSubmit,
}: CreateCompanyDialogProps) {
  const copy = useMessages().createCompanyDialog;
  const [form, setForm] = useState(EMPTY);
  const [tried, setTried] = useState(false);
  const website = form.website.trim();
  const errors = {
    name: form.name.trim().length < 2 ? copy.nameRequired : null,
    website: website && !isWebsite(website) ? copy.websiteInvalid : null,
  };
  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const optional = (value: string) => value.trim() || null;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setForm(EMPTY);
      setTried(false);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>

          <DialogDescription>{copy.hint}</DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="min-w-0 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setTried(true);
            if (errors.name || errors.website) return;
            onSubmit({
              name: form.name.trim(),
              description: optional(form.description),
              sector: optional(form.sector),
              size: optional(form.size),
              location: optional(form.location),
              website: optional(form.website),
            });
          }}
        >
          <FormField label={copy.nameLabel} error={tried ? errors.name : null}>
            {(control) => (
              <Input
                {...control}
                value={form.name}
                onChange={(event) => set("name")(event.target.value)}
                maxLength={LIMITS.name}
                showCounter={false}
                autoComplete="organization"
              />
            )}
          </FormField>

          <FormField label={copy.descriptionLabel} optional={copy.optional}>
            {(control) => (
              <Textarea
                {...control}
                value={form.description}
                onChange={(event) => set("description")(event.target.value)}
                placeholder={copy.descriptionPlaceholder}
                rows={4}
                maxLength={LIMITS.description}
              />
            )}
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label={copy.sectorLabel} optional={copy.optional}>
              {(control) => (
                <Input
                  {...control}
                  value={form.sector}
                  onChange={(event) => set("sector")(event.target.value)}
                  placeholder={copy.sectorPlaceholder}
                  maxLength={LIMITS.sector}
                  showCounter={false}
                />
              )}
            </FormField>

            <FormField label={copy.sizeLabel} optional={copy.optional}>
              {(control) => (
                <select
                  {...control}
                  value={form.size}
                  onChange={(event) => set("size")(event.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                >
                  <option value="">{copy.sizeEmpty}</option>

                  {sizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </FormField>
          </div>

          <FormField label={copy.locationLabel} optional={copy.optional}>
            {(control) => (
              <Input
                {...control}
                value={form.location}
                onChange={(event) => set("location")(event.target.value)}
                placeholder={copy.locationPlaceholder}
                maxLength={LIMITS.location}
                showCounter={false}
              />
            )}
          </FormField>

          <FormField
            label={copy.websiteLabel}
            optional={copy.optional}
            error={tried ? errors.website : null}
          >
            {(control) => (
              <Input
                {...control}
                type="url"
                inputMode="url"
                value={form.website}
                onChange={(event) => set("website")(event.target.value)}
                placeholder="https://"
                maxLength={LIMITS.website}
                showCounter={false}
              />
            )}
          </FormField>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9 rounded-full px-4"
              disabled={pending}
              onClick={() => handleOpenChange(false)}
            >
              {copy.cancel}
            </Button>

            <Button type="submit" size="sm" className="h-9 rounded-full px-4" disabled={pending}>
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              {pending ? copy.creating : copy.create}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
