import React from "react";

export default function DepartmentGuard({
  allowDepartments = [],
  children,
}) {
  const auth = JSON.parse(localStorage.getItem("user"));

  const roles = auth?.user?.role || [];
  const departments = auth?.user?.department || [];

  // Super Admin can see everything
  if (roles.includes("superadmin")) {
    return children;
  }

  const isAuthorized = allowDepartments.some((dept) =>
    departments.includes(dept)
  );

  // Not authorized => render nothing
  if (!isAuthorized) {
    return null;
  }

  return children;
}