// baseRouter.tsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { app1Routes } from "./app1/app1Router";
import { app2Routes } from "./app2/app2Router";
import HomePage  from "./HomePage"
import LoginPage from "./LoginPage";
export const router = createBrowserRouter([
      {
        path: "/login",
        element: <LoginPage/>,
    },
    {
        path: "/home",
        element: <HomePage/>,
    },
  // ...app1Routes,
  ...app2Routes,
]);