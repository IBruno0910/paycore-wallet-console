import { useTransfers } from "./useTransfers";
import type { TransferStatus, Transfer } from "./transfers.types";
import { CreateTransferForm } from "./CreateTransferForm";
import { useState, useEffect } from "react";
import { TransferDetailModal } from "./TransferDetailModal";
import { Skeleton } from "../../components/feedback/skeleton";

export function TransfersPage() {
  const { transfers, loading, error, refetch } = useTransfers();
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TransferStatus>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

const filteredTransfers = transfers.filter((transfer) => {
  const matchesSearch =
    transfer.id.toLowerCase().includes(search.toLowerCase()) ||
    transfer.description?.toLowerCase().includes(search.toLowerCase());

  const normalizedStatus = transfer.status.toLowerCase() as TransferStatus;

  const matchesStatus =
    statusFilter === "all" || normalizedStatus === statusFilter;

  return matchesSearch && matchesStatus;
});

const totalPages = Math.ceil(filteredTransfers.length / pageSize);

const paginatedTransfers = filteredTransfers.slice(
  (page - 1) * pageSize,
  page * pageSize
);

useEffect(() => {
  setPage(1);
}, [search, statusFilter]);

  if (loading) {
    return <TransfersSkeleton />;
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

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Buscar</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por ID o descripción"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | TransferStatus)
            }
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completadas</option>
            <option value="failed">Fallidas</option>
          </select>
        </div>
      </div>

      {filteredTransfers.length === 0 ? (
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
              {paginatedTransfers.map((transfer) => {

                return (
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
                    <StatusBadge status={transfer.status.toLowerCase() as TransferStatus} />
                  </td>

                  <td className="px-4 py-3 text-slate-500">
                    {formatDate(transfer.createdAt)}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm">
            <p className="text-slate-500">
              Página {page} de {totalPages || 1}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                disabled={page === 1}
                className="rounded-lg border border-slate-300 px-3 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>

              <button
                onClick={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
                disabled={page === totalPages || totalPages === 0}
                className="rounded-lg border border-slate-300 px-3 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
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

function TransfersSkeleton() {
  return (
    <section className="space-y-6">
      <Skeleton className="h-20 w-full" />

      <Skeleton className="h-56 w-full" />

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="space-y-3 p-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </section>
  );
}