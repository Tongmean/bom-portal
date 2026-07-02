// app1Router.tsx

import App1Layout from "./App1Layout";
// import Dashboard from "./modules/Dashboard";
// import Users from "./modules/Users";

export const app1Routes = [
  {
    path: "/app1",
    element: <App1Layout />,
    // children: [
    //   {
    //     index: true,
    //     element: <Dashboard />
    //   },
    //   {
    //     path: "users",
    //     element: <Users />
    //   }
    // ]
  }
];