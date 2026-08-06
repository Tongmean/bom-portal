import React, { useMemo } from "react";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import useFetchMultiple from "../../../hook/useFetchmultiple";
import useMutation from "../../../hook/useMutation";
import { baseURL } from "../../../../utility/apiClient";
import DynamicRoutingForm from "./DynamicRoutingForm";
import { navigateWithHighlight } from "../../../utility/navigationHighlight";

const PutSingleProcessRoutingTooling = () => {
  const navigate = useNavigate();
  const { mutate, loading: mutationLoading, error: mutationError } = useMutation();
  const { id } = useParams();

  const endpoints = useMemo(
    () => ({
      initialData: `${baseURL}/app2/process_tooling/${id}`,
      routing_tooling: `${baseURL}/app2/process_tooling/1`,
      m_mat: `${baseURL}/app2/m_mat`,
      componentHeaderOption: `${baseURL}/app2/option/m_componentHeader`,
      routingOrder_option: `${baseURL}/app2/option/m_routingOrder`,
    }),
    []
  );

  const { data, loading, error } = useFetchMultiple(endpoints);
  
    const {header, detail_bom, detail_machine} = data?.routing_tooling?.columnDefs || {}
    
  // console.log("data", data);
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

  const handleUpdate = async (payload) => {
    console.log("payload", payload);
    try {
      const result = await mutate({
        url: `${baseURL}/app2/process_tooling/putSingle`,
        method: "POST",
        data: payload,
      });

      if (result?.success) {
        message.success(result?.data?.msg || "Create success");
        setTimeout(() => {
          navigateWithHighlight({
            navigate,
            path: "/app2/process/routing-order-tooling",
            ids: [Number(id)],
            idField: "process_routing_tooling_id",
          })
        }, 2000); // 2 seconds
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
      mode="update"
      headerColumn={header || []}
      detailBomColumn={detail_bom || []}
      detailMachineColumn={detail_machine || []}
      initialData={{
        header:data?.initialData?.data?.process_routing_tooling[0] || {}, 
        detail_bom:data?.initialData?.data?.process_routing_tooling_bom || [], 
        detail_machine:data?.initialData?.data?.process_routing_tooling_machine || [] 
      }} // Empty initial state
      optionsMap={optionsMap}
      loading={mutationLoading}
      onSubmit={handleUpdate}
      onCancel={() => 
        navigateWithHighlight({
          navigate,
          path: "/app2/process/routing-order-tooling",
          ids: [Number(id)],
          idField: "process_routing_tooling_id",
        })
      }
    />
  );
};

export default PutSingleProcessRoutingTooling;