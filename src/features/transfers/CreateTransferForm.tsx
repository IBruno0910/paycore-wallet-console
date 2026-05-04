import { useState } from "react";
import { getApiErrorMessage } from "../../api/api-error";
import { createTransfer } from "./transfers.api";

type CreateTransferFormProps = {
  onCreated: () => void | Promise<void>;
};

export function CreateTransferForm({ onCreated }: CreateTransferFormProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [sourceAccountId] = useState(
    "cc6c9f19-c54f-4291-be93-a919e23e8daf"
  );
  const [destinationAccountId] = useState(
    "0ddf1be0-d228-4f17-a264-89c1232f9583"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("El monto debe ser mayor a 0.");
      return;
    }

    if (!description.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createTransfer({
        amount: numericAmount,
        description: description.trim(),
        sourceAccountId,
        destinationAccountId,
        idempotencyKey: crypto.randomUUID(),
      });

      setAmount("");
      setDescription("");
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
        Creá una transferencia de prueba contra la API Paycore.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-3">
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

        <div className="flex items-end">
          <button
            className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Crear transferencia"}
          </button>
        </div>
      </form>

      {successMessage && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </section>
  );
}