export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH";

export type Alert = {
  type: string;
  severity: AlertSeverity;
  message: string;
  details: Record<string, any>;
};