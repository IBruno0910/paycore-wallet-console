import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../api/api-error";
import { paths } from "../../routes/paths";
import { login } from "./auth.api";
import { saveAuthSession } from "./auth.storage";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@paycore.com");
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      const data = await login({ email, password });

      saveAuthSession(data.token, data.user);
      navigate(paths.dashboard);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 text-slate-900 shadow-xl">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-slate-500">
          Accedé a Paycore Wallet Console.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@paycore.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Contraseña</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}