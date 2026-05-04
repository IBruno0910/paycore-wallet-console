import type { Transfer, TransferStatus } from "./transfers.types";

type TransferDetailModalProps = {
  transfer: Transfer;
  onClose: () => void;
};

export function TransferDetailModal({
  transfer,
  onClose,
}: TransferDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <section className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xl font-bold">Detalle de transferencia</h3>
            <p className="mt-1 font-mono text-xs text-slate-500">
              {transfer.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Cerrar
          </button>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoItem label="Monto" value={formatCurrency(transfer.amount)} />
          <InfoItem label="Estado" value={<StatusBadge status={transfer.status} />} />
          <InfoItem
            label="Descripción"
            value={transfer.description || "Sin descripción"}
          />
          <InfoItem label="Fecha de creación" value={formatDate(transfer.createdAt)} />
          <InfoItem
            label="Idempotency key"
            value={transfer.idempotencyKey || "No disponible"}
          />
          <InfoItem label="Cuenta origen" value={transfer.sourceAccountId || "No disponible"} />
          <InfoItem
            label="Cuenta destino"
            value={transfer.destinationAccountId || "No disponible"}
          />
        </div>
      </section>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-2 break-all text-sm font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TransferStatus }) {
  const variants: Record<TransferStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  const labels: Record<TransferStatus, string> = {
    pending: "Pendiente",
    completed: "Completada",
    failed: "Fallida",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${variants[status]}`}>
      {labels[status]}
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