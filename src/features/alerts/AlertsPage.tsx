import { useEffect, useState } from "react";
import { useAlerts } from "./useAlerts";

export function AlertsPage() {
  const { alerts, smartAlerts, loading, error, refetch } = useAlerts();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
  }, [alerts, smartAlerts]);

  if (loading) return <p className="text-slate-500">Cargando alertas...</p>;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-700">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-white"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Alertas del sistema</h2>
          <p className="mt-1 text-slate-500">
            Monitoreo de eventos críticos y anomalías operativas.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-xs text-slate-500">
              Actualizado: {lastUpdated.toLocaleTimeString()}
            </p>
          )}

          <button
            onClick={refetch}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-slate-100"
          >
            Actualizar
          </button>
        </div>
      </header>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Alertas</h3>
        <div className="grid gap-4">
          {alerts.map((alert, i) => (
            <AlertCard key={i} alert={alert} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Insights inteligentes</h3>
        <div className="grid gap-4">
          {smartAlerts.map((alert, i) => (
            <AlertCard key={i} alert={alert} isSmart />
          ))}
        </div>
      </div>
    </section>
  );
}

function AlertCard({
  alert,
  isSmart = false,
}: {
  alert: any;
  isSmart?: boolean;
}) {
  const colors = {
    HIGH: "border-red-300 bg-red-50 text-red-800",
    MEDIUM: "border-yellow-300 bg-yellow-50 text-yellow-800",
    LOW: "border-slate-300 bg-slate-50 text-slate-700",
  };

  return (
    <article
      className={`rounded-2xl border p-5 ${
        colors[alert.severity as keyof typeof colors]
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">
          {isSmart ? "Insight" : "Alerta"}
        </p>
        <span className="text-xs font-bold">{alert.severity}</span>
      </div>

      <h4 className="mt-2 text-lg font-bold">{alert.type}</h4>
      <p className="mt-2 text-sm">{alert.message}</p>

      <pre className="mt-4 overflow-auto rounded-xl bg-white p-3 text-xs text-slate-700">
        {JSON.stringify(alert.details, null, 2)}
      </pre>
    </article>
  );
}