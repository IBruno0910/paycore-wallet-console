import { useState } from "react";
import { getApiErrorMessage } from "../../api/api-error";
import { useAccounts } from "../accounts/useAccounts";
import { createTransfer } from "./transfers.api";

type CreateTransferFormProps = {
  onCreated: () => void | Promise<void>;
};

export function CreateTransferForm({ onCreated }: CreateTransferFormProps) {
  const { accounts, loading: loadingAccounts, error: accountsError } = useAccounts();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const numericAmount = Number(amount);

    if (!sourceAccountId) {
      setError("Seleccioná una cuenta de origen.");
      return;
    }

    if (!destinationAccountId) {
      setError("Seleccioná una cuenta de destino.");
      return;
    }

    if (sourceAccountId === destinationAccountId) {
      setError("La cuenta de origen y destino no pueden ser la misma.");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setError("El monto debe ser mayor a 0.");
      return;
    }

    if (!description.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    setShowConfirmation(true);
  }

    async function handleConfirmTransfer() {
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await createTransfer({
        amount: Number(amount),
        description: description.trim(),
        sourceAccountId,
        destinationAccountId,
        idempotencyKey: crypto.randomUUID(),
      });

      setAmount("");
      setDescription("");
      setSourceAccountId("");
      setDestinationAccountId("");
      setShowConfirmation(false);

      setSuccessMessage("Transferencia creada correctamente.");

      await onCreated();

      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold">Nueva transferencia</h3>
      <p className="mt-1 text-sm text-slate-500">
        Creá una transferencia entre cuentas reales de Paycore.
      </p>

      {accountsError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          No pudimos cargar las cuentas: {accountsError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Cuenta origen</label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            value={sourceAccountId}
            onChange={(event) => setSourceAccountId(event.target.value)}
            disabled={loadingAccounts}
          >
            <option value="">
              {loadingAccounts ? "Cargando cuentas..." : "Seleccionar cuenta"}
            </option>

            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.alias} · {account.currency} · Disponible:{" "}
                {formatCurrency(account.availableBalance)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Cuenta destino</label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            value={destinationAccountId}
            onChange={(event) => setDestinationAccountId(event.target.value)}
            disabled={loadingAccounts}
          >
            <option value="">
              {loadingAccounts ? "Cargando cuentas..." : "Seleccionar cuenta"}
            </option>

            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.alias} · {account.currency} · Disponible:{" "}
                {formatCurrency(account.availableBalance)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Monto</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="1000"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Descripción</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Pago proveedor"
          />
        </div>

        <div className="md:col-span-2">
          <button
            className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting || loadingAccounts}
          >
            {isSubmitting ? "Creando..." : "Crear transferencia"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold">Confirmar transferencia</h3>

            <p className="mt-2 text-sm text-slate-500">
              Revisá los datos antes de crear la transferencia.
            </p>

            <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
              <p>
                <span className="font-medium text-slate-500">Monto:</span>{" "}
                <strong>{formatCurrency(Number(amount))}</strong>
              </p>

              <p>
                <span className="font-medium text-slate-500">Descripción:</span>{" "}
                <strong>{description}</strong>
              </p>

              <p>
                <span className="font-medium text-slate-500">Cuenta origen:</span>{" "}
                <strong>{sourceAccountId}</strong>
              </p>

              <p>
                <span className="font-medium text-slate-500">Cuenta destino:</span>{" "}
                <strong>{destinationAccountId}</strong>
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                disabled={isSubmitting}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmTransfer}
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Confirmando..." : "Confirmar transferencia"}
              </button>
            </div>
          </div>
        </div>
)}
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}