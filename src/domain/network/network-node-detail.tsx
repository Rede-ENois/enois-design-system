import { useState } from "react";

import { Globe, Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { NetworkNodeApiRequest } from "../../types/domain/network/network-node-api-request.js";
import type { NetworkNodeDetailData } from "../../types/domain/network/network-node-detail-data.js";
import type { NetworkNodeDetailProps } from "../../types/domain/network/network-node-detail-props.js";
import { Button } from "../../ui/button.js";
import { Pill } from "../../ui/pill.js";
import { Select } from "../../ui/select.js";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../ui/sheet.js";

/** Campos com o valor vigente: o admin edita o que está lá, não preenche de zero. Vazio = mantém. */
function NodeCapacityForm({
  detail,
  onSaveCapacity,
  capacityPending,
}: {
  detail: NetworkNodeDetailData;
  onSaveCapacity: NetworkNodeDetailProps["onSaveCapacity"];
  capacityPending: boolean;
}) {
  const messages = useMessages().networkNodeDetail;
  const [cpuCores, setCpuCores] = useState(String(detail.declaredCpuCores));
  const [memoryMb, setMemoryMb] = useState(String(detail.declaredMemoryMb));
  const [diskMb, setDiskMb] = useState(String(detail.declaredDiskMb));
  const [bandwidthMbps, setBandwidthMbps] = useState(String(detail.declaredBandwidthMbps));

  const numberOrNull = (value: string) => {
    const parsed = Number(value);
    return value === "" || Number.isNaN(parsed) ? undefined : parsed;
  };

  const field = (
    label: string,
    value: string,
    onChange: (next: string) => void,
    suffix: string,
  ) => (
    <label className="space-y-1 text-xs">
      <span className="text-text-subtle">{label}</span>

      <span className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-border-soft bg-surface-2 px-3 py-2 text-sm text-text-strong"
        />

        <span className="text-text-subtle">{suffix}</span>
      </span>
    </label>
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {field(messages.cpuCores, cpuCores, setCpuCores, "vCPU")}

        {field(messages.memoryMb, memoryMb, setMemoryMb, "MB")}

        {field(messages.diskMb, diskMb, setDiskMb, "MB")}

        {field(messages.bandwidthMbps, bandwidthMbps, setBandwidthMbps, "Mbps")}
      </div>

      <Button
        variant="outline"
        className="rounded-full"
        disabled={capacityPending}
        onClick={() =>
          onSaveCapacity({
            cpuCores: numberOrNull(cpuCores),
            memoryMb: numberOrNull(memoryMb),
            diskMb: numberOrNull(diskMb),
            bandwidthMbps: numberOrNull(bandwidthMbps),
          })
        }
      >
        {capacityPending && <Loader2 className="h-4 w-4 animate-spin" />}

        {messages.saveCapacity}
      </Button>
    </div>
  );
}

/**
 * Requisição a API auxiliar: o admin escolhe a rota pelo nome e o pedido leva alvo (é este nó que
 * executa). A lista é a que vai assinada para o nó, então toda opção daqui é executável — o que
 * não está na assinatura não aparece, e não há campo de URL para digitar.
 */
function NodeApiRequestForm({
  routes,
  onRequestRoute,
  routePending,
  apiRequests,
  apiRequestsLoading,
}: {
  routes: string[];
  onRequestRoute: NetworkNodeDetailProps["onRequestRoute"];
  routePending: boolean;
  apiRequests: NetworkNodeApiRequest[];
  apiRequestsLoading: boolean;
}) {
  const messages = useMessages().networkNodeDetail;
  const [route, setRoute] = useState("");

  if (routes.length === 0) {
    return <p className="text-xs text-text-subtle">{messages.routesEmpty}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <label className="flex-1 space-y-1 text-xs">
          <span className="text-text-subtle">{messages.routesTitle}</span>

          <Select value={route} onChange={(event) => setRoute(event.target.value)}>
            <option value="">{messages.routesPlaceholder}</option>

            {routes.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </label>

        <Button
          variant="outline"
          className="rounded-full"
          disabled={routePending || route === ""}
          onClick={() => {
            onRequestRoute(route);
            setRoute("");
          }}
        >
          {routePending && <Loader2 className="h-4 w-4 animate-spin" />}

          {messages.requestRoute}
        </Button>
      </div>

      <p className="flex gap-1.5 text-[11px] text-text-subtle">
        <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0" />

        {messages.routesHint}
      </p>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-text-strong">{messages.apiRequestsTitle}</p>

        {apiRequestsLoading && (
          <p className="text-xs text-text-subtle">{messages.apiRequestsLoading}</p>
        )}

        {!apiRequestsLoading && apiRequests.length === 0 && (
          <p className="text-xs text-text-subtle">{messages.apiRequestsEmpty}</p>
        )}

        <ul className="space-y-2">
          {apiRequests.map((request) => (
            <li
              key={request.taskId}
              className="rounded-xl border border-border-soft px-3 py-2 text-xs"
            >
              <p className="font-mono font-semibold text-text-strong">
                {messages.apiRequestEntry(request.route, request.status, request.attempt)}
              </p>

              <p className="text-text-subtle">
                {messages.apiRequestDeadline(request.deadlineLabel)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * A página por nó, num painel lateral: o que o participante cedeu (a capacidade que esta tela
 * edita, com o valor vigente já nos campos), os perfis autorizados e o histórico administrativo
 * lido da trilha de auditoria. Toda ação daqui é auditada pelo backend — o histórico que a tela
 * mostra é a prova delas. O formulário remonta por nó (`key`): abrir outro nó não herda rascunho.
 */
export function NetworkNodeDetail({
  detail,
  history,
  historyLoading = false,
  onSaveCapacity,
  capacityPending = false,
  onSaveProfiles,
  profilesPending = false,
  routes,
  onRequestRoute,
  routePending = false,
  apiRequests,
  apiRequestsLoading = false,
  onOpenChange,
}: NetworkNodeDetailProps) {
  const messages = useMessages().networkNodeDetail;
  const [profiles, setProfiles] = useState<string[]>([]);
  const [profilesDraftNode, setProfilesDraftNode] = useState<string | null>(null);

  const open = detail !== null;

  // O rascunho de perfis acompanha o nó aberto: trocar de nó no drawer não herda a seleção.
  if (detail && profilesDraftNode !== detail.node.id) {
    setProfilesDraftNode(detail.node.id);
    setProfiles(detail.node.profiles);
  }

  const toggleProfile = (profile: string) =>
    setProfiles((current) =>
      current.includes(profile)
        ? current.filter((item) => item !== profile)
        : [...current, profile],
    );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto bg-surface-card sm:max-w-md">
        {detail && (
          <>
            <SheetHeader>
              <SheetTitle className="text-base">{detail.node.displayName}</SheetTitle>

              <SheetDescription>{messages.owner(detail.node.ownerUserId)}</SheetDescription>
            </SheetHeader>

            <div className="mt-4 space-y-6 pr-2">
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
                  {messages.capacityTitle}
                </h3>

                <NodeCapacityForm
                  key={detail.node.id}
                  detail={detail}
                  onSaveCapacity={onSaveCapacity}
                  capacityPending={capacityPending}
                />
              </section>

              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
                  {messages.profilesTitle}
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {detail.availableProfiles.map((profile) => (
                    <button
                      key={profile}
                      type="button"
                      onClick={() => toggleProfile(profile)}
                      className="rounded-full"
                    >
                      <Pill size="sm" active={profiles.includes(profile)}>
                        {profile}
                      </Pill>
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-text-subtle">{messages.profilesHint}</p>

                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={profilesPending}
                  onClick={() => onSaveProfiles(profiles)}
                >
                  {profilesPending && <Loader2 className="h-4 w-4 animate-spin" />}

                  {messages.saveProfiles}
                </Button>
              </section>

              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
                  {messages.routesTitle}
                </h3>

                <NodeApiRequestForm
                  routes={routes}
                  onRequestRoute={onRequestRoute}
                  routePending={routePending}
                  apiRequests={apiRequests}
                  apiRequestsLoading={apiRequestsLoading}
                />
              </section>

              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
                  {messages.historyTitle}
                </h3>

                {historyLoading && (
                  <p className="text-xs text-text-subtle">{messages.historyLoading}</p>
                )}

                {!historyLoading && history.length === 0 && (
                  <p className="text-xs text-text-subtle">{messages.historyEmpty}</p>
                )}

                <ul className="space-y-2">
                  {history.map((entry) => (
                    <li
                      key={entry.id}
                      className="rounded-xl border border-border-soft px-3 py-2 text-xs"
                    >
                      <p className="font-mono font-semibold text-text-strong">{entry.action}</p>

                      <p className="text-text-subtle">
                        {messages.historyEntry(entry.actorId, entry.dateLabel)}
                      </p>

                      {entry.metadata && (
                        <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                          {entry.metadata}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
