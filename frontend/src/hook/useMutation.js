// import { useState } from "react";
// import apiClient from "../../utility/apiClient";
// import { useAuthContext } from '../../Auth/useAuthContext';

// const useMutation = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { user } = useAuthContext();
//   const mutate = async ({
//     method = "post",
//     url,
//     data = {},
//     config = {},
//   }) => {
//     try {
//       setLoading(true);
//       setError(null);

//       // const userString = localStorage.getItem("user");
//       // const user = userString ? JSON.parse(userString) : null;
//       const token = user?.user?.token;
//       // console.log("user", user)
//       // console.log("TOKEN:", token);

//       const response = await apiClient({
//         method,
//         url,
//         data,
//         headers: {
//           ...(config.headers || {}),
//           ...(token && {
//             Authorization: `Bearer ${token}`,
//           }),
//         },
//         ...config,
//       });

//       return {
//         success: true,
//         data: response.data,
//       };
//     } catch (err) {
//       const message =
//         err.response?.data?.message ||
//         err.response?.data?.msg ||
//         err.message;

//       setError(message);

//       return {
//         success: false,
//         error: message,
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     mutate,
//     loading,
//     error,
//   };
// };

// export default useMutation;


// // const { mutate, loading } = useMutation();

// // // POST
// // await mutate({
// //   method: "post",
// //   url: "/user/create",
// //   data: formData,
// // });

// // // PUT
// // await mutate({
// //   method: "put",
// //   url: `/user/${id}`,
// //   data: formData,
// // });

// // // DELETE
// // await mutate({
// //   method: "delete",
// //   url: `/user/${id}`,
// // });

import { useState, useCallback } from "react";
import apiClient from "../../utility/apiClient";
import { useAuthContext } from "../../Auth/useAuthContext";

const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuthContext();

  const mutate = useCallback(
    async ({
      method = "post",
      url,
      data = {},
      config = {},
    }) => {
      try {
        setLoading(true);
        setError(null);

        const token = user?.user?.token;

        const response = await apiClient({
          method,
          url,
          data,
          headers: {
            ...(config.headers || {}),
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
          ...config,
        });

        return {
          success: true,
          data: response.data,
        };
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.msg ||
          err.message;

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return {
    mutate,
    loading,
    error,
  };
};

export default useMutation;