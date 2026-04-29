import { useDashboard } from "./useDashboard";

export function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) return <p>Cargando dashboard...</p>;

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={refetch}>Reintentar</button>
      </div>
    );
  }

  if (!data) return <p>No hay datos disponibles.</p>;

  const transfers = data.data.transfers;
  const webhooks = data.data.webhooks;

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-4 gap-4">
        <Card title="Total transferencias" value={transfers.totalTransfers} />
        <Card title="Completadas" value={transfers.completedTransfers} />
        <Card title="Fallidas" value={transfers.failedTransfers} />
        <Card
          title="Volumen total"
          value={formatCurrency(transfers.totalTransferredVolume)}
        />
        <Card title="Tasa de éxito" value={`${transfers.successRate}%`} />
        <Card title="Tasa de fallos" value={`${transfers.failedRate}%`} />
        <Card title="Eventos webhook" value={webhooks.totalWebhookEvents} />
        <Card title="Delivery webhook" value={`${webhooks.deliveryRate}%`} />
      </div>
    </section>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}