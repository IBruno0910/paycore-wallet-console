import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "./useDashboard";
import { useTransfers } from "../transfers/useTransfers";
import { Skeleton } from "../../components/feedback/skeleton";

const COLORS = {
  completed: "#22c55e",   // verde
  failed: "#ef4444",      // rojo
  pending: "#f59e0b",     // amarillo
  neutral: "#0f172a",     // slate-900
  light: "#94a3b8",       // slate-400
};

export function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();
  const { transfers: timelineTransfers } = useTransfers();

  if (loading) {
    return <DashboardSkeleton />;
  }

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
      name: "Pendientes/Otras",
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
    { name: "Éxito", value: transfers.successRate },
    { name: "Fallos", value: transfers.failedRate },
    { name: "Webhooks", value: webhooks.deliveryRate },
  ];

  const timelineData = Object.values(
    timelineTransfers.reduce<Record<string, { date: string; total: number; volume: number }>>(
      (acc, transfer) => {
        const date = new Date(transfer.createdAt).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
        });

        if (!acc[date]) {
          acc[date] = {
            date,
            total: 0,
            volume: 0,
          };
        }

        acc[date].total += 1;
        acc[date].volume += transfer.amount;

        return acc;
      },
      {}
    )
  );
  
  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              PSP Operations Console
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              Dashboard operativo
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitoreo de transferencias, volumen procesado, performance de
              webhooks y salud general de la billetera.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 px-6 py-4 text-white">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Volumen procesado
            </p>
            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(transfers.totalTransferredVolume)}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Transferencias"
          value={transfers.totalTransfers}
          description="Operaciones totales registradas"
        />
        <MetricCard
          title="Completadas"
          value={transfers.completedTransfers}
          description="Transferencias procesadas con éxito"
        />
        <MetricCard
          title="Fallidas"
          value={transfers.failedTransfers}
          description="Operaciones rechazadas o fallidas"
          variant="danger"
        />
        <MetricCard
          title="Eventos webhook"
          value={webhooks.totalWebhookEvents}
          description="Eventos emitidos por el sistema"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <RateCard
          title="Tasa de éxito"
          value={transfers.successRate}
          helper="Transferencias completadas"
        />
        <RateCard
          title="Tasa de fallos"
          value={transfers.failedRate}
          helper="Transferencias fallidas"
          variant="danger"
        />
        <RateCard
          title="Delivery webhooks"
          value={webhooks.deliveryRate}
          helper="Eventos entregados correctamente"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Distribución de transferencias"
          description="Comparación entre operaciones completadas, fallidas y pendientes."
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transferStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                <Cell fill={COLORS.completed} />
                <Cell fill={COLORS.failed} />
                <Cell fill={COLORS.pending} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Distribución de webhooks"
          description="Estado operativo de eventos enviados a integraciones externas."
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={webhookData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                <Cell fill={COLORS.completed} />
                <Cell fill={COLORS.failed} />
                <Cell fill={COLORS.light} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="xl:col-span-2">
          <ChartCard
            title="Tasas operativas"
            description="Resumen porcentual de éxito, fallos y delivery de webhooks."
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={rateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {rateData.map((entry) => {
                    let color = COLORS.neutral;

                    if (entry.name === "Éxito") color = COLORS.completed;
                    if (entry.name === "Fallos") color = COLORS.failed;
                    if (entry.name === "Webhooks") color = COLORS.light;

                    return <Cell key={entry.name} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="xl:col-span-2">
          <ChartCard
            title="Timeline de transferencias"
            description="Evolución diaria de cantidad de transferencias y volumen operado."
          >
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />

                <YAxis
                  yAxisId="left"
                  allowDecimals={false}
                  tickFormatter={(value) => `${value}`}
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => formatCompactCurrency(value)}
                />

                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Volumen") {
                      return [formatCurrency(Number(value)), name];
                    }

                    return [value, name];
                  }}
                />

                <Legend />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="total"
                  stroke={COLORS.neutral}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Cantidad"
                />

                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="volume"
                  stroke={COLORS.completed}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Volumen"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  title,
  value,
  description,
  variant = "default",
}: {
  title: string;
  value: string | number;
  description: string;
  variant?: "default" | "danger";
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p
        className={`mt-3 text-3xl font-bold ${
          variant === "danger" ? "text-red-600" : "text-slate-950"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </article>
  );
}

function RateCard({
  title,
  value,
  helper,
  variant = "default",
}: {
  title: string;
  value: number;
  helper: string;
  variant?: "default" | "danger";
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            variant === "danger"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {value}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            variant === "danger" ? "bg-red-500" : "bg-slate-950"
          }`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">{helper}</p>
    </article>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

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

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

function DashboardSkeleton() {
  return (
    <section className="space-y-8">
      <Skeleton className="h-40 w-full rounded-3xl" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
        <Skeleton className="h-96 xl:col-span-2" />
      </div>
    </section>
  );
}