import { Link, Outlet, useNavigate } from "react-router-dom";
import { paths } from "../../routes/paths";
import { clearAuthSession } from "../../features/auth/auth.storage";

export function AppLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    clearAuthSession();
    navigate(paths.login);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold">Paycore</h1>
        <p className="mt-1 text-sm text-slate-500">Wallet Console</p>

        <nav className="mt-8 flex flex-col gap-2 text-sm">
          <Link
            to={paths.dashboard}
            className="rounded-lg px-3 py-2 hover:bg-slate-100"
          >
            Dashboard
          </Link>

          <Link
            to={paths.accounts}
            className="rounded-lg px-3 py-2 hover:bg-slate-100"
          >
            Cuentas
          </Link>

          <Link
            to={paths.transfers}
            className="rounded-lg px-3 py-2 hover:bg-slate-100"
          >
            Transferencias
          </Link>

          <Link
            to={paths.transactions}
            className="rounded-lg px-3 py-2 hover:bg-slate-100"
          >
            Movimientos
          </Link>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full rounded-xl border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
}