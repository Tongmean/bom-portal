import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { message } from "antd";

const ProtectedRoute = ({
  children,
  allowRoles = [],
  allowDepartments = [],
}) => {
  const location = useLocation();

  const auth = JSON.parse(localStorage.getItem("user"));

  const role = auth?.user?.role || [];
  const department = auth?.user?.department || [];
  const Permissionroute = auth?.user?.Permissionroute || [];

  const isSuperAdmin = role.includes("superadmin");

  const hasRoutePermission = Permissionroute.some(
    (route) =>
      location.pathname === `/${route}` ||
      location.pathname === route
  );

  const hasRolePermission =
    allowRoles.length === 0 ||
    allowRoles.some((r) => role.includes(r));

  const hasDepartmentPermission =
    allowDepartments.length === 0 ||
    allowDepartments.some((d) => department.includes(d));

  const isAuthorized =
    isSuperAdmin ||
    (hasRoutePermission &&
      hasRolePermission &&
      hasDepartmentPermission);

  useEffect(() => {
    if (auth && !isAuthorized) {
         message.error({
            content: "You do not have permission to access this page",
            duration: 5,
        });
    }
  }, [auth, isAuthorized]);

  // Not logged in
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // Super Admin
  if (isSuperAdmin) {
    return children;
  }

  // No permission -> block render
  if (!isAuthorized) {
    return null;
  }

  return children;
};

export default ProtectedRoute;