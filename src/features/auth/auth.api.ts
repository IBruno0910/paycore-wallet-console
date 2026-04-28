import { apiClient } from "../../api/client";
import type { LoginCredentials, LoginResponse } from "./auth.types";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
  return response.data;
}