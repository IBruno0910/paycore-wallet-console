import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../../api/api-error";
import { getAccounts } from "./accounts.api";
import type { Account } from "./accounts.types";

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAccounts() {
    setLoading(true);
    setError("");

    try {
      const response = await getAccounts();
      setAccounts(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    refetch: fetchAccounts,
  };
}