import { useTransfers } from "./useTransfers";
import type { TransferStatus, Transfer } from "./transfers.types";
import { CreateTransferForm } from "./CreateTransferForm";
import { useState } from "react";
import { TransferDetailModal } from "./TransferDetailModal";


export function TransfersPage() {
  const { transfers, loading, error, refetch } = useTransfers();

  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);

  if (loading) {
    return <p className="text-slate-500">Cargando transferencias...</p>;
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">
          No pudimos cargar las transferencias
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
        <h2 className="text-2xl font-bold">Transferencias</h2>
        <p className="mt-2 text-slate-500">
          Gestión y monitoreo de transferencias de la PSP.
        </p>
      </header>

      <CreateTransferForm onCreated={refetch} />

      {transfers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h3 className="text-lg font-semibold">No hay transferencias</h3>
          <p className="mt-2 text-sm text-slate-500">
            Todavía no se registraron transferencias en el sistema.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Descripción</th>
                <th className="px-4 py-3 font-medium">Monto</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {transfers.map((transfer) => (
                <tr
                  key={transfer.id}
                  onClick={() => setSelectedTransfer(transfer)}
                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {transfer.id.slice(0, 8)}...
                  </td>

                  <td className="px-4 py-3">
                    {transfer.description || "Sin descripción"}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(transfer.amount)}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={transfer.status} />
                  </td>

                  <td className="px-4 py-3 text-slate-500">
                    {formatDate(transfer.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedTransfer && (
        <TransferDetailModal
          transfer={selectedTransfer}
          onClose={() => setSelectedTransfer(null)}
        />
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: TransferStatus }) {
  const baseClass =
    "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize";

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
    <span className={`${baseClass} ${variants[status]}`}>
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