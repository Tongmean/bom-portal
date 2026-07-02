// utils/protectRoute.js

import { Navigate } from "react-router-dom";
// import { App } from "antd";

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

/*
|--------------------------------------------------------------------------
| Check Route Permission
|--------------------------------------------------------------------------
|
| Superadmin
|     access everything
|
| Admin
|     access everything
|
| User
|     only Permissionroute
|
*/

// export const checkRoutePermission = (pathname) => {
//   const user = getUser();

//   if (!user) return false;

//   //--------------------------------------------------
//   // Superadmin
//   //--------------------------------------------------

//   if (user.role === "superadmin") {
//     return true;
//   }

//   //--------------------------------------------------
//   // Admin
//   //--------------------------------------------------

//   if (user.role === "admin") {
//     return true;
//   }

//   //--------------------------------------------------
//   // User
//   //--------------------------------------------------

//   if (user.role === "user") {
//     return user.Permissionroute.some((route) =>
//       pathname.startsWith(route)
//     );
//   }

//   return false;
// };

/*
|--------------------------------------------------------------------------
| Protect Route Component
|--------------------------------------------------------------------------
*/

export default function ProtectRoute({ children }) {
  const user = (getUser())?.user;

  //--------------------------------------------------
  // Not Login
  //--------------------------------------------------

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //--------------------------------------------------
  // Login
  //--------------------------------------------------

  return children;
}