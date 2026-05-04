import { useAccounts } from "./useAccounts";

export function AccountsPage() {
  const { accounts, loading, error, refetch } = useAccounts();

  if (loading) {
    return <p className="text-slate-500">Cargando cuentas...</p>;
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">
          No pudimos cargar las cuentas
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

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Cuentas</h2>
        <p className="mt-2 text-slate-500">
          Visualización de cuentas operativas, saldos y estado.
        </p>
      </header>

      {accounts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h3 className="text-lg font-semibold">No hay cuentas</h3>
          <p className="mt-2 text-sm text-slate-500">
            Todavía no hay cuentas registradas para esta empresa.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((account) => (
            <article
              key={account.id}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{account.alias}</h3>
                  <p className="mt-1 font-mono text-xs text-slate-500">
                    {account.id}
                  </p>
                </div>

                <StatusBadge status={account.status} />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Saldo disponible"
                  value={formatCurrency(account.availableBalance)}
                />
                <InfoItem
                  label="Saldo retenido"
                  value={formatCurrency(account.heldBalance)}
                />
                <InfoItem label="Moneda" value={account.currency} />
                <InfoItem
                  label="Actualizada"
                  value={formatDate(account.updatedAt)}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}