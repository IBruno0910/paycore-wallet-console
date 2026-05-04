import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../../api/api-error";
import { getTransfers } from "./transfers.api";
import type { Pagination, Transfer } from "./transfers.types";

const PAGE_SIZE = 10;

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchTransfers(targetPage = page) {
    setLoading(transfers.length === 0);
    setError("");

    try {
      const response = await getTransfers(targetPage, PAGE_SIZE);

      setTransfers(response.data);
      setPagination(response.pagination);
      setPage(response.pagination.page);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransfers(page);
  }, [page]);

  return {
    transfers,
    pagination,
    page,
    pageSize: PAGE_SIZE,
    loading,
    error,
    setPage,
    refetch: () => fetchTransfers(page),
  };
}