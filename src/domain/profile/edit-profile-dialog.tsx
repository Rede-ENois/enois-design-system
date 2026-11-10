import { type ChangeEvent, useRef, useState } from "react";

import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { useMessages } from "../../messages/messages-context.js";
import type { EditProfileDialogProps } from "../../types/domain/profile/edit-profile-dialog-props.js";
import type { EditProfileFieldProps } from "../../types/domain/profile/edit-profile-field-props.js";
import type { EditProfileListItem } from "../../types/domain/profile/edit-profile-list-item.js";
import type { EditProfileSubListProps } from "../../types/domain/profile/edit-profile-sub-list-props.js";
import type { EditProfileTab } from "../../types/domain/profile/edit-profile-tab.js";
import { Button } from "../../ui/button.js";
import { DateTextInput } from "../../ui/date-text-input.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Switch } from "../../ui/switch.js";
import { Textarea } from "../../ui/textarea.js";
import { MAX_BADGES } from "../badges/max-badges.js";

import { profileBadges } from "./profile-badges.js";
import { subListErrors } from "./sub-list-errors.js";

export function EditProfileDialog({
  profile,
  children,
  open,
  onOpenChange,
  tab,
  onTabChange,
  savePending = false,
  onSave,
  onUploadBadge,
  experiences,
  education,
  certifications,
  listPending,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
}: EditProfileDialogProps) {
  const messages = useMessages().editProfileDialog;
  const { resolveMediaUrl } = useAdapters();

  const [username, setUsername] = useState(profile.username);
  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [company, setCompany] = useState(profile.company ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [birthDate, setBirthDate] = useState(profile.birthDate ?? "");
  const [availability, setAvailability] = useState(profile.availability ?? "");
  const [portfolio, setPortfolio] = useState(profile.portfolio ?? "");
  const [linksText, setLinksText] = useState((profile.externalLinks ?? []).join("\n"));
  const [skillsText, setSkillsText] = useState((profile.skills ?? []).join(", "));
  const [goalsText, setGoalsText] = useState((profile.goals ?? []).join(", "));
  const [openToWork, setOpenToWork] = useState(profile.openToWork);
  const [isMentor, setIsMentor] = useState(profile.isMentor);
  // Ranking opcional (pedido via suporte): preferencia da CONTA, salva junto com o perfil.
  const [showRanking, setShowRanking] = useState(profile.showRanking !== false);
  const [aka, setAka] = useState(profile.aka ?? "");
  const [badges, setBadges] = useState<string[]>(profileBadges(profile));
  const [usernameError, setUsernameError] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [badgeUploading, setBadgeUploading] = useState(false);
  const badgeRef = useRef<HTMLInputElement>(null);

  // Mesmo caminho do avatar na página de perfil: sobe pelo provedor que a API indicar (S3 ou
  // ImageKit) e guarda a URL — ela vai junto no salvar do diálogo, não em um PATCH próprio.
  const handleBadgeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Limpar o input: o navegador não dispara `change` para o MESMO arquivo escolhido duas vezes.
    event.target.value = "";
    if (!file) return;
    setGeneralError(null);
    if (badges.length >= MAX_BADGES) {
      setGeneralError(messages.badgesFull);
      return;
    }
    setBadgeUploading(true);
    try {
      const url = await onUploadBadge(file);
      // Entra no fim da lista: a ordem é a que aparece no perfil, e a primeira acompanha o nome.
      setBadges((current) => [...current, url]);
    } catch (error) {
      // The app already turns the API refusal into words for people (wrong type, image refused):
      // hiding it behind the generic text left people guessing why a normal PNG failed.
      setGeneralError(
        error instanceof Error && error.message ? error.message : messages.imageUploadError,
      );
    } finally {
      setBadgeUploading(false);
    }
  };

  const handleSave = async () => {
    setUsernameError("");
    setGeneralError(null);
    const error = await onSave({
      username,
      name,
      headline,
      bio,
      company,
      location,
      birthDate,
      availability,
      portfolio,
      linksText,
      skillsText,
      goalsText,
      openToWork,
      isMentor,
      showRanking,
      aka,
      badges,
    });
    if (!error) return;
    if (error.field === "username") setUsernameError(error.message);
    else setGeneralError(error.message);
  };

  const tabs: { key: EditProfileTab; label: string }[] = [
    { key: "info", label: messages.tabs.info },
    { key: "experiences", label: messages.tabs.experiences },
    { key: "education", label: messages.tabs.education },
    { key: "certifications", label: messages.tabs.certifications },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-border-soft bg-surface-card px-6 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-normal text-text-strong">
              {messages.title}
            </DialogTitle>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
                {tab === "info" ? messages.cancel : messages.close}
              </Button>

              {generalError && (
                <p
                  className="mr-auto max-w-[60%] text-xs font-normal text-destructive"
                  role="alert"
                >
                  {generalError}
                </p>
              )}

              {/* Experiências/formação/certificações têm o próprio "Salvar" por item. Manter o
                  botão do perfil aqui fechava o diálogo e descartava a edição em andamento. */}
              {tab === "info" && (
                <Button size="sm" onClick={handleSave} disabled={savePending}>
                  {savePending ? messages.saving : messages.save}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-1 overflow-x-auto text-sm">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => onTabChange(t.key)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-normal transition ${
                  tab === t.key
                    ? "bg-surface-2 text-primary"
                    : "text-text-subtle hover:bg-surface-3 hover:text-text-strong"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6 px-6 pb-6 pt-4">
          {tab === "info" && (
            <div className="space-y-5">
              <Field label={messages.fields.name}>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={160}
                  className="h-10 border-border-soft bg-surface-1"
                />
              </Field>

              <Field label={messages.fields.username} error={usernameError}>
                <Input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameError("");
                  }}
                  placeholder={messages.placeholders.username}
                  maxLength={80}
                  className="h-10 border-border-soft bg-surface-1"
                />
              </Field>

              <Field label={messages.fields.aka}>
                <Input
                  value={aka}
                  onChange={(e) => setAka(e.target.value)}
                  placeholder={messages.placeholders.aka}
                  maxLength={60}
                  className="h-10 border-border-soft bg-surface-1"
                />

                <p className="text-xs font-normal text-text-subtle">{messages.akaHint}</p>
              </Field>

              <Field label={messages.fields.badges}>
                <div className="flex flex-wrap items-center gap-2">
                  {badges.map((url, index) => (
                    <span key={url} className="relative inline-flex shrink-0">
                      <img
                        src={resolveMediaUrl(url)}
                        alt=""
                        className="h-10 w-10 rounded-full border border-border-soft bg-surface-1 object-cover"
                      />

                      <button
                        type="button"
                        aria-label={`${messages.badgeRemove} ${index + 1}`}
                        title={`${messages.badgeRemove} ${index + 1}`}
                        onClick={() =>
                          setBadges((current) => current.filter((item) => item !== url))
                        }
                        className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-surface-1 text-text-subtle ring-1 ring-border-soft transition hover:text-destructive"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}

                  {badges.length < MAX_BADGES ? (
                    <button
                      type="button"
                      onClick={() => badgeRef.current?.click()}
                      disabled={badgeUploading}
                      aria-label={messages.badgeUpload}
                      title={messages.badgeUpload}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-dashed border-border-soft text-text-subtle transition hover:border-primary/50 hover:text-foreground disabled:opacity-50"
                    >
                      {badgeUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                  ) : null}

                  <input
                    ref={badgeRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBadgeUpload}
                  />
                </div>

                <p className="text-xs font-normal text-text-subtle">
                  {badges.length >= MAX_BADGES ? messages.badgesFull : messages.badgesHint}
                </p>
              </Field>

              <Field label={messages.fields.headline}>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={messages.placeholders.headline}
                  maxLength={180}
                  className="h-10 border-border-soft bg-surface-1"
                />
              </Field>

              <Field label={messages.fields.bio}>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={1024}
                  className="border-border-soft bg-surface-1"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={messages.fields.company}>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    maxLength={160}
                    className="h-10 border-border-soft bg-surface-1"
                  />
                </Field>

                <Field label={messages.fields.location}>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    maxLength={160}
                    className="h-10 border-border-soft bg-surface-1"
                  />
                </Field>

                <Field label={messages.fields.birthDate}>
                  <DateTextInput
                    autoComplete="bday"
                    value={birthDate}
                    onValueChange={setBirthDate}
                    max={new Date().toISOString().slice(0, 10)}
                    className="h-10 border-border-soft bg-surface-1"
                  />
                </Field>
              </div>

              <Field label={messages.fields.availability}>
                <Input
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder={messages.placeholders.availability}
                  maxLength={160}
                  className="h-10 border-border-soft bg-surface-1"
                />
              </Field>

              <Field label={messages.fields.portfolio}>
                <Input
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder={messages.placeholders.portfolio}
                  maxLength={500}
                  className="h-10 border-border-soft bg-surface-1"
                />
              </Field>

              <Field label={messages.fields.externalLinks}>
                <Textarea
                  value={linksText}
                  onChange={(e) => setLinksText(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="border-border-soft bg-surface-1"
                />
              </Field>

              <Field label={messages.fields.skills}>
                {/* 1600 caracteres: espaço para listar habilidades separadas por vírgula ou escrever
                    uma frase inteira — o servidor aceita o mesmo teto. */}
                <Input
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  maxLength={1600}
                  className="h-10 border-border-soft bg-surface-1"
                />
              </Field>

              <Field label={messages.fields.goals}>
                <Input
                  value={goalsText}
                  onChange={(e) => setGoalsText(e.target.value)}
                  maxLength={1600}
                  className="h-10 border-border-soft bg-surface-1"
                />
              </Field>

              <div className="flex items-center gap-8">
                <label className="flex items-center gap-3 text-sm font-normal text-text-strong">
                  <Switch checked={openToWork} onCheckedChange={setOpenToWork} />

                  <>{messages.openToWork}</>
                </label>

                <label className="flex items-center gap-3 text-sm font-normal text-text-strong">
                  <Switch checked={isMentor} onCheckedChange={setIsMentor} />

                  <>{messages.mentorAvailable}</>
                </label>
              </div>

              <label className="flex items-start gap-3 text-sm font-normal text-text-strong">
                <Switch checked={showRanking} onCheckedChange={setShowRanking} />

                <span>
                  <span className="block">{messages.showRanking}</span>

                  <span className="block text-xs font-normal text-text-subtle">
                    {messages.showRankingHint}
                  </span>
                </span>
              </label>
            </div>
          )}

          {tab === "experiences" && (
            <SubList
              items={experiences}
              fields={[
                { key: "title", label: messages.experienceFields.title, required: true },
                {
                  key: "company",
                  label: messages.experienceFields.company,
                  required: true,
                },
                { key: "location", label: messages.experienceFields.location },
                {
                  key: "description",
                  label: messages.experienceFields.description,
                  multiline: true,
                },
                {
                  key: "startDate",
                  label: messages.experienceFields.startDate,
                  type: "date",
                },
                {
                  key: "endDate",
                  label: messages.experienceFields.endDate,
                  type: "date",
                },
              ]}
              currentlyHereKey="currentlyHere"
              pending={listPending.experiences}
              onCreate={(data) => onCreateItem("experiences", data)}
              onUpdate={(id, data) => onUpdateItem("experiences", id, data)}
              onDelete={(id) => onDeleteItem("experiences", id)}
              emptyMessage={messages.emptyExperience}
              newItem={{
                title: "",
                company: "",
                location: "",
                description: "",
                startDate: "",
                endDate: "",
              }}
            />
          )}

          {tab === "education" && (
            <SubList
              items={education}
              fields={[
                { key: "school", label: messages.educationFields.school, required: true },
                { key: "degree", label: messages.educationFields.degree, required: true },
                { key: "field", label: messages.educationFields.field },
                {
                  key: "description",
                  label: messages.educationFields.description,
                  multiline: true,
                },
                {
                  key: "startDate",
                  label: messages.educationFields.startDate,
                  type: "date",
                },
                { key: "endDate", label: messages.educationFields.endDate, type: "date" },
              ]}
              currentlyHereKey="currentlyHere"
              pending={listPending.education}
              onCreate={(data) => onCreateItem("education", data)}
              onUpdate={(id, data) => onUpdateItem("education", id, data)}
              onDelete={(id) => onDeleteItem("education", id)}
              emptyMessage={messages.emptyEducation}
              newItem={{
                school: "",
                degree: "",
                field: "",
                description: "",
                startDate: "",
                endDate: "",
              }}
            />
          )}

          {tab === "certifications" && (
            <SubList
              items={certifications}
              fields={[
                { key: "name", label: messages.certificationFields.name, required: true },
                {
                  key: "issuer",
                  label: messages.certificationFields.issuer,
                  required: true,
                },
                {
                  key: "description",
                  label: messages.certificationFields.description,
                  multiline: true,
                },
                {
                  key: "issueDate",
                  label: messages.certificationFields.issueDate,
                  type: "date",
                },
                {
                  key: "expirationDate",
                  label: messages.certificationFields.expirationDate,
                  type: "date",
                },
                {
                  key: "credentialUrl",
                  label: messages.certificationFields.credentialUrl,
                },
              ]}
              pending={listPending.certifications}
              onCreate={(data) => onCreateItem("certifications", data)}
              onUpdate={(id, data) => onUpdateItem("certifications", id, data)}
              onDelete={(id) => onDeleteItem("certifications", id)}
              emptyMessage={messages.emptyCertification}
              newItem={{
                name: "",
                issuer: "",
                description: "",
                issueDate: "",
                expirationDate: "",
                credentialUrl: "",
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: EditProfileFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-normal text-text-subtle">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SubList({
  items,
  fields,
  currentlyHereKey,
  pending,
  onCreate,
  onUpdate,
  onDelete,
  emptyMessage,
  newItem,
}: EditProfileSubListProps) {
  const messages = useMessages().editProfileDialog;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({ ...newItem });
  const [currentlyHere, setCurrentlyHere] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const resetMessages = () => {
    setErrors({});
    setSubmitError(null);
  };

  const startEdit = (item: EditProfileListItem) => {
    resetMessages();
    setEditingId(item.id);
    const values: Record<string, string> = {};
    for (const f of fields) {
      values[f.key] = String((item as Record<string, unknown>)[f.key] ?? "");
    }
    setForm(values);
    if (currentlyHereKey) {
      setCurrentlyHere(Boolean((item as Record<string, unknown>)[currentlyHereKey]));
    }
  };

  const handleSubmit = async () => {
    // A data impossível só aparece no `validity` do campo: o `value` continua "" e o React não
    // dispara onChange (vazio para vazio), então a checagem lê o DOM na hora de salvar.
    const dateInputs = formRef.current?.querySelectorAll<HTMLInputElement>("input[type=date]");
    const invalidDates = new Set(
      [...(dateInputs ?? [])].filter((input) => input.validity.badInput).map((input) => input.name),
    );
    const found = subListErrors(
      { fields, form, invalidDates, currentlyHere: currentlyHereKey ? currentlyHere : undefined },
      messages,
    );
    setErrors(found);
    setSubmitError(null);
    if (Object.keys(found).length > 0) return;

    // Sem `currentlyHere` no corpo: o backend não lê o campo e deriva "atual" de `endDate == null`.
    const data: Record<string, unknown> = { ...form };
    if (currentlyHereKey && currentlyHere) data.endDate = null;
    try {
      if (editingId && editingId !== "__new__") {
        await onUpdate(editingId, data);
      } else {
        await onCreate(data);
      }
    } catch (err) {
      // O formulário só fecha quando salvou: o erro da API aparece nele.
      setSubmitError(err instanceof Error && err.message ? err.message : messages.unexpectedError);
      return;
    }
    setEditingId(null);
    setForm({ ...newItem });
    setCurrentlyHere(false);
  };

  const showForm = editingId !== null;

  return (
    <div className="space-y-4">
      {showForm ? (
        <div ref={formRef} className="space-y-3 rounded-xl border border-border-soft p-4">
          {fields.map((f) => (
            <Field key={f.key} label={f.label} error={errors[f.key]}>
              {f.multiline ? (
                <Textarea
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  rows={2}
                  // Sem `h-10`: a altura fixa brigava com o `min-h-[60px]` do primitivo, então
                  // o campo ficava com 60px de qualquer jeito. As `rows` é que mandam.
                  className="border-border-soft bg-surface-1"
                />
              ) : (
                <Input
                  name={f.key}
                  type={f.type ?? "text"}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  aria-invalid={Boolean(errors[f.key])}
                  className="h-10 border-border-soft bg-surface-1"
                />
              )}
            </Field>
          ))}
          {currentlyHereKey && (
            <label className="flex items-center gap-2 text-sm font-normal text-text-strong">
              <Switch checked={currentlyHere} onCheckedChange={setCurrentlyHere} />

              <>{messages.currentlyHere}</>
            </label>
          )}
          {submitError && (
            <p role="alert" className="text-xs text-destructive">
              {submitError}
            </p>
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={pending}>
              {pending ? messages.saving : messages.save}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                resetMessages();
                setEditingId(null);
                setForm({ ...newItem });
                setCurrentlyHere(false);
              }}
            >
              {messages.cancel}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm font-normal text-text-subtle">{emptyMessage}</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-xl border border-border-soft p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 text-sm font-normal">
                    <p className="break-words text-text-strong">
                      {String((item as Record<string, unknown>)[fields[0].key] ?? "")}
                    </p>

                    <p className="break-words text-text-subtle">
                      {String((item as Record<string, unknown>)[fields[1]?.key] ?? "")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(item)}
                      aria-label={messages.edit}
                      title={messages.edit}
                      className="grid h-8 w-8 place-items-center rounded-lg hover:bg-surface-2"
                    >
                      <Pencil className="h-4 w-4 text-text-subtle" />
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      aria-label={messages.remove}
                      title={messages.remove}
                      className="grid h-8 w-8 place-items-center rounded-lg hover:bg-surface-2 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5"
            onClick={() => {
              resetMessages();
              setEditingId("__new__");
              setForm({ ...newItem });
              setCurrentlyHere(false);
            }}
          >
            <Plus className="h-4 w-4" />

            <>{messages.add}</>
          </Button>
        </>
      )}
    </div>
  );
}
