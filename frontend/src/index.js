import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./Auth/AuthContext";
import {SocketProvider} from "./hook/useSocketContext"
const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  // <React.StrictMode>
  <AuthContextProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);