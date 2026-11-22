/** Placeholder das linhas do painel do grupo enquanto o app carrega quem participa. */
export function GroupParticipantsSkeleton() {
  return (
    <div aria-busy="true" className="space-y-2">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3 py-2">
          <span className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-surface-2" />
          <span className="h-3 w-32 animate-pulse rounded bg-surface-2" />
        </div>
      ))}
    </div>
  );
}
