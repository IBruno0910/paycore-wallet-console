import { Link, Outlet } from "react-router-dom";
import { paths } from "../../routes/paths";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold">Paycore</h1>
        <p className="mt-1 text-sm text-slate-500">Wallet Console</p>

        <nav className="mt-8 flex flex-col gap-2">
          <Link to={paths.dashboard}>Dashboard</Link>
          <Link to={paths.accounts}>Cuentas</Link>
          <Link to={paths.transfers}>Transferencias</Link>
          <Link to={paths.transactions}>Movimientos</Link>
        </nav>
      </aside>

      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
}