/**
 * Um registro do histórico administrativo do nó — a trilha de auditoria lida de volta. `metadata`
 * chega como texto; a view mostra, não interpreta. `dateLabel` já vem formatado do app.
 */
export type NetworkNodeHistoryEntry = {
  id: string;
  actorId: string;
  action: string;
  metadata: string | null;
  dateLabel: string;
};
