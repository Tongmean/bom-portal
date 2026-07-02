import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from '../../Auth/useAuthContext';

const useFetchmultiple = (endpoints = {}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.user?.token;
      // console.log("token",token)
      // console.log("user",user)

      const entries = Object.entries(endpoints);

      const results = await Promise.all(
        entries.map(async ([key, url]) => {
          const response = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`${key} API failed`);
          }

          const json = await response.json();

          return [key, json];
        })
      );

      setData(Object.fromEntries(results));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoints]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    data,
    loading,
    error,
    refetch: fetchAll,
  };
};

export default useFetchmultiple;