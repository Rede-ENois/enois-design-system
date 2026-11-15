import type { ModerationReportData } from "./moderation-report-data.js";
import type { ReportAdminAction } from "./report-admin-action.js";

export type ReportActionConfirmation = {
  report: ModerationReportData;
  action: ReportAdminAction;
};
