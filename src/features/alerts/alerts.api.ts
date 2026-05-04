import { apiClient } from "../../api/client";

export async function getAlerts() {
  const res = await apiClient.get("/analytics/alerts");
  return res.data.data;
}

export async function getSmartAlerts() {
  const res = await apiClient.get("/analytics/smart-alerts");
  return res.data.data;
}