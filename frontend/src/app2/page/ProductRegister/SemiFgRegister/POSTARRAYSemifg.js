import React, { useMemo } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import useFetchMultiple from "../../../hook/useFetchmultiple";
import useMutation from "../../../hook/useMutation";
import { baseURL } from "../../../../utility/apiClient";
import DynamicArrayForm from "./DynamicArrayForm";

const CreateSemiFG = () => {
  const navigate = useNavigate();
  const { mutate, loading: mutationLoading } = useMutation();

  const endpoints = useMemo(() => ({
    semiRegister: `${baseURL}/app2/semi-register/1`,
    m_mat: `${baseURL}/app2/m_mat`,
  }), []);

  const { data: fetchResult, loading, error } = useFetchMultiple(endpoints);
  const columnDefs = fetchResult?.semiRegister?.columnDefs || [];
  const m_mat_data = fetchResult?.m_mat?.data || [];

  const optionsMap = useMemo(() => {
    const matOptionsPatent = m_mat_data
      .filter((item) => {
        // Ensure item.component exists, then check if it contains WIP, SEMI, or FG
        return item.component && /WIP|SEMI|FG/i.test(item.component);
      })
      .map((item) => ({
        value: item.mat_id,
        label: `${item.erp} - ${item.component}`,
      }));
    const matOptionschild = m_mat_data
      .filter((item) => {
        // Ensure item.component exists, then check if it contains WIP, SEMI, or FG
        return item.component && /WIP|SEMI|FG|รีเวท/i.test(item.component);
      })
      .map((item) => ({
        value: item.mat_id,
        label: `${item.erp} - ${item.component} -${item.name}`,
      }));

    return {
      parrent_mat_id: matOptionsPatent,
      child_mat_id: matOptionschild,
    };
  }, [m_mat_data]);
  // console.log("optionsMap", optionsMap);
  // console.log("m_mat_data", m_mat_data);
  const handleCreate = async (payloadArray) => {
    console.log("Submitting payload:", payloadArray);
    try {
      const result = await mutate({
        url: `${baseURL}/app2/semi-register/postArray`,
        method: "POST", // POST method
        data: payloadArray, // Array payload
      });

      if (result?.success) {
        message.success(result?.data?.msg || "Created successfully");
        // navigate(-1);
      } else {
        message.error("Failed to create record");
      }
    } catch (err) {
      message.error("An error occurred");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading configuration</div>;

  return (
    <DynamicArrayForm
      mode="create"
      columnDefs={columnDefs}
      initialData={[]} // Let form handle the default empty row
      optionsMap={optionsMap}
      loading={mutationLoading}
      onSubmit={handleCreate}
      onCancel={() => navigate(-1)}
    />
  );
};

export default CreateSemiFG;