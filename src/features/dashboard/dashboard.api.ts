import { apiClient } from "../../api/client";

type TransfersSummary = {
  totalTransfers: number;
  completedTransfers: number;
  failedTransfers: number;
  totalTransferredVolume: number;
  successRate: number;
  failedRate: number;
};

type WebhooksSummary = {
  totalWebhookEvents: number;
  deliveredWebhookEvents: number;
  failedWebhookEvents: number;
  deliveryRate: number;
};

export type DashboardResponse = {
  success: boolean;
  data: {
    transfers: TransfersSummary;
    webhooks: WebhooksSummary;
  };
};

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await apiClient.get<DashboardResponse>("/analytics/summary");
  return response.data;
}