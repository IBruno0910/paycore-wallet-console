import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken } from "../features/auth/auth.storage";
import { paths } from "./paths";

export function ProtectedRoute() {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to={paths.login} replace />;
  }

  return <Outlet />;
}