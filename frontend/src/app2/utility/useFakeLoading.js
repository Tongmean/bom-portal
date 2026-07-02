// utility/useFakeLoading.js

import { useState, useEffect } from "react";

const useFakeLoading = (loading) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let interval;
    let timeout;

    if (loading) {
      // Reset when loading starts
      setPercent(0);

      interval = setInterval(() => {
        setPercent((prev) => {
          // Stop at 95% until API finishes
          if (prev >= 95) return prev;

          // Increase randomly
          const step = Math.floor(Math.random() * 8) + 2;

          return Math.min(prev + step, 95);
        });
      }, 200);
    } else {
      // Complete loading
      setPercent(100);

      timeout = setTimeout(() => {
        setPercent(0);
      }, 500);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loading]);

  return percent;
};

export default useFakeLoading;