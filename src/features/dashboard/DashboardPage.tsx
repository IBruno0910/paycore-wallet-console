import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "./useDashboard";

export function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) return <p className="text-slate-500">Cargando dashboard...</p>;

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">
          No pudimos cargar el dashboard
        </h2>
        <p className="mt-2 text-sm text-red-700">{error}</p>

        <button
          onClick={refetch}
          className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Reintentar
        </button>
      </section>
    );
  }

  if (!data) return <p>No hay datos disponibles.</p>;

  const transfers = data.data.transfers;
  const webhooks = data.data.webhooks;

  const transferStatusData = [
    { name: "Completadas", value: transfers.completedTransfers },
    { name: "Fallidas", value: transfers.failedTransfers },
    {
      name: "Otras",
      value:
        transfers.totalTransfers -
        transfers.completedTransfers -
        transfers.failedTransfers,
    },
  ];

  const webhookData = [
    { name: "Entregados", value: webhooks.deliveredWebhookEvents },
    { name: "Fallidos", value: webhooks.failedWebhookEvents },
    {
      name: "Pendientes/Otros",
      value:
        webhooks.totalWebhookEvents -
        webhooks.deliveredWebhookEvents -
        webhooks.failedWebhookEvents,
    },
  ];

  const rateData = [
    { name: "Éxito transfers", value: transfers.successRate },
    { name: "Fallos transfers", value: transfers.failedRate },
    { name: "Delivery webhooks", value: webhooks.deliveryRate },
  ];

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="mt-2 text-slate-500">
          Resumen operativo de transferencias, volumen y webhooks.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
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

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Estado de transferencias">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={transferStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
              >
                {transferStatusData.map((entry) => (
                  <Cell key={entry.name} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Estado de webhooks">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={webhookData}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
              >
                {webhookData.map((entry) => (
                  <Cell key={entry.name} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tasas operativas">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-6">{children}</div>
    </article>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}