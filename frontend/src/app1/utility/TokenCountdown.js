

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
// import { useAuthContext } from "../../Auth/useAuthContext";
import { useLogout } from "../../Auth/useLogout";

const TokenCountdown = ({ token }) => {
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const { logout } = useLogout();

  useEffect(() => {
    if (!token) return;

    const updateTimer = () => {
      try {
        const decoded = jwtDecode(token);

        if (!decoded.exp) {
          logout();
          return;
        }

        const now = Math.floor(Date.now() / 1000);
        const remaining = decoded.exp - now;

        if (remaining <= 0) {
          setTimeLeft("00:00:00");

          logout(); // Auto logout
          return;
        }

        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;

        setTimeLeft(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        );
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [token, logout]);

  return <span>{timeLeft}</span>;
};

export default TokenCountdown;