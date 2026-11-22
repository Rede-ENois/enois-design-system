import { useEffect, useRef } from "react";

import type { ModerationReportData } from "../../types/domain/moderation/moderation-report-data.js";

export function useReportActionFocus(reports: ModerationReportData[]) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const actionReportRef = useRef<string | null>(null);

  useEffect(() => {
    const reportId = actionReportRef.current;
    if (!reportId || reports.some((report) => report.reportId === reportId)) return;
    actionReportRef.current = null;
    if (!triggerRef.current?.isConnected && document.activeElement === document.body) {
      titleRef.current?.focus({ preventScroll: true });
    }
  }, [reports]);

  const rememberTrigger = () => {
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    actionReportRef.current = null;
  };

  const onCloseAutoFocus = (event: Event) => {
    const active = document.activeElement;
    const closingDialog = event.target;
    const movedElsewhere =
      active &&
      active !== document.body &&
      active.isConnected &&
      !(closingDialog instanceof HTMLElement && closingDialog.contains(active));
    // A confirmação controlada não registra um DialogTrigger no Radix.
    event.preventDefault();
    if (movedElsewhere) return;
    const trigger = triggerRef.current;
    if (trigger?.isConnected && !trigger.matches(":disabled, [aria-disabled='true']")) {
      trigger.focus({ preventScroll: true });
    } else titleRef.current?.focus({ preventScroll: true });
  };

  return {
    titleRef,
    rememberTrigger,
    onCloseAutoFocus,
    watchRemoval: (reportId: string) => {
      actionReportRef.current = reportId;
    },
  };
}
