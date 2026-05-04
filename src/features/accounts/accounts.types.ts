export type AccountStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export type Account = {
  id: string;
  companyId: string;
  alias: string;
  currency: string;
  availableBalance: number;
  heldBalance: number;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
};

export type AccountsResponse = {
  success: boolean;
  data: Account[];
};