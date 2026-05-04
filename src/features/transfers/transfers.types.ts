export type TransferStatus = "pending" | "completed" | "failed";

export type Transfer = {
  id: string;
  amount: number;
  description?: string;
  status: TransferStatus;
  idempotencyKey?: string;
  accountId?: string;
  createdAt: string;
  updatedAt?: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
};

export type TransfersResponse = {
  success: boolean;
  data: Transfer[];
};

export type CreateTransferPayload = {
  amount: number;
  description: string;
  sourceAccountId: string;
  destinationAccountId: string;
  idempotencyKey: string;
};

export type CreateTransferResponse = {
  success: boolean;
  message: string;
  data: Transfer;
};