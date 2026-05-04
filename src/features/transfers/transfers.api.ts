import { apiClient } from "../../api/client";
import type {
  CreateTransferPayload,
  CreateTransferResponse,
  TransfersResponse,
} from "./transfers.types";

export async function getTransfers(
  page = 1,
  limit = 10
): Promise<TransfersResponse> {
  const response = await apiClient.get<TransfersResponse>("/transfers", {
    params: {
      page,
      limit,
    },
  });

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