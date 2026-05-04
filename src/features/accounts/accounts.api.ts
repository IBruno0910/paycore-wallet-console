import { apiClient } from "../../api/client";
import type { AccountsResponse } from "./accounts.types";

export async function getAccounts(): Promise<AccountsResponse> {
  const response = await apiClient.get<AccountsResponse>("/accounts");
  return response.data;
}