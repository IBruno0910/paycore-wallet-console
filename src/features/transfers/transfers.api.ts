import { apiClient } from "../../api/client";
import type {
  CreateTransferPayload,
  CreateTransferResponse,
  TransfersResponse,
} from "./transfers.types";

export async function getTransfers(): Promise<TransfersResponse> {
  const response = await apiClient.get<TransfersResponse>("/transfers");
  return response.data;
}

export async function createTransfer(
  payload: CreateTransferPayload
): Promise<CreateTransferResponse> {
  const response = await apiClient.post<CreateTransferResponse>(
    "/transfers",
    payload
  );

  return response.data;
}