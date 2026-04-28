import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { LoginPage } from "../features/auth/LoginPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { AccountsPage } from "../features/accounts/AccountsPage";
import { TransfersPage } from "../features/transfers/TransfersPage";
import { TransactionsPage } from "../features/transactions/TransactionsPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { paths } from "./paths";

const router = createBrowserRouter([
  {
    path: paths.login,
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: paths.dashboard,
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: paths.accounts,
            element: <AccountsPage />,
          },
          {
            path: paths.transfers,
            element: <TransfersPage />,
          },
          {
            path: paths.transactions,
            element: <TransactionsPage />,
          },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}