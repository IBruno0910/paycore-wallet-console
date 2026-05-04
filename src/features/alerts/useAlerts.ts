import { useEffect, useState } from "react";
import { getAlerts, getSmartAlerts } from "./alerts.api";
import { getApiErrorMessage } from "../../api/api-error";
import type { Alert } from "./alerts.types";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [smartAlerts, setSmartAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAll() {
    try {
      setLoading(true);
      setError("");

      const [alertsData, smartAlertsData] = await Promise.all([
        getAlerts(),
        getSmartAlerts(),
      ]);

      setAlerts(alertsData);
      setSmartAlerts(smartAlertsData);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

    useEffect(() => {
    fetchAll();

    const interval = setInterval(() => {
        fetchAll();
    }, 10000); // cada 10s

    return () => clearInterval(interval);
    }, []);

  return {
    alerts,
    smartAlerts,
    loading,
    error,
    refetch: fetchAll,
  };
}