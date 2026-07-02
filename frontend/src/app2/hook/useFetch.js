

// import { useEffect, useState, useCallback } from "react";

// const useFetch = (url) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const refetch = useCallback(async () => {
//     if (!url) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error("Request failed");
//       }

//       const result = await response.json();
//       setData(result);

//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [url]);

//   useEffect(() => {
//     refetch();
//   }, [refetch]);

//   return {
//     data,
//     loading,
//     error,
//     refetch,
//   };
// };

// export default useFetch;

import { useEffect, useState, useCallback } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.user?.token;
      console.log("token",token)
      console.log("user",user?.user)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json();
      setData(result);

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useFetch;