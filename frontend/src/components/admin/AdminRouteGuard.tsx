import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { getAdminToken } from '../../api/adminSession';

export function AdminRouteGuard() {
  const location = useLocation();
  const token = getAdminToken();

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
