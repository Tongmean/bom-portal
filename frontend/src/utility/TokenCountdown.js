

// import React, { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// // import { useAuthContext } from "../../Auth/useAuthContext";
// import { useLogout } from "../../Auth/useLogout";

// const TokenCountdown = ({ token }) => {
//   const [timeLeft, setTimeLeft] = useState("00:00:00");
//   const { logout } = useLogout();

//   useEffect(() => {
//     if (!token) return;

//     const updateTimer = () => {
//       try {
//         const decoded = jwtDecode(token);

//         if (!decoded.exp) {
//           logout();
//           return;
//         }

//         const now = Math.floor(Date.now() / 1000);
//         const remaining = decoded.exp - now;

//         if (remaining <= 0) {
//           setTimeLeft("00:00:00");

//           logout(); // Auto logout
//           // return;
//         }

//         const hours = Math.floor(remaining / 3600);
//         const minutes = Math.floor((remaining % 3600) / 60);
//         const seconds = remaining % 60;

//         setTimeLeft(
//           `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
//             2,
//             "0"
//           )}:${String(seconds).padStart(2, "0")}`
//         );
//       } catch (error) {
//         console.error("Invalid token:", error);
//         logout();
//       }
//     };

//     updateTimer();

//     const interval = setInterval(updateTimer, 1000);

//     return () => clearInterval(interval);
//   }, [token, logout]);

//   return <span>{timeLeft}</span>;
// };

// export default TokenCountdown;


import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useLogout } from "../../Auth/useLogout";

const TokenCountdown = ({ token }) => {
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const { logout } = useLogout();

  useEffect(() => {
    // If there is no token, reset and exit
    if (!token) {
      setTimeLeft("00:00:00");
      return;
    }

    const updateTimer = () => {
      try {
        const decoded = jwtDecode(token); // exp is in seconds since epoch [web:15]

        // If token has no exp, treat as invalid and logout
        if (!decoded.exp) {
          logout();
          return;
        }

        const now = Math.floor(Date.now() / 1000);
        const remaining = decoded.exp - now;

        // If already expired, force logout and stop at 00:00:00
        if (remaining <= 0) {
          setTimeLeft("00:00:00");
          logout();
          return; // important: do not continue to compute hours/min/sec
        }

        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;

        setTimeLeft(
          `${String(hours).padStart(2, "0")}:` +
          `${String(minutes).padStart(2, "0")}:` +
          `${String(seconds).padStart(2, "0")}`
        );
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    };

    // First immediate run
    updateTimer();

    // Then update every second
    const interval = setInterval(updateTimer, 1000);

    // Clean up
    return () => clearInterval(interval);
  }, [token, logout]);

  return <span>{timeLeft}</span>;
};

export default TokenCountdown;