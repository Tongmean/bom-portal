import React, { useMemo, useEffect, useState } from "react";
import { message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetchMultiple from "../../../hook/useFetchmultiple";
import useMutation from "../../../hook/useMutation";
import { baseURL } from "../../../../utility/apiClient";
import DynamicArrayForm from "./DynamicArrayForm";
import {
    navigateWithHighlight,
  } from "../../../utility/navigationHighlight";

const EditSemiFG = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 1. Extract and convert searchParams into an array (e.g., ?ids=2,8 -> [2, 8])
  const idsString = searchParams.get("ids");
  
  const idArray = useMemo(() => {
    const arr = idsString ? idsString.split(",").map((id) => Number(id.trim())) : [];
    // console.log("1. Parsed idArray from URL:", arr);
    return arr;
  }, [idsString]);

  // State to hold the fetched initial array data
  const [initialData, setInitialData] = useState([]);
  const [isFetchingInitial, setIsFetchingInitial] = useState(true);

  // Mutations
  const { mutate: fetchInitialMutate } = useMutation();
  const { mutate: updateMutate, loading: isUpdating } = useMutation();

  // Fetch configs (columns and materials)
  const endpoints = useMemo(() => ({
    semiRegister: `${baseURL}/app2/semi-register/1`,
    m_mat: `${baseURL}/app2/m_mat`,
  }), []);
  
  const { data: fetchResult, loading: isConfigLoading, error } = useFetchMultiple(endpoints);
  const columnDefs = fetchResult?.semiRegister?.columnDefs || [];
  const m_mat_data = fetchResult?.m_mat?.data || [];

 // 2. Fetch the initial data via POST when the component mounts
    useEffect(() => {
        if (!idArray || idArray.length === 0) {
        setIsFetchingInitial(false);
        return;
        }

        const fetchInitialValues = async () => {
        try {
            const result = await fetchInitialMutate({
            url: `${baseURL}/app2/semi-register/postinitail`, 
            method: "POST",
            data: { ids: idArray },
            });

            if (result?.success || result?.status === 200) {
            const fetchedArray = result?.data?.data || result?.data || result || [];
            
            if (Array.isArray(fetchedArray)) {
                // 🛠️ CONVERT STRING IDS TO NUMBERS HERE
                const formattedData = fetchedArray.map(item => ({
                ...item,
                parrent_mat_id: item.parrent_mat_id ? Number(item.parrent_mat_id) : null,
                child_mat_id: item.child_mat_id ? Number(item.child_mat_id) : null,
                quantity: item.quantity ? Number(item.quantity) : null,
                priority: item.priority ? Number(item.priority) : null,
                }));

                setInitialData(formattedData);
            } else {
                message.error("Data format error from server");
                setInitialData([]);
            }
            }
        } catch (err) {
            message.error("An error occurred while fetching initial data");
        } finally {
            setIsFetchingInitial(false);
        }
        };

    fetchInitialValues();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idArray]);

  // Filter materials (WIP, SEMI, FG) mapping
  const optionsMap = useMemo(() => {
    const matOptions = m_mat_data
      .filter((item) => item.component && /WIP|SEMI|FG/i.test(item.component))
      .map((item) => ({
        value: item.mat_id,
        label: `${item.erp} - ${item.component}`,
      }));

    return {
      parrent_mat_id: matOptions,
      child_mat_id: matOptions,
    };
  }, [m_mat_data]);

  // 3. Handle the PUT update
  const handleUpdate = async (payloadArray) => {
    console.log("Submitting update payload:", payloadArray);
    try {
      const result = await updateMutate({
        url: `${baseURL}/app2/semi-register/putArray`, // ⚠️ Double-check your PUT endpoint
        method: "POST",
        data: payloadArray, // Form payload (array of objects)
      });

      if (result?.success) {
        message.success(result?.data?.msg || "Updated successfully");
        setTimeout(() => {
            navigateWithHighlight({
              navigate,
              path: "/app2/product-register/semifg-Register",
              ids: idArray,
              idField: "mat_id",
            })
        }, 2000); // 2 seconds
      } else {
        message.error("Failed to update records");
      }
    } catch (err) {
      message.error("An error occurred during update");
    }
  };

  // Loading States
  if (isConfigLoading || isFetchingInitial) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading setup data...
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "red" }}>
        Error loading configuration. Please check your network or API.
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <DynamicArrayForm
        mode="edit"
        columnDefs={columnDefs}
        initialData={initialData} // Hydrated from the POST request
        optionsMap={optionsMap}
        loading={isUpdating}
        onSubmit={handleUpdate}
        onCancel={() => 
            setTimeout(() => {
                navigateWithHighlight({
                  navigate,
                  path: "/app2/product-register/semifg-Register",
                  ids: idArray,
                  idField: "mat_id",
                })
            }, 2000) // 2 seconds
        }
      />
    </div>
  );
};

export default EditSemiFG;