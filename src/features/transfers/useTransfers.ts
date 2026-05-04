import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../../api/api-error";
import { getTransfers } from "./transfers.api";
import type { Transfer } from "./transfers.types";

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchTransfers() {
    const isInitialLoad = transfers.length === 0;

    if (isInitialLoad) {
      setLoading(true);
    }

    setError("");

    try {
      const response = await getTransfers();
      setTransfers(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransfers();
  }, []);

  return {
    transfers,
    loading,
    error,
    refetch: fetchTransfers,
  };
}