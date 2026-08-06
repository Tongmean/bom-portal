import React, { useMemo } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import useFetchMultiple from "../../../hook/useFetchmultiple";
import useMutation from "../../../hook/useMutation";
import { baseURL } from "../../../../utility/apiClient";
import DynamicRoutingForm from "./DynamicRoutingForm";
const PostSingleProcessRoutingTooling = () => {
  const navigate = useNavigate();
  const { mutate, loading: mutationLoading, error: mutationError } = useMutation();

  const endpoints = useMemo(
    () => ({
     
      routing_tooling: `${baseURL}/app2/process_tooling/1`,
      m_mat: `${baseURL}/app2/m_mat`,
      componentHeaderOption: `${baseURL}/app2/option/m_componentHeader`,
      routingOrder_option: `${baseURL}/app2/option/m_routingOrder`,
    }),
    []
  );

  const { data, loading, error } = useFetchMultiple(endpoints);
  
    const {header, detail_bom, detail_machine} = data?.routing_tooling?.columnDefs || {}
  console.log("data", data);
//   console.log("header", header);
  const optionsMap = useMemo(
    () => ({
      process:
        data?.componentHeaderOption?.data
        ?.filter((item) =>
        ["hotPress", "sharpenDrilling", "packaging"].includes(
          item.compoent
        )
        ).sort((b, a) =>
          b.compoent_header_option_label.localeCompare(
            a.compoent_header_option_label
          )
        )
        .map((item) => ({
          value: item.compoent_header_option_id,
          label: item.compoent_header_option_label,
        })) || [],
      mat_id:
        data?.m_mat?.data?.map((item) => ({
          value: item.mat_id,
          label: `${item.erp} - ${item.component}`,
        })) || [],
      machine_id:
        data?.m_mat?.data?.map((item) => ({
          value: item.mat_id,
          label: `${item.erp} - ${item.component}`,
        })) || [],
      tooling_id:
        data?.m_mat?.data?.map((item) => ({
          value: item.mat_id,
          label: `${item.erp} - ${item.component}`,
        })) || [],
        process_routing_order_id:
        data?.routingOrder_option?.data?.map((item) => ({
          value: item.process_routing_order_id,
          label: `${item.erp} - ${item.compoent_header_option_label}- ${item.process_order}`,
        })) || [],
    }),
    [data]
  );

  const handleCreate = async (payload) => {
    console.log("payload", payload);
    try {
      const result = await mutate({
        url: `${baseURL}/app2/process_tooling/postSingle`,
        method: "POST",
        data: payload,
      });

      if (result?.success) {
        message.success(result?.data?.msg || "Create success");
      } else {
        message.error(mutationError);
      }
    } catch {
      message.error(mutationError);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading form data</div>;

  return (
    <DynamicRoutingForm
      mode="create"
      headerColumn={header || []}
      detailBomColumn={detail_bom || []}
      detailMachineColumn={detail_machine || []}
      initialData={{ detail_bom: [], detail_machine: [] }} // Empty initial state
      optionsMap={optionsMap}
      loading={mutationLoading}
      onSubmit={handleCreate}
      onCancel={() => navigate(-1)}
    />
  );
};

export default PostSingleProcessRoutingTooling;