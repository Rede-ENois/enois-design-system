/** The state of the whole showcase while the banks are being fetched. */
export type TalentBankDiscoveryState = { kind: "loading" } | { kind: "ready" } | { kind: "error" };
