import { AxiosError } from "axios";

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;

  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }

  if (axiosError.response?.data?.error) {
    return axiosError.response.data.error;
  }

  if (axiosError.message) {
    return axiosError.message;
  }

  return "Ocurrió un error inesperado.";
}