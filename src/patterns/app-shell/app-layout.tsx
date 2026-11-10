import type { WithRequiredChildren } from "../../types/components/with-required-children.js";

function AppLayoutRoot({ children }: WithRequiredChildren) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Warm lamp light over the top of the page; decorative, never in the way of a click. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[image:var(--lamp)] bg-no-repeat"
      />

      <div className="relative">{children}</div>
    </div>
  );
}

function AppLayoutHeader({ children }: WithRequiredChildren) {
  return <>{children}</>;
}

function AppLayoutContent({ children }: WithRequiredChildren) {
  return (
    // Bottom room on phones so the last item is never under the flat dock.
    <div className="mx-auto flex max-w-7xl gap-6 px-3 pb-20 pt-4 sm:px-6 sm:pt-6 lg:pb-6">
      {children}
    </div>
  );
}

function AppLayoutSidebar({ children }: WithRequiredChildren) {
  return <>{children}</>;
}

function AppLayoutMain({ children }: WithRequiredChildren) {
  return <main className="min-w-0 flex-1">{children}</main>;
}

function AppLayoutNavigation({ children }: WithRequiredChildren) {
  return <>{children}</>;
}

export const AppLayout = Object.assign(AppLayoutRoot, {
  Header: AppLayoutHeader,
  Content: AppLayoutContent,
  Sidebar: AppLayoutSidebar,
  Main: AppLayoutMain,
  Navigation: AppLayoutNavigation,
});
